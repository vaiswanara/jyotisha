"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VedicAstroEngine_1 = require("./engine/VedicAstroEngine");
console.log("Running getRiseSetTimes test...");
const res = VedicAstroEngine_1.VedicAstroEngine.getRiseSetTimes(0, "2026-06-07", 77.5946, 12.9716, 5.5);
console.log("Result:", res);
// Also let's run swetest static command directly to see what output is returned inside the engine
const args = `-b6.6.2026 -geopos77.5946,12.9716,0 -rise -p0 -n3`;
const out = VedicAstroEngine_1.VedicAstroEngine.runSwetestStatic(args);
console.log("Raw Output length:", out.length);
console.log("Raw Output content:\n", out);
