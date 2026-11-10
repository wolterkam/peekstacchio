class PeekWorkspace {
    constructor(workspace) {
        this.workspace = workspace;
        this.windows = new Map();

        // Listen for adding and removing windows
        workspace.windowAdded.connect(
            (window) =>
                !this.windows.has(String(window.internalId)) &&
                this.windows.set(String(window.internalId), new PeekWindow(window, this)),
        );
        workspace.windowRemoved.connect((window) => this.windows.delete(String(window.internalId)));

        // Pick up all windows on init
        workspace
            .windowList()
            .forEach(
                (window) =>
                    !this.windows.has(String(window.internalId)) &&
                    this.windows.set(String(window.internalId), new PeekWindow(window, this)),
            );
    }

    get peekWindows() {
        return Array.from(this.windows.values());
    }
}
