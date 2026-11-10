class Area {
    constructor({ x, y, width, height }) {
        [this.left, this.top, this.right, this.bottom] = [x, y, x + width, y + height];
    }

    contains({ left, top, right, bottom }) {
        return (
            left < right &&
            top < bottom &&
            this.left <= left &&
            this.top <= top &&
            this.right >= right &&
            this.bottom >= bottom
        );
    }
}
