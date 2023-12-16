type Tags = keyof HTMLElementTagNameMap;
type Attributes<T extends Tags> = Partial<HTMLElementTagNameMap[T]>;
interface Callbacks<T> {
	onload?: (result: T) => void;
	onerror?: (element: Error) => void;
	oncomplete?: (element: HTMLElement) => void;
}

export enum LoaderEvent {
	LOAD = "load",
	ERROR = "error",
	COMPLETE = "complete",
}

const __parent__ = document.head || document.getElementsByTagName("head")[0] || document.body;
const __loaded__ = "loaded";
const __supported__ = ["body", "frame", "frameset", "iframe", "img", "link", "script", "style"];

function elem<T extends Tags>(url: string, tag: Tags, options: Attributes<T>): HTMLElementTagNameMap[T] {
	let el = options.id ? document.getElementById(options.id) : null;
	if (!el) {
		const selector = `${tag}[${tag === "link" ? "href" : "src"}="${url}"]`;
		el = __parent__.querySelector(selector);
	}
	if (!el) {
		el = document.createElement(tag);
		Object.assign(el, options);
		__parent__.appendChild(el);
	}
	return el as HTMLElementTagNameMap[T];
}

export const yamiLoader = {
	LoaderEvent,
	load<T extends Tags>(
		tag: T,
		options: Attributes<T> = {},
		callbacks: Callbacks<HTMLElementTagNameMap[T]> = {}
	): Promise<HTMLElementTagNameMap[T]> {
		//@ts-ignore
		const url: string = options.src || options.href;

		let el = elem<T>(url, tag, options);
		if (!__supported__.includes(tag)) {
			return Promise.resolve(el);
		}

		if (el.getAttribute(__loaded__) === "1") {
			return Promise.resolve(el);
		}

		let invoke!: () => void;

		return new Promise<any>((resolve, reject) => {
			function load() {
				resolve(el);
			}
			function err() {
				reject(`Failed to load ${url}`);
			}

			el.addEventListener("load", load, false);
			el.addEventListener("error", err, false);

			invoke = () => {
				el.removeEventListener("load", load, false);
				el.removeEventListener("error", err, false);
				document.dispatchEvent(new CustomEvent(LoaderEvent.COMPLETE, { detail: el }));
				callbacks.oncomplete?.(el);
			};

			const duration = 15 * 1000;
			setTimeout(() => reject(`Time out of ${duration}ms`), duration);
		})
			.then((data) => {
				el.setAttribute(__loaded__, "1");
				document.dispatchEvent(new CustomEvent(LoaderEvent.LOAD, { detail: el }));
				callbacks.onload?.(el);
				return data;
			})
			.catch((reason) => {
				el.remove();
				document.dispatchEvent(new CustomEvent(LoaderEvent.ERROR, { detail: reason }));
				callbacks.onerror?.(reason);
				throw new Error(reason);
			})
			.finally(invoke);
	},
	loadScript(url: string, options?: Partial<HTMLScriptElement>, callbacks?: Callbacks<HTMLScriptElement>) {
		return this.load(
			"script",
			{
				...options,
				defer: true,
				async: true,
				type: "text/javascript",
				crossOrigin: "anonymous",
				src: url,
			},
			callbacks
		);
	},
	loadCss(url: string, options?: Partial<HTMLLinkElement>, callbacks?: Callbacks<HTMLLinkElement>) {
		return this.load(
			"link",
			{
				...options,
				rel: "stylesheet",
				type: "text/css",
				crossOrigin: "anonymous",
				href: url,
			},
			callbacks
		);
	},

	async jsonp<R>(
		url: string,
		options: {
			callee: string;
			name?: string;
			callbacks?: Callbacks<R>;
		}
	): Promise<R> {
		const [host, query] = url.split("?");
		const params = new URLSearchParams(query);
		params.append(options.name || "jsonCallback", options.callee);
		const callbacks = Object.create(options.callbacks || {});
		const cb = callbacks.onload;
		delete callbacks.onload;

		const el = await this.loadScript(host + "?" + params.toString(), undefined, callbacks as any);

		//@ts-ignore
		const data = globalThis[options.callee]();
		//@ts-ignore
		globalThis[options.callee] = null;
		el.remove();
		cb?.call(options, data);
		return data;
	},
};

export default yamiLoader;
