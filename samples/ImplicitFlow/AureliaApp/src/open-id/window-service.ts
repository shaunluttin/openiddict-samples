export class WindowService {

    private window: Window;

    constructor() {
        this.window = window;
    }

    public GetHref(): string {
        return this.window.location.href;
    }

    public SetHref(value: string) {
        this.window.location.href = value;
    }

    public GetLocation(): Location {
        return this.window.location;
    }
}