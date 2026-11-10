class PeekAnimation {
    constructor(window) {
        this.timer = new QTimer(window);
        this.timer.interval = 16;

        this.timer.timeout.connect(() => {
            const { deleted, active, move, resize } = window;
            if (deleted || active || move || resize) return this.timer.stop();

            const { x, y, width, height } = window.frameGeometry;
            const step = (this.targetX - x) * 0.25;
            const nextX = Math.abs(step) <= 0.5 ? this.targetX : x + step;
            window.frameGeometry = { x: nextX, y, width, height };

            // If reached afterwards, end animation
            if (nextX === this.targetX) this.timer.stop();
        });
    }

    start(targetX) {
        this.targetX = targetX;
        this.timer.start();
    }
}
