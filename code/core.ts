import kaboom, { KaboomOpt } from "kaplay"
import "kaplay/global"

import Load from "./load"

import * as C from "./cst"

let boundK = (opts?: KaboomOpt) => kaboom(Object.assign(C.KaboomSettings, opts))

export default {
  kaboom: boundK,
  Load,
  C,
}