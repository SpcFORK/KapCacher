// (c) SpcFORK - Kaboom Cache System
// 2024-05-29 - 10:00 PM

import type { KaboomCtx } from "kaplay";
import * as kbg from "kaplay";

export const HEADER = {
  name: 'Cacher',
  version: '0.0.4'
}

export function CacherPlugin(kbg: KaboomCtx) {
  class Cacher {
    private cacheName: string;

    private _cache: Cache;
    set cache(v: Cache) {
      this._cache = v;
      localStorage.setItem(this.cacheName, JSON.stringify(v));
      this.initialized = true;
    }

    get cache() {
      return this._cache;
    }

    private initialized = false;

    static nsBuilder(ns: string, text: string) {
      return `${ns}~${text}`;
    }

    constructor(cacheName: string) {
      this.cacheName = cacheName;
    }

    ensureIsInit() {
      if (!this.initialized)
        throw new Error("Cache not initialized, will not function without cache");
    }

    async init() {
      this.cache = await caches.open(this.cacheName);
      this.initialized = true;
    }

    createNamespace(namespace: string): CacherNamespace {
      this.ensureIsInit();
      return new CacherNamespace(this, namespace);
    }

    createSpriteCacher(): SpriteCacher {
      this.ensureIsInit();
      return new SpriteCacher(this);
    }
  }

  class CacherNamespace {
    namespace: string;
    parent: Cacher;
    cache: () => Cache;

    constructor(parent: Cacher, namespace: string) {
      parent.ensureIsInit();
      this.namespace = namespace;
      this.parent = parent;
      this.cache = () => this.parent.cache;
    }

    nsBuilder = (name: string) => Cacher.nsBuilder(this.namespace, name);

    async get(name: string): Promise<Response | undefined> {
      return await this.cache().match(this.nsBuilder(name));
    }

    async put(name: string, response: Response) {
      await this.cache().put(this.nsBuilder(name), response);
    }

    makeRollout(rolloutList: string[], rolloutInterval = 0) {
      return new CacheRollout(this, rolloutList, rolloutInterval);
    }
  }

  class CacheRollout {
    rolloutList: string[];
    rolloutInterval: number;
    parent: CacherNamespace;
    cache: () => Cache;

    constructor(parent: CacherNamespace, rolloutList: string[], rolloutInterval = 0) {
      this.rolloutList = rolloutList;
      this.rolloutInterval = rolloutInterval;
      this.parent = parent;
      this.cache = () => parent.cache();
    }

    async rollout(cb: (name: string, nsName: string, response: Response | undefined, t: InstanceType<typeof CacheRollout>) => any): Promise<any[]> {
      const results = await Promise.all(this.rolloutList.map(async (name) => {
        const nsName = this.parent.nsBuilder(name);
        const response = await this.cache().match(nsName);
        const result = await cb(name, nsName, response, this);
        if (this.rolloutInterval > 0) await kbg.wait(this.rolloutInterval);
        return result;
      }));
      return results;
    }

    // @ Throw out broken Caches
    async tossBrokenCaches(rolloutList: string[]) {
      let ck = await this.cache().keys();
      let arrNotInRLL: string[] = [];
      for (let req of ck) {
        let name = req.url.split('/').pop()?.split('~')[1] as string;
        if (!rolloutList.includes(name)) arrNotInRLL.push(name);
      }
      for (let b of arrNotInRLL) await this.cache().delete(b);
    }
  }

  class SpriteCacher {
    namespace: string;
    parent: Cacher;
    CNS: CacherNamespace;
    cache: () => Cache;

    nsBuilder = (name: string) => Cacher.nsBuilder(this.namespace, name);

    constructor(parent: Cacher) {
      this.namespace = 'sprite';
      this.parent = parent;
      this.CNS = new CacherNamespace(parent, this.namespace);
      this.cache = () => this.CNS.cache();
    }

    async fetchAndCacheSprite(name: string): Promise<Response> {
      const response = await fetch(`./sprites/${name}.png`);
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);

      let res = new Response(imageBlob);

      await this.CNS.put(name, res);
      await kbg.loadSprite(name, imageUrl);

      return res;
    }

    async loadCachedSprite(name: string, cachedResponse: Response): Promise<Response> {
      const reader = new FileReader();
      reader.onload = async () => await kbg.loadSprite(name, reader.result as string)
        .catch(async (e) => {
          console.error(`Failed to load cached sprite for ${name}:`, e);
          cachedResponse = await this.fetchAndCacheSprite(name);
        });

      reader.readAsDataURL(await cachedResponse.blob());
      return cachedResponse;
    }

    async rollout(rolloutList: string[], rolloutInterval = 0) {
      let rl = this.CNS.makeRollout(rolloutList, rolloutInterval);
      let res = await rl.rollout(async (name, nsName, response, t) => {
        if (response) await this.loadCachedSprite(name, response);
        else await this.fetchAndCacheSprite(name);
      })
      await rl.tossBrokenCaches(rolloutList);
      return res;
    }
  }

  return {
    ...HEADER,
    Cacher,
    CacherNamespace,
    CacheRollout,
    SpriteCacher,
  };
}

export type NS = ReturnType<typeof CacherPlugin>

declare global {
  interface CacherPlugin {
    Cacher: NS["Cacher"];
    CacherNamespace: NS["CacherNamespace"];
    CacheRollout: NS["CacheRollout"];
    SpriteCacher: NS["SpriteCacher"];
  }

  interface Window extends CacherPlugin { }
  interface globalThis extends CacherPlugin { }

  const Cacher: NS["Cacher"];
  const CacherNamespace: NS["CacherNamespace"];
  const CacheRollout: NS["CacheRollout"];
  const SpriteCacher: NS["SpriteCacher"];
}