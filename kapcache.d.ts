// Generate by [js2dts@0.3.3](https://github.com/whxaxes/js2dts#readme)

import { KaboomCtx } from 'kaplay/dist/kaboom';
export interface T100 {
  name: string;
  version: string;
}
export const HEADER: T100;
declare class CacheRollout_1 {
  rolloutList: string[];
  rolloutInterval: number;
  parent: CacherNamespace_1;
  cache: () => Cache;
  constructor(parent: CacherNamespace_1, rolloutList: string[], rolloutInterval?: number);
  rollout(cb: (name: string, nsName: string, response: Response | any, t: InstanceType<typeof CacheRollout_1>) => any): Promise<any[]>;
  tossBrokenCaches(rolloutList: string[]): Promise<void>;
}
declare class CacherNamespace_1 {
  namespace: string;
  parent: Cacher_1;
  cache: () => Cache;
  constructor(parent: Cacher_1, namespace: string);
  nsBuilder: any;
  get(name: string): Promise<Response | any>;
  put(name: string, response: Response): Promise<void>;
  makeRollout(rolloutList: string[], rolloutInterval?: number): CacheRollout_1;
}
declare class Cacher_1 {
  cacheName: string;
  cache: any;
  initialized: any;
  static nsBuilder(ns: string, text: string): string;
  constructor(cacheName: string);
  ensureIsInit(): void;
  init(): Promise<void>;
  createNamespace(namespace: string): CacherNamespace_1;
  createSpriteCacher(): any;
}
export const Cacher: Cacher_1;
export const CacherNamespace: CacherNamespace_1;
export const CacheRollout: CacheRollout_1;
declare class SpriteCacher {
  namespace: string;
  parent: Cacher_1;
  CNS: CacherNamespace_1;
  cache: () => Cache;
  nsBuilder: any;
  constructor(parent: Cacher_1);
  fetchAndCacheSprite(name: string): Promise<Response>;
  loadCachedSprite(name: string, cachedResponse: Response): Promise<Response>;
  rollout(rolloutList: string[], rolloutInterval?: number): Promise<any[]>;
}
export interface T101 {
  Cacher: typeof Cacher_1;
  CacherNamespace: typeof CacherNamespace_1;
  CacheRollout: typeof CacheRollout_1;
  SpriteCacher: typeof SpriteCacher;
  name: string;
  version: string;
}
declare function CacherPlugin_1(kbg: KaboomCtx): T101;
export const CacherPlugin: typeof CacherPlugin_1;
