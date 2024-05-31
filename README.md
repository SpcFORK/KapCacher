## Kapcacher

Kapcacher is a caching system plugin developed as part of the Kaboom library. It provides functionalities to cache and manage resources efficiently, enabling better performance and resource optimization within Kaboom game development projects.

To get started, do:
```ts
// Import the plugin where you init Kaboom.
import { CacherPlugin } from "kapcacher";

core.kaboom({
  plugins: [CacherPlugin]
});

// ---

import "kapcacher/global";

const C = [ 'bean' ];
async function LoadSprites() {
  let cacher = new Cacher('game');
  await cacher.init();

  // @ Load sprites
  let sc = cacher.createSpriteCacher();
  await sc.rollout(C);
}
```