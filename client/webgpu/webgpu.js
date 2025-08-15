import { vec3 } from "./vector"

export class Vertex {
    /** @type {vec3} */ position
    /** @type {vec3} */ normal
    /** @type {vec3} */ color
    constructor(position, normal, color) {
        this.position = position
        this.normal = normal
        this.color = color
    }
}

export class Uniform {
    /** @type {string} */ type
    /** @type {string} */ name
    /** @type {value} */ value
    constructor (name, type) {
        this.name = name
        this.type = type
    }
}

const sizes = { // sizes of types in bytes
    f: 4,
    vec2: 8,
    vec3: 12,
    mat3: 36,
    mat4: 64,
    // add more types later
}

export class Uniforms {
    /** @type {Uniform[]} */ uniforms
    /** @type {number} */ totalSize

    /** @param {Uniform[]} uniformTypes */
    constructor (uniformTypes) { // finish uniforms logic :thumbsup:
        uniformTypes.forEach(uniform => {
            this.uniforms.push(uniform)
            const index = this.uniforms.length - 1
            Object.prototype(this, {
                set [uniform.name](value) {this.uniforms[index].value = value}
            })
            this.totalSize += sizes[type]
        })
    }
}

export class webgpu {
    /** @type {HTMLCanvasElement} */ canvas
    /** @type {GPUCanvasContext} */ context
    /** @type {GPUAdapter} */ adapter
    /** @type {any} */ device
    /** @type {any} */ vertexBuffer
    /** @type {any} */ indexBuffer
    /** @type {any} */ uniformBuffer
    /** @type {number} */ indiciesLength
    /** @type {Uniforms} */ uniforms
    /** @type {any} */ bindGroupLayout
    /** @type {any} */ pipelineLayout

    throwError(error) {
        alert(error)
        throw new Error(error)
    }

    constructor() {
        if (!navigator.gpu) this.throwError('WebGPU not supported. Please use Chrome 113+, Edge 113+, or Firefox Nightly.')
        
        this.canvas = document.createElement("canvas")
        document.body.appendChild(this.canvas)
        this.canvas.id = "webgpuCanvas"

        this.context = this.canvas.getContext("webgpu")
        if (!this.context) this.throwError('WebGPU context not available.')
    }

    async configureVariables() {
        this.adapter = await navigator.gpu.requestAdapter()
        if (!this.adapter) this.throwError('Failed to get WebGPU adapter.')

        this.device = await adapter.requestDevice();

        const format = navigator.gpu.getPreferredCanvasFormat()
        context.configure({
            device: this.device,
            format: format,
            alphaMode: 'opaque'
        });
    }

    /** @param {Vertex[]} vertices @param {number[]} indices */
    loadTriangles(vertices, indices) {
        const verticesraw = new Array()
        vertices.forEach(vertex => // load all vertices into raw array
            verticesraw.push(...vertex.position.array, ...vertex.normal.array, ...vertex.color.array,))

        this.vertexBuffer = device.createBuffer({
            size: verticesraw.length * 4,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true
        })
        new Float32Array(verticesraw.getMappedRange()).set(verticesraw)
        vertexBuffer.unmap()

        this.indexBuffer = device.createBuffer({
            size: indices.length * 4,
            usage: GPUBufferUsage.INDEX,
            mappedAtCreation: true
        })
        new Uint32Array(indexBuffer.getMappedRange()).set(indices)
        indexBuffer.unmap()

        this.indiciesLength = indices.length
    }

    /** @param {Uniforms} uniformTypes */
    setupUniforms(uniformTypes) {
        this.uniformBuffer = device.createBuffer({
            size: uniformTypes.totalSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        this.uniforms = uniformTypes

        this.bindGroupLayout = this.device.createBindGroupLayout({
            entries: [{
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                buffer: { type: 'uniform' }
            }]
        })

        this.pipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        })
    }
}

