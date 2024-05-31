import { CacherPlugin as cs } from './kapcache'

export type NS = ReturnType<typeof cs>

declare global {
  export interface CacherPlugin {
    Cacher: NS["Cacher"];
    CacherNamespace: NS["CacherNamespace"];
    CacheRollout: NS["CacheRollout"];
    SpriteCacher: NS["SpriteCacher"];
  }

  interface Window extends CacherPlugin { }
  interface globalThis extends CacherPlugin { }

  // @ If you came here because CacherPlugin is giving you an error about redec, make sure you have a better linter, and don't have multiple copies of CacherPlugin in your project.
  const Cacher: NS["Cacher"];
  const CacherNamespace: NS["CacherNamespace"];
  const CacheRollout: NS["CacheRollout"];
  const SpriteCacher: NS["SpriteCacher"];
}