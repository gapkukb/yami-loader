type Tags = keyof HTMLElementTagNameMap;

type Attributes<T extends Tags> = Partial<HTMLElementTagNameMap[T]> & { extra?: any };

interface Callbacks<T extends Tags, R = unknown, J extends boolean = false, U = JSONPAttribute<T, J>> {
	onload?: J extends false ? (el: HTMLElementTagNameMap[T], options: U) => void : (data: R, options: U) => void;
	onerror?: (reason: string, options: U) => void;
	oncomplete?: (options: U) => void;
}

type JSONPOptions = Attributes<"script"> & {
	callee: string;
	name?: string;
};

type JSONPAttribute<T extends Tags, J extends boolean = false> = J extends false
	? Attributes<T>
	: Attributes<T> & JSONPOptions;

export enum LoaderEvent {
	LOAD = "_load",
	ERROR = "_error",
	COMPLETE = "_complete",
}

const _parent_ = document.head || document.body;
const _loaded_ = "loaded";
const _can_load_ = ["body", "frame", "frameset", "iframe", "img", "link", "script", "style"];
const fire = (event: LoaderEvent, detail: any) => document.dispatchEvent(new CustomEvent(event, { detail }));

function elem<T extends Tags>(url: string, tag: Tags, options: Attributes<T>): HTMLElementTagNameMap[T] {
	let el = options.id ? _parent_.querySelector("#" + options.id) : null;
	if (!el) {
		const selector = `${tag}[${tag === "link" ? "href" : "src"}="${url}"]`;
		el = _parent_.querySelector(selector);
	}
	if (!el) {
		el = document.createElement(tag);
		Object.assign(el, options);
		_parent_.appendChild(el);
	}
	return el as HTMLElementTagNameMap[T];
}

export class YamiLoader {
	timeout = 15 * 1000;
	LoaderEvent = LoaderEvent;
	constructor(options?: { timeout?: number }) {
		Object.assign(this, options);
	}
	load<T extends Tags>(
		tag: T,
		options: Attributes<T> = {},
		callbacks: Callbacks<T> = {}
	): Promise<{
		el: HTMLElementTagNameMap[T];
		options: Attributes<T>;
	}> {
		//@ts-ignore
		const url: string = options.href || options.src;
		let el = elem<T>(url, tag, options);
		let invoke!: () => void;
		let timer: number = 0;

		return new Promise<any>((resolve, reject) => {
			function ok() {
				resolve({ el, options });
			}
			function err(reason?: String | Event) {
				reject({ reason: typeof reason === "string" ? reason : `Failed to load ${url}`, options });
			}

			if (!_can_load_.includes(tag)) {
				return ok();
			} else if (!url) {
				return err("Not found the source address");
			} else if (el.getAttribute(_loaded_) === "1") {
				return ok();
			}

			el.addEventListener("load", ok, false);
			el.addEventListener("error", err, false);

			invoke = () => {
				el.removeEventListener("load", ok, false);
				el.removeEventListener("error", err, false);
				fire(LoaderEvent.COMPLETE, options);
				callbacks.oncomplete?.(options);
				clearTimeout(timer);
			};

			timer = setTimeout(() => err(`Time out of ${this.timeout} ms`), this.timeout);
		})
			.then((result) => {
				el.setAttribute(_loaded_, "1");
				if (!("_jsonp_" in options)) {
					fire(LoaderEvent.LOAD, result);
					callbacks.onload?.(result.el, result.options);
				}
				return result;
			})
			.catch((reason) => {
				el.remove();
				const ret = { reason, options };
				fire(LoaderEvent.ERROR, ret);
				callbacks.onerror?.(reason, options);
				return Promise.reject(ret);
			})
			.finally(invoke);
	}
	loadScript(url: string, options?: Attributes<"script">, callbacks?: Callbacks<"script">) {
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
	}
	loadCss(url: string, options?: Attributes<"link">, callbacks?: Callbacks<"link">) {
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
	}

	async loadJson<R>(
		url: string,
		options: JSONPOptions,
		callbacks?: Callbacks<"script", R, true>
	): Promise<{ data: R; options: JSONPOptions }> {
		const [host, query] = url.split("?");
		const params = new URLSearchParams(query);
		params.append(options.name || "jsonCallback", options.callee);
		const cb = callbacks?.onload;
		delete callbacks?.onload;

		const { el, options: opts } = await this.loadScript(
			host + "?" + params.toString(),
			Object.assign(options, { _jsonp_: true }),
			callbacks as any
		);

		//@ts-ignore
		const data = globalThis[options.callee]();
		//@ts-ignore
		globalThis[options.callee] = null;
		el.remove();
		const result = { data, options: opts as JSONPOptions };
		fire(LoaderEvent.LOAD, result);
		cb?.call(callbacks, data, opts as any);
		return result;
	}
}

export const yamiLoader = new YamiLoader();
export default YamiLoader;
