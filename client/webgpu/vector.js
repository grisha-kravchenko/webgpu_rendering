export class vec4 { // lowest uses class. recommended to use vec3 instead.
    /** @type {number} */ x;
    /** @type {number} */ y;
    /** @type {number} */ z;
    /** @type {number} */ w;

    constructor(x,y,z,w) {
        this.x = x ?? 0
        this.y = y ?? this.x
        this.z = z ?? this.x
        this.w = w ?? 0
    }
}

export class vec3 {
    /** @type {number} */ x;
    /** @type {number} */ y;
    /** @type {number} */ z;

    constructor(x,y,z) {
        this.x = x ?? 0
        this.y = y ?? this.x
        this.z = z ?? this.x
    }

    get array() {return [this.x, this.y, this.z]}

    static add(a, b) {return new vec3(a.x + b.x, a.y + b.y, a.z + b.z)}
    static sub(a, b) {return new vec3(a.x - b.x, a.y - b.y, a.z - b.z)}
}

export class vec2 {
    /** @type {number} */ x;
    /** @type {number} */ y;

    constructor(x,y) {
        this.x = x ?? 0
        this.y = y ?? this.x
    }
}