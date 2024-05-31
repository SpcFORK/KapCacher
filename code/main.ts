import core from "./core";
import { CacherPlugin } from "kapcacher";

core.kaboom({
  plugins: [CacherPlugin]
});

load(
  core.Load().then(() => go("init"))
);