import * as C from "./cst";

async function LoadSprites() {
  // load assets
  const l = (name = '') => loadSprite(name, `./sprites/${name}.png`);
  C.KaboomSprites.map(l);
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