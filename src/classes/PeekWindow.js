"use strict";

class PeekWindow {
    constructor(window, peekWorkspace) {
        this.window = window;
        this.peekWorkspace = peekWorkspace;
        this.animation = new PeekAnimation(window);

        // Listen for events that might require other windows to peek out
        [window.activeChanged, window.frameGeometryChanged, window.stackingOrderChanged].forEach(
            (signal) =>
                signal.connect(() => {
                    if (window.active && !window.deleted) {
                        this.coveredWindows.forEach((other) => other.peekFrom(this));
                    }
                }),
        );
    }

    get area() {
        return new Area(this.window.frameGeometry);
    }

    get desktop() {
        return this.peekWorkspace.workspace.currentDesktopForScreen(this.window.output);
    }

    get stackPosition() {
        return this.peekWorkspace.workspace.stackingOrder.indexOf(this.window);
    }

    get canPeek() {
        const { moveable, fullScreen, maximizeMode, tile, move, resize } = this.window;
        return moveable && ![fullScreen, maximizeMode !== 0, tile, move, resize].some(Boolean);
    }

    isVisibleOn(desktop, activity) {
        const { normalWindow, dialog, deleted, minimized, hidden, shade, desktops, activities } =
            this.window;
        return (
            (normalWindow || dialog) &&
            ![deleted, minimized, hidden, shade].some(Boolean) &&
            (!desktops.length || desktops.includes(desktop)) &&
            (!activities.length || activities.includes(activity))
        );
    }

    get coveredWindows() {
        const {
            peekWindows,
            workspace: { stackingOrder, currentActivity },
        } = this.peekWorkspace;

        if (this.stackPosition >= 0 && this.isVisibleOn(this.desktop, currentActivity)) {
            const underneath = new Set(stackingOrder.slice(0, this.stackPosition));
            return peekWindows.filter(
                (other) =>
                    underneath.has(other.window) &&
                    other.isVisibleOn(this.desktop, currentActivity) &&
                    this.area.contains(other.area),
            );
        } else {
            return [];
        }
    }

    peekFrom(cover) {
        if (this.canPeek) {
            const { x, width } = this.window.frameGeometry;
            const { left: coverLeft, right: coverRight } = cover.area;
            const { x: minX, width: desktopWidth } = this.peekWorkspace.workspace.clientArea(
                KWin.MaximizeArea,
                this.window,
            );

            // Only move windows that can fit in desktop
            if (width <= desktopWidth) {
                const maxX = minX + desktopWidth - width;
                const positions = [coverLeft - 32, coverRight + 32 - width].sort(
                    (a, b) => Math.abs(a - x) - Math.abs(b - x),
                );

                // Choose the nearest position that fits. Clamp if neither fits.
                const targetX =
                    positions.find((position) => position >= minX && position <= maxX) ??
                    Math.max(minX, Math.min(positions[0], maxX));
                this.animation.start(targetX);
            }
        }
    }
}
