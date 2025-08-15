import { webgpu } from "./webgpu/webgpu.js"

export class main {
    init() {
        const render = new webgpu();
        console.log(render)

        render.initGPUInstance();

    }
}