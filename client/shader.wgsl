struct Uniforms {
    viewProjectionMatrix: mat4x4<f32>,
    modelMatrix: mat4x4<f32>,
    lightPosition: vec3<f32>,
    lightIntensity: f32,
};

@binding(0) @group(0) var<uniform> uniforms: Uniforms;

struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
};

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) normal: vec3<f32>,
    @location(1) worldPosition: vec3<f32>,
};

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    
    // Apply model matrix to position
    let worldPosition = (uniforms.modelMatrix * vec4<f32>(input.position, 1.0)).xyz;
    
    // Calculate final position
    output.position = uniforms.viewProjectionMatrix * vec4<f32>(worldPosition, 1.0);
    
    // Transform normal using model matrix
    output.normal = normalize((uniforms.modelMatrix * vec4<f32>(input.normal, 0.0)).xyz);
    output.worldPosition = worldPosition;
    
    return output;
}

@fragment
fn fragmentMain(
    @location(0) normal: vec3<f32>,
    @location(1) worldPosition: vec3<f32>
) -> @location(0) vec4<f32> {
    // Light direction
    let lightDir = normalize(uniforms.lightPosition - worldPosition);
    
    // Diffuse lighting
    let diff = max(dot(normal, lightDir), 0.0) * uniforms.lightIntensity;
    
    // Ambient lighting
    let ambient = 0.2;
    
    // Combine lighting
    let intensity = min(ambient + diff, 1.0);
    
    let heightFactor = (worldPosition.z + 1.0) * 0.5;
    let color = mix(vec3<f32>(0.0, 0.8, 1.0), vec3<f32>(0.2, 0.1, 0.6), heightFactor);
    
    return vec4<f32>(color * intensity, 1.0);
}