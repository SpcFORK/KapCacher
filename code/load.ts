import * as C from "./cst";
import "kapcacher/global";

async function LoadSprites() {
  let cacher = new Cacher('game');
  await cacher.init();

  // @ Load sprites
  let sc = cacher.createSpriteCacher();
  await sc.rollout(C.KaboomSprites);
}

async function LoadScenes() {
  await import('./scenes/all');
}

export default async function Load() {
  await Promise.all([
    LoadSprites(),
    LoadScenes(),
  ]);
}