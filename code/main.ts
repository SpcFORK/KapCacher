import core from "./core";

core.kaboom()

load(
  core.Load().then(() => go("init"))
);