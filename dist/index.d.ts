type Tags = keyof HTMLElementTagNameMap;
type Attributes<T extends Tags> = Partial<HTMLElementTagNameMap[T]> & {
    extra?: any;
};
interface Callbacks<T extends Tags, R = unknown, J extends boolean = false, U = JSONPAttribute<T, J>> {
    onload?: J extends false ? (el: HTMLElementTagNameMap[T], options: U) => void : (data: R, options: U) => void;
    onerror?: (reason: string, options: U) => void;
    oncomplete?: (options: U) => void;
}
type JSONPOptions = Attributes<"script"> & {
    callee: string;
    name?: string;
};
type JSONPAttribute<T extends Tags, J extends boolean = false> = J extends false ? Attributes<T> : Attributes<T> & JSONPOptions;
export declare enum LoaderEvent {
    LOAD = "_load",
    ERROR = "_error",
    COMPLETE = "_complete"
}
export declare class YamiLoader {
    timeout: number;
    LoaderEvent: typeof LoaderEvent;
    constructor(options?: {
        timeout?: number;
    });
    load<T extends Tags>(tag: T, options?: Attributes<T>, callbacks?: Callbacks<T>): Promise<{
        el: HTMLElementTagNameMap[T];
        options: Attributes<T>;
    }>;
    loadScript(url: string, options?: Attributes<"script">, callbacks?: Callbacks<"script">): Promise<{
        el: HTMLScriptElement;
        options: Attributes<"script">;
    }>;
    loadCss(url: string, options?: Attributes<"link">, callbacks?: Callbacks<"link">): Promise<{
        el: HTMLLinkElement;
        options: Attributes<"link">;
    }>;
    loadJson<R>(url: string, options: JSONPOptions, callbacks?: Callbacks<"script", R, true>): Promise<{
        data: R;
        options: JSONPOptions;
    }>;
}
export declare const yamiLoader: YamiLoader;
export default YamiLoader;
