type Tags = keyof HTMLElementTagNameMap;
type Attributes<T extends Tags> = Partial<HTMLElementTagNameMap[T]>;
interface Callbacks<T> {
    onload?: (result: T) => void;
    onerror?: (element: Error) => void;
    oncomplete?: (element: HTMLElement) => void;
}
export declare enum LoaderEvent {
    LOAD = "load",
    ERROR = "error",
    COMPLETE = "complete"
}
export declare const yamiLoader: {
    LoaderEvent: typeof LoaderEvent;
    load<T extends keyof HTMLElementTagNameMap>(tag: T, options?: Partial<HTMLElementTagNameMap[T]>, callbacks?: Callbacks<HTMLElementTagNameMap[T]>): Promise<HTMLElementTagNameMap[T]>;
    loadScript(url: string, options?: Partial<HTMLScriptElement>, callbacks?: Callbacks<HTMLScriptElement>): Promise<HTMLScriptElement>;
    loadCss(url: string, options?: Partial<HTMLLinkElement>, callbacks?: Callbacks<HTMLLinkElement>): Promise<HTMLLinkElement>;
    jsonp<R>(url: string, options: {
        callee: string;
        name?: string | undefined;
        callbacks?: Callbacks<R> | undefined;
    }): Promise<R>;
};
export default yamiLoader;
