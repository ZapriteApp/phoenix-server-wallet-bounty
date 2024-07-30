
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
	'use strict';

	/** @returns {void} */
	function noop$1() {}

	const identity = (x) => x;

	/**
	 * @template T
	 * @template S
	 * @param {T} tar
	 * @param {S} src
	 * @returns {T & S}
	 */
	function assign(tar, src) {
		// @ts-ignore
		for (const k in src) tar[k] = src[k];
		return /** @type {T & S} */ (tar);
	}

	// Adapted from https://github.com/then/is-promise/blob/master/index.js
	// Distributed under MIT License https://github.com/then/is-promise/blob/master/LICENSE
	/**
	 * @param {any} value
	 * @returns {value is PromiseLike<any>}
	 */
	function is_promise(value) {
		return (
			!!value &&
			(typeof value === 'object' || typeof value === 'function') &&
			typeof (/** @type {any} */ (value).then) === 'function'
		);
	}

	/** @returns {void} */
	function add_location(element, file, line, column, char) {
		element.__svelte_meta = {
			loc: { file, line, column, char }
		};
	}

	function run(fn) {
		return fn();
	}

	function blank_object() {
		return Object.create(null);
	}

	/**
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function run_all(fns) {
		fns.forEach(run);
	}

	/**
	 * @param {any} thing
	 * @returns {thing is Function}
	 */
	function is_function(thing) {
		return typeof thing === 'function';
	}

	/** @returns {boolean} */
	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
	}

	let src_url_equal_anchor;

	/**
	 * @param {string} element_src
	 * @param {string} url
	 * @returns {boolean}
	 */
	function src_url_equal(element_src, url) {
		if (element_src === url) return true;
		if (!src_url_equal_anchor) {
			src_url_equal_anchor = document.createElement('a');
		}
		// This is actually faster than doing URL(..).href
		src_url_equal_anchor.href = url;
		return element_src === src_url_equal_anchor.href;
	}

	/** @returns {boolean} */
	function is_empty(obj) {
		return Object.keys(obj).length === 0;
	}

	/** @returns {void} */
	function validate_store(store, name) {
		if (store != null && typeof store.subscribe !== 'function') {
			throw new Error(`'${name}' is not a store with a 'subscribe' method`);
		}
	}

	function subscribe(store, ...callbacks) {
		if (store == null) {
			for (const callback of callbacks) {
				callback(undefined);
			}
			return noop$1;
		}
		const unsub = store.subscribe(...callbacks);
		return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
	}

	/** @returns {void} */
	function component_subscribe(component, store, callback) {
		component.$$.on_destroy.push(subscribe(store, callback));
	}

	function create_slot(definition, ctx, $$scope, fn) {
		if (definition) {
			const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
			return definition[0](slot_ctx);
		}
	}

	function get_slot_context(definition, ctx, $$scope, fn) {
		return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
	}

	function get_slot_changes(definition, $$scope, dirty, fn) {
		if (definition[2] && fn) {
			const lets = definition[2](fn(dirty));
			if ($$scope.dirty === undefined) {
				return lets;
			}
			if (typeof lets === 'object') {
				const merged = [];
				const len = Math.max($$scope.dirty.length, lets.length);
				for (let i = 0; i < len; i += 1) {
					merged[i] = $$scope.dirty[i] | lets[i];
				}
				return merged;
			}
			return $$scope.dirty | lets;
		}
		return $$scope.dirty;
	}

	/** @returns {void} */
	function update_slot_base(
		slot,
		slot_definition,
		ctx,
		$$scope,
		slot_changes,
		get_slot_context_fn
	) {
		if (slot_changes) {
			const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
			slot.p(slot_context, slot_changes);
		}
	}

	/** @returns {any[] | -1} */
	function get_all_dirty_from_scope($$scope) {
		if ($$scope.ctx.length > 32) {
			const dirty = [];
			const length = $$scope.ctx.length / 32;
			for (let i = 0; i < length; i++) {
				dirty[i] = -1;
			}
			return dirty;
		}
		return -1;
	}

	/** @returns {{}} */
	function exclude_internal_props(props) {
		const result = {};
		for (const k in props) if (k[0] !== '$') result[k] = props[k];
		return result;
	}

	function null_to_empty(value) {
		return value == null ? '' : value;
	}

	const is_client = typeof window !== 'undefined';

	/** @type {() => number} */
	let now = is_client ? () => window.performance.now() : () => Date.now();

	let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop$1;

	const tasks = new Set();

	/**
	 * @param {number} now
	 * @returns {void}
	 */
	function run_tasks(now) {
		tasks.forEach((task) => {
			if (!task.c(now)) {
				tasks.delete(task);
				task.f();
			}
		});
		if (tasks.size !== 0) raf(run_tasks);
	}

	/**
	 * Creates a new task that runs on each raf frame
	 * until it returns a falsy value or is aborted
	 * @param {import('./private.js').TaskCallback} callback
	 * @returns {import('./private.js').Task}
	 */
	function loop(callback) {
		/** @type {import('./private.js').TaskEntry} */
		let task;
		if (tasks.size === 0) raf(run_tasks);
		return {
			promise: new Promise((fulfill) => {
				tasks.add((task = { c: callback, f: fulfill }));
			}),
			abort() {
				tasks.delete(task);
			}
		};
	}

	/** @type {typeof globalThis} */
	const globals =
		typeof window !== 'undefined'
			? window
			: typeof globalThis !== 'undefined'
			? globalThis
			: // @ts-ignore Node typings have this
			  global;

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @returns {void}
	 */
	function append(target, node) {
		target.appendChild(node);
	}

	/**
	 * @param {Node} node
	 * @returns {ShadowRoot | Document}
	 */
	function get_root_for_style(node) {
		if (!node) return document;
		const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
		if (root && /** @type {ShadowRoot} */ (root).host) {
			return /** @type {ShadowRoot} */ (root);
		}
		return node.ownerDocument;
	}

	/**
	 * @param {Node} node
	 * @returns {CSSStyleSheet}
	 */
	function append_empty_stylesheet(node) {
		const style_element = element('style');
		// For transitions to work without 'style-src: unsafe-inline' Content Security Policy,
		// these empty tags need to be allowed with a hash as a workaround until we move to the Web Animations API.
		// Using the hash for the empty string (for an empty tag) works in all browsers except Safari.
		// So as a workaround for the workaround, when we append empty style tags we set their content to /* empty */.
		// The hash 'sha256-9OlNO0DNEeaVzHL4RZwCLsBHA8WBQ8toBp/4F5XV2nc=' will then work even in Safari.
		style_element.textContent = '/* empty */';
		append_stylesheet(get_root_for_style(node), style_element);
		return style_element.sheet;
	}

	/**
	 * @param {ShadowRoot | Document} node
	 * @param {HTMLStyleElement} style
	 * @returns {CSSStyleSheet}
	 */
	function append_stylesheet(node, style) {
		append(/** @type {Document} */ (node).head || node, style);
		return style.sheet;
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @param {Node} [anchor]
	 * @returns {void}
	 */
	function insert(target, node, anchor) {
		target.insertBefore(node, anchor || null);
	}

	/**
	 * @param {Node} node
	 * @returns {void}
	 */
	function detach(node) {
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	}

	/**
	 * @template {keyof HTMLElementTagNameMap} K
	 * @param {K} name
	 * @returns {HTMLElementTagNameMap[K]}
	 */
	function element(name) {
		return document.createElement(name);
	}

	/**
	 * @template {keyof SVGElementTagNameMap} K
	 * @param {K} name
	 * @returns {SVGElement}
	 */
	function svg_element(name) {
		return document.createElementNS('http://www.w3.org/2000/svg', name);
	}

	/**
	 * @param {string} data
	 * @returns {Text}
	 */
	function text(data) {
		return document.createTextNode(data);
	}

	/**
	 * @returns {Text} */
	function space() {
		return text(' ');
	}

	/**
	 * @returns {Text} */
	function empty() {
		return text('');
	}

	/**
	 * @param {EventTarget} node
	 * @param {string} event
	 * @param {EventListenerOrEventListenerObject} handler
	 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
	 * @returns {() => void}
	 */
	function listen(node, event, handler, options) {
		node.addEventListener(event, handler, options);
		return () => node.removeEventListener(event, handler, options);
	}

	/**
	 * @returns {(event: any) => any} */
	function stop_propagation(fn) {
		return function (event) {
			event.stopPropagation();
			// @ts-ignore
			return fn.call(this, event);
		};
	}

	/**
	 * @param {Element} node
	 * @param {string} attribute
	 * @param {string} [value]
	 * @returns {void}
	 */
	function attr(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
	}
	/**
	 * List of attributes that should always be set through the attr method,
	 * because updating them through the property setter doesn't work reliably.
	 * In the example of `width`/`height`, the problem is that the setter only
	 * accepts numeric values, but the attribute can also be set to a string like `50%`.
	 * If this list becomes too big, rethink this approach.
	 */
	const always_set_through_set_attribute = ['width', 'height'];

	/**
	 * @param {Element & ElementCSSInlineStyle} node
	 * @param {{ [x: string]: string }} attributes
	 * @returns {void}
	 */
	function set_attributes(node, attributes) {
		// @ts-ignore
		const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
		for (const key in attributes) {
			if (attributes[key] == null) {
				node.removeAttribute(key);
			} else if (key === 'style') {
				node.style.cssText = attributes[key];
			} else if (key === '__value') {
				/** @type {any} */ (node).value = node[key] = attributes[key];
			} else if (
				descriptors[key] &&
				descriptors[key].set &&
				always_set_through_set_attribute.indexOf(key) === -1
			) {
				node[key] = attributes[key];
			} else {
				attr(node, key, attributes[key]);
			}
		}
	}

	/**
	 * @param {Element & ElementCSSInlineStyle} node
	 * @param {{ [x: string]: string }} attributes
	 * @returns {void}
	 */
	function set_svg_attributes(node, attributes) {
		for (const key in attributes) {
			attr(node, key, attributes[key]);
		}
	}

	/** @returns {number} */
	function to_number(value) {
		return value === '' ? null : +value;
	}

	/**
	 * @param {Element} element
	 * @returns {ChildNode[]}
	 */
	function children(element) {
		return Array.from(element.childNodes);
	}

	/**
	 * @returns {void} */
	function set_input_value(input, value) {
		input.value = value == null ? '' : value;
	}

	/**
	 * @returns {void} */
	function set_style(node, key, value, important) {
		if (value == null) {
			node.style.removeProperty(key);
		} else {
			node.style.setProperty(key, value, important ? 'important' : '');
		}
	}

	/**
	 * @template T
	 * @param {string} type
	 * @param {T} [detail]
	 * @param {{ bubbles?: boolean, cancelable?: boolean }} [options]
	 * @returns {CustomEvent<T>}
	 */
	function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
		return new CustomEvent(type, { detail, bubbles, cancelable });
	}

	/**
	 * @typedef {Node & {
	 * 	claim_order?: number;
	 * 	hydrate_init?: true;
	 * 	actual_end_child?: NodeEx;
	 * 	childNodes: NodeListOf<NodeEx>;
	 * }} NodeEx
	 */

	/** @typedef {ChildNode & NodeEx} ChildNodeEx */

	/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

	/**
	 * @typedef {ChildNodeEx[] & {
	 * 	claim_info?: {
	 * 		last_index: number;
	 * 		total_claimed: number;
	 * 	};
	 * }} ChildNodeArray
	 */

	// we need to store the information for multiple documents because a Svelte application could also contain iframes
	// https://github.com/sveltejs/svelte/issues/3624
	/** @type {Map<Document | ShadowRoot, import('./private.d.ts').StyleInformation>} */
	const managed_styles = new Map();

	let active = 0;

	// https://github.com/darkskyapp/string-hash/blob/master/index.js
	/**
	 * @param {string} str
	 * @returns {number}
	 */
	function hash(str) {
		let hash = 5381;
		let i = str.length;
		while (i--) hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
		return hash >>> 0;
	}

	/**
	 * @param {Document | ShadowRoot} doc
	 * @param {Element & ElementCSSInlineStyle} node
	 * @returns {{ stylesheet: any; rules: {}; }}
	 */
	function create_style_information(doc, node) {
		const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
		managed_styles.set(doc, info);
		return info;
	}

	/**
	 * @param {Element & ElementCSSInlineStyle} node
	 * @param {number} a
	 * @param {number} b
	 * @param {number} duration
	 * @param {number} delay
	 * @param {(t: number) => number} ease
	 * @param {(t: number, u: number) => string} fn
	 * @param {number} uid
	 * @returns {string}
	 */
	function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
		const step = 16.666 / duration;
		let keyframes = '{\n';
		for (let p = 0; p <= 1; p += step) {
			const t = a + (b - a) * ease(p);
			keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
		}
		const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
		const name = `__svelte_${hash(rule)}_${uid}`;
		const doc = get_root_for_style(node);
		const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
		if (!rules[name]) {
			rules[name] = true;
			stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
		}
		const animation = node.style.animation || '';
		node.style.animation = `${
		animation ? `${animation}, ` : ''
	}${name} ${duration}ms linear ${delay}ms 1 both`;
		active += 1;
		return name;
	}

	/**
	 * @param {Element & ElementCSSInlineStyle} node
	 * @param {string} [name]
	 * @returns {void}
	 */
	function delete_rule(node, name) {
		const previous = (node.style.animation || '').split(', ');
		const next = previous.filter(
			name
				? (anim) => anim.indexOf(name) < 0 // remove specific animation
				: (anim) => anim.indexOf('__svelte') === -1 // remove all Svelte animations
		);
		const deleted = previous.length - next.length;
		if (deleted) {
			node.style.animation = next.join(', ');
			active -= deleted;
			if (!active) clear_rules();
		}
	}

	/** @returns {void} */
	function clear_rules() {
		raf(() => {
			if (active) return;
			managed_styles.forEach((info) => {
				const { ownerNode } = info.stylesheet;
				// there is no ownerNode if it runs on jsdom.
				if (ownerNode) detach(ownerNode);
			});
			managed_styles.clear();
		});
	}

	let current_component;

	/** @returns {void} */
	function set_current_component(component) {
		current_component = component;
	}

	function get_current_component() {
		if (!current_component) throw new Error('Function called outside component initialization');
		return current_component;
	}

	/**
	 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
	 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
	 * it can be called from an external module).
	 *
	 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
	 *
	 * `onMount` does not run inside a [server-side component](https://svelte.dev/docs#run-time-server-side-component-api).
	 *
	 * https://svelte.dev/docs/svelte#onmount
	 * @template T
	 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
	 * @returns {void}
	 */
	function onMount(fn) {
		get_current_component().$$.on_mount.push(fn);
	}

	/**
	 * Schedules a callback to run immediately before the component is unmounted.
	 *
	 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
	 * only one that runs inside a server-side component.
	 *
	 * https://svelte.dev/docs/svelte#ondestroy
	 * @param {() => any} fn
	 * @returns {void}
	 */
	function onDestroy(fn) {
		get_current_component().$$.on_destroy.push(fn);
	}

	/**
	 * Creates an event dispatcher that can be used to dispatch [component events](https://svelte.dev/docs#template-syntax-component-directives-on-eventname).
	 * Event dispatchers are functions that can take two arguments: `name` and `detail`.
	 *
	 * Component events created with `createEventDispatcher` create a
	 * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
	 * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
	 * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
	 * property and can contain any type of data.
	 *
	 * The event dispatcher can be typed to narrow the allowed event names and the type of the `detail` argument:
	 * ```ts
	 * const dispatch = createEventDispatcher<{
	 *  loaded: never; // does not take a detail argument
	 *  change: string; // takes a detail argument of type string, which is required
	 *  optional: number | null; // takes an optional detail argument of type number
	 * }>();
	 * ```
	 *
	 * https://svelte.dev/docs/svelte#createeventdispatcher
	 * @template {Record<string, any>} [EventMap=any]
	 * @returns {import('./public.js').EventDispatcher<EventMap>}
	 */
	function createEventDispatcher() {
		const component = get_current_component();
		return (type, detail, { cancelable = false } = {}) => {
			const callbacks = component.$$.callbacks[type];
			if (callbacks) {
				// TODO are there situations where events could be dispatched
				// in a server (non-DOM) environment?
				const event = custom_event(/** @type {string} */ (type), detail, { cancelable });
				callbacks.slice().forEach((fn) => {
					fn.call(component, event);
				});
				return !event.defaultPrevented;
			}
			return true;
		};
	}

	/**
	 * Associates an arbitrary `context` object with the current component and the specified `key`
	 * and returns that object. The context is then available to children of the component
	 * (including slotted content) with `getContext`.
	 *
	 * Like lifecycle functions, this must be called during component initialisation.
	 *
	 * https://svelte.dev/docs/svelte#setcontext
	 * @template T
	 * @param {any} key
	 * @param {T} context
	 * @returns {T}
	 */
	function setContext(key, context) {
		get_current_component().$$.context.set(key, context);
		return context;
	}

	/**
	 * Retrieves the context that belongs to the closest parent component with the specified `key`.
	 * Must be called during component initialisation.
	 *
	 * https://svelte.dev/docs/svelte#getcontext
	 * @template T
	 * @param {any} key
	 * @returns {T}
	 */
	function getContext(key) {
		return get_current_component().$$.context.get(key);
	}

	// TODO figure out if we still want to support
	// shorthand events, or if we want to implement
	// a real bubbling mechanism
	/**
	 * @param component
	 * @param event
	 * @returns {void}
	 */
	function bubble(component, event) {
		const callbacks = component.$$.callbacks[event.type];
		if (callbacks) {
			// @ts-ignore
			callbacks.slice().forEach((fn) => fn.call(this, event));
		}
	}

	const dirty_components = [];
	const binding_callbacks = [];

	let render_callbacks = [];

	const flush_callbacks = [];

	const resolved_promise = /* @__PURE__ */ Promise.resolve();

	let update_scheduled = false;

	/** @returns {void} */
	function schedule_update() {
		if (!update_scheduled) {
			update_scheduled = true;
			resolved_promise.then(flush);
		}
	}

	/** @returns {void} */
	function add_render_callback(fn) {
		render_callbacks.push(fn);
	}

	// flush() calls callbacks in this order:
	// 1. All beforeUpdate callbacks, in order: parents before children
	// 2. All bind:this callbacks, in reverse order: children before parents.
	// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
	//    for afterUpdates called during the initial onMount, which are called in
	//    reverse order: children before parents.
	// Since callbacks might update component values, which could trigger another
	// call to flush(), the following steps guard against this:
	// 1. During beforeUpdate, any updated components will be added to the
	//    dirty_components array and will cause a reentrant call to flush(). Because
	//    the flush index is kept outside the function, the reentrant call will pick
	//    up where the earlier call left off and go through all dirty components. The
	//    current_component value is saved and restored so that the reentrant call will
	//    not interfere with the "parent" flush() call.
	// 2. bind:this callbacks cannot trigger new flush() calls.
	// 3. During afterUpdate, any updated components will NOT have their afterUpdate
	//    callback called a second time; the seen_callbacks set, outside the flush()
	//    function, guarantees this behavior.
	const seen_callbacks = new Set();

	let flushidx = 0; // Do *not* move this inside the flush() function

	/** @returns {void} */
	function flush() {
		// Do not reenter flush while dirty components are updated, as this can
		// result in an infinite loop. Instead, let the inner flush handle it.
		// Reentrancy is ok afterwards for bindings etc.
		if (flushidx !== 0) {
			return;
		}
		const saved_component = current_component;
		do {
			// first, call beforeUpdate functions
			// and update components
			try {
				while (flushidx < dirty_components.length) {
					const component = dirty_components[flushidx];
					flushidx++;
					set_current_component(component);
					update(component.$$);
				}
			} catch (e) {
				// reset dirty state to not end up in a deadlocked state and then rethrow
				dirty_components.length = 0;
				flushidx = 0;
				throw e;
			}
			set_current_component(null);
			dirty_components.length = 0;
			flushidx = 0;
			while (binding_callbacks.length) binding_callbacks.pop()();
			// then, once components are updated, call
			// afterUpdate functions. This may cause
			// subsequent updates...
			for (let i = 0; i < render_callbacks.length; i += 1) {
				const callback = render_callbacks[i];
				if (!seen_callbacks.has(callback)) {
					// ...so guard against infinite loops
					seen_callbacks.add(callback);
					callback();
				}
			}
			render_callbacks.length = 0;
		} while (dirty_components.length);
		while (flush_callbacks.length) {
			flush_callbacks.pop()();
		}
		update_scheduled = false;
		seen_callbacks.clear();
		set_current_component(saved_component);
	}

	/** @returns {void} */
	function update($$) {
		if ($$.fragment !== null) {
			$$.update();
			run_all($$.before_update);
			const dirty = $$.dirty;
			$$.dirty = [-1];
			$$.fragment && $$.fragment.p($$.ctx, dirty);
			$$.after_update.forEach(add_render_callback);
		}
	}

	/**
	 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function flush_render_callbacks(fns) {
		const filtered = [];
		const targets = [];
		render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
		targets.forEach((c) => c());
		render_callbacks = filtered;
	}

	/**
	 * @type {Promise<void> | null}
	 */
	let promise;

	/**
	 * @returns {Promise<void>}
	 */
	function wait() {
		if (!promise) {
			promise = Promise.resolve();
			promise.then(() => {
				promise = null;
			});
		}
		return promise;
	}

	/**
	 * @param {Element} node
	 * @param {INTRO | OUTRO | boolean} direction
	 * @param {'start' | 'end'} kind
	 * @returns {void}
	 */
	function dispatch(node, direction, kind) {
		node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
	}

	const outroing = new Set();

	/**
	 * @type {Outro}
	 */
	let outros;

	/**
	 * @returns {void} */
	function group_outros() {
		outros = {
			r: 0,
			c: [],
			p: outros // parent group
		};
	}

	/**
	 * @returns {void} */
	function check_outros() {
		if (!outros.r) {
			run_all(outros.c);
		}
		outros = outros.p;
	}

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} [local]
	 * @returns {void}
	 */
	function transition_in(block, local) {
		if (block && block.i) {
			outroing.delete(block);
			block.i(local);
		}
	}

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} local
	 * @param {0 | 1} [detach]
	 * @param {() => void} [callback]
	 * @returns {void}
	 */
	function transition_out(block, local, detach, callback) {
		if (block && block.o) {
			if (outroing.has(block)) return;
			outroing.add(block);
			outros.c.push(() => {
				outroing.delete(block);
				if (callback) {
					if (detach) block.d(1);
					callback();
				}
			});
			block.o(local);
		} else if (callback) {
			callback();
		}
	}

	/**
	 * @type {import('../transition/public.js').TransitionConfig}
	 */
	const null_transition = { duration: 0 };

	/**
	 * @param {Element & ElementCSSInlineStyle} node
	 * @param {TransitionFn} fn
	 * @param {any} params
	 * @returns {{ start(): void; invalidate(): void; end(): void; }}
	 */
	function create_in_transition(node, fn, params) {
		/**
		 * @type {TransitionOptions} */
		const options = { direction: 'in' };
		let config = fn(node, params, options);
		let running = false;
		let animation_name;
		let task;
		let uid = 0;

		/**
		 * @returns {void} */
		function cleanup() {
			if (animation_name) delete_rule(node, animation_name);
		}

		/**
		 * @returns {void} */
		function go() {
			const {
				delay = 0,
				duration = 300,
				easing = identity,
				tick = noop$1,
				css
			} = config || null_transition;
			if (css) animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
			tick(0, 1);
			const start_time = now() + delay;
			const end_time = start_time + duration;
			if (task) task.abort();
			running = true;
			add_render_callback(() => dispatch(node, true, 'start'));
			task = loop((now) => {
				if (running) {
					if (now >= end_time) {
						tick(1, 0);
						dispatch(node, true, 'end');
						cleanup();
						return (running = false);
					}
					if (now >= start_time) {
						const t = easing((now - start_time) / duration);
						tick(t, 1 - t);
					}
				}
				return running;
			});
		}
		let started = false;
		return {
			start() {
				if (started) return;
				started = true;
				delete_rule(node);
				if (is_function(config)) {
					config = config(options);
					wait().then(go);
				} else {
					go();
				}
			},
			invalidate() {
				started = false;
			},
			end() {
				if (running) {
					cleanup();
					running = false;
				}
			}
		};
	}

	/**
	 * @param {Element & ElementCSSInlineStyle} node
	 * @param {TransitionFn} fn
	 * @param {any} params
	 * @returns {{ end(reset: any): void; }}
	 */
	function create_out_transition(node, fn, params) {
		/** @type {TransitionOptions} */
		const options = { direction: 'out' };
		let config = fn(node, params, options);
		let running = true;
		let animation_name;
		const group = outros;
		group.r += 1;
		/** @type {boolean} */
		let original_inert_value;

		/**
		 * @returns {void} */
		function go() {
			const {
				delay = 0,
				duration = 300,
				easing = identity,
				tick = noop$1,
				css
			} = config || null_transition;

			if (css) animation_name = create_rule(node, 1, 0, duration, delay, easing, css);

			const start_time = now() + delay;
			const end_time = start_time + duration;
			add_render_callback(() => dispatch(node, false, 'start'));

			if ('inert' in node) {
				original_inert_value = /** @type {HTMLElement} */ (node).inert;
				node.inert = true;
			}

			loop((now) => {
				if (running) {
					if (now >= end_time) {
						tick(0, 1);
						dispatch(node, false, 'end');
						if (!--group.r) {
							// this will result in `end()` being called,
							// so we don't need to clean up here
							run_all(group.c);
						}
						return false;
					}
					if (now >= start_time) {
						const t = easing((now - start_time) / duration);
						tick(1 - t, t);
					}
				}
				return running;
			});
		}

		if (is_function(config)) {
			wait().then(() => {
				// @ts-ignore
				config = config(options);
				go();
			});
		} else {
			go();
		}

		return {
			end(reset) {
				if (reset && 'inert' in node) {
					node.inert = original_inert_value;
				}
				if (reset && config.tick) {
					config.tick(1, 0);
				}
				if (running) {
					if (animation_name) delete_rule(node, animation_name);
					running = false;
				}
			}
		};
	}

	/** @typedef {1} INTRO */
	/** @typedef {0} OUTRO */
	/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
	/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

	/**
	 * @typedef {Object} Outro
	 * @property {number} r
	 * @property {Function[]} c
	 * @property {Object} p
	 */

	/**
	 * @typedef {Object} PendingProgram
	 * @property {number} start
	 * @property {INTRO|OUTRO} b
	 * @property {Outro} [group]
	 */

	/**
	 * @typedef {Object} Program
	 * @property {number} a
	 * @property {INTRO|OUTRO} b
	 * @property {1|-1} d
	 * @property {number} duration
	 * @property {number} start
	 * @property {number} end
	 * @property {Outro} [group]
	 */

	/**
	 * @template T
	 * @param {Promise<T>} promise
	 * @param {import('./private.js').PromiseInfo<T>} info
	 * @returns {boolean}
	 */
	function handle_promise(promise, info) {
		const token = (info.token = {});
		/**
		 * @param {import('./private.js').FragmentFactory} type
		 * @param {0 | 1 | 2} index
		 * @param {number} [key]
		 * @param {any} [value]
		 * @returns {void}
		 */
		function update(type, index, key, value) {
			if (info.token !== token) return;
			info.resolved = value;
			let child_ctx = info.ctx;
			if (key !== undefined) {
				child_ctx = child_ctx.slice();
				child_ctx[key] = value;
			}
			const block = type && (info.current = type)(child_ctx);
			let needs_flush = false;
			if (info.block) {
				if (info.blocks) {
					info.blocks.forEach((block, i) => {
						if (i !== index && block) {
							group_outros();
							transition_out(block, 1, 1, () => {
								if (info.blocks[i] === block) {
									info.blocks[i] = null;
								}
							});
							check_outros();
						}
					});
				} else {
					info.block.d(1);
				}
				block.c();
				transition_in(block, 1);
				block.m(info.mount(), info.anchor);
				needs_flush = true;
			}
			info.block = block;
			if (info.blocks) info.blocks[index] = block;
			if (needs_flush) {
				flush();
			}
		}
		if (is_promise(promise)) {
			const current_component = get_current_component();
			promise.then(
				(value) => {
					set_current_component(current_component);
					update(info.then, 1, info.value, value);
					set_current_component(null);
				},
				(error) => {
					set_current_component(current_component);
					update(info.catch, 2, info.error, error);
					set_current_component(null);
					if (!info.hasCatch) {
						throw error;
					}
				}
			);
			// if we previously had a then/catch block, destroy it
			if (info.current !== info.pending) {
				update(info.pending, 0);
				return true;
			}
		} else {
			if (info.current !== info.then) {
				update(info.then, 1, info.value, promise);
				return true;
			}
			info.resolved = /** @type {T} */ (promise);
		}
	}

	/** @returns {void} */
	function update_await_block_branch(info, ctx, dirty) {
		const child_ctx = ctx.slice();
		const { resolved } = info;
		if (info.current === info.then) {
			child_ctx[info.value] = resolved;
		}
		if (info.current === info.catch) {
			child_ctx[info.error] = resolved;
		}
		info.block.p(child_ctx, dirty);
	}

	// general each functions:

	function ensure_array_like(array_like_or_iterator) {
		return array_like_or_iterator?.length !== undefined
			? array_like_or_iterator
			: Array.from(array_like_or_iterator);
	}

	// keyed each functions:

	/** @returns {void} */
	function destroy_block(block, lookup) {
		block.d(1);
		lookup.delete(block.key);
	}

	/** @returns {any[]} */
	function update_keyed_each(
		old_blocks,
		dirty,
		get_key,
		dynamic,
		ctx,
		list,
		lookup,
		node,
		destroy,
		create_each_block,
		next,
		get_context
	) {
		let o = old_blocks.length;
		let n = list.length;
		let i = o;
		const old_indexes = {};
		while (i--) old_indexes[old_blocks[i].key] = i;
		const new_blocks = [];
		const new_lookup = new Map();
		const deltas = new Map();
		const updates = [];
		i = n;
		while (i--) {
			const child_ctx = get_context(ctx, list, i);
			const key = get_key(child_ctx);
			let block = lookup.get(key);
			if (!block) {
				block = create_each_block(key, child_ctx);
				block.c();
			} else if (dynamic) {
				// defer updates until all the DOM shuffling is done
				updates.push(() => block.p(child_ctx, dirty));
			}
			new_lookup.set(key, (new_blocks[i] = block));
			if (key in old_indexes) deltas.set(key, Math.abs(i - old_indexes[key]));
		}
		const will_move = new Set();
		const did_move = new Set();
		/** @returns {void} */
		function insert(block) {
			transition_in(block, 1);
			block.m(node, next);
			lookup.set(block.key, block);
			next = block.first;
			n--;
		}
		while (o && n) {
			const new_block = new_blocks[n - 1];
			const old_block = old_blocks[o - 1];
			const new_key = new_block.key;
			const old_key = old_block.key;
			if (new_block === old_block) {
				// do nothing
				next = new_block.first;
				o--;
				n--;
			} else if (!new_lookup.has(old_key)) {
				// remove old block
				destroy(old_block, lookup);
				o--;
			} else if (!lookup.has(new_key) || will_move.has(new_key)) {
				insert(new_block);
			} else if (did_move.has(old_key)) {
				o--;
			} else if (deltas.get(new_key) > deltas.get(old_key)) {
				did_move.add(new_key);
				insert(new_block);
			} else {
				will_move.add(old_key);
				o--;
			}
		}
		while (o--) {
			const old_block = old_blocks[o];
			if (!new_lookup.has(old_block.key)) destroy(old_block, lookup);
		}
		while (n) insert(new_blocks[n - 1]);
		run_all(updates);
		return new_blocks;
	}

	/** @returns {void} */
	function validate_each_keys(ctx, list, get_context, get_key) {
		const keys = new Map();
		for (let i = 0; i < list.length; i++) {
			const key = get_key(get_context(ctx, list, i));
			if (keys.has(key)) {
				let value = '';
				try {
					value = `with value '${String(key)}' `;
				} catch (e) {
					// can't stringify
				}
				throw new Error(
					`Cannot have duplicate keys in a keyed each: Keys at index ${keys.get(
					key
				)} and ${i} ${value}are duplicates`
				);
			}
			keys.set(key, i);
		}
	}

	/** @returns {{}} */
	function get_spread_update(levels, updates) {
		const update = {};
		const to_null_out = {};
		const accounted_for = { $$scope: 1 };
		let i = levels.length;
		while (i--) {
			const o = levels[i];
			const n = updates[i];
			if (n) {
				for (const key in o) {
					if (!(key in n)) to_null_out[key] = 1;
				}
				for (const key in n) {
					if (!accounted_for[key]) {
						update[key] = n[key];
						accounted_for[key] = 1;
					}
				}
				levels[i] = n;
			} else {
				for (const key in o) {
					accounted_for[key] = 1;
				}
			}
		}
		for (const key in to_null_out) {
			if (!(key in update)) update[key] = undefined;
		}
		return update;
	}

	function get_spread_object(spread_props) {
		return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
	}

	/** @returns {void} */
	function create_component(block) {
		block && block.c();
	}

	/** @returns {void} */
	function mount_component(component, target, anchor) {
		const { fragment, after_update } = component.$$;
		fragment && fragment.m(target, anchor);
		// onMount happens before the initial afterUpdate
		add_render_callback(() => {
			const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
			// if the component was destroyed immediately
			// it will update the `$$.on_destroy` reference to `null`.
			// the destructured on_destroy may still reference to the old array
			if (component.$$.on_destroy) {
				component.$$.on_destroy.push(...new_on_destroy);
			} else {
				// Edge case - component was destroyed immediately,
				// most likely as a result of a binding initialising
				run_all(new_on_destroy);
			}
			component.$$.on_mount = [];
		});
		after_update.forEach(add_render_callback);
	}

	/** @returns {void} */
	function destroy_component(component, detaching) {
		const $$ = component.$$;
		if ($$.fragment !== null) {
			flush_render_callbacks($$.after_update);
			run_all($$.on_destroy);
			$$.fragment && $$.fragment.d(detaching);
			// TODO null out other refs, including component.$$ (but need to
			// preserve final state?)
			$$.on_destroy = $$.fragment = null;
			$$.ctx = [];
		}
	}

	/** @returns {void} */
	function make_dirty(component, i) {
		if (component.$$.dirty[0] === -1) {
			dirty_components.push(component);
			schedule_update();
			component.$$.dirty.fill(0);
		}
		component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
	}

	// TODO: Document the other params
	/**
	 * @param {SvelteComponent} component
	 * @param {import('./public.js').ComponentConstructorOptions} options
	 *
	 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
	 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
	 * This will be the `add_css` function from the compiled component.
	 *
	 * @returns {void}
	 */
	function init(
		component,
		options,
		instance,
		create_fragment,
		not_equal,
		props,
		append_styles = null,
		dirty = [-1]
	) {
		const parent_component = current_component;
		set_current_component(component);
		/** @type {import('./private.js').T$$} */
		const $$ = (component.$$ = {
			fragment: null,
			ctx: [],
			// state
			props,
			update: noop$1,
			not_equal,
			bound: blank_object(),
			// lifecycle
			on_mount: [],
			on_destroy: [],
			on_disconnect: [],
			before_update: [],
			after_update: [],
			context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
			// everything else
			callbacks: blank_object(),
			dirty,
			skip_bound: false,
			root: options.target || parent_component.$$.root
		});
		append_styles && append_styles($$.root);
		let ready = false;
		$$.ctx = instance
			? instance(component, options.props || {}, (i, ret, ...rest) => {
					const value = rest.length ? rest[0] : ret;
					if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
						if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
						if (ready) make_dirty(component, i);
					}
					return ret;
			  })
			: [];
		$$.update();
		ready = true;
		run_all($$.before_update);
		// `false` as a special case of no DOM component
		$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
		if (options.target) {
			if (options.hydrate) {
				// TODO: what is the correct type here?
				// @ts-expect-error
				const nodes = children(options.target);
				$$.fragment && $$.fragment.l(nodes);
				nodes.forEach(detach);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				$$.fragment && $$.fragment.c();
			}
			if (options.intro) transition_in(component.$$.fragment);
			mount_component(component, options.target, options.anchor);
			flush();
		}
		set_current_component(parent_component);
	}

	/**
	 * Base class for Svelte components. Used when dev=false.
	 *
	 * @template {Record<string, any>} [Props=any]
	 * @template {Record<string, any>} [Events=any]
	 */
	class SvelteComponent {
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$ = undefined;
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$set = undefined;

		/** @returns {void} */
		$destroy() {
			destroy_component(this, 1);
			this.$destroy = noop$1;
		}

		/**
		 * @template {Extract<keyof Events, string>} K
		 * @param {K} type
		 * @param {((e: Events[K]) => void) | null | undefined} callback
		 * @returns {() => void}
		 */
		$on(type, callback) {
			if (!is_function(callback)) {
				return noop$1;
			}
			const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
			callbacks.push(callback);
			return () => {
				const index = callbacks.indexOf(callback);
				if (index !== -1) callbacks.splice(index, 1);
			};
		}

		/**
		 * @param {Partial<Props>} props
		 * @returns {void}
		 */
		$set(props) {
			if (this.$$set && !is_empty(props)) {
				this.$$.skip_bound = true;
				this.$$set(props);
				this.$$.skip_bound = false;
			}
		}
	}

	/**
	 * @typedef {Object} CustomElementPropDefinition
	 * @property {string} [attribute]
	 * @property {boolean} [reflect]
	 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
	 */

	// generated during release, do not modify

	/**
	 * The current version, as set in package.json.
	 *
	 * https://svelte.dev/docs/svelte-compiler#svelte-version
	 * @type {string}
	 */
	const VERSION$1 = '4.2.18';
	const PUBLIC_VERSION = '4';

	/**
	 * @template T
	 * @param {string} type
	 * @param {T} [detail]
	 * @returns {void}
	 */
	function dispatch_dev(type, detail) {
		document.dispatchEvent(custom_event(type, { version: VERSION$1, ...detail }, { bubbles: true }));
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @returns {void}
	 */
	function append_dev(target, node) {
		dispatch_dev('SvelteDOMInsert', { target, node });
		append(target, node);
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @param {Node} [anchor]
	 * @returns {void}
	 */
	function insert_dev(target, node, anchor) {
		dispatch_dev('SvelteDOMInsert', { target, node, anchor });
		insert(target, node, anchor);
	}

	/**
	 * @param {Node} node
	 * @returns {void}
	 */
	function detach_dev(node) {
		dispatch_dev('SvelteDOMRemove', { node });
		detach(node);
	}

	/**
	 * @param {Node} node
	 * @param {string} event
	 * @param {EventListenerOrEventListenerObject} handler
	 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
	 * @param {boolean} [has_prevent_default]
	 * @param {boolean} [has_stop_propagation]
	 * @param {boolean} [has_stop_immediate_propagation]
	 * @returns {() => void}
	 */
	function listen_dev(
		node,
		event,
		handler,
		options,
		has_prevent_default,
		has_stop_propagation,
		has_stop_immediate_propagation
	) {
		const modifiers =
			options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
		if (has_prevent_default) modifiers.push('preventDefault');
		if (has_stop_propagation) modifiers.push('stopPropagation');
		if (has_stop_immediate_propagation) modifiers.push('stopImmediatePropagation');
		dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
		const dispose = listen(node, event, handler, options);
		return () => {
			dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
			dispose();
		};
	}

	/**
	 * @param {Element} node
	 * @param {string} attribute
	 * @param {string} [value]
	 * @returns {void}
	 */
	function attr_dev(node, attribute, value) {
		attr(node, attribute, value);
		if (value == null) dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
		else dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
	}

	/**
	 * @param {Element} node
	 * @param {string} property
	 * @param {any} [value]
	 * @returns {void}
	 */
	function prop_dev(node, property, value) {
		node[property] = value;
		dispatch_dev('SvelteDOMSetProperty', { node, property, value });
	}

	/**
	 * @param {Text} text
	 * @param {unknown} data
	 * @returns {void}
	 */
	function set_data_dev(text, data) {
		data = '' + data;
		if (text.data === data) return;
		dispatch_dev('SvelteDOMSetData', { node: text, data });
		text.data = /** @type {string} */ (data);
	}

	function ensure_array_like_dev(arg) {
		if (
			typeof arg !== 'string' &&
			!(arg && typeof arg === 'object' && 'length' in arg) &&
			!(typeof Symbol === 'function' && arg && Symbol.iterator in arg)
		) {
			throw new Error('{#each} only works with iterable values.');
		}
		return ensure_array_like(arg);
	}

	/**
	 * @returns {void} */
	function validate_slots(name, slot, keys) {
		for (const slot_key of Object.keys(slot)) {
			if (!~keys.indexOf(slot_key)) {
				console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
			}
		}
	}

	function construct_svelte_component_dev(component, props) {
		const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
		try {
			const instance = new component(props);
			if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
				throw new Error(error_message);
			}
			return instance;
		} catch (err) {
			const { message } = err;
			if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
				throw new Error(error_message);
			} else {
				throw err;
			}
		}
	}

	/**
	 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
	 *
	 * Can be used to create strongly typed Svelte components.
	 *
	 * #### Example:
	 *
	 * You have component library on npm called `component-library`, from which
	 * you export a component called `MyComponent`. For Svelte+TypeScript users,
	 * you want to provide typings. Therefore you create a `index.d.ts`:
	 * ```ts
	 * import { SvelteComponent } from "svelte";
	 * export class MyComponent extends SvelteComponent<{foo: string}> {}
	 * ```
	 * Typing this makes it possible for IDEs like VS Code with the Svelte extension
	 * to provide intellisense and to use the component like this in a Svelte file
	 * with TypeScript:
	 * ```svelte
	 * <script lang="ts">
	 * 	import { MyComponent } from "component-library";
	 * </script>
	 * <MyComponent foo={'bar'} />
	 * ```
	 * @template {Record<string, any>} [Props=any]
	 * @template {Record<string, any>} [Events=any]
	 * @template {Record<string, any>} [Slots=any]
	 * @extends {SvelteComponent<Props, Events>}
	 */
	class SvelteComponentDev extends SvelteComponent {
		/**
		 * For type checking capabilities only.
		 * Does not exist at runtime.
		 * ### DO NOT USE!
		 *
		 * @type {Props}
		 */
		$$prop_def;
		/**
		 * For type checking capabilities only.
		 * Does not exist at runtime.
		 * ### DO NOT USE!
		 *
		 * @type {Events}
		 */
		$$events_def;
		/**
		 * For type checking capabilities only.
		 * Does not exist at runtime.
		 * ### DO NOT USE!
		 *
		 * @type {Slots}
		 */
		$$slot_def;

		/** @param {import('./public.js').ComponentConstructorOptions<Props>} options */
		constructor(options) {
			if (!options || (!options.target && !options.$$inline)) {
				throw new Error("'target' is a required option");
			}
			super();
		}

		/** @returns {void} */
		$destroy() {
			super.$destroy();
			this.$destroy = () => {
				console.warn('Component was already destroyed'); // eslint-disable-line no-console
			};
		}

		/** @returns {void} */
		$capture_state() {}

		/** @returns {void} */
		$inject_state() {}
	}

	if (typeof window !== 'undefined')
		// @ts-ignore
		(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

	const matchIconName = /^[a-z0-9]+(-[a-z0-9]+)*$/;
	const stringToIcon = (value, validate, allowSimpleName, provider = "") => {
	  const colonSeparated = value.split(":");
	  if (value.slice(0, 1) === "@") {
	    if (colonSeparated.length < 2 || colonSeparated.length > 3) {
	      return null;
	    }
	    provider = colonSeparated.shift().slice(1);
	  }
	  if (colonSeparated.length > 3 || !colonSeparated.length) {
	    return null;
	  }
	  if (colonSeparated.length > 1) {
	    const name2 = colonSeparated.pop();
	    const prefix = colonSeparated.pop();
	    const result = {
	      // Allow provider without '@': "provider:prefix:name"
	      provider: colonSeparated.length > 0 ? colonSeparated[0] : provider,
	      prefix,
	      name: name2
	    };
	    return validate && !validateIconName(result) ? null : result;
	  }
	  const name = colonSeparated[0];
	  const dashSeparated = name.split("-");
	  if (dashSeparated.length > 1) {
	    const result = {
	      provider,
	      prefix: dashSeparated.shift(),
	      name: dashSeparated.join("-")
	    };
	    return validate && !validateIconName(result) ? null : result;
	  }
	  if (allowSimpleName && provider === "") {
	    const result = {
	      provider,
	      prefix: "",
	      name
	    };
	    return validate && !validateIconName(result, allowSimpleName) ? null : result;
	  }
	  return null;
	};
	const validateIconName = (icon, allowSimpleName) => {
	  if (!icon) {
	    return false;
	  }
	  return !!((icon.provider === "" || icon.provider.match(matchIconName)) && (allowSimpleName && icon.prefix === "" || icon.prefix.match(matchIconName)) && icon.name.match(matchIconName));
	};

	const defaultIconDimensions = Object.freeze(
	  {
	    left: 0,
	    top: 0,
	    width: 16,
	    height: 16
	  }
	);
	const defaultIconTransformations = Object.freeze({
	  rotate: 0,
	  vFlip: false,
	  hFlip: false
	});
	const defaultIconProps = Object.freeze({
	  ...defaultIconDimensions,
	  ...defaultIconTransformations
	});
	const defaultExtendedIconProps = Object.freeze({
	  ...defaultIconProps,
	  body: "",
	  hidden: false
	});

	function mergeIconTransformations(obj1, obj2) {
	  const result = {};
	  if (!obj1.hFlip !== !obj2.hFlip) {
	    result.hFlip = true;
	  }
	  if (!obj1.vFlip !== !obj2.vFlip) {
	    result.vFlip = true;
	  }
	  const rotate = ((obj1.rotate || 0) + (obj2.rotate || 0)) % 4;
	  if (rotate) {
	    result.rotate = rotate;
	  }
	  return result;
	}

	function mergeIconData(parent, child) {
	  const result = mergeIconTransformations(parent, child);
	  for (const key in defaultExtendedIconProps) {
	    if (key in defaultIconTransformations) {
	      if (key in parent && !(key in result)) {
	        result[key] = defaultIconTransformations[key];
	      }
	    } else if (key in child) {
	      result[key] = child[key];
	    } else if (key in parent) {
	      result[key] = parent[key];
	    }
	  }
	  return result;
	}

	function getIconsTree(data, names) {
	  const icons = data.icons;
	  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
	  const resolved = /* @__PURE__ */ Object.create(null);
	  function resolve(name) {
	    if (icons[name]) {
	      return resolved[name] = [];
	    }
	    if (!(name in resolved)) {
	      resolved[name] = null;
	      const parent = aliases[name] && aliases[name].parent;
	      const value = parent && resolve(parent);
	      if (value) {
	        resolved[name] = [parent].concat(value);
	      }
	    }
	    return resolved[name];
	  }
	  (names || Object.keys(icons).concat(Object.keys(aliases))).forEach(resolve);
	  return resolved;
	}

	function internalGetIconData(data, name, tree) {
	  const icons = data.icons;
	  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
	  let currentProps = {};
	  function parse(name2) {
	    currentProps = mergeIconData(
	      icons[name2] || aliases[name2],
	      currentProps
	    );
	  }
	  parse(name);
	  tree.forEach(parse);
	  return mergeIconData(data, currentProps);
	}

	function parseIconSet(data, callback) {
	  const names = [];
	  if (typeof data !== "object" || typeof data.icons !== "object") {
	    return names;
	  }
	  if (data.not_found instanceof Array) {
	    data.not_found.forEach((name) => {
	      callback(name, null);
	      names.push(name);
	    });
	  }
	  const tree = getIconsTree(data);
	  for (const name in tree) {
	    const item = tree[name];
	    if (item) {
	      callback(name, internalGetIconData(data, name, item));
	      names.push(name);
	    }
	  }
	  return names;
	}

	const optionalPropertyDefaults = {
	  provider: "",
	  aliases: {},
	  not_found: {},
	  ...defaultIconDimensions
	};
	function checkOptionalProps(item, defaults) {
	  for (const prop in defaults) {
	    if (prop in item && typeof item[prop] !== typeof defaults[prop]) {
	      return false;
	    }
	  }
	  return true;
	}
	function quicklyValidateIconSet(obj) {
	  if (typeof obj !== "object" || obj === null) {
	    return null;
	  }
	  const data = obj;
	  if (typeof data.prefix !== "string" || !obj.icons || typeof obj.icons !== "object") {
	    return null;
	  }
	  if (!checkOptionalProps(obj, optionalPropertyDefaults)) {
	    return null;
	  }
	  const icons = data.icons;
	  for (const name in icons) {
	    const icon = icons[name];
	    if (!name.match(matchIconName) || typeof icon.body !== "string" || !checkOptionalProps(
	      icon,
	      defaultExtendedIconProps
	    )) {
	      return null;
	    }
	  }
	  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
	  for (const name in aliases) {
	    const icon = aliases[name];
	    const parent = icon.parent;
	    if (!name.match(matchIconName) || typeof parent !== "string" || !icons[parent] && !aliases[parent] || !checkOptionalProps(
	      icon,
	      defaultExtendedIconProps
	    )) {
	      return null;
	    }
	  }
	  return data;
	}

	const dataStorage = /* @__PURE__ */ Object.create(null);
	function newStorage(provider, prefix) {
	  return {
	    provider,
	    prefix,
	    icons: /* @__PURE__ */ Object.create(null),
	    missing: /* @__PURE__ */ new Set()
	  };
	}
	function getStorage(provider, prefix) {
	  const providerStorage = dataStorage[provider] || (dataStorage[provider] = /* @__PURE__ */ Object.create(null));
	  return providerStorage[prefix] || (providerStorage[prefix] = newStorage(provider, prefix));
	}
	function addIconSet(storage, data) {
	  if (!quicklyValidateIconSet(data)) {
	    return [];
	  }
	  return parseIconSet(data, (name, icon) => {
	    if (icon) {
	      storage.icons[name] = icon;
	    } else {
	      storage.missing.add(name);
	    }
	  });
	}
	function addIconToStorage(storage, name, icon) {
	  try {
	    if (typeof icon.body === "string") {
	      storage.icons[name] = { ...icon };
	      return true;
	    }
	  } catch (err) {
	  }
	  return false;
	}
	function listIcons(provider, prefix) {
	  let allIcons = [];
	  const providers = typeof provider === "string" ? [provider] : Object.keys(dataStorage);
	  providers.forEach((provider2) => {
	    const prefixes = typeof provider2 === "string" && typeof prefix === "string" ? [prefix] : Object.keys(dataStorage[provider2] || {});
	    prefixes.forEach((prefix2) => {
	      const storage = getStorage(provider2, prefix2);
	      allIcons = allIcons.concat(
	        Object.keys(storage.icons).map(
	          (name) => (provider2 !== "" ? "@" + provider2 + ":" : "") + prefix2 + ":" + name
	        )
	      );
	    });
	  });
	  return allIcons;
	}

	let simpleNames = false;
	function allowSimpleNames(allow) {
	  if (typeof allow === "boolean") {
	    simpleNames = allow;
	  }
	  return simpleNames;
	}
	function getIconData(name) {
	  const icon = typeof name === "string" ? stringToIcon(name, true, simpleNames) : name;
	  if (icon) {
	    const storage = getStorage(icon.provider, icon.prefix);
	    const iconName = icon.name;
	    return storage.icons[iconName] || (storage.missing.has(iconName) ? null : void 0);
	  }
	}
	function addIcon(name, data) {
	  const icon = stringToIcon(name, true, simpleNames);
	  if (!icon) {
	    return false;
	  }
	  const storage = getStorage(icon.provider, icon.prefix);
	  return addIconToStorage(storage, icon.name, data);
	}
	function addCollection(data, provider) {
	  if (typeof data !== "object") {
	    return false;
	  }
	  if (typeof provider !== "string") {
	    provider = data.provider || "";
	  }
	  if (simpleNames && !provider && !data.prefix) {
	    let added = false;
	    if (quicklyValidateIconSet(data)) {
	      data.prefix = "";
	      parseIconSet(data, (name, icon) => {
	        if (icon && addIcon(name, icon)) {
	          added = true;
	        }
	      });
	    }
	    return added;
	  }
	  const prefix = data.prefix;
	  if (!validateIconName({
	    provider,
	    prefix,
	    name: "a"
	  })) {
	    return false;
	  }
	  const storage = getStorage(provider, prefix);
	  return !!addIconSet(storage, data);
	}
	function iconLoaded(name) {
	  return !!getIconData(name);
	}
	function getIcon(name) {
	  const result = getIconData(name);
	  return result ? {
	    ...defaultIconProps,
	    ...result
	  } : null;
	}

	const defaultIconSizeCustomisations = Object.freeze({
	  width: null,
	  height: null
	});
	const defaultIconCustomisations = Object.freeze({
	  // Dimensions
	  ...defaultIconSizeCustomisations,
	  // Transformations
	  ...defaultIconTransformations
	});

	const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
	const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
	function calculateSize(size, ratio, precision) {
	  if (ratio === 1) {
	    return size;
	  }
	  precision = precision || 100;
	  if (typeof size === "number") {
	    return Math.ceil(size * ratio * precision) / precision;
	  }
	  if (typeof size !== "string") {
	    return size;
	  }
	  const oldParts = size.split(unitsSplit);
	  if (oldParts === null || !oldParts.length) {
	    return size;
	  }
	  const newParts = [];
	  let code = oldParts.shift();
	  let isNumber = unitsTest.test(code);
	  while (true) {
	    if (isNumber) {
	      const num = parseFloat(code);
	      if (isNaN(num)) {
	        newParts.push(code);
	      } else {
	        newParts.push(Math.ceil(num * ratio * precision) / precision);
	      }
	    } else {
	      newParts.push(code);
	    }
	    code = oldParts.shift();
	    if (code === void 0) {
	      return newParts.join("");
	    }
	    isNumber = !isNumber;
	  }
	}

	function splitSVGDefs(content, tag = "defs") {
	  let defs = "";
	  const index = content.indexOf("<" + tag);
	  while (index >= 0) {
	    const start = content.indexOf(">", index);
	    const end = content.indexOf("</" + tag);
	    if (start === -1 || end === -1) {
	      break;
	    }
	    const endEnd = content.indexOf(">", end);
	    if (endEnd === -1) {
	      break;
	    }
	    defs += content.slice(start + 1, end).trim();
	    content = content.slice(0, index).trim() + content.slice(endEnd + 1);
	  }
	  return {
	    defs,
	    content
	  };
	}
	function mergeDefsAndContent(defs, content) {
	  return defs ? "<defs>" + defs + "</defs>" + content : content;
	}
	function wrapSVGContent(body, start, end) {
	  const split = splitSVGDefs(body);
	  return mergeDefsAndContent(split.defs, start + split.content + end);
	}

	const isUnsetKeyword = (value) => value === "unset" || value === "undefined" || value === "none";
	function iconToSVG(icon, customisations) {
	  const fullIcon = {
	    ...defaultIconProps,
	    ...icon
	  };
	  const fullCustomisations = {
	    ...defaultIconCustomisations,
	    ...customisations
	  };
	  const box = {
	    left: fullIcon.left,
	    top: fullIcon.top,
	    width: fullIcon.width,
	    height: fullIcon.height
	  };
	  let body = fullIcon.body;
	  [fullIcon, fullCustomisations].forEach((props) => {
	    const transformations = [];
	    const hFlip = props.hFlip;
	    const vFlip = props.vFlip;
	    let rotation = props.rotate;
	    if (hFlip) {
	      if (vFlip) {
	        rotation += 2;
	      } else {
	        transformations.push(
	          "translate(" + (box.width + box.left).toString() + " " + (0 - box.top).toString() + ")"
	        );
	        transformations.push("scale(-1 1)");
	        box.top = box.left = 0;
	      }
	    } else if (vFlip) {
	      transformations.push(
	        "translate(" + (0 - box.left).toString() + " " + (box.height + box.top).toString() + ")"
	      );
	      transformations.push("scale(1 -1)");
	      box.top = box.left = 0;
	    }
	    let tempValue;
	    if (rotation < 0) {
	      rotation -= Math.floor(rotation / 4) * 4;
	    }
	    rotation = rotation % 4;
	    switch (rotation) {
	      case 1:
	        tempValue = box.height / 2 + box.top;
	        transformations.unshift(
	          "rotate(90 " + tempValue.toString() + " " + tempValue.toString() + ")"
	        );
	        break;
	      case 2:
	        transformations.unshift(
	          "rotate(180 " + (box.width / 2 + box.left).toString() + " " + (box.height / 2 + box.top).toString() + ")"
	        );
	        break;
	      case 3:
	        tempValue = box.width / 2 + box.left;
	        transformations.unshift(
	          "rotate(-90 " + tempValue.toString() + " " + tempValue.toString() + ")"
	        );
	        break;
	    }
	    if (rotation % 2 === 1) {
	      if (box.left !== box.top) {
	        tempValue = box.left;
	        box.left = box.top;
	        box.top = tempValue;
	      }
	      if (box.width !== box.height) {
	        tempValue = box.width;
	        box.width = box.height;
	        box.height = tempValue;
	      }
	    }
	    if (transformations.length) {
	      body = wrapSVGContent(
	        body,
	        '<g transform="' + transformations.join(" ") + '">',
	        "</g>"
	      );
	    }
	  });
	  const customisationsWidth = fullCustomisations.width;
	  const customisationsHeight = fullCustomisations.height;
	  const boxWidth = box.width;
	  const boxHeight = box.height;
	  let width;
	  let height;
	  if (customisationsWidth === null) {
	    height = customisationsHeight === null ? "1em" : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
	    width = calculateSize(height, boxWidth / boxHeight);
	  } else {
	    width = customisationsWidth === "auto" ? boxWidth : customisationsWidth;
	    height = customisationsHeight === null ? calculateSize(width, boxHeight / boxWidth) : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
	  }
	  const attributes = {};
	  const setAttr = (prop, value) => {
	    if (!isUnsetKeyword(value)) {
	      attributes[prop] = value.toString();
	    }
	  };
	  setAttr("width", width);
	  setAttr("height", height);
	  const viewBox = [box.left, box.top, boxWidth, boxHeight];
	  attributes.viewBox = viewBox.join(" ");
	  return {
	    attributes,
	    viewBox,
	    body
	  };
	}

	const regex$1 = /\sid="(\S+)"/g;
	const randomPrefix = "IconifyId" + Date.now().toString(16) + (Math.random() * 16777216 | 0).toString(16);
	let counter = 0;
	function replaceIDs(body, prefix = randomPrefix) {
	  const ids = [];
	  let match;
	  while (match = regex$1.exec(body)) {
	    ids.push(match[1]);
	  }
	  if (!ids.length) {
	    return body;
	  }
	  const suffix = "suffix" + (Math.random() * 16777216 | Date.now()).toString(16);
	  ids.forEach((id) => {
	    const newID = typeof prefix === "function" ? prefix(id) : prefix + (counter++).toString();
	    const escapedID = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	    body = body.replace(
	      // Allowed characters before id: [#;"]
	      // Allowed characters after id: [)"], .[a-z]
	      new RegExp('([#;"])(' + escapedID + ')([")]|\\.[a-z])', "g"),
	      "$1" + newID + suffix + "$3"
	    );
	  });
	  body = body.replace(new RegExp(suffix, "g"), "");
	  return body;
	}

	const storage = /* @__PURE__ */ Object.create(null);
	function setAPIModule(provider, item) {
	  storage[provider] = item;
	}
	function getAPIModule(provider) {
	  return storage[provider] || storage[""];
	}

	function createAPIConfig(source) {
	  let resources;
	  if (typeof source.resources === "string") {
	    resources = [source.resources];
	  } else {
	    resources = source.resources;
	    if (!(resources instanceof Array) || !resources.length) {
	      return null;
	    }
	  }
	  const result = {
	    // API hosts
	    resources,
	    // Root path
	    path: source.path || "/",
	    // URL length limit
	    maxURL: source.maxURL || 500,
	    // Timeout before next host is used.
	    rotate: source.rotate || 750,
	    // Timeout before failing query.
	    timeout: source.timeout || 5e3,
	    // Randomise default API end point.
	    random: source.random === true,
	    // Start index
	    index: source.index || 0,
	    // Receive data after time out (used if time out kicks in first, then API module sends data anyway).
	    dataAfterTimeout: source.dataAfterTimeout !== false
	  };
	  return result;
	}
	const configStorage = /* @__PURE__ */ Object.create(null);
	const fallBackAPISources = [
	  "https://api.simplesvg.com",
	  "https://api.unisvg.com"
	];
	const fallBackAPI = [];
	while (fallBackAPISources.length > 0) {
	  if (fallBackAPISources.length === 1) {
	    fallBackAPI.push(fallBackAPISources.shift());
	  } else {
	    if (Math.random() > 0.5) {
	      fallBackAPI.push(fallBackAPISources.shift());
	    } else {
	      fallBackAPI.push(fallBackAPISources.pop());
	    }
	  }
	}
	configStorage[""] = createAPIConfig({
	  resources: ["https://api.iconify.design"].concat(fallBackAPI)
	});
	function addAPIProvider(provider, customConfig) {
	  const config = createAPIConfig(customConfig);
	  if (config === null) {
	    return false;
	  }
	  configStorage[provider] = config;
	  return true;
	}
	function getAPIConfig(provider) {
	  return configStorage[provider];
	}
	function listAPIProviders() {
	  return Object.keys(configStorage);
	}

	const detectFetch = () => {
	  let callback;
	  try {
	    callback = fetch;
	    if (typeof callback === "function") {
	      return callback;
	    }
	  } catch (err) {
	  }
	};
	let fetchModule = detectFetch();
	function setFetch(fetch2) {
	  fetchModule = fetch2;
	}
	function getFetch() {
	  return fetchModule;
	}
	function calculateMaxLength(provider, prefix) {
	  const config = getAPIConfig(provider);
	  if (!config) {
	    return 0;
	  }
	  let result;
	  if (!config.maxURL) {
	    result = 0;
	  } else {
	    let maxHostLength = 0;
	    config.resources.forEach((item) => {
	      const host = item;
	      maxHostLength = Math.max(maxHostLength, host.length);
	    });
	    const url = prefix + ".json?icons=";
	    result = config.maxURL - maxHostLength - config.path.length - url.length;
	  }
	  return result;
	}
	function shouldAbort(status) {
	  return status === 404;
	}
	const prepare = (provider, prefix, icons) => {
	  const results = [];
	  const maxLength = calculateMaxLength(provider, prefix);
	  const type = "icons";
	  let item = {
	    type,
	    provider,
	    prefix,
	    icons: []
	  };
	  let length = 0;
	  icons.forEach((name, index) => {
	    length += name.length + 1;
	    if (length >= maxLength && index > 0) {
	      results.push(item);
	      item = {
	        type,
	        provider,
	        prefix,
	        icons: []
	      };
	      length = name.length;
	    }
	    item.icons.push(name);
	  });
	  results.push(item);
	  return results;
	};
	function getPath(provider) {
	  if (typeof provider === "string") {
	    const config = getAPIConfig(provider);
	    if (config) {
	      return config.path;
	    }
	  }
	  return "/";
	}
	const send = (host, params, callback) => {
	  if (!fetchModule) {
	    callback("abort", 424);
	    return;
	  }
	  let path = getPath(params.provider);
	  switch (params.type) {
	    case "icons": {
	      const prefix = params.prefix;
	      const icons = params.icons;
	      const iconsList = icons.join(",");
	      const urlParams = new URLSearchParams({
	        icons: iconsList
	      });
	      path += prefix + ".json?" + urlParams.toString();
	      break;
	    }
	    case "custom": {
	      const uri = params.uri;
	      path += uri.slice(0, 1) === "/" ? uri.slice(1) : uri;
	      break;
	    }
	    default:
	      callback("abort", 400);
	      return;
	  }
	  let defaultError = 503;
	  fetchModule(host + path).then((response) => {
	    const status = response.status;
	    if (status !== 200) {
	      setTimeout(() => {
	        callback(shouldAbort(status) ? "abort" : "next", status);
	      });
	      return;
	    }
	    defaultError = 501;
	    return response.json();
	  }).then((data) => {
	    if (typeof data !== "object" || data === null) {
	      setTimeout(() => {
	        if (data === 404) {
	          callback("abort", data);
	        } else {
	          callback("next", defaultError);
	        }
	      });
	      return;
	    }
	    setTimeout(() => {
	      callback("success", data);
	    });
	  }).catch(() => {
	    callback("next", defaultError);
	  });
	};
	const fetchAPIModule = {
	  prepare,
	  send
	};

	function sortIcons(icons) {
	  const result = {
	    loaded: [],
	    missing: [],
	    pending: []
	  };
	  const storage = /* @__PURE__ */ Object.create(null);
	  icons.sort((a, b) => {
	    if (a.provider !== b.provider) {
	      return a.provider.localeCompare(b.provider);
	    }
	    if (a.prefix !== b.prefix) {
	      return a.prefix.localeCompare(b.prefix);
	    }
	    return a.name.localeCompare(b.name);
	  });
	  let lastIcon = {
	    provider: "",
	    prefix: "",
	    name: ""
	  };
	  icons.forEach((icon) => {
	    if (lastIcon.name === icon.name && lastIcon.prefix === icon.prefix && lastIcon.provider === icon.provider) {
	      return;
	    }
	    lastIcon = icon;
	    const provider = icon.provider;
	    const prefix = icon.prefix;
	    const name = icon.name;
	    const providerStorage = storage[provider] || (storage[provider] = /* @__PURE__ */ Object.create(null));
	    const localStorage = providerStorage[prefix] || (providerStorage[prefix] = getStorage(provider, prefix));
	    let list;
	    if (name in localStorage.icons) {
	      list = result.loaded;
	    } else if (prefix === "" || localStorage.missing.has(name)) {
	      list = result.missing;
	    } else {
	      list = result.pending;
	    }
	    const item = {
	      provider,
	      prefix,
	      name
	    };
	    list.push(item);
	  });
	  return result;
	}

	function removeCallback(storages, id) {
	  storages.forEach((storage) => {
	    const items = storage.loaderCallbacks;
	    if (items) {
	      storage.loaderCallbacks = items.filter((row) => row.id !== id);
	    }
	  });
	}
	function updateCallbacks(storage) {
	  if (!storage.pendingCallbacksFlag) {
	    storage.pendingCallbacksFlag = true;
	    setTimeout(() => {
	      storage.pendingCallbacksFlag = false;
	      const items = storage.loaderCallbacks ? storage.loaderCallbacks.slice(0) : [];
	      if (!items.length) {
	        return;
	      }
	      let hasPending = false;
	      const provider = storage.provider;
	      const prefix = storage.prefix;
	      items.forEach((item) => {
	        const icons = item.icons;
	        const oldLength = icons.pending.length;
	        icons.pending = icons.pending.filter((icon) => {
	          if (icon.prefix !== prefix) {
	            return true;
	          }
	          const name = icon.name;
	          if (storage.icons[name]) {
	            icons.loaded.push({
	              provider,
	              prefix,
	              name
	            });
	          } else if (storage.missing.has(name)) {
	            icons.missing.push({
	              provider,
	              prefix,
	              name
	            });
	          } else {
	            hasPending = true;
	            return true;
	          }
	          return false;
	        });
	        if (icons.pending.length !== oldLength) {
	          if (!hasPending) {
	            removeCallback([storage], item.id);
	          }
	          item.callback(
	            icons.loaded.slice(0),
	            icons.missing.slice(0),
	            icons.pending.slice(0),
	            item.abort
	          );
	        }
	      });
	    });
	  }
	}
	let idCounter = 0;
	function storeCallback(callback, icons, pendingSources) {
	  const id = idCounter++;
	  const abort = removeCallback.bind(null, pendingSources, id);
	  if (!icons.pending.length) {
	    return abort;
	  }
	  const item = {
	    id,
	    icons,
	    callback,
	    abort
	  };
	  pendingSources.forEach((storage) => {
	    (storage.loaderCallbacks || (storage.loaderCallbacks = [])).push(item);
	  });
	  return abort;
	}

	function listToIcons(list, validate = true, simpleNames = false) {
	  const result = [];
	  list.forEach((item) => {
	    const icon = typeof item === "string" ? stringToIcon(item, validate, simpleNames) : item;
	    if (icon) {
	      result.push(icon);
	    }
	  });
	  return result;
	}

	// src/config.ts
	var defaultConfig = {
	  resources: [],
	  index: 0,
	  timeout: 2e3,
	  rotate: 750,
	  random: false,
	  dataAfterTimeout: false
	};

	// src/query.ts
	function sendQuery(config, payload, query, done) {
	  const resourcesCount = config.resources.length;
	  const startIndex = config.random ? Math.floor(Math.random() * resourcesCount) : config.index;
	  let resources;
	  if (config.random) {
	    let list = config.resources.slice(0);
	    resources = [];
	    while (list.length > 1) {
	      const nextIndex = Math.floor(Math.random() * list.length);
	      resources.push(list[nextIndex]);
	      list = list.slice(0, nextIndex).concat(list.slice(nextIndex + 1));
	    }
	    resources = resources.concat(list);
	  } else {
	    resources = config.resources.slice(startIndex).concat(config.resources.slice(0, startIndex));
	  }
	  const startTime = Date.now();
	  let status = "pending";
	  let queriesSent = 0;
	  let lastError;
	  let timer = null;
	  let queue = [];
	  let doneCallbacks = [];
	  if (typeof done === "function") {
	    doneCallbacks.push(done);
	  }
	  function resetTimer() {
	    if (timer) {
	      clearTimeout(timer);
	      timer = null;
	    }
	  }
	  function abort() {
	    if (status === "pending") {
	      status = "aborted";
	    }
	    resetTimer();
	    queue.forEach((item) => {
	      if (item.status === "pending") {
	        item.status = "aborted";
	      }
	    });
	    queue = [];
	  }
	  function subscribe(callback, overwrite) {
	    if (overwrite) {
	      doneCallbacks = [];
	    }
	    if (typeof callback === "function") {
	      doneCallbacks.push(callback);
	    }
	  }
	  function getQueryStatus() {
	    return {
	      startTime,
	      payload,
	      status,
	      queriesSent,
	      queriesPending: queue.length,
	      subscribe,
	      abort
	    };
	  }
	  function failQuery() {
	    status = "failed";
	    doneCallbacks.forEach((callback) => {
	      callback(void 0, lastError);
	    });
	  }
	  function clearQueue() {
	    queue.forEach((item) => {
	      if (item.status === "pending") {
	        item.status = "aborted";
	      }
	    });
	    queue = [];
	  }
	  function moduleResponse(item, response, data) {
	    const isError = response !== "success";
	    queue = queue.filter((queued) => queued !== item);
	    switch (status) {
	      case "pending":
	        break;
	      case "failed":
	        if (isError || !config.dataAfterTimeout) {
	          return;
	        }
	        break;
	      default:
	        return;
	    }
	    if (response === "abort") {
	      lastError = data;
	      failQuery();
	      return;
	    }
	    if (isError) {
	      lastError = data;
	      if (!queue.length) {
	        if (!resources.length) {
	          failQuery();
	        } else {
	          execNext();
	        }
	      }
	      return;
	    }
	    resetTimer();
	    clearQueue();
	    if (!config.random) {
	      const index = config.resources.indexOf(item.resource);
	      if (index !== -1 && index !== config.index) {
	        config.index = index;
	      }
	    }
	    status = "completed";
	    doneCallbacks.forEach((callback) => {
	      callback(data);
	    });
	  }
	  function execNext() {
	    if (status !== "pending") {
	      return;
	    }
	    resetTimer();
	    const resource = resources.shift();
	    if (resource === void 0) {
	      if (queue.length) {
	        timer = setTimeout(() => {
	          resetTimer();
	          if (status === "pending") {
	            clearQueue();
	            failQuery();
	          }
	        }, config.timeout);
	        return;
	      }
	      failQuery();
	      return;
	    }
	    const item = {
	      status: "pending",
	      resource,
	      callback: (status2, data) => {
	        moduleResponse(item, status2, data);
	      }
	    };
	    queue.push(item);
	    queriesSent++;
	    timer = setTimeout(execNext, config.rotate);
	    query(resource, payload, item.callback);
	  }
	  setTimeout(execNext);
	  return getQueryStatus;
	}

	// src/index.ts
	function initRedundancy(cfg) {
	  const config = {
	    ...defaultConfig,
	    ...cfg
	  };
	  let queries = [];
	  function cleanup() {
	    queries = queries.filter((item) => item().status === "pending");
	  }
	  function query(payload, queryCallback, doneCallback) {
	    const query2 = sendQuery(
	      config,
	      payload,
	      queryCallback,
	      (data, error) => {
	        cleanup();
	        if (doneCallback) {
	          doneCallback(data, error);
	        }
	      }
	    );
	    queries.push(query2);
	    return query2;
	  }
	  function find(callback) {
	    return queries.find((value) => {
	      return callback(value);
	    }) || null;
	  }
	  const instance = {
	    query,
	    find,
	    setIndex: (index) => {
	      config.index = index;
	    },
	    getIndex: () => config.index,
	    cleanup
	  };
	  return instance;
	}

	function emptyCallback$1() {
	}
	const redundancyCache = /* @__PURE__ */ Object.create(null);
	function getRedundancyCache(provider) {
	  if (!redundancyCache[provider]) {
	    const config = getAPIConfig(provider);
	    if (!config) {
	      return;
	    }
	    const redundancy = initRedundancy(config);
	    const cachedReundancy = {
	      config,
	      redundancy
	    };
	    redundancyCache[provider] = cachedReundancy;
	  }
	  return redundancyCache[provider];
	}
	function sendAPIQuery(target, query, callback) {
	  let redundancy;
	  let send;
	  if (typeof target === "string") {
	    const api = getAPIModule(target);
	    if (!api) {
	      callback(void 0, 424);
	      return emptyCallback$1;
	    }
	    send = api.send;
	    const cached = getRedundancyCache(target);
	    if (cached) {
	      redundancy = cached.redundancy;
	    }
	  } else {
	    const config = createAPIConfig(target);
	    if (config) {
	      redundancy = initRedundancy(config);
	      const moduleKey = target.resources ? target.resources[0] : "";
	      const api = getAPIModule(moduleKey);
	      if (api) {
	        send = api.send;
	      }
	    }
	  }
	  if (!redundancy || !send) {
	    callback(void 0, 424);
	    return emptyCallback$1;
	  }
	  return redundancy.query(query, send, callback)().abort;
	}

	const browserCacheVersion = "iconify2";
	const browserCachePrefix = "iconify";
	const browserCacheCountKey = browserCachePrefix + "-count";
	const browserCacheVersionKey = browserCachePrefix + "-version";
	const browserStorageHour = 36e5;
	const browserStorageCacheExpiration = 168;
	const browserStorageLimit = 50;

	function getStoredItem(func, key) {
	  try {
	    return func.getItem(key);
	  } catch (err) {
	  }
	}
	function setStoredItem(func, key, value) {
	  try {
	    func.setItem(key, value);
	    return true;
	  } catch (err) {
	  }
	}
	function removeStoredItem(func, key) {
	  try {
	    func.removeItem(key);
	  } catch (err) {
	  }
	}

	function setBrowserStorageItemsCount(storage, value) {
	  return setStoredItem(storage, browserCacheCountKey, value.toString());
	}
	function getBrowserStorageItemsCount(storage) {
	  return parseInt(getStoredItem(storage, browserCacheCountKey)) || 0;
	}

	const browserStorageConfig = {
	  local: true,
	  session: true
	};
	const browserStorageEmptyItems = {
	  local: /* @__PURE__ */ new Set(),
	  session: /* @__PURE__ */ new Set()
	};
	let browserStorageStatus = false;
	function setBrowserStorageStatus(status) {
	  browserStorageStatus = status;
	}

	let _window = typeof window === "undefined" ? {} : window;
	function getBrowserStorage(key) {
	  const attr = key + "Storage";
	  try {
	    if (_window && _window[attr] && typeof _window[attr].length === "number") {
	      return _window[attr];
	    }
	  } catch (err) {
	  }
	  browserStorageConfig[key] = false;
	}

	function iterateBrowserStorage(key, callback) {
	  const func = getBrowserStorage(key);
	  if (!func) {
	    return;
	  }
	  const version = getStoredItem(func, browserCacheVersionKey);
	  if (version !== browserCacheVersion) {
	    if (version) {
	      const total2 = getBrowserStorageItemsCount(func);
	      for (let i = 0; i < total2; i++) {
	        removeStoredItem(func, browserCachePrefix + i.toString());
	      }
	    }
	    setStoredItem(func, browserCacheVersionKey, browserCacheVersion);
	    setBrowserStorageItemsCount(func, 0);
	    return;
	  }
	  const minTime = Math.floor(Date.now() / browserStorageHour) - browserStorageCacheExpiration;
	  const parseItem = (index) => {
	    const name = browserCachePrefix + index.toString();
	    const item = getStoredItem(func, name);
	    if (typeof item !== "string") {
	      return;
	    }
	    try {
	      const data = JSON.parse(item);
	      if (typeof data === "object" && typeof data.cached === "number" && data.cached > minTime && typeof data.provider === "string" && typeof data.data === "object" && typeof data.data.prefix === "string" && // Valid item: run callback
	      callback(data, index)) {
	        return true;
	      }
	    } catch (err) {
	    }
	    removeStoredItem(func, name);
	  };
	  let total = getBrowserStorageItemsCount(func);
	  for (let i = total - 1; i >= 0; i--) {
	    if (!parseItem(i)) {
	      if (i === total - 1) {
	        total--;
	        setBrowserStorageItemsCount(func, total);
	      } else {
	        browserStorageEmptyItems[key].add(i);
	      }
	    }
	  }
	}

	function initBrowserStorage() {
	  if (browserStorageStatus) {
	    return;
	  }
	  setBrowserStorageStatus(true);
	  for (const key in browserStorageConfig) {
	    iterateBrowserStorage(key, (item) => {
	      const iconSet = item.data;
	      const provider = item.provider;
	      const prefix = iconSet.prefix;
	      const storage = getStorage(
	        provider,
	        prefix
	      );
	      if (!addIconSet(storage, iconSet).length) {
	        return false;
	      }
	      const lastModified = iconSet.lastModified || -1;
	      storage.lastModifiedCached = storage.lastModifiedCached ? Math.min(storage.lastModifiedCached, lastModified) : lastModified;
	      return true;
	    });
	  }
	}

	function updateLastModified(storage, lastModified) {
	  const lastValue = storage.lastModifiedCached;
	  if (
	    // Matches or newer
	    lastValue && lastValue >= lastModified
	  ) {
	    return lastValue === lastModified;
	  }
	  storage.lastModifiedCached = lastModified;
	  if (lastValue) {
	    for (const key in browserStorageConfig) {
	      iterateBrowserStorage(key, (item) => {
	        const iconSet = item.data;
	        return item.provider !== storage.provider || iconSet.prefix !== storage.prefix || iconSet.lastModified === lastModified;
	      });
	    }
	  }
	  return true;
	}
	function storeInBrowserStorage(storage, data) {
	  if (!browserStorageStatus) {
	    initBrowserStorage();
	  }
	  function store(key) {
	    let func;
	    if (!browserStorageConfig[key] || !(func = getBrowserStorage(key))) {
	      return;
	    }
	    const set = browserStorageEmptyItems[key];
	    let index;
	    if (set.size) {
	      set.delete(index = Array.from(set).shift());
	    } else {
	      index = getBrowserStorageItemsCount(func);
	      if (index >= browserStorageLimit || !setBrowserStorageItemsCount(func, index + 1)) {
	        return;
	      }
	    }
	    const item = {
	      cached: Math.floor(Date.now() / browserStorageHour),
	      provider: storage.provider,
	      data
	    };
	    return setStoredItem(
	      func,
	      browserCachePrefix + index.toString(),
	      JSON.stringify(item)
	    );
	  }
	  if (data.lastModified && !updateLastModified(storage, data.lastModified)) {
	    return;
	  }
	  if (!Object.keys(data.icons).length) {
	    return;
	  }
	  if (data.not_found) {
	    data = Object.assign({}, data);
	    delete data.not_found;
	  }
	  if (!store("local")) {
	    store("session");
	  }
	}

	function emptyCallback() {
	}
	function loadedNewIcons(storage) {
	  if (!storage.iconsLoaderFlag) {
	    storage.iconsLoaderFlag = true;
	    setTimeout(() => {
	      storage.iconsLoaderFlag = false;
	      updateCallbacks(storage);
	    });
	  }
	}
	function loadNewIcons(storage, icons) {
	  if (!storage.iconsToLoad) {
	    storage.iconsToLoad = icons;
	  } else {
	    storage.iconsToLoad = storage.iconsToLoad.concat(icons).sort();
	  }
	  if (!storage.iconsQueueFlag) {
	    storage.iconsQueueFlag = true;
	    setTimeout(() => {
	      storage.iconsQueueFlag = false;
	      const { provider, prefix } = storage;
	      const icons2 = storage.iconsToLoad;
	      delete storage.iconsToLoad;
	      let api;
	      if (!icons2 || !(api = getAPIModule(provider))) {
	        return;
	      }
	      const params = api.prepare(provider, prefix, icons2);
	      params.forEach((item) => {
	        sendAPIQuery(provider, item, (data) => {
	          if (typeof data !== "object") {
	            item.icons.forEach((name) => {
	              storage.missing.add(name);
	            });
	          } else {
	            try {
	              const parsed = addIconSet(
	                storage,
	                data
	              );
	              if (!parsed.length) {
	                return;
	              }
	              const pending = storage.pendingIcons;
	              if (pending) {
	                parsed.forEach((name) => {
	                  pending.delete(name);
	                });
	              }
	              storeInBrowserStorage(storage, data);
	            } catch (err) {
	              console.error(err);
	            }
	          }
	          loadedNewIcons(storage);
	        });
	      });
	    });
	  }
	}
	const loadIcons = (icons, callback) => {
	  const cleanedIcons = listToIcons(icons, true, allowSimpleNames());
	  const sortedIcons = sortIcons(cleanedIcons);
	  if (!sortedIcons.pending.length) {
	    let callCallback = true;
	    if (callback) {
	      setTimeout(() => {
	        if (callCallback) {
	          callback(
	            sortedIcons.loaded,
	            sortedIcons.missing,
	            sortedIcons.pending,
	            emptyCallback
	          );
	        }
	      });
	    }
	    return () => {
	      callCallback = false;
	    };
	  }
	  const newIcons = /* @__PURE__ */ Object.create(null);
	  const sources = [];
	  let lastProvider, lastPrefix;
	  sortedIcons.pending.forEach((icon) => {
	    const { provider, prefix } = icon;
	    if (prefix === lastPrefix && provider === lastProvider) {
	      return;
	    }
	    lastProvider = provider;
	    lastPrefix = prefix;
	    sources.push(getStorage(provider, prefix));
	    const providerNewIcons = newIcons[provider] || (newIcons[provider] = /* @__PURE__ */ Object.create(null));
	    if (!providerNewIcons[prefix]) {
	      providerNewIcons[prefix] = [];
	    }
	  });
	  sortedIcons.pending.forEach((icon) => {
	    const { provider, prefix, name } = icon;
	    const storage = getStorage(provider, prefix);
	    const pendingQueue = storage.pendingIcons || (storage.pendingIcons = /* @__PURE__ */ new Set());
	    if (!pendingQueue.has(name)) {
	      pendingQueue.add(name);
	      newIcons[provider][prefix].push(name);
	    }
	  });
	  sources.forEach((storage) => {
	    const { provider, prefix } = storage;
	    if (newIcons[provider][prefix].length) {
	      loadNewIcons(storage, newIcons[provider][prefix]);
	    }
	  });
	  return callback ? storeCallback(callback, sortedIcons, sources) : emptyCallback;
	};
	const loadIcon = (icon) => {
	  return new Promise((fulfill, reject) => {
	    const iconObj = typeof icon === "string" ? stringToIcon(icon, true) : icon;
	    if (!iconObj) {
	      reject(icon);
	      return;
	    }
	    loadIcons([iconObj || icon], (loaded) => {
	      if (loaded.length && iconObj) {
	        const data = getIconData(iconObj);
	        if (data) {
	          fulfill({
	            ...defaultIconProps,
	            ...data
	          });
	          return;
	        }
	      }
	      reject(icon);
	    });
	  });
	};

	function toggleBrowserCache(storage, value) {
	  switch (storage) {
	    case "local":
	    case "session":
	      browserStorageConfig[storage] = value;
	      break;
	    case "all":
	      for (const key in browserStorageConfig) {
	        browserStorageConfig[key] = value;
	      }
	      break;
	  }
	}

	function mergeCustomisations(defaults, item) {
	  const result = {
	    ...defaults
	  };
	  for (const key in item) {
	    const value = item[key];
	    const valueType = typeof value;
	    if (key in defaultIconSizeCustomisations) {
	      if (value === null || value && (valueType === "string" || valueType === "number")) {
	        result[key] = value;
	      }
	    } else if (valueType === typeof result[key]) {
	      result[key] = key === "rotate" ? value % 4 : value;
	    }
	  }
	  return result;
	}

	const separator = /[\s,]+/;
	function flipFromString(custom, flip) {
	  flip.split(separator).forEach((str) => {
	    const value = str.trim();
	    switch (value) {
	      case "horizontal":
	        custom.hFlip = true;
	        break;
	      case "vertical":
	        custom.vFlip = true;
	        break;
	    }
	  });
	}

	function rotateFromString(value, defaultValue = 0) {
	  const units = value.replace(/^-?[0-9.]*/, "");
	  function cleanup(value2) {
	    while (value2 < 0) {
	      value2 += 4;
	    }
	    return value2 % 4;
	  }
	  if (units === "") {
	    const num = parseInt(value);
	    return isNaN(num) ? 0 : cleanup(num);
	  } else if (units !== value) {
	    let split = 0;
	    switch (units) {
	      case "%":
	        split = 25;
	        break;
	      case "deg":
	        split = 90;
	    }
	    if (split) {
	      let num = parseFloat(value.slice(0, value.length - units.length));
	      if (isNaN(num)) {
	        return 0;
	      }
	      num = num / split;
	      return num % 1 === 0 ? cleanup(num) : 0;
	    }
	  }
	  return defaultValue;
	}

	function iconToHTML(body, attributes) {
	  let renderAttribsHTML = body.indexOf("xlink:") === -1 ? "" : ' xmlns:xlink="http://www.w3.org/1999/xlink"';
	  for (const attr in attributes) {
	    renderAttribsHTML += " " + attr + '="' + attributes[attr] + '"';
	  }
	  return '<svg xmlns="http://www.w3.org/2000/svg"' + renderAttribsHTML + ">" + body + "</svg>";
	}

	function encodeSVGforURL(svg) {
	  return svg.replace(/"/g, "'").replace(/%/g, "%25").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/\s+/g, " ");
	}
	function svgToData(svg) {
	  return "data:image/svg+xml," + encodeSVGforURL(svg);
	}
	function svgToURL(svg) {
	  return 'url("' + svgToData(svg) + '")';
	}

	const defaultExtendedIconCustomisations = {
	    ...defaultIconCustomisations,
	    inline: false,
	};

	/**
	 * Default SVG attributes
	 */
	const svgDefaults = {
	    'xmlns': 'http://www.w3.org/2000/svg',
	    'xmlns:xlink': 'http://www.w3.org/1999/xlink',
	    'aria-hidden': true,
	    'role': 'img',
	};
	/**
	 * Style modes
	 */
	const commonProps = {
	    display: 'inline-block',
	};
	const monotoneProps = {
	    'background-color': 'currentColor',
	};
	const coloredProps = {
	    'background-color': 'transparent',
	};
	// Dynamically add common props to variables above
	const propsToAdd = {
	    image: 'var(--svg)',
	    repeat: 'no-repeat',
	    size: '100% 100%',
	};
	const propsToAddTo = {
	    '-webkit-mask': monotoneProps,
	    'mask': monotoneProps,
	    'background': coloredProps,
	};
	for (const prefix in propsToAddTo) {
	    const list = propsToAddTo[prefix];
	    for (const prop in propsToAdd) {
	        list[prefix + '-' + prop] = propsToAdd[prop];
	    }
	}
	/**
	 * Fix size: add 'px' to numbers
	 */
	function fixSize(value) {
	    return value + (value.match(/^[-0-9.]+$/) ? 'px' : '');
	}
	/**
	 * Generate icon from properties
	 */
	function render(
	// Icon must be validated before calling this function
	icon, 
	// Properties
	props) {
	    const customisations = mergeCustomisations(defaultExtendedIconCustomisations, props);
	    // Check mode
	    const mode = props.mode || 'svg';
	    const componentProps = (mode === 'svg' ? { ...svgDefaults } : {});
	    if (icon.body.indexOf('xlink:') === -1) {
	        delete componentProps['xmlns:xlink'];
	    }
	    // Create style if missing
	    let style = typeof props.style === 'string' ? props.style : '';
	    // Get element properties
	    for (let key in props) {
	        const value = props[key];
	        if (value === void 0) {
	            continue;
	        }
	        switch (key) {
	            // Properties to ignore
	            case 'icon':
	            case 'style':
	            case 'onLoad':
	            case 'mode':
	                break;
	            // Boolean attributes
	            case 'inline':
	            case 'hFlip':
	            case 'vFlip':
	                customisations[key] =
	                    value === true || value === 'true' || value === 1;
	                break;
	            // Flip as string: 'horizontal,vertical'
	            case 'flip':
	                if (typeof value === 'string') {
	                    flipFromString(customisations, value);
	                }
	                break;
	            // Color: copy to style, add extra ';' in case style is missing it
	            case 'color':
	                style =
	                    style +
	                        (style.length > 0 && style.trim().slice(-1) !== ';'
	                            ? ';'
	                            : '') +
	                        'color: ' +
	                        value +
	                        '; ';
	                break;
	            // Rotation as string
	            case 'rotate':
	                if (typeof value === 'string') {
	                    customisations[key] = rotateFromString(value);
	                }
	                else if (typeof value === 'number') {
	                    customisations[key] = value;
	                }
	                break;
	            // Remove aria-hidden
	            case 'ariaHidden':
	            case 'aria-hidden':
	                if (value !== true && value !== 'true') {
	                    delete componentProps['aria-hidden'];
	                }
	                break;
	            default:
	                if (key.slice(0, 3) === 'on:') {
	                    // Svelte event
	                    break;
	                }
	                // Copy missing property if it does not exist in customisations
	                if (defaultExtendedIconCustomisations[key] === void 0) {
	                    componentProps[key] = value;
	                }
	        }
	    }
	    // Generate icon
	    const item = iconToSVG(icon, customisations);
	    const renderAttribs = item.attributes;
	    // Inline display
	    if (customisations.inline) {
	        // Style overrides it
	        style = 'vertical-align: -0.125em; ' + style;
	    }
	    if (mode === 'svg') {
	        // Add icon stuff
	        Object.assign(componentProps, renderAttribs);
	        // Style
	        if (style !== '') {
	            componentProps.style = style;
	        }
	        // Counter for ids based on "id" property to render icons consistently on server and client
	        let localCounter = 0;
	        let id = props.id;
	        if (typeof id === 'string') {
	            // Convert '-' to '_' to avoid errors in animations
	            id = id.replace(/-/g, '_');
	        }
	        // Generate HTML
	        return {
	            svg: true,
	            attributes: componentProps,
	            body: replaceIDs(item.body, id ? () => id + 'ID' + localCounter++ : 'iconifySvelte'),
	        };
	    }
	    // Render <span> with style
	    const { body, width, height } = icon;
	    const useMask = mode === 'mask' ||
	        (mode === 'bg' ? false : body.indexOf('currentColor') !== -1);
	    // Generate SVG
	    const html = iconToHTML(body, {
	        ...renderAttribs,
	        width: width + '',
	        height: height + '',
	    });
	    // Generate style
	    const url = svgToURL(html);
	    const styles = {
	        '--svg': url,
	    };
	    const size = (prop) => {
	        const value = renderAttribs[prop];
	        if (value) {
	            styles[prop] = fixSize(value);
	        }
	    };
	    size('width');
	    size('height');
	    Object.assign(styles, commonProps, useMask ? monotoneProps : coloredProps);
	    let customStyle = '';
	    for (const key in styles) {
	        customStyle += key + ': ' + styles[key] + ';';
	    }
	    componentProps.style = customStyle + style;
	    return {
	        svg: false,
	        attributes: componentProps,
	    };
	}

	/**
	 * Enable cache
	 */
	function enableCache(storage) {
	    toggleBrowserCache(storage, true);
	}
	/**
	 * Disable cache
	 */
	function disableCache(storage) {
	    toggleBrowserCache(storage, false);
	}
	/**
	 * Initialise stuff
	 */
	// Enable short names
	allowSimpleNames(true);
	// Set API module
	setAPIModule('', fetchAPIModule);
	/**
	 * Browser stuff
	 */
	if (typeof document !== 'undefined' && typeof window !== 'undefined') {
	    // Set cache and load existing cache
	    initBrowserStorage();
	    const _window = window;
	    // Load icons from global "IconifyPreload"
	    if (_window.IconifyPreload !== void 0) {
	        const preload = _window.IconifyPreload;
	        const err = 'Invalid IconifyPreload syntax.';
	        if (typeof preload === 'object' && preload !== null) {
	            (preload instanceof Array ? preload : [preload]).forEach((item) => {
	                try {
	                    if (
	                    // Check if item is an object and not null/array
	                    typeof item !== 'object' ||
	                        item === null ||
	                        item instanceof Array ||
	                        // Check for 'icons' and 'prefix'
	                        typeof item.icons !== 'object' ||
	                        typeof item.prefix !== 'string' ||
	                        // Add icon set
	                        !addCollection(item)) {
	                        console.error(err);
	                    }
	                }
	                catch (e) {
	                    console.error(err);
	                }
	            });
	        }
	    }
	    // Set API from global "IconifyProviders"
	    if (_window.IconifyProviders !== void 0) {
	        const providers = _window.IconifyProviders;
	        if (typeof providers === 'object' && providers !== null) {
	            for (let key in providers) {
	                const err = 'IconifyProviders[' + key + '] is invalid.';
	                try {
	                    const value = providers[key];
	                    if (typeof value !== 'object' ||
	                        !value ||
	                        value.resources === void 0) {
	                        continue;
	                    }
	                    if (!addAPIProvider(key, value)) {
	                        console.error(err);
	                    }
	                }
	                catch (e) {
	                    console.error(err);
	                }
	            }
	        }
	    }
	}
	/**
	 * Check if component needs to be updated
	 */
	function checkIconState(icon, state, mounted, callback, onload) {
	    // Abort loading icon
	    function abortLoading() {
	        if (state.loading) {
	            state.loading.abort();
	            state.loading = null;
	        }
	    }
	    // Icon is an object
	    if (typeof icon === 'object' &&
	        icon !== null &&
	        typeof icon.body === 'string') {
	        // Stop loading
	        state.name = '';
	        abortLoading();
	        return { data: { ...defaultIconProps, ...icon } };
	    }
	    // Invalid icon?
	    let iconName;
	    if (typeof icon !== 'string' ||
	        (iconName = stringToIcon(icon, false, true)) === null) {
	        abortLoading();
	        return null;
	    }
	    // Load icon
	    const data = getIconData(iconName);
	    if (!data) {
	        // Icon data is not available
	        // Do not load icon until component is mounted
	        if (mounted && (!state.loading || state.loading.name !== icon)) {
	            // New icon to load
	            abortLoading();
	            state.name = '';
	            state.loading = {
	                name: icon,
	                abort: loadIcons([iconName], callback),
	            };
	        }
	        return null;
	    }
	    // Icon data is available
	    abortLoading();
	    if (state.name !== icon) {
	        state.name = icon;
	        if (onload && !state.destroyed) {
	            onload(icon);
	        }
	    }
	    // Add classes
	    const classes = ['iconify'];
	    if (iconName.prefix !== '') {
	        classes.push('iconify--' + iconName.prefix);
	    }
	    if (iconName.provider !== '') {
	        classes.push('iconify--' + iconName.provider);
	    }
	    return { data, classes };
	}
	/**
	 * Generate icon
	 */
	function generateIcon(icon, props) {
	    return icon
	        ? render({
	            ...defaultIconProps,
	            ...icon,
	        }, props)
	        : null;
	}
	/**
	 * Internal API
	 */
	const _api = {
	    getAPIConfig,
	    setAPIModule,
	    sendAPIQuery,
	    setFetch,
	    getFetch,
	    listAPIProviders,
	};

	/* node_modules/@iconify/svelte/dist/Icon.svelte generated by Svelte v4.2.18 */
	const file$f = "node_modules/@iconify/svelte/dist/Icon.svelte";

	// (110:0) {#if data}
	function create_if_block$9(ctx) {
		let if_block_anchor;

		function select_block_type(ctx, dirty) {
			if (/*data*/ ctx[0].svg) return create_if_block_1$4;
			return create_else_block$3;
		}

		let current_block_type = select_block_type(ctx);
		let if_block = current_block_type(ctx);

		const block = {
			c: function create() {
				if_block.c();
				if_block_anchor = empty();
			},
			m: function mount(target, anchor) {
				if_block.m(target, anchor);
				insert_dev(target, if_block_anchor, anchor);
			},
			p: function update(ctx, dirty) {
				if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block.d(1);
					if_block = current_block_type(ctx);

					if (if_block) {
						if_block.c();
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				}
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(if_block_anchor);
				}

				if_block.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$9.name,
			type: "if",
			source: "(110:0) {#if data}",
			ctx
		});

		return block;
	}

	// (115:1) {:else}
	function create_else_block$3(ctx) {
		let span;
		let span_levels = [/*data*/ ctx[0].attributes];
		let span_data = {};

		for (let i = 0; i < span_levels.length; i += 1) {
			span_data = assign(span_data, span_levels[i]);
		}

		const block = {
			c: function create() {
				span = element("span");
				set_attributes(span, span_data);
				add_location(span, file$f, 115, 2, 2119);
			},
			m: function mount(target, anchor) {
				insert_dev(target, span, anchor);
			},
			p: function update(ctx, dirty) {
				set_attributes(span, span_data = get_spread_update(span_levels, [dirty & /*data*/ 1 && /*data*/ ctx[0].attributes]));
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(span);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_else_block$3.name,
			type: "else",
			source: "(115:1) {:else}",
			ctx
		});

		return block;
	}

	// (111:1) {#if data.svg}
	function create_if_block_1$4(ctx) {
		let svg;
		let raw_value = /*data*/ ctx[0].body + "";
		let svg_levels = [/*data*/ ctx[0].attributes];
		let svg_data = {};

		for (let i = 0; i < svg_levels.length; i += 1) {
			svg_data = assign(svg_data, svg_levels[i]);
		}

		const block = {
			c: function create() {
				svg = svg_element("svg");
				set_svg_attributes(svg, svg_data);
				add_location(svg, file$f, 111, 2, 2051);
			},
			m: function mount(target, anchor) {
				insert_dev(target, svg, anchor);
				svg.innerHTML = raw_value;
			},
			p: function update(ctx, dirty) {
				if (dirty & /*data*/ 1 && raw_value !== (raw_value = /*data*/ ctx[0].body + "")) svg.innerHTML = raw_value;			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [dirty & /*data*/ 1 && /*data*/ ctx[0].attributes]));
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(svg);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_1$4.name,
			type: "if",
			source: "(111:1) {#if data.svg}",
			ctx
		});

		return block;
	}

	function create_fragment$g(ctx) {
		let if_block_anchor;
		let if_block = /*data*/ ctx[0] && create_if_block$9(ctx);

		const block = {
			c: function create() {
				if (if_block) if_block.c();
				if_block_anchor = empty();
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert_dev(target, if_block_anchor, anchor);
			},
			p: function update(ctx, [dirty]) {
				if (/*data*/ ctx[0]) {
					if (if_block) {
						if_block.p(ctx, dirty);
					} else {
						if_block = create_if_block$9(ctx);
						if_block.c();
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}
			},
			i: noop$1,
			o: noop$1,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(if_block_anchor);
				}

				if (if_block) if_block.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$g.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$g($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Icon', slots, []);

		const state = {
			// Last icon name
			name: '',
			// Loading status
			loading: null,
			// Destroyed status
			destroyed: false
		};

		// Mounted status
		let mounted = false;

		// Callback counter
		let counter = 0;

		// Generated data
		let data;

		const onLoad = icon => {
			// Legacy onLoad property
			if (typeof $$props.onLoad === 'function') {
				$$props.onLoad(icon);
			}

			// on:load event
			const dispatch = createEventDispatcher();

			dispatch('load', { icon });
		};

		// Increase counter when loaded to force re-calculation of data
		function loaded() {
			$$invalidate(3, counter++, counter);
		}

		// Force re-render
		onMount(() => {
			$$invalidate(2, mounted = true);
		});

		// Abort loading when component is destroyed
		onDestroy(() => {
			$$invalidate(1, state.destroyed = true, state);

			if (state.loading) {
				state.loading.abort();
				$$invalidate(1, state.loading = null, state);
			}
		});

		$$self.$$set = $$new_props => {
			$$invalidate(6, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		};

		$$self.$capture_state = () => ({
			enableCache,
			disableCache,
			iconLoaded,
			iconExists: iconLoaded,
			getIcon,
			listIcons,
			addIcon,
			addCollection,
			calculateSize,
			replaceIDs,
			buildIcon: iconToSVG,
			loadIcons,
			loadIcon,
			addAPIProvider,
			_api,
			onMount,
			onDestroy,
			createEventDispatcher,
			checkIconState,
			generateIcon,
			state,
			mounted,
			counter,
			data,
			onLoad,
			loaded
		});

		$$self.$inject_state = $$new_props => {
			$$invalidate(6, $$props = assign(assign({}, $$props), $$new_props));
			if ('mounted' in $$props) $$invalidate(2, mounted = $$new_props.mounted);
			if ('counter' in $$props) $$invalidate(3, counter = $$new_props.counter);
			if ('data' in $$props) $$invalidate(0, data = $$new_props.data);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			{
				const iconData = checkIconState($$props.icon, state, mounted, loaded, onLoad);
				$$invalidate(0, data = iconData ? generateIcon(iconData.data, $$props) : null);

				if (data && iconData.classes) {
					// Add classes
					$$invalidate(
						0,
						data.attributes['class'] = (typeof $$props['class'] === 'string'
						? $$props['class'] + ' '
						: '') + iconData.classes.join(' '),
						data
					);
				}
			}
		};

		$$props = exclude_internal_props($$props);
		return [data, state, mounted, counter];
	}

	class Icon extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Icon",
				options,
				id: create_fragment$g.name
			});
		}
	}

	const LOCATION = {};
	const ROUTER = {};
	const HISTORY = {};

	/**
	 * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
	 * https://github.com/reach/router/blob/master/LICENSE
	 */

	const PARAM = /^:(.+)/;
	const SEGMENT_POINTS = 4;
	const STATIC_POINTS = 3;
	const DYNAMIC_POINTS = 2;
	const SPLAT_PENALTY = 1;
	const ROOT_POINTS = 1;

	/**
	 * Split up the URI into segments delimited by `/`
	 * Strip starting/ending `/`
	 * @param {string} uri
	 * @return {string[]}
	 */
	const segmentize = (uri) => uri.replace(/(^\/+|\/+$)/g, "").split("/");
	/**
	 * Strip `str` of potential start and end `/`
	 * @param {string} string
	 * @return {string}
	 */
	const stripSlashes = (string) => string.replace(/(^\/+|\/+$)/g, "");
	/**
	 * Score a route depending on how its individual segments look
	 * @param {object} route
	 * @param {number} index
	 * @return {object}
	 */
	const rankRoute = (route, index) => {
	    const score = route.default
	        ? 0
	        : segmentize(route.path).reduce((score, segment) => {
	              score += SEGMENT_POINTS;

	              if (segment === "") {
	                  score += ROOT_POINTS;
	              } else if (PARAM.test(segment)) {
	                  score += DYNAMIC_POINTS;
	              } else if (segment[0] === "*") {
	                  score -= SEGMENT_POINTS + SPLAT_PENALTY;
	              } else {
	                  score += STATIC_POINTS;
	              }

	              return score;
	          }, 0);

	    return { route, score, index };
	};
	/**
	 * Give a score to all routes and sort them on that
	 * If two routes have the exact same score, we go by index instead
	 * @param {object[]} routes
	 * @return {object[]}
	 */
	const rankRoutes = (routes) =>
	    routes
	        .map(rankRoute)
	        .sort((a, b) =>
	            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
	        );
	/**
	 * Ranks and picks the best route to match. Each segment gets the highest
	 * amount of points, then the type of segment gets an additional amount of
	 * points where
	 *
	 *  static > dynamic > splat > root
	 *
	 * This way we don't have to worry about the order of our routes, let the
	 * computers do it.
	 *
	 * A route looks like this
	 *
	 *  { path, default, value }
	 *
	 * And a returned match looks like:
	 *
	 *  { route, params, uri }
	 *
	 * @param {object[]} routes
	 * @param {string} uri
	 * @return {?object}
	 */
	const pick = (routes, uri) => {
	    let match;
	    let default_;

	    const [uriPathname] = uri.split("?");
	    const uriSegments = segmentize(uriPathname);
	    const isRootUri = uriSegments[0] === "";
	    const ranked = rankRoutes(routes);

	    for (let i = 0, l = ranked.length; i < l; i++) {
	        const route = ranked[i].route;
	        let missed = false;

	        if (route.default) {
	            default_ = {
	                route,
	                params: {},
	                uri,
	            };
	            continue;
	        }

	        const routeSegments = segmentize(route.path);
	        const params = {};
	        const max = Math.max(uriSegments.length, routeSegments.length);
	        let index = 0;

	        for (; index < max; index++) {
	            const routeSegment = routeSegments[index];
	            const uriSegment = uriSegments[index];

	            if (routeSegment && routeSegment[0] === "*") {
	                // Hit a splat, just grab the rest, and return a match
	                // uri:   /files/documents/work
	                // route: /files/* or /files/*splatname
	                const splatName =
	                    routeSegment === "*" ? "*" : routeSegment.slice(1);

	                params[splatName] = uriSegments
	                    .slice(index)
	                    .map(decodeURIComponent)
	                    .join("/");
	                break;
	            }

	            if (typeof uriSegment === "undefined") {
	                // URI is shorter than the route, no match
	                // uri:   /users
	                // route: /users/:userId
	                missed = true;
	                break;
	            }

	            const dynamicMatch = PARAM.exec(routeSegment);

	            if (dynamicMatch && !isRootUri) {
	                const value = decodeURIComponent(uriSegment);
	                params[dynamicMatch[1]] = value;
	            } else if (routeSegment !== uriSegment) {
	                // Current segments don't match, not dynamic, not splat, so no match
	                // uri:   /users/123/settings
	                // route: /users/:id/profile
	                missed = true;
	                break;
	            }
	        }

	        if (!missed) {
	            match = {
	                route,
	                params,
	                uri: "/" + uriSegments.slice(0, index).join("/"),
	            };
	            break;
	        }
	    }

	    return match || default_ || null;
	};
	/**
	 * Combines the `basepath` and the `path` into one path.
	 * @param {string} basepath
	 * @param {string} path
	 */
	const combinePaths = (basepath, path) =>
	    `${stripSlashes(
        path === "/"
            ? basepath
            : `${stripSlashes(basepath)}/${stripSlashes(path)}`
    )}/`;

	const canUseDOM = () =>
	    typeof window !== "undefined" &&
	    "document" in window &&
	    "location" in window;

	/* node_modules/svelte-routing/src/Route.svelte generated by Svelte v4.2.18 */
	const get_default_slot_changes$1 = dirty => ({ params: dirty & /*routeParams*/ 4 });
	const get_default_slot_context$1 = ctx => ({ params: /*routeParams*/ ctx[2] });

	// (42:0) {#if $activeRoute && $activeRoute.route === route}
	function create_if_block$8(ctx) {
		let current_block_type_index;
		let if_block;
		let if_block_anchor;
		let current;
		const if_block_creators = [create_if_block_1$3, create_else_block$2];
		const if_blocks = [];

		function select_block_type(ctx, dirty) {
			if (/*component*/ ctx[0]) return 0;
			return 1;
		}

		current_block_type_index = select_block_type(ctx);
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

		const block = {
			c: function create() {
				if_block.c();
				if_block_anchor = empty();
			},
			m: function mount(target, anchor) {
				if_blocks[current_block_type_index].m(target, anchor);
				insert_dev(target, if_block_anchor, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(if_block_anchor);
				}

				if_blocks[current_block_type_index].d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$8.name,
			type: "if",
			source: "(42:0) {#if $activeRoute && $activeRoute.route === route}",
			ctx
		});

		return block;
	}

	// (51:4) {:else}
	function create_else_block$2(ctx) {
		let current;
		const default_slot_template = /*#slots*/ ctx[8].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], get_default_slot_context$1);

		const block = {
			c: function create() {
				if (default_slot) default_slot.c();
			},
			m: function mount(target, anchor) {
				if (default_slot) {
					default_slot.m(target, anchor);
				}

				current = true;
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope, routeParams*/ 132)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[7],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, get_default_slot_changes$1),
							get_default_slot_context$1
						);
					}
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (default_slot) default_slot.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_else_block$2.name,
			type: "else",
			source: "(51:4) {:else}",
			ctx
		});

		return block;
	}

	// (43:4) {#if component}
	function create_if_block_1$3(ctx) {
		let await_block_anchor;
		let promise;
		let current;

		let info = {
			ctx,
			current: null,
			token: null,
			hasCatch: false,
			pending: create_pending_block,
			then: create_then_block,
			catch: create_catch_block,
			value: 12,
			blocks: [,,,]
		};

		handle_promise(promise = /*component*/ ctx[0], info);

		const block = {
			c: function create() {
				await_block_anchor = empty();
				info.block.c();
			},
			m: function mount(target, anchor) {
				insert_dev(target, await_block_anchor, anchor);
				info.block.m(target, info.anchor = anchor);
				info.mount = () => await_block_anchor.parentNode;
				info.anchor = await_block_anchor;
				current = true;
			},
			p: function update(new_ctx, dirty) {
				ctx = new_ctx;
				info.ctx = ctx;

				if (dirty & /*component*/ 1 && promise !== (promise = /*component*/ ctx[0]) && handle_promise(promise, info)) ; else {
					update_await_block_branch(info, ctx, dirty);
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(info.block);
				current = true;
			},
			o: function outro(local) {
				for (let i = 0; i < 3; i += 1) {
					const block = info.blocks[i];
					transition_out(block);
				}

				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(await_block_anchor);
				}

				info.block.d(detaching);
				info.token = null;
				info = null;
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_1$3.name,
			type: "if",
			source: "(43:4) {#if component}",
			ctx
		});

		return block;
	}

	// (1:0) <script>     import { getContext, onDestroy }
	function create_catch_block(ctx) {
		const block = {
			c: noop$1,
			m: noop$1,
			p: noop$1,
			i: noop$1,
			o: noop$1,
			d: noop$1
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_catch_block.name,
			type: "catch",
			source: "(1:0) <script>     import { getContext, onDestroy }",
			ctx
		});

		return block;
	}

	// (44:49)              <svelte:component                 this={resolvedComponent?.default || resolvedComponent}
	function create_then_block(ctx) {
		let switch_instance;
		let switch_instance_anchor;
		let current;
		const switch_instance_spread_levels = [/*routeParams*/ ctx[2], /*routeProps*/ ctx[3]];
		var switch_value = /*resolvedComponent*/ ctx[12]?.default || /*resolvedComponent*/ ctx[12];

		function switch_props(ctx, dirty) {
			let switch_instance_props = {};

			for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
				switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
			}

			if (dirty !== undefined && dirty & /*routeParams, routeProps*/ 12) {
				switch_instance_props = assign(switch_instance_props, get_spread_update(switch_instance_spread_levels, [
					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
				]));
			}

			return {
				props: switch_instance_props,
				$$inline: true
			};
		}

		if (switch_value) {
			switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
		}

		const block = {
			c: function create() {
				if (switch_instance) create_component(switch_instance.$$.fragment);
				switch_instance_anchor = empty();
			},
			m: function mount(target, anchor) {
				if (switch_instance) mount_component(switch_instance, target, anchor);
				insert_dev(target, switch_instance_anchor, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				if (dirty & /*component*/ 1 && switch_value !== (switch_value = /*resolvedComponent*/ ctx[12]?.default || /*resolvedComponent*/ ctx[12])) {
					if (switch_instance) {
						group_outros();
						const old_component = switch_instance;

						transition_out(old_component.$$.fragment, 1, 0, () => {
							destroy_component(old_component, 1);
						});

						check_outros();
					}

					if (switch_value) {
						switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx, dirty));
						create_component(switch_instance.$$.fragment);
						transition_in(switch_instance.$$.fragment, 1);
						mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
					} else {
						switch_instance = null;
					}
				} else if (switch_value) {
					const switch_instance_changes = (dirty & /*routeParams, routeProps*/ 12)
					? get_spread_update(switch_instance_spread_levels, [
							dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
							dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
						])
					: {};

					switch_instance.$set(switch_instance_changes);
				}
			},
			i: function intro(local) {
				if (current) return;
				if (switch_instance) transition_in(switch_instance.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				if (switch_instance) transition_out(switch_instance.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(switch_instance_anchor);
				}

				if (switch_instance) destroy_component(switch_instance, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_then_block.name,
			type: "then",
			source: "(44:49)              <svelte:component                 this={resolvedComponent?.default || resolvedComponent}",
			ctx
		});

		return block;
	}

	// (1:0) <script>     import { getContext, onDestroy }
	function create_pending_block(ctx) {
		const block = {
			c: noop$1,
			m: noop$1,
			p: noop$1,
			i: noop$1,
			o: noop$1,
			d: noop$1
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_pending_block.name,
			type: "pending",
			source: "(1:0) <script>     import { getContext, onDestroy }",
			ctx
		});

		return block;
	}

	function create_fragment$f(ctx) {
		let if_block_anchor;
		let current;
		let if_block = /*$activeRoute*/ ctx[1] && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[5] && create_if_block$8(ctx);

		const block = {
			c: function create() {
				if (if_block) if_block.c();
				if_block_anchor = empty();
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert_dev(target, if_block_anchor, anchor);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				if (/*$activeRoute*/ ctx[1] && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[5]) {
					if (if_block) {
						if_block.p(ctx, dirty);

						if (dirty & /*$activeRoute*/ 2) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block$8(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(if_block_anchor);
				}

				if (if_block) if_block.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$f.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$f($$self, $$props, $$invalidate) {
		let $activeRoute;
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Route', slots, ['default']);
		let { path = "" } = $$props;
		let { component = null } = $$props;
		let routeParams = {};
		let routeProps = {};
		const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
		validate_store(activeRoute, 'activeRoute');
		component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));

		const route = {
			path,
			// If no path prop is given, this Route will act as the default Route
			// that is rendered if no other Route in the Router is a match.
			default: path === ""
		};

		registerRoute(route);

		onDestroy(() => {
			unregisterRoute(route);
		});

		$$self.$$set = $$new_props => {
			$$invalidate(11, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
			if ('path' in $$new_props) $$invalidate(6, path = $$new_props.path);
			if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
			if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
		};

		$$self.$capture_state = () => ({
			getContext,
			onDestroy,
			ROUTER,
			canUseDOM,
			path,
			component,
			routeParams,
			routeProps,
			registerRoute,
			unregisterRoute,
			activeRoute,
			route,
			$activeRoute
		});

		$$self.$inject_state = $$new_props => {
			$$invalidate(11, $$props = assign(assign({}, $$props), $$new_props));
			if ('path' in $$props) $$invalidate(6, path = $$new_props.path);
			if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
			if ('routeParams' in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
			if ('routeProps' in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($activeRoute && $activeRoute.route === route) {
				$$invalidate(2, routeParams = $activeRoute.params);
				const { component: c, path, ...rest } = $$props;
				$$invalidate(3, routeProps = rest);

				if (c) {
					if (c.toString().startsWith("class ")) $$invalidate(0, component = c); else $$invalidate(0, component = c());
				}

				canUseDOM() && !$activeRoute.preserveScroll && window?.scrollTo(0, 0);
			}
		};

		$$props = exclude_internal_props($$props);

		return [
			component,
			$activeRoute,
			routeParams,
			routeProps,
			activeRoute,
			route,
			path,
			$$scope,
			slots
		];
	}

	class Route extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$f, create_fragment$f, safe_not_equal, { path: 6, component: 0 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Route",
				options,
				id: create_fragment$f.name
			});
		}

		get path() {
			throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set path(value) {
			throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get component() {
			throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set component(value) {
			throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	const subscriber_queue = [];

	/**
	 * Creates a `Readable` store that allows reading by subscription.
	 *
	 * https://svelte.dev/docs/svelte-store#readable
	 * @template T
	 * @param {T} [value] initial value
	 * @param {import('./public.js').StartStopNotifier<T>} [start]
	 * @returns {import('./public.js').Readable<T>}
	 */
	function readable(value, start) {
		return {
			subscribe: writable(value, start).subscribe
		};
	}

	/**
	 * Create a `Writable` store that allows both updating and reading by subscription.
	 *
	 * https://svelte.dev/docs/svelte-store#writable
	 * @template T
	 * @param {T} [value] initial value
	 * @param {import('./public.js').StartStopNotifier<T>} [start]
	 * @returns {import('./public.js').Writable<T>}
	 */
	function writable(value, start = noop$1) {
		/** @type {import('./public.js').Unsubscriber} */
		let stop;
		/** @type {Set<import('./private.js').SubscribeInvalidateTuple<T>>} */
		const subscribers = new Set();
		/** @param {T} new_value
		 * @returns {void}
		 */
		function set(new_value) {
			if (safe_not_equal(value, new_value)) {
				value = new_value;
				if (stop) {
					// store is ready
					const run_queue = !subscriber_queue.length;
					for (const subscriber of subscribers) {
						subscriber[1]();
						subscriber_queue.push(subscriber, value);
					}
					if (run_queue) {
						for (let i = 0; i < subscriber_queue.length; i += 2) {
							subscriber_queue[i][0](subscriber_queue[i + 1]);
						}
						subscriber_queue.length = 0;
					}
				}
			}
		}

		/**
		 * @param {import('./public.js').Updater<T>} fn
		 * @returns {void}
		 */
		function update(fn) {
			set(fn(value));
		}

		/**
		 * @param {import('./public.js').Subscriber<T>} run
		 * @param {import('./private.js').Invalidator<T>} [invalidate]
		 * @returns {import('./public.js').Unsubscriber}
		 */
		function subscribe(run, invalidate = noop$1) {
			/** @type {import('./private.js').SubscribeInvalidateTuple<T>} */
			const subscriber = [run, invalidate];
			subscribers.add(subscriber);
			if (subscribers.size === 1) {
				stop = start(set, update) || noop$1;
			}
			run(value);
			return () => {
				subscribers.delete(subscriber);
				if (subscribers.size === 0 && stop) {
					stop();
					stop = null;
				}
			};
		}
		return { set, update, subscribe };
	}

	/**
	 * Derived value store by synchronizing one or more readable stores and
	 * applying an aggregation function over its input values.
	 *
	 * https://svelte.dev/docs/svelte-store#derived
	 * @template {import('./private.js').Stores} S
	 * @template T
	 * @overload
	 * @param {S} stores - input stores
	 * @param {(values: import('./private.js').StoresValues<S>, set: (value: T) => void, update: (fn: import('./public.js').Updater<T>) => void) => import('./public.js').Unsubscriber | void} fn - function callback that aggregates the values
	 * @param {T} [initial_value] - initial value
	 * @returns {import('./public.js').Readable<T>}
	 */

	/**
	 * Derived value store by synchronizing one or more readable stores and
	 * applying an aggregation function over its input values.
	 *
	 * https://svelte.dev/docs/svelte-store#derived
	 * @template {import('./private.js').Stores} S
	 * @template T
	 * @overload
	 * @param {S} stores - input stores
	 * @param {(values: import('./private.js').StoresValues<S>) => T} fn - function callback that aggregates the values
	 * @param {T} [initial_value] - initial value
	 * @returns {import('./public.js').Readable<T>}
	 */

	/**
	 * @template {import('./private.js').Stores} S
	 * @template T
	 * @param {S} stores
	 * @param {Function} fn
	 * @param {T} [initial_value]
	 * @returns {import('./public.js').Readable<T>}
	 */
	function derived(stores, fn, initial_value) {
		const single = !Array.isArray(stores);
		/** @type {Array<import('./public.js').Readable<any>>} */
		const stores_array = single ? [stores] : stores;
		if (!stores_array.every(Boolean)) {
			throw new Error('derived() expects stores as input, got a falsy value');
		}
		const auto = fn.length < 2;
		return readable(initial_value, (set, update) => {
			let started = false;
			const values = [];
			let pending = 0;
			let cleanup = noop$1;
			const sync = () => {
				if (pending) {
					return;
				}
				cleanup();
				const result = fn(single ? values[0] : values, set, update);
				if (auto) {
					set(result);
				} else {
					cleanup = is_function(result) ? result : noop$1;
				}
			};
			const unsubscribers = stores_array.map((store, i) =>
				subscribe(
					store,
					(value) => {
						values[i] = value;
						pending &= ~(1 << i);
						if (started) {
							sync();
						}
					},
					() => {
						pending |= 1 << i;
					}
				)
			);
			started = true;
			sync();
			return function stop() {
				run_all(unsubscribers);
				cleanup();
				// We need to set this to false because callbacks can still happen despite having unsubscribed:
				// Callbacks might already be placed in the queue which doesn't know it should no longer
				// invoke this derived store.
				started = false;
			};
		});
	}

	/**
	 * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
	 * https://github.com/reach/router/blob/master/LICENSE
	 */

	const getLocation = (source) => {
	    return {
	        ...source.location,
	        state: source.history.state,
	        key: (source.history.state && source.history.state.key) || "initial",
	    };
	};
	const createHistory = (source) => {
	    const listeners = [];
	    let location = getLocation(source);

	    return {
	        get location() {
	            return location;
	        },

	        listen(listener) {
	            listeners.push(listener);

	            const popstateListener = () => {
	                location = getLocation(source);
	                listener({ location, action: "POP" });
	            };

	            source.addEventListener("popstate", popstateListener);

	            return () => {
	                source.removeEventListener("popstate", popstateListener);
	                const index = listeners.indexOf(listener);
	                listeners.splice(index, 1);
	            };
	        },

	        navigate(to, { state, replace = false, preserveScroll = false, blurActiveElement = true } = {}) {
	            state = { ...state, key: Date.now() + "" };
	            // try...catch iOS Safari limits to 100 pushState calls
	            try {
	                if (replace) source.history.replaceState(state, "", to);
	                else source.history.pushState(state, "", to);
	            } catch (e) {
	                source.location[replace ? "replace" : "assign"](to);
	            }
	            location = getLocation(source);
	            listeners.forEach((listener) =>
	                listener({ location, action: "PUSH", preserveScroll })
	            );
	            if(blurActiveElement) document.activeElement.blur();
	        },
	    };
	};
	// Stores history entries in memory for testing or other platforms like Native
	const createMemorySource = (initialPathname = "/") => {
	    let index = 0;
	    const stack = [{ pathname: initialPathname, search: "" }];
	    const states = [];

	    return {
	        get location() {
	            return stack[index];
	        },
	        addEventListener(name, fn) {},
	        removeEventListener(name, fn) {},
	        history: {
	            get entries() {
	                return stack;
	            },
	            get index() {
	                return index;
	            },
	            get state() {
	                return states[index];
	            },
	            pushState(state, _, uri) {
	                const [pathname, search = ""] = uri.split("?");
	                index++;
	                stack.push({ pathname, search });
	                states.push(state);
	            },
	            replaceState(state, _, uri) {
	                const [pathname, search = ""] = uri.split("?");
	                stack[index] = { pathname, search };
	                states[index] = state;
	            },
	        },
	    };
	};
	// Global history uses window.history as the source if available,
	// otherwise a memory history
	const globalHistory = createHistory(
	    canUseDOM() ? window : createMemorySource()
	);
	const { navigate } = globalHistory;

	/* node_modules/svelte-routing/src/Router.svelte generated by Svelte v4.2.18 */

	const { Object: Object_1$1 } = globals;
	const file$e = "node_modules/svelte-routing/src/Router.svelte";

	const get_default_slot_changes_1 = dirty => ({
		route: dirty & /*$activeRoute*/ 4,
		location: dirty & /*$location*/ 2
	});

	const get_default_slot_context_1 = ctx => ({
		route: /*$activeRoute*/ ctx[2] && /*$activeRoute*/ ctx[2].uri,
		location: /*$location*/ ctx[1]
	});

	const get_default_slot_changes = dirty => ({
		route: dirty & /*$activeRoute*/ 4,
		location: dirty & /*$location*/ 2
	});

	const get_default_slot_context = ctx => ({
		route: /*$activeRoute*/ ctx[2] && /*$activeRoute*/ ctx[2].uri,
		location: /*$location*/ ctx[1]
	});

	// (143:0) {:else}
	function create_else_block$1(ctx) {
		let current;
		const default_slot_template = /*#slots*/ ctx[15].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], get_default_slot_context_1);

		const block = {
			c: function create() {
				if (default_slot) default_slot.c();
			},
			m: function mount(target, anchor) {
				if (default_slot) {
					default_slot.m(target, anchor);
				}

				current = true;
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope, $activeRoute, $location*/ 16390)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[14],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, get_default_slot_changes_1),
							get_default_slot_context_1
						);
					}
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (default_slot) default_slot.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_else_block$1.name,
			type: "else",
			source: "(143:0) {:else}",
			ctx
		});

		return block;
	}

	// (134:0) {#if viewtransition}
	function create_if_block$7(ctx) {
		let previous_key = /*$location*/ ctx[1].pathname;
		let key_block_anchor;
		let current;
		let key_block = create_key_block(ctx);

		const block = {
			c: function create() {
				key_block.c();
				key_block_anchor = empty();
			},
			m: function mount(target, anchor) {
				key_block.m(target, anchor);
				insert_dev(target, key_block_anchor, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				if (dirty & /*$location*/ 2 && safe_not_equal(previous_key, previous_key = /*$location*/ ctx[1].pathname)) {
					group_outros();
					transition_out(key_block, 1, 1, noop$1);
					check_outros();
					key_block = create_key_block(ctx);
					key_block.c();
					transition_in(key_block, 1);
					key_block.m(key_block_anchor.parentNode, key_block_anchor);
				} else {
					key_block.p(ctx, dirty);
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(key_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(key_block);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(key_block_anchor);
				}

				key_block.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$7.name,
			type: "if",
			source: "(134:0) {#if viewtransition}",
			ctx
		});

		return block;
	}

	// (135:4) {#key $location.pathname}
	function create_key_block(ctx) {
		let div;
		let div_intro;
		let div_outro;
		let current;
		const default_slot_template = /*#slots*/ ctx[15].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], get_default_slot_context);

		const block = {
			c: function create() {
				div = element("div");
				if (default_slot) default_slot.c();
				add_location(div, file$e, 135, 8, 4659);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);

				if (default_slot) {
					default_slot.m(div, null);
				}

				current = true;
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope, $activeRoute, $location*/ 16390)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[14],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, get_default_slot_changes),
							get_default_slot_context
						);
					}
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);

				if (local) {
					add_render_callback(() => {
						if (!current) return;
						if (div_outro) div_outro.end(1);
						div_intro = create_in_transition(div, /*viewtransitionFn*/ ctx[3], {});
						div_intro.start();
					});
				}

				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				if (div_intro) div_intro.invalidate();

				if (local) {
					div_outro = create_out_transition(div, /*viewtransitionFn*/ ctx[3], {});
				}

				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				if (default_slot) default_slot.d(detaching);
				if (detaching && div_outro) div_outro.end();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_key_block.name,
			type: "key",
			source: "(135:4) {#key $location.pathname}",
			ctx
		});

		return block;
	}

	function create_fragment$e(ctx) {
		let current_block_type_index;
		let if_block;
		let if_block_anchor;
		let current;
		const if_block_creators = [create_if_block$7, create_else_block$1];
		const if_blocks = [];

		function select_block_type(ctx, dirty) {
			if (/*viewtransition*/ ctx[0]) return 0;
			return 1;
		}

		current_block_type_index = select_block_type(ctx);
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

		const block = {
			c: function create() {
				if_block.c();
				if_block_anchor = empty();
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				if_blocks[current_block_type_index].m(target, anchor);
				insert_dev(target, if_block_anchor, anchor);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(if_block_anchor);
				}

				if_blocks[current_block_type_index].d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$e.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$e($$self, $$props, $$invalidate) {
		let $location;
		let $routes;
		let $base;
		let $activeRoute;
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Router', slots, ['default']);
		let { basepath = "/" } = $$props;
		let { url = null } = $$props;
		let { viewtransition = null } = $$props;
		let { history = globalHistory } = $$props;

		const viewtransitionFn = (node, _, direction) => {
			const vt = viewtransition(direction);
			if (typeof vt?.fn === "function") return vt.fn(node, vt); else return vt;
		};

		setContext(HISTORY, history);
		const locationContext = getContext(LOCATION);
		const routerContext = getContext(ROUTER);
		const routes = writable([]);
		validate_store(routes, 'routes');
		component_subscribe($$self, routes, value => $$invalidate(12, $routes = value));
		const activeRoute = writable(null);
		validate_store(activeRoute, 'activeRoute');
		component_subscribe($$self, activeRoute, value => $$invalidate(2, $activeRoute = value));
		let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

		// If locationContext is not set, this is the topmost Router in the tree.
		// If the `url` prop is given we force the location to it.
		const location = locationContext || writable(url ? { pathname: url } : history.location);

		validate_store(location, 'location');
		component_subscribe($$self, location, value => $$invalidate(1, $location = value));

		// If routerContext is set, the routerBase of the parent Router
		// will be the base for this Router's descendants.
		// If routerContext is not set, the path and resolved uri will both
		// have the value of the basepath prop.
		const base = routerContext
		? routerContext.routerBase
		: writable({ path: basepath, uri: basepath });

		validate_store(base, 'base');
		component_subscribe($$self, base, value => $$invalidate(13, $base = value));

		const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
			// If there is no activeRoute, the routerBase will be identical to the base.
			if (!activeRoute) return base;

			const { path: basepath } = base;
			const { route, uri } = activeRoute;

			// Remove the potential /* or /*splatname from
			// the end of the child Routes relative paths.
			const path = route.default
			? basepath
			: route.path.replace(/\*.*$/, "");

			return { path, uri };
		});

		const registerRoute = route => {
			const { path: basepath } = $base;
			let { path } = route;

			// We store the original path in the _path property so we can reuse
			// it when the basepath changes. The only thing that matters is that
			// the route reference is intact, so mutation is fine.
			route._path = path;

			route.path = combinePaths(basepath, path);

			if (typeof window === "undefined") {
				// In SSR we should set the activeRoute immediately if it is a match.
				// If there are more Routes being registered after a match is found,
				// we just skip them.
				if (hasActiveRoute) return;

				const matchingRoute = pick([route], $location.pathname);

				if (matchingRoute) {
					activeRoute.set(matchingRoute);
					hasActiveRoute = true;
				}
			} else {
				routes.update(rs => [...rs, route]);
			}
		};

		const unregisterRoute = route => {
			routes.update(rs => rs.filter(r => r !== route));
		};

		let preserveScroll = false;

		if (!locationContext) {
			// The topmost Router in the tree is responsible for updating
			// the location store and supplying it through context.
			onMount(() => {
				const unlisten = history.listen(event => {
					$$invalidate(11, preserveScroll = event.preserveScroll || false);
					location.set(event.location);
				});

				return unlisten;
			});

			setContext(LOCATION, location);
		}

		setContext(ROUTER, {
			activeRoute,
			base,
			routerBase,
			registerRoute,
			unregisterRoute
		});

		const writable_props = ['basepath', 'url', 'viewtransition', 'history'];

		Object_1$1.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
		});

		$$self.$$set = $$props => {
			if ('basepath' in $$props) $$invalidate(8, basepath = $$props.basepath);
			if ('url' in $$props) $$invalidate(9, url = $$props.url);
			if ('viewtransition' in $$props) $$invalidate(0, viewtransition = $$props.viewtransition);
			if ('history' in $$props) $$invalidate(10, history = $$props.history);
			if ('$$scope' in $$props) $$invalidate(14, $$scope = $$props.$$scope);
		};

		$$self.$capture_state = () => ({
			getContext,
			onMount,
			setContext,
			derived,
			writable,
			HISTORY,
			LOCATION,
			ROUTER,
			globalHistory,
			combinePaths,
			pick,
			basepath,
			url,
			viewtransition,
			history,
			viewtransitionFn,
			locationContext,
			routerContext,
			routes,
			activeRoute,
			hasActiveRoute,
			location,
			base,
			routerBase,
			registerRoute,
			unregisterRoute,
			preserveScroll,
			$location,
			$routes,
			$base,
			$activeRoute
		});

		$$self.$inject_state = $$props => {
			if ('basepath' in $$props) $$invalidate(8, basepath = $$props.basepath);
			if ('url' in $$props) $$invalidate(9, url = $$props.url);
			if ('viewtransition' in $$props) $$invalidate(0, viewtransition = $$props.viewtransition);
			if ('history' in $$props) $$invalidate(10, history = $$props.history);
			if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
			if ('preserveScroll' in $$props) $$invalidate(11, preserveScroll = $$props.preserveScroll);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*$base*/ 8192) {
				// This reactive statement will update all the Routes' path when
				// the basepath changes.
				{
					const { path: basepath } = $base;
					routes.update(rs => rs.map(r => Object.assign(r, { path: combinePaths(basepath, r._path) })));
				}
			}

			if ($$self.$$.dirty & /*$routes, $location, preserveScroll*/ 6146) {
				// This reactive statement will be run when the Router is created
				// when there are no Routes and then again the following tick, so it
				// will not find an active Route in SSR and in the browser it will only
				// pick an active Route after all Routes have been registered.
				{
					const bestMatch = pick($routes, $location.pathname);
					activeRoute.set(bestMatch ? { ...bestMatch, preserveScroll } : bestMatch);
				}
			}
		};

		return [
			viewtransition,
			$location,
			$activeRoute,
			viewtransitionFn,
			routes,
			activeRoute,
			location,
			base,
			basepath,
			url,
			history,
			preserveScroll,
			$routes,
			$base,
			$$scope,
			slots
		];
	}

	class Router extends SvelteComponentDev {
		constructor(options) {
			super(options);

			init(this, options, instance$e, create_fragment$e, safe_not_equal, {
				basepath: 8,
				url: 9,
				viewtransition: 0,
				history: 10
			});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Router",
				options,
				id: create_fragment$e.name
			});
		}

		get basepath() {
			throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set basepath(value) {
			throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get url() {
			throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set url(value) {
			throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get viewtransition() {
			throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set viewtransition(value) {
			throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get history() {
			throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set history(value) {
			throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	const isAuthenticated = writable(false);
	const authToken = writable(null);

	// Initialize authentication and token from local storage
	function initializeAuth() {
	  const token = localStorage.getItem('authToken');
	  const authStatus = token !== null;
	  isAuthenticated.set(authStatus);
	  authToken.set(token);
	}

	function login() {
	  // Simulate token generation (you would replace this with actual token from an auth server)
	  const token = 'your_generated_token_here'; // Replace with actual token from server

	  // Store token and update authentication state
	  localStorage.setItem('authToken', token);
	  isAuthenticated.set(true);
	  authToken.set(token);
	}

	function logout() {
	  // Clear token and authentication status
	  localStorage.removeItem('authToken');
	  isAuthenticated.set(false);
	  authToken.set(null);
	}

	/* src/components/Welcome.svelte generated by Svelte v4.2.18 */
	const file$d = "src/components/Welcome.svelte";

	function create_fragment$d(ctx) {
		let div;
		let h3;
		let t1;
		let button;
		let mounted;
		let dispose;

		const block = {
			c: function create() {
				div = element("div");
				h3 = element("h3");
				h3.textContent = "Welcome to Your Node Manager";
				t1 = space();
				button = element("button");
				button.textContent = "Enter App";
				add_location(h3, file$d, 11, 2, 279);
				attr_dev(button, "class", "svelte-crb6op");
				add_location(button, file$d, 12, 2, 320);
				attr_dev(div, "class", "login-screen svelte-crb6op");
				add_location(div, file$d, 10, 0, 249);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				append_dev(div, h3);
				append_dev(div, t1);
				append_dev(div, button);

				if (!mounted) {
					dispose = listen_dev(button, "click", /*handleLogin*/ ctx[0], false, false, false, false);
					mounted = true;
				}
			},
			p: noop$1,
			i: noop$1,
			o: noop$1,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$d.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$d($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Welcome', slots, []);

		function handleLogin() {
			login(); // Set authentication state and token
			navigate('/app'); // Redirect to the main app screen
		}

		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Welcome> was created with unknown prop '${key}'`);
		});

		$$self.$capture_state = () => ({ navigate, login, handleLogin });
		return [handleLogin];
	}

	class Welcome extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Welcome",
				options,
				id: create_fragment$d.name
			});
		}
	}

	/* src/components/buttons/LogOut.svelte generated by Svelte v4.2.18 */
	const file$c = "src/components/buttons/LogOut.svelte";

	function create_fragment$c(ctx) {
		let button;
		let mounted;
		let dispose;

		const block = {
			c: function create() {
				button = element("button");
				button.textContent = "Logout";
				attr_dev(button, "class", "logout-button svelte-10tw1vx");
				add_location(button, file$c, 10, 0, 179);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, button, anchor);

				if (!mounted) {
					dispose = listen_dev(button, "click", /*handleLogout*/ ctx[0], false, false, false, false);
					mounted = true;
				}
			},
			p: noop$1,
			i: noop$1,
			o: noop$1,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(button);
				}

				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$c.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$c($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('LogOut', slots, []);

		function handleLogout() {
			logout();
			navigate('/');
		}

		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LogOut> was created with unknown prop '${key}'`);
		});

		$$self.$capture_state = () => ({ logout, navigate, handleLogout });
		return [handleLogout];
	}

	class LogOut extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "LogOut",
				options,
				id: create_fragment$c.name
			});
		}
	}

	/* src/components/Version.svelte generated by Svelte v4.2.18 */
	const file$b = "src/components/Version.svelte";

	function create_fragment$b(ctx) {
		let div;
		let t0;
		let t1;
		let t2;
		let icon;
		let current;

		icon = new Icon({
				props: { icon: "devicon:github-wordmark" },
				$$inline: true
			});

		const block = {
			c: function create() {
				div = element("div");
				t0 = text("Version ");
				t1 = text(/*version*/ ctx[0]);
				t2 = space();
				create_component(icon.$$.fragment);
				attr_dev(div, "class", "version-button svelte-z152xv");
				add_location(div, file$b, 8, 0, 135);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				append_dev(div, t0);
				append_dev(div, t1);
				append_dev(div, t2);
				mount_component(icon, div, null);
				current = true;
			},
			p: noop$1,
			i: function intro(local) {
				if (current) return;
				transition_in(icon.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(icon.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				destroy_component(icon);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$b.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$b($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Version', slots, []);
		let version = 'v 0.0.1';
		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Version> was created with unknown prop '${key}'`);
		});

		$$self.$capture_state = () => ({ Icon, navigate, version });

		$$self.$inject_state = $$props => {
			if ('version' in $$props) $$invalidate(0, version = $$props.version);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [version];
	}

	let Version$1 = class Version extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Version",
				options,
				id: create_fragment$b.name
			});
		}
	};

	function bind(fn, thisArg) {
	  return function wrap() {
	    return fn.apply(thisArg, arguments);
	  };
	}

	// utils is a library of generic helper functions non-specific to axios

	const {toString} = Object.prototype;
	const {getPrototypeOf} = Object;

	const kindOf = (cache => thing => {
	    const str = toString.call(thing);
	    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
	})(Object.create(null));

	const kindOfTest = (type) => {
	  type = type.toLowerCase();
	  return (thing) => kindOf(thing) === type
	};

	const typeOfTest = type => thing => typeof thing === type;

	/**
	 * Determine if a value is an Array
	 *
	 * @param {Object} val The value to test
	 *
	 * @returns {boolean} True if value is an Array, otherwise false
	 */
	const {isArray} = Array;

	/**
	 * Determine if a value is undefined
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if the value is undefined, otherwise false
	 */
	const isUndefined = typeOfTest('undefined');

	/**
	 * Determine if a value is a Buffer
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Buffer, otherwise false
	 */
	function isBuffer(val) {
	  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
	    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
	}

	/**
	 * Determine if a value is an ArrayBuffer
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */
	const isArrayBuffer = kindOfTest('ArrayBuffer');


	/**
	 * Determine if a value is a view on an ArrayBuffer
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	 */
	function isArrayBufferView(val) {
	  let result;
	  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
	    result = ArrayBuffer.isView(val);
	  } else {
	    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
	  }
	  return result;
	}

	/**
	 * Determine if a value is a String
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a String, otherwise false
	 */
	const isString = typeOfTest('string');

	/**
	 * Determine if a value is a Function
	 *
	 * @param {*} val The value to test
	 * @returns {boolean} True if value is a Function, otherwise false
	 */
	const isFunction = typeOfTest('function');

	/**
	 * Determine if a value is a Number
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Number, otherwise false
	 */
	const isNumber = typeOfTest('number');

	/**
	 * Determine if a value is an Object
	 *
	 * @param {*} thing The value to test
	 *
	 * @returns {boolean} True if value is an Object, otherwise false
	 */
	const isObject = (thing) => thing !== null && typeof thing === 'object';

	/**
	 * Determine if a value is a Boolean
	 *
	 * @param {*} thing The value to test
	 * @returns {boolean} True if value is a Boolean, otherwise false
	 */
	const isBoolean = thing => thing === true || thing === false;

	/**
	 * Determine if a value is a plain Object
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a plain Object, otherwise false
	 */
	const isPlainObject = (val) => {
	  if (kindOf(val) !== 'object') {
	    return false;
	  }

	  const prototype = getPrototypeOf(val);
	  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
	};

	/**
	 * Determine if a value is a Date
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Date, otherwise false
	 */
	const isDate = kindOfTest('Date');

	/**
	 * Determine if a value is a File
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	const isFile = kindOfTest('File');

	/**
	 * Determine if a value is a Blob
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */
	const isBlob = kindOfTest('Blob');

	/**
	 * Determine if a value is a FileList
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	const isFileList = kindOfTest('FileList');

	/**
	 * Determine if a value is a Stream
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Stream, otherwise false
	 */
	const isStream = (val) => isObject(val) && isFunction(val.pipe);

	/**
	 * Determine if a value is a FormData
	 *
	 * @param {*} thing The value to test
	 *
	 * @returns {boolean} True if value is an FormData, otherwise false
	 */
	const isFormData = (thing) => {
	  let kind;
	  return thing && (
	    (typeof FormData === 'function' && thing instanceof FormData) || (
	      isFunction(thing.append) && (
	        (kind = kindOf(thing)) === 'formdata' ||
	        // detect form-data instance
	        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
	      )
	    )
	  )
	};

	/**
	 * Determine if a value is a URLSearchParams object
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
	 */
	const isURLSearchParams = kindOfTest('URLSearchParams');

	const [isReadableStream, isRequest, isResponse, isHeaders] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(kindOfTest);

	/**
	 * Trim excess whitespace off the beginning and end of a string
	 *
	 * @param {String} str The String to trim
	 *
	 * @returns {String} The String freed of excess whitespace
	 */
	const trim = (str) => str.trim ?
	  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

	/**
	 * Iterate over an Array or an Object invoking a function for each item.
	 *
	 * If `obj` is an Array callback will be called passing
	 * the value, index, and complete array for each item.
	 *
	 * If 'obj' is an Object callback will be called passing
	 * the value, key, and complete object for each property.
	 *
	 * @param {Object|Array} obj The object to iterate
	 * @param {Function} fn The callback to invoke for each item
	 *
	 * @param {Boolean} [allOwnKeys = false]
	 * @returns {any}
	 */
	function forEach(obj, fn, {allOwnKeys = false} = {}) {
	  // Don't bother if no value provided
	  if (obj === null || typeof obj === 'undefined') {
	    return;
	  }

	  let i;
	  let l;

	  // Force an array if not already something iterable
	  if (typeof obj !== 'object') {
	    /*eslint no-param-reassign:0*/
	    obj = [obj];
	  }

	  if (isArray(obj)) {
	    // Iterate over array values
	    for (i = 0, l = obj.length; i < l; i++) {
	      fn.call(null, obj[i], i, obj);
	    }
	  } else {
	    // Iterate over object keys
	    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
	    const len = keys.length;
	    let key;

	    for (i = 0; i < len; i++) {
	      key = keys[i];
	      fn.call(null, obj[key], key, obj);
	    }
	  }
	}

	function findKey(obj, key) {
	  key = key.toLowerCase();
	  const keys = Object.keys(obj);
	  let i = keys.length;
	  let _key;
	  while (i-- > 0) {
	    _key = keys[i];
	    if (key === _key.toLowerCase()) {
	      return _key;
	    }
	  }
	  return null;
	}

	const _global = (() => {
	  /*eslint no-undef:0*/
	  if (typeof globalThis !== "undefined") return globalThis;
	  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
	})();

	const isContextDefined = (context) => !isUndefined(context) && context !== _global;

	/**
	 * Accepts varargs expecting each argument to be an object, then
	 * immutably merges the properties of each object and returns result.
	 *
	 * When multiple objects contain the same key the later object in
	 * the arguments list will take precedence.
	 *
	 * Example:
	 *
	 * ```js
	 * var result = merge({foo: 123}, {foo: 456});
	 * console.log(result.foo); // outputs 456
	 * ```
	 *
	 * @param {Object} obj1 Object to merge
	 *
	 * @returns {Object} Result of all merge properties
	 */
	function merge(/* obj1, obj2, obj3, ... */) {
	  const {caseless} = isContextDefined(this) && this || {};
	  const result = {};
	  const assignValue = (val, key) => {
	    const targetKey = caseless && findKey(result, key) || key;
	    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
	      result[targetKey] = merge(result[targetKey], val);
	    } else if (isPlainObject(val)) {
	      result[targetKey] = merge({}, val);
	    } else if (isArray(val)) {
	      result[targetKey] = val.slice();
	    } else {
	      result[targetKey] = val;
	    }
	  };

	  for (let i = 0, l = arguments.length; i < l; i++) {
	    arguments[i] && forEach(arguments[i], assignValue);
	  }
	  return result;
	}

	/**
	 * Extends object a by mutably adding to it the properties of object b.
	 *
	 * @param {Object} a The object to be extended
	 * @param {Object} b The object to copy properties from
	 * @param {Object} thisArg The object to bind function to
	 *
	 * @param {Boolean} [allOwnKeys]
	 * @returns {Object} The resulting value of object a
	 */
	const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
	  forEach(b, (val, key) => {
	    if (thisArg && isFunction(val)) {
	      a[key] = bind(val, thisArg);
	    } else {
	      a[key] = val;
	    }
	  }, {allOwnKeys});
	  return a;
	};

	/**
	 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
	 *
	 * @param {string} content with BOM
	 *
	 * @returns {string} content value without BOM
	 */
	const stripBOM = (content) => {
	  if (content.charCodeAt(0) === 0xFEFF) {
	    content = content.slice(1);
	  }
	  return content;
	};

	/**
	 * Inherit the prototype methods from one constructor into another
	 * @param {function} constructor
	 * @param {function} superConstructor
	 * @param {object} [props]
	 * @param {object} [descriptors]
	 *
	 * @returns {void}
	 */
	const inherits = (constructor, superConstructor, props, descriptors) => {
	  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
	  constructor.prototype.constructor = constructor;
	  Object.defineProperty(constructor, 'super', {
	    value: superConstructor.prototype
	  });
	  props && Object.assign(constructor.prototype, props);
	};

	/**
	 * Resolve object with deep prototype chain to a flat object
	 * @param {Object} sourceObj source object
	 * @param {Object} [destObj]
	 * @param {Function|Boolean} [filter]
	 * @param {Function} [propFilter]
	 *
	 * @returns {Object}
	 */
	const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
	  let props;
	  let i;
	  let prop;
	  const merged = {};

	  destObj = destObj || {};
	  // eslint-disable-next-line no-eq-null,eqeqeq
	  if (sourceObj == null) return destObj;

	  do {
	    props = Object.getOwnPropertyNames(sourceObj);
	    i = props.length;
	    while (i-- > 0) {
	      prop = props[i];
	      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
	        destObj[prop] = sourceObj[prop];
	        merged[prop] = true;
	      }
	    }
	    sourceObj = filter !== false && getPrototypeOf(sourceObj);
	  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

	  return destObj;
	};

	/**
	 * Determines whether a string ends with the characters of a specified string
	 *
	 * @param {String} str
	 * @param {String} searchString
	 * @param {Number} [position= 0]
	 *
	 * @returns {boolean}
	 */
	const endsWith = (str, searchString, position) => {
	  str = String(str);
	  if (position === undefined || position > str.length) {
	    position = str.length;
	  }
	  position -= searchString.length;
	  const lastIndex = str.indexOf(searchString, position);
	  return lastIndex !== -1 && lastIndex === position;
	};


	/**
	 * Returns new array from array like object or null if failed
	 *
	 * @param {*} [thing]
	 *
	 * @returns {?Array}
	 */
	const toArray = (thing) => {
	  if (!thing) return null;
	  if (isArray(thing)) return thing;
	  let i = thing.length;
	  if (!isNumber(i)) return null;
	  const arr = new Array(i);
	  while (i-- > 0) {
	    arr[i] = thing[i];
	  }
	  return arr;
	};

	/**
	 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
	 * thing passed in is an instance of Uint8Array
	 *
	 * @param {TypedArray}
	 *
	 * @returns {Array}
	 */
	// eslint-disable-next-line func-names
	const isTypedArray = (TypedArray => {
	  // eslint-disable-next-line func-names
	  return thing => {
	    return TypedArray && thing instanceof TypedArray;
	  };
	})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

	/**
	 * For each entry in the object, call the function with the key and value.
	 *
	 * @param {Object<any, any>} obj - The object to iterate over.
	 * @param {Function} fn - The function to call for each entry.
	 *
	 * @returns {void}
	 */
	const forEachEntry = (obj, fn) => {
	  const generator = obj && obj[Symbol.iterator];

	  const iterator = generator.call(obj);

	  let result;

	  while ((result = iterator.next()) && !result.done) {
	    const pair = result.value;
	    fn.call(obj, pair[0], pair[1]);
	  }
	};

	/**
	 * It takes a regular expression and a string, and returns an array of all the matches
	 *
	 * @param {string} regExp - The regular expression to match against.
	 * @param {string} str - The string to search.
	 *
	 * @returns {Array<boolean>}
	 */
	const matchAll = (regExp, str) => {
	  let matches;
	  const arr = [];

	  while ((matches = regExp.exec(str)) !== null) {
	    arr.push(matches);
	  }

	  return arr;
	};

	/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
	const isHTMLForm = kindOfTest('HTMLFormElement');

	const toCamelCase = str => {
	  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
	    function replacer(m, p1, p2) {
	      return p1.toUpperCase() + p2;
	    }
	  );
	};

	/* Creating a function that will check if an object has a property. */
	const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

	/**
	 * Determine if a value is a RegExp object
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a RegExp object, otherwise false
	 */
	const isRegExp = kindOfTest('RegExp');

	const reduceDescriptors = (obj, reducer) => {
	  const descriptors = Object.getOwnPropertyDescriptors(obj);
	  const reducedDescriptors = {};

	  forEach(descriptors, (descriptor, name) => {
	    let ret;
	    if ((ret = reducer(descriptor, name, obj)) !== false) {
	      reducedDescriptors[name] = ret || descriptor;
	    }
	  });

	  Object.defineProperties(obj, reducedDescriptors);
	};

	/**
	 * Makes all methods read-only
	 * @param {Object} obj
	 */

	const freezeMethods = (obj) => {
	  reduceDescriptors(obj, (descriptor, name) => {
	    // skip restricted props in strict mode
	    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
	      return false;
	    }

	    const value = obj[name];

	    if (!isFunction(value)) return;

	    descriptor.enumerable = false;

	    if ('writable' in descriptor) {
	      descriptor.writable = false;
	      return;
	    }

	    if (!descriptor.set) {
	      descriptor.set = () => {
	        throw Error('Can not rewrite read-only method \'' + name + '\'');
	      };
	    }
	  });
	};

	const toObjectSet = (arrayOrString, delimiter) => {
	  const obj = {};

	  const define = (arr) => {
	    arr.forEach(value => {
	      obj[value] = true;
	    });
	  };

	  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

	  return obj;
	};

	const noop = () => {};

	const toFiniteNumber = (value, defaultValue) => {
	  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
	};

	const ALPHA = 'abcdefghijklmnopqrstuvwxyz';

	const DIGIT = '0123456789';

	const ALPHABET = {
	  DIGIT,
	  ALPHA,
	  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
	};

	const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
	  let str = '';
	  const {length} = alphabet;
	  while (size--) {
	    str += alphabet[Math.random() * length|0];
	  }

	  return str;
	};

	/**
	 * If the thing is a FormData object, return true, otherwise return false.
	 *
	 * @param {unknown} thing - The thing to check.
	 *
	 * @returns {boolean}
	 */
	function isSpecCompliantForm(thing) {
	  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
	}

	const toJSONObject = (obj) => {
	  const stack = new Array(10);

	  const visit = (source, i) => {

	    if (isObject(source)) {
	      if (stack.indexOf(source) >= 0) {
	        return;
	      }

	      if(!('toJSON' in source)) {
	        stack[i] = source;
	        const target = isArray(source) ? [] : {};

	        forEach(source, (value, key) => {
	          const reducedValue = visit(value, i + 1);
	          !isUndefined(reducedValue) && (target[key] = reducedValue);
	        });

	        stack[i] = undefined;

	        return target;
	      }
	    }

	    return source;
	  };

	  return visit(obj, 0);
	};

	const isAsyncFn = kindOfTest('AsyncFunction');

	const isThenable = (thing) =>
	  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

	var utils$3 = {
	  isArray,
	  isArrayBuffer,
	  isBuffer,
	  isFormData,
	  isArrayBufferView,
	  isString,
	  isNumber,
	  isBoolean,
	  isObject,
	  isPlainObject,
	  isReadableStream,
	  isRequest,
	  isResponse,
	  isHeaders,
	  isUndefined,
	  isDate,
	  isFile,
	  isBlob,
	  isRegExp,
	  isFunction,
	  isStream,
	  isURLSearchParams,
	  isTypedArray,
	  isFileList,
	  forEach,
	  merge,
	  extend,
	  trim,
	  stripBOM,
	  inherits,
	  toFlatObject,
	  kindOf,
	  kindOfTest,
	  endsWith,
	  toArray,
	  forEachEntry,
	  matchAll,
	  isHTMLForm,
	  hasOwnProperty,
	  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
	  reduceDescriptors,
	  freezeMethods,
	  toObjectSet,
	  toCamelCase,
	  noop,
	  toFiniteNumber,
	  findKey,
	  global: _global,
	  isContextDefined,
	  ALPHABET,
	  generateString,
	  isSpecCompliantForm,
	  toJSONObject,
	  isAsyncFn,
	  isThenable
	};

	/**
	 * Create an Error with the specified message, config, error code, request and response.
	 *
	 * @param {string} message The error message.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 * @param {Object} [config] The config.
	 * @param {Object} [request] The request.
	 * @param {Object} [response] The response.
	 *
	 * @returns {Error} The created error.
	 */
	function AxiosError(message, code, config, request, response) {
	  Error.call(this);

	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, this.constructor);
	  } else {
	    this.stack = (new Error()).stack;
	  }

	  this.message = message;
	  this.name = 'AxiosError';
	  code && (this.code = code);
	  config && (this.config = config);
	  request && (this.request = request);
	  response && (this.response = response);
	}

	utils$3.inherits(AxiosError, Error, {
	  toJSON: function toJSON() {
	    return {
	      // Standard
	      message: this.message,
	      name: this.name,
	      // Microsoft
	      description: this.description,
	      number: this.number,
	      // Mozilla
	      fileName: this.fileName,
	      lineNumber: this.lineNumber,
	      columnNumber: this.columnNumber,
	      stack: this.stack,
	      // Axios
	      config: utils$3.toJSONObject(this.config),
	      code: this.code,
	      status: this.response && this.response.status ? this.response.status : null
	    };
	  }
	});

	const prototype$1 = AxiosError.prototype;
	const descriptors = {};

	[
	  'ERR_BAD_OPTION_VALUE',
	  'ERR_BAD_OPTION',
	  'ECONNABORTED',
	  'ETIMEDOUT',
	  'ERR_NETWORK',
	  'ERR_FR_TOO_MANY_REDIRECTS',
	  'ERR_DEPRECATED',
	  'ERR_BAD_RESPONSE',
	  'ERR_BAD_REQUEST',
	  'ERR_CANCELED',
	  'ERR_NOT_SUPPORT',
	  'ERR_INVALID_URL'
	// eslint-disable-next-line func-names
	].forEach(code => {
	  descriptors[code] = {value: code};
	});

	Object.defineProperties(AxiosError, descriptors);
	Object.defineProperty(prototype$1, 'isAxiosError', {value: true});

	// eslint-disable-next-line func-names
	AxiosError.from = (error, code, config, request, response, customProps) => {
	  const axiosError = Object.create(prototype$1);

	  utils$3.toFlatObject(error, axiosError, function filter(obj) {
	    return obj !== Error.prototype;
	  }, prop => {
	    return prop !== 'isAxiosError';
	  });

	  AxiosError.call(axiosError, error.message, code, config, request, response);

	  axiosError.cause = error;

	  axiosError.name = error.name;

	  customProps && Object.assign(axiosError, customProps);

	  return axiosError;
	};

	// eslint-disable-next-line strict
	var httpAdapter = null;

	/**
	 * Determines if the given thing is a array or js object.
	 *
	 * @param {string} thing - The object or array to be visited.
	 *
	 * @returns {boolean}
	 */
	function isVisitable(thing) {
	  return utils$3.isPlainObject(thing) || utils$3.isArray(thing);
	}

	/**
	 * It removes the brackets from the end of a string
	 *
	 * @param {string} key - The key of the parameter.
	 *
	 * @returns {string} the key without the brackets.
	 */
	function removeBrackets(key) {
	  return utils$3.endsWith(key, '[]') ? key.slice(0, -2) : key;
	}

	/**
	 * It takes a path, a key, and a boolean, and returns a string
	 *
	 * @param {string} path - The path to the current key.
	 * @param {string} key - The key of the current object being iterated over.
	 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
	 *
	 * @returns {string} The path to the current key.
	 */
	function renderKey(path, key, dots) {
	  if (!path) return key;
	  return path.concat(key).map(function each(token, i) {
	    // eslint-disable-next-line no-param-reassign
	    token = removeBrackets(token);
	    return !dots && i ? '[' + token + ']' : token;
	  }).join(dots ? '.' : '');
	}

	/**
	 * If the array is an array and none of its elements are visitable, then it's a flat array.
	 *
	 * @param {Array<any>} arr - The array to check
	 *
	 * @returns {boolean}
	 */
	function isFlatArray(arr) {
	  return utils$3.isArray(arr) && !arr.some(isVisitable);
	}

	const predicates = utils$3.toFlatObject(utils$3, {}, null, function filter(prop) {
	  return /^is[A-Z]/.test(prop);
	});

	/**
	 * Convert a data object to FormData
	 *
	 * @param {Object} obj
	 * @param {?Object} [formData]
	 * @param {?Object} [options]
	 * @param {Function} [options.visitor]
	 * @param {Boolean} [options.metaTokens = true]
	 * @param {Boolean} [options.dots = false]
	 * @param {?Boolean} [options.indexes = false]
	 *
	 * @returns {Object}
	 **/

	/**
	 * It converts an object into a FormData object
	 *
	 * @param {Object<any, any>} obj - The object to convert to form data.
	 * @param {string} formData - The FormData object to append to.
	 * @param {Object<string, any>} options
	 *
	 * @returns
	 */
	function toFormData(obj, formData, options) {
	  if (!utils$3.isObject(obj)) {
	    throw new TypeError('target must be an object');
	  }

	  // eslint-disable-next-line no-param-reassign
	  formData = formData || new (FormData)();

	  // eslint-disable-next-line no-param-reassign
	  options = utils$3.toFlatObject(options, {
	    metaTokens: true,
	    dots: false,
	    indexes: false
	  }, false, function defined(option, source) {
	    // eslint-disable-next-line no-eq-null,eqeqeq
	    return !utils$3.isUndefined(source[option]);
	  });

	  const metaTokens = options.metaTokens;
	  // eslint-disable-next-line no-use-before-define
	  const visitor = options.visitor || defaultVisitor;
	  const dots = options.dots;
	  const indexes = options.indexes;
	  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
	  const useBlob = _Blob && utils$3.isSpecCompliantForm(formData);

	  if (!utils$3.isFunction(visitor)) {
	    throw new TypeError('visitor must be a function');
	  }

	  function convertValue(value) {
	    if (value === null) return '';

	    if (utils$3.isDate(value)) {
	      return value.toISOString();
	    }

	    if (!useBlob && utils$3.isBlob(value)) {
	      throw new AxiosError('Blob is not supported. Use a Buffer instead.');
	    }

	    if (utils$3.isArrayBuffer(value) || utils$3.isTypedArray(value)) {
	      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
	    }

	    return value;
	  }

	  /**
	   * Default visitor.
	   *
	   * @param {*} value
	   * @param {String|Number} key
	   * @param {Array<String|Number>} path
	   * @this {FormData}
	   *
	   * @returns {boolean} return true to visit the each prop of the value recursively
	   */
	  function defaultVisitor(value, key, path) {
	    let arr = value;

	    if (value && !path && typeof value === 'object') {
	      if (utils$3.endsWith(key, '{}')) {
	        // eslint-disable-next-line no-param-reassign
	        key = metaTokens ? key : key.slice(0, -2);
	        // eslint-disable-next-line no-param-reassign
	        value = JSON.stringify(value);
	      } else if (
	        (utils$3.isArray(value) && isFlatArray(value)) ||
	        ((utils$3.isFileList(value) || utils$3.endsWith(key, '[]')) && (arr = utils$3.toArray(value))
	        )) {
	        // eslint-disable-next-line no-param-reassign
	        key = removeBrackets(key);

	        arr.forEach(function each(el, index) {
	          !(utils$3.isUndefined(el) || el === null) && formData.append(
	            // eslint-disable-next-line no-nested-ternary
	            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
	            convertValue(el)
	          );
	        });
	        return false;
	      }
	    }

	    if (isVisitable(value)) {
	      return true;
	    }

	    formData.append(renderKey(path, key, dots), convertValue(value));

	    return false;
	  }

	  const stack = [];

	  const exposedHelpers = Object.assign(predicates, {
	    defaultVisitor,
	    convertValue,
	    isVisitable
	  });

	  function build(value, path) {
	    if (utils$3.isUndefined(value)) return;

	    if (stack.indexOf(value) !== -1) {
	      throw Error('Circular reference detected in ' + path.join('.'));
	    }

	    stack.push(value);

	    utils$3.forEach(value, function each(el, key) {
	      const result = !(utils$3.isUndefined(el) || el === null) && visitor.call(
	        formData, el, utils$3.isString(key) ? key.trim() : key, path, exposedHelpers
	      );

	      if (result === true) {
	        build(el, path ? path.concat(key) : [key]);
	      }
	    });

	    stack.pop();
	  }

	  if (!utils$3.isObject(obj)) {
	    throw new TypeError('data must be an object');
	  }

	  build(obj);

	  return formData;
	}

	/**
	 * It encodes a string by replacing all characters that are not in the unreserved set with
	 * their percent-encoded equivalents
	 *
	 * @param {string} str - The string to encode.
	 *
	 * @returns {string} The encoded string.
	 */
	function encode$1(str) {
	  const charMap = {
	    '!': '%21',
	    "'": '%27',
	    '(': '%28',
	    ')': '%29',
	    '~': '%7E',
	    '%20': '+',
	    '%00': '\x00'
	  };
	  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
	    return charMap[match];
	  });
	}

	/**
	 * It takes a params object and converts it to a FormData object
	 *
	 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
	 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
	 *
	 * @returns {void}
	 */
	function AxiosURLSearchParams(params, options) {
	  this._pairs = [];

	  params && toFormData(params, this, options);
	}

	const prototype = AxiosURLSearchParams.prototype;

	prototype.append = function append(name, value) {
	  this._pairs.push([name, value]);
	};

	prototype.toString = function toString(encoder) {
	  const _encode = encoder ? function(value) {
	    return encoder.call(this, value, encode$1);
	  } : encode$1;

	  return this._pairs.map(function each(pair) {
	    return _encode(pair[0]) + '=' + _encode(pair[1]);
	  }, '').join('&');
	};

	/**
	 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
	 * URI encoded counterparts
	 *
	 * @param {string} val The value to be encoded.
	 *
	 * @returns {string} The encoded value.
	 */
	function encode(val) {
	  return encodeURIComponent(val).
	    replace(/%3A/gi, ':').
	    replace(/%24/g, '$').
	    replace(/%2C/gi, ',').
	    replace(/%20/g, '+').
	    replace(/%5B/gi, '[').
	    replace(/%5D/gi, ']');
	}

	/**
	 * Build a URL by appending params to the end
	 *
	 * @param {string} url The base of the url (e.g., http://www.google.com)
	 * @param {object} [params] The params to be appended
	 * @param {?object} options
	 *
	 * @returns {string} The formatted url
	 */
	function buildURL(url, params, options) {
	  /*eslint no-param-reassign:0*/
	  if (!params) {
	    return url;
	  }
	  
	  const _encode = options && options.encode || encode;

	  const serializeFn = options && options.serialize;

	  let serializedParams;

	  if (serializeFn) {
	    serializedParams = serializeFn(params, options);
	  } else {
	    serializedParams = utils$3.isURLSearchParams(params) ?
	      params.toString() :
	      new AxiosURLSearchParams(params, options).toString(_encode);
	  }

	  if (serializedParams) {
	    const hashmarkIndex = url.indexOf("#");

	    if (hashmarkIndex !== -1) {
	      url = url.slice(0, hashmarkIndex);
	    }
	    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
	  }

	  return url;
	}

	class InterceptorManager {
	  constructor() {
	    this.handlers = [];
	  }

	  /**
	   * Add a new interceptor to the stack
	   *
	   * @param {Function} fulfilled The function to handle `then` for a `Promise`
	   * @param {Function} rejected The function to handle `reject` for a `Promise`
	   *
	   * @return {Number} An ID used to remove interceptor later
	   */
	  use(fulfilled, rejected, options) {
	    this.handlers.push({
	      fulfilled,
	      rejected,
	      synchronous: options ? options.synchronous : false,
	      runWhen: options ? options.runWhen : null
	    });
	    return this.handlers.length - 1;
	  }

	  /**
	   * Remove an interceptor from the stack
	   *
	   * @param {Number} id The ID that was returned by `use`
	   *
	   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
	   */
	  eject(id) {
	    if (this.handlers[id]) {
	      this.handlers[id] = null;
	    }
	  }

	  /**
	   * Clear all interceptors from the stack
	   *
	   * @returns {void}
	   */
	  clear() {
	    if (this.handlers) {
	      this.handlers = [];
	    }
	  }

	  /**
	   * Iterate over all the registered interceptors
	   *
	   * This method is particularly useful for skipping over any
	   * interceptors that may have become `null` calling `eject`.
	   *
	   * @param {Function} fn The function to call for each interceptor
	   *
	   * @returns {void}
	   */
	  forEach(fn) {
	    utils$3.forEach(this.handlers, function forEachHandler(h) {
	      if (h !== null) {
	        fn(h);
	      }
	    });
	  }
	}

	var InterceptorManager$1 = InterceptorManager;

	var transitionalDefaults = {
	  silentJSONParsing: true,
	  forcedJSONParsing: true,
	  clarifyTimeoutError: false
	};

	var URLSearchParams$1 = typeof URLSearchParams !== 'undefined' ? URLSearchParams : AxiosURLSearchParams;

	var FormData$1 = typeof FormData !== 'undefined' ? FormData : null;

	var Blob$1 = typeof Blob !== 'undefined' ? Blob : null;

	var platform$1 = {
	  isBrowser: true,
	  classes: {
	    URLSearchParams: URLSearchParams$1,
	    FormData: FormData$1,
	    Blob: Blob$1
	  },
	  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
	};

	const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';

	/**
	 * Determine if we're running in a standard browser environment
	 *
	 * This allows axios to run in a web worker, and react-native.
	 * Both environments support XMLHttpRequest, but not fully standard globals.
	 *
	 * web workers:
	 *  typeof window -> undefined
	 *  typeof document -> undefined
	 *
	 * react-native:
	 *  navigator.product -> 'ReactNative'
	 * nativescript
	 *  navigator.product -> 'NativeScript' or 'NS'
	 *
	 * @returns {boolean}
	 */
	const hasStandardBrowserEnv = (
	  (product) => {
	    return hasBrowserEnv && ['ReactNative', 'NativeScript', 'NS'].indexOf(product) < 0
	  })(typeof navigator !== 'undefined' && navigator.product);

	/**
	 * Determine if we're running in a standard browser webWorker environment
	 *
	 * Although the `isStandardBrowserEnv` method indicates that
	 * `allows axios to run in a web worker`, the WebWorker will still be
	 * filtered out due to its judgment standard
	 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
	 * This leads to a problem when axios post `FormData` in webWorker
	 */
	const hasStandardBrowserWebWorkerEnv = (() => {
	  return (
	    typeof WorkerGlobalScope !== 'undefined' &&
	    // eslint-disable-next-line no-undef
	    self instanceof WorkerGlobalScope &&
	    typeof self.importScripts === 'function'
	  );
	})();

	const origin = hasBrowserEnv && window.location.href || 'http://localhost';

	var utils$2 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		hasBrowserEnv: hasBrowserEnv,
		hasStandardBrowserEnv: hasStandardBrowserEnv,
		hasStandardBrowserWebWorkerEnv: hasStandardBrowserWebWorkerEnv,
		origin: origin
	});

	var platform = {
	  ...utils$2,
	  ...platform$1
	};

	function toURLEncodedForm(data, options) {
	  return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
	    visitor: function(value, key, path, helpers) {
	      if (platform.isNode && utils$3.isBuffer(value)) {
	        this.append(key, value.toString('base64'));
	        return false;
	      }

	      return helpers.defaultVisitor.apply(this, arguments);
	    }
	  }, options));
	}

	/**
	 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
	 *
	 * @param {string} name - The name of the property to get.
	 *
	 * @returns An array of strings.
	 */
	function parsePropPath(name) {
	  // foo[x][y][z]
	  // foo.x.y.z
	  // foo-x-y-z
	  // foo x y z
	  return utils$3.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
	    return match[0] === '[]' ? '' : match[1] || match[0];
	  });
	}

	/**
	 * Convert an array to an object.
	 *
	 * @param {Array<any>} arr - The array to convert to an object.
	 *
	 * @returns An object with the same keys and values as the array.
	 */
	function arrayToObject(arr) {
	  const obj = {};
	  const keys = Object.keys(arr);
	  let i;
	  const len = keys.length;
	  let key;
	  for (i = 0; i < len; i++) {
	    key = keys[i];
	    obj[key] = arr[key];
	  }
	  return obj;
	}

	/**
	 * It takes a FormData object and returns a JavaScript object
	 *
	 * @param {string} formData The FormData object to convert to JSON.
	 *
	 * @returns {Object<string, any> | null} The converted object.
	 */
	function formDataToJSON(formData) {
	  function buildPath(path, value, target, index) {
	    let name = path[index++];

	    if (name === '__proto__') return true;

	    const isNumericKey = Number.isFinite(+name);
	    const isLast = index >= path.length;
	    name = !name && utils$3.isArray(target) ? target.length : name;

	    if (isLast) {
	      if (utils$3.hasOwnProp(target, name)) {
	        target[name] = [target[name], value];
	      } else {
	        target[name] = value;
	      }

	      return !isNumericKey;
	    }

	    if (!target[name] || !utils$3.isObject(target[name])) {
	      target[name] = [];
	    }

	    const result = buildPath(path, value, target[name], index);

	    if (result && utils$3.isArray(target[name])) {
	      target[name] = arrayToObject(target[name]);
	    }

	    return !isNumericKey;
	  }

	  if (utils$3.isFormData(formData) && utils$3.isFunction(formData.entries)) {
	    const obj = {};

	    utils$3.forEachEntry(formData, (name, value) => {
	      buildPath(parsePropPath(name), value, obj, 0);
	    });

	    return obj;
	  }

	  return null;
	}

	/**
	 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
	 * of the input
	 *
	 * @param {any} rawValue - The value to be stringified.
	 * @param {Function} parser - A function that parses a string into a JavaScript object.
	 * @param {Function} encoder - A function that takes a value and returns a string.
	 *
	 * @returns {string} A stringified version of the rawValue.
	 */
	function stringifySafely(rawValue, parser, encoder) {
	  if (utils$3.isString(rawValue)) {
	    try {
	      (parser || JSON.parse)(rawValue);
	      return utils$3.trim(rawValue);
	    } catch (e) {
	      if (e.name !== 'SyntaxError') {
	        throw e;
	      }
	    }
	  }

	  return (encoder || JSON.stringify)(rawValue);
	}

	const defaults = {

	  transitional: transitionalDefaults,

	  adapter: ['xhr', 'http', 'fetch'],

	  transformRequest: [function transformRequest(data, headers) {
	    const contentType = headers.getContentType() || '';
	    const hasJSONContentType = contentType.indexOf('application/json') > -1;
	    const isObjectPayload = utils$3.isObject(data);

	    if (isObjectPayload && utils$3.isHTMLForm(data)) {
	      data = new FormData(data);
	    }

	    const isFormData = utils$3.isFormData(data);

	    if (isFormData) {
	      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
	    }

	    if (utils$3.isArrayBuffer(data) ||
	      utils$3.isBuffer(data) ||
	      utils$3.isStream(data) ||
	      utils$3.isFile(data) ||
	      utils$3.isBlob(data) ||
	      utils$3.isReadableStream(data)
	    ) {
	      return data;
	    }
	    if (utils$3.isArrayBufferView(data)) {
	      return data.buffer;
	    }
	    if (utils$3.isURLSearchParams(data)) {
	      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
	      return data.toString();
	    }

	    let isFileList;

	    if (isObjectPayload) {
	      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
	        return toURLEncodedForm(data, this.formSerializer).toString();
	      }

	      if ((isFileList = utils$3.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
	        const _FormData = this.env && this.env.FormData;

	        return toFormData(
	          isFileList ? {'files[]': data} : data,
	          _FormData && new _FormData(),
	          this.formSerializer
	        );
	      }
	    }

	    if (isObjectPayload || hasJSONContentType ) {
	      headers.setContentType('application/json', false);
	      return stringifySafely(data);
	    }

	    return data;
	  }],

	  transformResponse: [function transformResponse(data) {
	    const transitional = this.transitional || defaults.transitional;
	    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
	    const JSONRequested = this.responseType === 'json';

	    if (utils$3.isResponse(data) || utils$3.isReadableStream(data)) {
	      return data;
	    }

	    if (data && utils$3.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
	      const silentJSONParsing = transitional && transitional.silentJSONParsing;
	      const strictJSONParsing = !silentJSONParsing && JSONRequested;

	      try {
	        return JSON.parse(data);
	      } catch (e) {
	        if (strictJSONParsing) {
	          if (e.name === 'SyntaxError') {
	            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
	          }
	          throw e;
	        }
	      }
	    }

	    return data;
	  }],

	  /**
	   * A timeout in milliseconds to abort a request. If set to 0 (default) a
	   * timeout is not created.
	   */
	  timeout: 0,

	  xsrfCookieName: 'XSRF-TOKEN',
	  xsrfHeaderName: 'X-XSRF-TOKEN',

	  maxContentLength: -1,
	  maxBodyLength: -1,

	  env: {
	    FormData: platform.classes.FormData,
	    Blob: platform.classes.Blob
	  },

	  validateStatus: function validateStatus(status) {
	    return status >= 200 && status < 300;
	  },

	  headers: {
	    common: {
	      'Accept': 'application/json, text/plain, */*',
	      'Content-Type': undefined
	    }
	  }
	};

	utils$3.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
	  defaults.headers[method] = {};
	});

	var defaults$1 = defaults;

	// RawAxiosHeaders whose duplicates are ignored by node
	// c.f. https://nodejs.org/api/http.html#http_message_headers
	const ignoreDuplicateOf = utils$3.toObjectSet([
	  'age', 'authorization', 'content-length', 'content-type', 'etag',
	  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
	  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
	  'referer', 'retry-after', 'user-agent'
	]);

	/**
	 * Parse headers into an object
	 *
	 * ```
	 * Date: Wed, 27 Aug 2014 08:58:49 GMT
	 * Content-Type: application/json
	 * Connection: keep-alive
	 * Transfer-Encoding: chunked
	 * ```
	 *
	 * @param {String} rawHeaders Headers needing to be parsed
	 *
	 * @returns {Object} Headers parsed into an object
	 */
	var parseHeaders = rawHeaders => {
	  const parsed = {};
	  let key;
	  let val;
	  let i;

	  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
	    i = line.indexOf(':');
	    key = line.substring(0, i).trim().toLowerCase();
	    val = line.substring(i + 1).trim();

	    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
	      return;
	    }

	    if (key === 'set-cookie') {
	      if (parsed[key]) {
	        parsed[key].push(val);
	      } else {
	        parsed[key] = [val];
	      }
	    } else {
	      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
	    }
	  });

	  return parsed;
	};

	const $internals = Symbol('internals');

	function normalizeHeader(header) {
	  return header && String(header).trim().toLowerCase();
	}

	function normalizeValue(value) {
	  if (value === false || value == null) {
	    return value;
	  }

	  return utils$3.isArray(value) ? value.map(normalizeValue) : String(value);
	}

	function parseTokens(str) {
	  const tokens = Object.create(null);
	  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
	  let match;

	  while ((match = tokensRE.exec(str))) {
	    tokens[match[1]] = match[2];
	  }

	  return tokens;
	}

	const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

	function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
	  if (utils$3.isFunction(filter)) {
	    return filter.call(this, value, header);
	  }

	  if (isHeaderNameFilter) {
	    value = header;
	  }

	  if (!utils$3.isString(value)) return;

	  if (utils$3.isString(filter)) {
	    return value.indexOf(filter) !== -1;
	  }

	  if (utils$3.isRegExp(filter)) {
	    return filter.test(value);
	  }
	}

	function formatHeader(header) {
	  return header.trim()
	    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
	      return char.toUpperCase() + str;
	    });
	}

	function buildAccessors(obj, header) {
	  const accessorName = utils$3.toCamelCase(' ' + header);

	  ['get', 'set', 'has'].forEach(methodName => {
	    Object.defineProperty(obj, methodName + accessorName, {
	      value: function(arg1, arg2, arg3) {
	        return this[methodName].call(this, header, arg1, arg2, arg3);
	      },
	      configurable: true
	    });
	  });
	}

	class AxiosHeaders {
	  constructor(headers) {
	    headers && this.set(headers);
	  }

	  set(header, valueOrRewrite, rewrite) {
	    const self = this;

	    function setHeader(_value, _header, _rewrite) {
	      const lHeader = normalizeHeader(_header);

	      if (!lHeader) {
	        throw new Error('header name must be a non-empty string');
	      }

	      const key = utils$3.findKey(self, lHeader);

	      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
	        self[key || _header] = normalizeValue(_value);
	      }
	    }

	    const setHeaders = (headers, _rewrite) =>
	      utils$3.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

	    if (utils$3.isPlainObject(header) || header instanceof this.constructor) {
	      setHeaders(header, valueOrRewrite);
	    } else if(utils$3.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
	      setHeaders(parseHeaders(header), valueOrRewrite);
	    } else if (utils$3.isHeaders(header)) {
	      for (const [key, value] of header.entries()) {
	        setHeader(value, key, rewrite);
	      }
	    } else {
	      header != null && setHeader(valueOrRewrite, header, rewrite);
	    }

	    return this;
	  }

	  get(header, parser) {
	    header = normalizeHeader(header);

	    if (header) {
	      const key = utils$3.findKey(this, header);

	      if (key) {
	        const value = this[key];

	        if (!parser) {
	          return value;
	        }

	        if (parser === true) {
	          return parseTokens(value);
	        }

	        if (utils$3.isFunction(parser)) {
	          return parser.call(this, value, key);
	        }

	        if (utils$3.isRegExp(parser)) {
	          return parser.exec(value);
	        }

	        throw new TypeError('parser must be boolean|regexp|function');
	      }
	    }
	  }

	  has(header, matcher) {
	    header = normalizeHeader(header);

	    if (header) {
	      const key = utils$3.findKey(this, header);

	      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
	    }

	    return false;
	  }

	  delete(header, matcher) {
	    const self = this;
	    let deleted = false;

	    function deleteHeader(_header) {
	      _header = normalizeHeader(_header);

	      if (_header) {
	        const key = utils$3.findKey(self, _header);

	        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
	          delete self[key];

	          deleted = true;
	        }
	      }
	    }

	    if (utils$3.isArray(header)) {
	      header.forEach(deleteHeader);
	    } else {
	      deleteHeader(header);
	    }

	    return deleted;
	  }

	  clear(matcher) {
	    const keys = Object.keys(this);
	    let i = keys.length;
	    let deleted = false;

	    while (i--) {
	      const key = keys[i];
	      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
	        delete this[key];
	        deleted = true;
	      }
	    }

	    return deleted;
	  }

	  normalize(format) {
	    const self = this;
	    const headers = {};

	    utils$3.forEach(this, (value, header) => {
	      const key = utils$3.findKey(headers, header);

	      if (key) {
	        self[key] = normalizeValue(value);
	        delete self[header];
	        return;
	      }

	      const normalized = format ? formatHeader(header) : String(header).trim();

	      if (normalized !== header) {
	        delete self[header];
	      }

	      self[normalized] = normalizeValue(value);

	      headers[normalized] = true;
	    });

	    return this;
	  }

	  concat(...targets) {
	    return this.constructor.concat(this, ...targets);
	  }

	  toJSON(asStrings) {
	    const obj = Object.create(null);

	    utils$3.forEach(this, (value, header) => {
	      value != null && value !== false && (obj[header] = asStrings && utils$3.isArray(value) ? value.join(', ') : value);
	    });

	    return obj;
	  }

	  [Symbol.iterator]() {
	    return Object.entries(this.toJSON())[Symbol.iterator]();
	  }

	  toString() {
	    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
	  }

	  get [Symbol.toStringTag]() {
	    return 'AxiosHeaders';
	  }

	  static from(thing) {
	    return thing instanceof this ? thing : new this(thing);
	  }

	  static concat(first, ...targets) {
	    const computed = new this(first);

	    targets.forEach((target) => computed.set(target));

	    return computed;
	  }

	  static accessor(header) {
	    const internals = this[$internals] = (this[$internals] = {
	      accessors: {}
	    });

	    const accessors = internals.accessors;
	    const prototype = this.prototype;

	    function defineAccessor(_header) {
	      const lHeader = normalizeHeader(_header);

	      if (!accessors[lHeader]) {
	        buildAccessors(prototype, _header);
	        accessors[lHeader] = true;
	      }
	    }

	    utils$3.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

	    return this;
	  }
	}

	AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

	// reserved names hotfix
	utils$3.reduceDescriptors(AxiosHeaders.prototype, ({value}, key) => {
	  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
	  return {
	    get: () => value,
	    set(headerValue) {
	      this[mapped] = headerValue;
	    }
	  }
	});

	utils$3.freezeMethods(AxiosHeaders);

	var AxiosHeaders$1 = AxiosHeaders;

	/**
	 * Transform the data for a request or a response
	 *
	 * @param {Array|Function} fns A single function or Array of functions
	 * @param {?Object} response The response object
	 *
	 * @returns {*} The resulting transformed data
	 */
	function transformData(fns, response) {
	  const config = this || defaults$1;
	  const context = response || config;
	  const headers = AxiosHeaders$1.from(context.headers);
	  let data = context.data;

	  utils$3.forEach(fns, function transform(fn) {
	    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
	  });

	  headers.normalize();

	  return data;
	}

	function isCancel(value) {
	  return !!(value && value.__CANCEL__);
	}

	/**
	 * A `CanceledError` is an object that is thrown when an operation is canceled.
	 *
	 * @param {string=} message The message.
	 * @param {Object=} config The config.
	 * @param {Object=} request The request.
	 *
	 * @returns {CanceledError} The created error.
	 */
	function CanceledError(message, config, request) {
	  // eslint-disable-next-line no-eq-null,eqeqeq
	  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED, config, request);
	  this.name = 'CanceledError';
	}

	utils$3.inherits(CanceledError, AxiosError, {
	  __CANCEL__: true
	});

	/**
	 * Resolve or reject a Promise based on response status.
	 *
	 * @param {Function} resolve A function that resolves the promise.
	 * @param {Function} reject A function that rejects the promise.
	 * @param {object} response The response.
	 *
	 * @returns {object} The response.
	 */
	function settle(resolve, reject, response) {
	  const validateStatus = response.config.validateStatus;
	  if (!response.status || !validateStatus || validateStatus(response.status)) {
	    resolve(response);
	  } else {
	    reject(new AxiosError(
	      'Request failed with status code ' + response.status,
	      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
	      response.config,
	      response.request,
	      response
	    ));
	  }
	}

	function parseProtocol(url) {
	  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
	  return match && match[1] || '';
	}

	/**
	 * Calculate data maxRate
	 * @param {Number} [samplesCount= 10]
	 * @param {Number} [min= 1000]
	 * @returns {Function}
	 */
	function speedometer(samplesCount, min) {
	  samplesCount = samplesCount || 10;
	  const bytes = new Array(samplesCount);
	  const timestamps = new Array(samplesCount);
	  let head = 0;
	  let tail = 0;
	  let firstSampleTS;

	  min = min !== undefined ? min : 1000;

	  return function push(chunkLength) {
	    const now = Date.now();

	    const startedAt = timestamps[tail];

	    if (!firstSampleTS) {
	      firstSampleTS = now;
	    }

	    bytes[head] = chunkLength;
	    timestamps[head] = now;

	    let i = tail;
	    let bytesCount = 0;

	    while (i !== head) {
	      bytesCount += bytes[i++];
	      i = i % samplesCount;
	    }

	    head = (head + 1) % samplesCount;

	    if (head === tail) {
	      tail = (tail + 1) % samplesCount;
	    }

	    if (now - firstSampleTS < min) {
	      return;
	    }

	    const passed = startedAt && now - startedAt;

	    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
	  };
	}

	/**
	 * Throttle decorator
	 * @param {Function} fn
	 * @param {Number} freq
	 * @return {Function}
	 */
	function throttle(fn, freq) {
	  let timestamp = 0;
	  const threshold = 1000 / freq;
	  let timer = null;
	  return function throttled() {
	    const force = this === true;

	    const now = Date.now();
	    if (force || now - timestamp > threshold) {
	      if (timer) {
	        clearTimeout(timer);
	        timer = null;
	      }
	      timestamp = now;
	      return fn.apply(null, arguments);
	    }
	    if (!timer) {
	      timer = setTimeout(() => {
	        timer = null;
	        timestamp = Date.now();
	        return fn.apply(null, arguments);
	      }, threshold - (now - timestamp));
	    }
	  };
	}

	var progressEventReducer = (listener, isDownloadStream, freq = 3) => {
	  let bytesNotified = 0;
	  const _speedometer = speedometer(50, 250);

	  return throttle(e => {
	    const loaded = e.loaded;
	    const total = e.lengthComputable ? e.total : undefined;
	    const progressBytes = loaded - bytesNotified;
	    const rate = _speedometer(progressBytes);
	    const inRange = loaded <= total;

	    bytesNotified = loaded;

	    const data = {
	      loaded,
	      total,
	      progress: total ? (loaded / total) : undefined,
	      bytes: progressBytes,
	      rate: rate ? rate : undefined,
	      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
	      event: e,
	      lengthComputable: total != null
	    };

	    data[isDownloadStream ? 'download' : 'upload'] = true;

	    listener(data);
	  }, freq);
	};

	var isURLSameOrigin = platform.hasStandardBrowserEnv ?

	// Standard browser envs have full support of the APIs needed to test
	// whether the request URL is of the same origin as current location.
	  (function standardBrowserEnv() {
	    const msie = /(msie|trident)/i.test(navigator.userAgent);
	    const urlParsingNode = document.createElement('a');
	    let originURL;

	    /**
	    * Parse a URL to discover its components
	    *
	    * @param {String} url The URL to be parsed
	    * @returns {Object}
	    */
	    function resolveURL(url) {
	      let href = url;

	      if (msie) {
	        // IE needs attribute set twice to normalize properties
	        urlParsingNode.setAttribute('href', href);
	        href = urlParsingNode.href;
	      }

	      urlParsingNode.setAttribute('href', href);

	      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
	      return {
	        href: urlParsingNode.href,
	        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
	        host: urlParsingNode.host,
	        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
	        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
	        hostname: urlParsingNode.hostname,
	        port: urlParsingNode.port,
	        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
	          urlParsingNode.pathname :
	          '/' + urlParsingNode.pathname
	      };
	    }

	    originURL = resolveURL(window.location.href);

	    /**
	    * Determine if a URL shares the same origin as the current location
	    *
	    * @param {String} requestURL The URL to test
	    * @returns {boolean} True if URL shares the same origin, otherwise false
	    */
	    return function isURLSameOrigin(requestURL) {
	      const parsed = (utils$3.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
	      return (parsed.protocol === originURL.protocol &&
	          parsed.host === originURL.host);
	    };
	  })() :

	  // Non standard browser envs (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return function isURLSameOrigin() {
	      return true;
	    };
	  })();

	var cookies = platform.hasStandardBrowserEnv ?

	  // Standard browser envs support document.cookie
	  {
	    write(name, value, expires, path, domain, secure) {
	      const cookie = [name + '=' + encodeURIComponent(value)];

	      utils$3.isNumber(expires) && cookie.push('expires=' + new Date(expires).toGMTString());

	      utils$3.isString(path) && cookie.push('path=' + path);

	      utils$3.isString(domain) && cookie.push('domain=' + domain);

	      secure === true && cookie.push('secure');

	      document.cookie = cookie.join('; ');
	    },

	    read(name) {
	      const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
	      return (match ? decodeURIComponent(match[3]) : null);
	    },

	    remove(name) {
	      this.write(name, '', Date.now() - 86400000);
	    }
	  }

	  :

	  // Non-standard browser env (web workers, react-native) lack needed support.
	  {
	    write() {},
	    read() {
	      return null;
	    },
	    remove() {}
	  };

	/**
	 * Determines whether the specified URL is absolute
	 *
	 * @param {string} url The URL to test
	 *
	 * @returns {boolean} True if the specified URL is absolute, otherwise false
	 */
	function isAbsoluteURL(url) {
	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
	  // by any combination of letters, digits, plus, period, or hyphen.
	  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
	}

	/**
	 * Creates a new URL by combining the specified URLs
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} relativeURL The relative URL
	 *
	 * @returns {string} The combined URL
	 */
	function combineURLs(baseURL, relativeURL) {
	  return relativeURL
	    ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '')
	    : baseURL;
	}

	/**
	 * Creates a new URL by combining the baseURL with the requestedURL,
	 * only when the requestedURL is not already an absolute URL.
	 * If the requestURL is absolute, this function returns the requestedURL untouched.
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} requestedURL Absolute or relative URL to combine
	 *
	 * @returns {string} The combined full path
	 */
	function buildFullPath(baseURL, requestedURL) {
	  if (baseURL && !isAbsoluteURL(requestedURL)) {
	    return combineURLs(baseURL, requestedURL);
	  }
	  return requestedURL;
	}

	const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? { ...thing } : thing;

	/**
	 * Config-specific merge-function which creates a new config-object
	 * by merging two configuration objects together.
	 *
	 * @param {Object} config1
	 * @param {Object} config2
	 *
	 * @returns {Object} New object resulting from merging config2 to config1
	 */
	function mergeConfig(config1, config2) {
	  // eslint-disable-next-line no-param-reassign
	  config2 = config2 || {};
	  const config = {};

	  function getMergedValue(target, source, caseless) {
	    if (utils$3.isPlainObject(target) && utils$3.isPlainObject(source)) {
	      return utils$3.merge.call({caseless}, target, source);
	    } else if (utils$3.isPlainObject(source)) {
	      return utils$3.merge({}, source);
	    } else if (utils$3.isArray(source)) {
	      return source.slice();
	    }
	    return source;
	  }

	  // eslint-disable-next-line consistent-return
	  function mergeDeepProperties(a, b, caseless) {
	    if (!utils$3.isUndefined(b)) {
	      return getMergedValue(a, b, caseless);
	    } else if (!utils$3.isUndefined(a)) {
	      return getMergedValue(undefined, a, caseless);
	    }
	  }

	  // eslint-disable-next-line consistent-return
	  function valueFromConfig2(a, b) {
	    if (!utils$3.isUndefined(b)) {
	      return getMergedValue(undefined, b);
	    }
	  }

	  // eslint-disable-next-line consistent-return
	  function defaultToConfig2(a, b) {
	    if (!utils$3.isUndefined(b)) {
	      return getMergedValue(undefined, b);
	    } else if (!utils$3.isUndefined(a)) {
	      return getMergedValue(undefined, a);
	    }
	  }

	  // eslint-disable-next-line consistent-return
	  function mergeDirectKeys(a, b, prop) {
	    if (prop in config2) {
	      return getMergedValue(a, b);
	    } else if (prop in config1) {
	      return getMergedValue(undefined, a);
	    }
	  }

	  const mergeMap = {
	    url: valueFromConfig2,
	    method: valueFromConfig2,
	    data: valueFromConfig2,
	    baseURL: defaultToConfig2,
	    transformRequest: defaultToConfig2,
	    transformResponse: defaultToConfig2,
	    paramsSerializer: defaultToConfig2,
	    timeout: defaultToConfig2,
	    timeoutMessage: defaultToConfig2,
	    withCredentials: defaultToConfig2,
	    withXSRFToken: defaultToConfig2,
	    adapter: defaultToConfig2,
	    responseType: defaultToConfig2,
	    xsrfCookieName: defaultToConfig2,
	    xsrfHeaderName: defaultToConfig2,
	    onUploadProgress: defaultToConfig2,
	    onDownloadProgress: defaultToConfig2,
	    decompress: defaultToConfig2,
	    maxContentLength: defaultToConfig2,
	    maxBodyLength: defaultToConfig2,
	    beforeRedirect: defaultToConfig2,
	    transport: defaultToConfig2,
	    httpAgent: defaultToConfig2,
	    httpsAgent: defaultToConfig2,
	    cancelToken: defaultToConfig2,
	    socketPath: defaultToConfig2,
	    responseEncoding: defaultToConfig2,
	    validateStatus: mergeDirectKeys,
	    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
	  };

	  utils$3.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
	    const merge = mergeMap[prop] || mergeDeepProperties;
	    const configValue = merge(config1[prop], config2[prop], prop);
	    (utils$3.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
	  });

	  return config;
	}

	var resolveConfig = (config) => {
	  const newConfig = mergeConfig({}, config);

	  let {data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth} = newConfig;

	  newConfig.headers = headers = AxiosHeaders$1.from(headers);

	  newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url), config.params, config.paramsSerializer);

	  // HTTP basic authentication
	  if (auth) {
	    headers.set('Authorization', 'Basic ' +
	      btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : ''))
	    );
	  }

	  let contentType;

	  if (utils$3.isFormData(data)) {
	    if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
	      headers.setContentType(undefined); // Let the browser set it
	    } else if ((contentType = headers.getContentType()) !== false) {
	      // fix semicolon duplication issue for ReactNative FormData implementation
	      const [type, ...tokens] = contentType ? contentType.split(';').map(token => token.trim()).filter(Boolean) : [];
	      headers.setContentType([type || 'multipart/form-data', ...tokens].join('; '));
	    }
	  }

	  // Add xsrf header
	  // This is only done if running in a standard browser environment.
	  // Specifically not if we're in a web worker, or react-native.

	  if (platform.hasStandardBrowserEnv) {
	    withXSRFToken && utils$3.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));

	    if (withXSRFToken || (withXSRFToken !== false && isURLSameOrigin(newConfig.url))) {
	      // Add xsrf header
	      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);

	      if (xsrfValue) {
	        headers.set(xsrfHeaderName, xsrfValue);
	      }
	    }
	  }

	  return newConfig;
	};

	const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

	var xhrAdapter = isXHRAdapterSupported && function (config) {
	  return new Promise(function dispatchXhrRequest(resolve, reject) {
	    const _config = resolveConfig(config);
	    let requestData = _config.data;
	    const requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
	    let {responseType} = _config;
	    let onCanceled;
	    function done() {
	      if (_config.cancelToken) {
	        _config.cancelToken.unsubscribe(onCanceled);
	      }

	      if (_config.signal) {
	        _config.signal.removeEventListener('abort', onCanceled);
	      }
	    }

	    let request = new XMLHttpRequest();

	    request.open(_config.method.toUpperCase(), _config.url, true);

	    // Set the request timeout in MS
	    request.timeout = _config.timeout;

	    function onloadend() {
	      if (!request) {
	        return;
	      }
	      // Prepare the response
	      const responseHeaders = AxiosHeaders$1.from(
	        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
	      );
	      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
	        request.responseText : request.response;
	      const response = {
	        data: responseData,
	        status: request.status,
	        statusText: request.statusText,
	        headers: responseHeaders,
	        config,
	        request
	      };

	      settle(function _resolve(value) {
	        resolve(value);
	        done();
	      }, function _reject(err) {
	        reject(err);
	        done();
	      }, response);

	      // Clean up request
	      request = null;
	    }

	    if ('onloadend' in request) {
	      // Use onloadend if available
	      request.onloadend = onloadend;
	    } else {
	      // Listen for ready state to emulate onloadend
	      request.onreadystatechange = function handleLoad() {
	        if (!request || request.readyState !== 4) {
	          return;
	        }

	        // The request errored out and we didn't get a response, this will be
	        // handled by onerror instead
	        // With one exception: request that using file: protocol, most browsers
	        // will return status as 0 even though it's a successful request
	        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
	          return;
	        }
	        // readystate handler is calling before onerror or ontimeout handlers,
	        // so we should call onloadend on the next 'tick'
	        setTimeout(onloadend);
	      };
	    }

	    // Handle browser request cancellation (as opposed to a manual cancellation)
	    request.onabort = function handleAbort() {
	      if (!request) {
	        return;
	      }

	      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, _config, request));

	      // Clean up request
	      request = null;
	    };

	    // Handle low level network errors
	    request.onerror = function handleError() {
	      // Real errors are hidden from us by the browser
	      // onerror should only fire if it's a network error
	      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, _config, request));

	      // Clean up request
	      request = null;
	    };

	    // Handle timeout
	    request.ontimeout = function handleTimeout() {
	      let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
	      const transitional = _config.transitional || transitionalDefaults;
	      if (_config.timeoutErrorMessage) {
	        timeoutErrorMessage = _config.timeoutErrorMessage;
	      }
	      reject(new AxiosError(
	        timeoutErrorMessage,
	        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
	        _config,
	        request));

	      // Clean up request
	      request = null;
	    };

	    // Remove Content-Type if data is undefined
	    requestData === undefined && requestHeaders.setContentType(null);

	    // Add headers to the request
	    if ('setRequestHeader' in request) {
	      utils$3.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
	        request.setRequestHeader(key, val);
	      });
	    }

	    // Add withCredentials to request if needed
	    if (!utils$3.isUndefined(_config.withCredentials)) {
	      request.withCredentials = !!_config.withCredentials;
	    }

	    // Add responseType to request if needed
	    if (responseType && responseType !== 'json') {
	      request.responseType = _config.responseType;
	    }

	    // Handle progress if needed
	    if (typeof _config.onDownloadProgress === 'function') {
	      request.addEventListener('progress', progressEventReducer(_config.onDownloadProgress, true));
	    }

	    // Not all browsers support upload events
	    if (typeof _config.onUploadProgress === 'function' && request.upload) {
	      request.upload.addEventListener('progress', progressEventReducer(_config.onUploadProgress));
	    }

	    if (_config.cancelToken || _config.signal) {
	      // Handle cancellation
	      // eslint-disable-next-line func-names
	      onCanceled = cancel => {
	        if (!request) {
	          return;
	        }
	        reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
	        request.abort();
	        request = null;
	      };

	      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
	      if (_config.signal) {
	        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
	      }
	    }

	    const protocol = parseProtocol(_config.url);

	    if (protocol && platform.protocols.indexOf(protocol) === -1) {
	      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
	      return;
	    }


	    // Send the request
	    request.send(requestData || null);
	  });
	};

	const composeSignals = (signals, timeout) => {
	  let controller = new AbortController();

	  let aborted;

	  const onabort = function (cancel) {
	    if (!aborted) {
	      aborted = true;
	      unsubscribe();
	      const err = cancel instanceof Error ? cancel : this.reason;
	      controller.abort(err instanceof AxiosError ? err : new CanceledError(err instanceof Error ? err.message : err));
	    }
	  };

	  let timer = timeout && setTimeout(() => {
	    onabort(new AxiosError(`timeout ${timeout} of ms exceeded`, AxiosError.ETIMEDOUT));
	  }, timeout);

	  const unsubscribe = () => {
	    if (signals) {
	      timer && clearTimeout(timer);
	      timer = null;
	      signals.forEach(signal => {
	        signal &&
	        (signal.removeEventListener ? signal.removeEventListener('abort', onabort) : signal.unsubscribe(onabort));
	      });
	      signals = null;
	    }
	  };

	  signals.forEach((signal) => signal && signal.addEventListener && signal.addEventListener('abort', onabort));

	  const {signal} = controller;

	  signal.unsubscribe = unsubscribe;

	  return [signal, () => {
	    timer && clearTimeout(timer);
	    timer = null;
	  }];
	};

	var composeSignals$1 = composeSignals;

	const streamChunk = function* (chunk, chunkSize) {
	  let len = chunk.byteLength;

	  if (!chunkSize || len < chunkSize) {
	    yield chunk;
	    return;
	  }

	  let pos = 0;
	  let end;

	  while (pos < len) {
	    end = pos + chunkSize;
	    yield chunk.slice(pos, end);
	    pos = end;
	  }
	};

	const readBytes = async function* (iterable, chunkSize, encode) {
	  for await (const chunk of iterable) {
	    yield* streamChunk(ArrayBuffer.isView(chunk) ? chunk : (await encode(String(chunk))), chunkSize);
	  }
	};

	const trackStream = (stream, chunkSize, onProgress, onFinish, encode) => {
	  const iterator = readBytes(stream, chunkSize, encode);

	  let bytes = 0;

	  return new ReadableStream({
	    type: 'bytes',

	    async pull(controller) {
	      const {done, value} = await iterator.next();

	      if (done) {
	        controller.close();
	        onFinish();
	        return;
	      }

	      let len = value.byteLength;
	      onProgress && onProgress(bytes += len);
	      controller.enqueue(new Uint8Array(value));
	    },
	    cancel(reason) {
	      onFinish(reason);
	      return iterator.return();
	    }
	  }, {
	    highWaterMark: 2
	  })
	};

	const fetchProgressDecorator = (total, fn) => {
	  const lengthComputable = total != null;
	  return (loaded) => setTimeout(() => fn({
	    lengthComputable,
	    total,
	    loaded
	  }));
	};

	const isFetchSupported = typeof fetch === 'function' && typeof Request === 'function' && typeof Response === 'function';
	const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === 'function';

	// used only inside the fetch adapter
	const encodeText = isFetchSupported && (typeof TextEncoder === 'function' ?
	    ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) :
	    async (str) => new Uint8Array(await new Response(str).arrayBuffer())
	);

	const supportsRequestStream = isReadableStreamSupported && (() => {
	  let duplexAccessed = false;

	  const hasContentType = new Request(platform.origin, {
	    body: new ReadableStream(),
	    method: 'POST',
	    get duplex() {
	      duplexAccessed = true;
	      return 'half';
	    },
	  }).headers.has('Content-Type');

	  return duplexAccessed && !hasContentType;
	})();

	const DEFAULT_CHUNK_SIZE = 64 * 1024;

	const supportsResponseStream = isReadableStreamSupported && !!(()=> {
	  try {
	    return utils$3.isReadableStream(new Response('').body);
	  } catch(err) {
	    // return undefined
	  }
	})();

	const resolvers = {
	  stream: supportsResponseStream && ((res) => res.body)
	};

	isFetchSupported && (((res) => {
	  ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(type => {
	    !resolvers[type] && (resolvers[type] = utils$3.isFunction(res[type]) ? (res) => res[type]() :
	      (_, config) => {
	        throw new AxiosError(`Response type '${type}' is not supported`, AxiosError.ERR_NOT_SUPPORT, config);
	      });
	  });
	})(new Response));

	const getBodyLength = async (body) => {
	  if (body == null) {
	    return 0;
	  }

	  if(utils$3.isBlob(body)) {
	    return body.size;
	  }

	  if(utils$3.isSpecCompliantForm(body)) {
	    return (await new Request(body).arrayBuffer()).byteLength;
	  }

	  if(utils$3.isArrayBufferView(body)) {
	    return body.byteLength;
	  }

	  if(utils$3.isURLSearchParams(body)) {
	    body = body + '';
	  }

	  if(utils$3.isString(body)) {
	    return (await encodeText(body)).byteLength;
	  }
	};

	const resolveBodyLength = async (headers, body) => {
	  const length = utils$3.toFiniteNumber(headers.getContentLength());

	  return length == null ? getBodyLength(body) : length;
	};

	var fetchAdapter = isFetchSupported && (async (config) => {
	  let {
	    url,
	    method,
	    data,
	    signal,
	    cancelToken,
	    timeout,
	    onDownloadProgress,
	    onUploadProgress,
	    responseType,
	    headers,
	    withCredentials = 'same-origin',
	    fetchOptions
	  } = resolveConfig(config);

	  responseType = responseType ? (responseType + '').toLowerCase() : 'text';

	  let [composedSignal, stopTimeout] = (signal || cancelToken || timeout) ?
	    composeSignals$1([signal, cancelToken], timeout) : [];

	  let finished, request;

	  const onFinish = () => {
	    !finished && setTimeout(() => {
	      composedSignal && composedSignal.unsubscribe();
	    });

	    finished = true;
	  };

	  let requestContentLength;

	  try {
	    if (
	      onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head' &&
	      (requestContentLength = await resolveBodyLength(headers, data)) !== 0
	    ) {
	      let _request = new Request(url, {
	        method: 'POST',
	        body: data,
	        duplex: "half"
	      });

	      let contentTypeHeader;

	      if (utils$3.isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
	        headers.setContentType(contentTypeHeader);
	      }

	      if (_request.body) {
	        data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, fetchProgressDecorator(
	          requestContentLength,
	          progressEventReducer(onUploadProgress)
	        ), null, encodeText);
	      }
	    }

	    if (!utils$3.isString(withCredentials)) {
	      withCredentials = withCredentials ? 'cors' : 'omit';
	    }

	    request = new Request(url, {
	      ...fetchOptions,
	      signal: composedSignal,
	      method: method.toUpperCase(),
	      headers: headers.normalize().toJSON(),
	      body: data,
	      duplex: "half",
	      withCredentials
	    });

	    let response = await fetch(request);

	    const isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');

	    if (supportsResponseStream && (onDownloadProgress || isStreamResponse)) {
	      const options = {};

	      ['status', 'statusText', 'headers'].forEach(prop => {
	        options[prop] = response[prop];
	      });

	      const responseContentLength = utils$3.toFiniteNumber(response.headers.get('content-length'));

	      response = new Response(
	        trackStream(response.body, DEFAULT_CHUNK_SIZE, onDownloadProgress && fetchProgressDecorator(
	          responseContentLength,
	          progressEventReducer(onDownloadProgress, true)
	        ), isStreamResponse && onFinish, encodeText),
	        options
	      );
	    }

	    responseType = responseType || 'text';

	    let responseData = await resolvers[utils$3.findKey(resolvers, responseType) || 'text'](response, config);

	    !isStreamResponse && onFinish();

	    stopTimeout && stopTimeout();

	    return await new Promise((resolve, reject) => {
	      settle(resolve, reject, {
	        data: responseData,
	        headers: AxiosHeaders$1.from(response.headers),
	        status: response.status,
	        statusText: response.statusText,
	        config,
	        request
	      });
	    })
	  } catch (err) {
	    onFinish();

	    if (err && err.name === 'TypeError' && /fetch/i.test(err.message)) {
	      throw Object.assign(
	        new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request),
	        {
	          cause: err.cause || err
	        }
	      )
	    }

	    throw AxiosError.from(err, err && err.code, config, request);
	  }
	});

	const knownAdapters = {
	  http: httpAdapter,
	  xhr: xhrAdapter,
	  fetch: fetchAdapter
	};

	utils$3.forEach(knownAdapters, (fn, value) => {
	  if (fn) {
	    try {
	      Object.defineProperty(fn, 'name', {value});
	    } catch (e) {
	      // eslint-disable-next-line no-empty
	    }
	    Object.defineProperty(fn, 'adapterName', {value});
	  }
	});

	const renderReason = (reason) => `- ${reason}`;

	const isResolvedHandle = (adapter) => utils$3.isFunction(adapter) || adapter === null || adapter === false;

	var adapters = {
	  getAdapter: (adapters) => {
	    adapters = utils$3.isArray(adapters) ? adapters : [adapters];

	    const {length} = adapters;
	    let nameOrAdapter;
	    let adapter;

	    const rejectedReasons = {};

	    for (let i = 0; i < length; i++) {
	      nameOrAdapter = adapters[i];
	      let id;

	      adapter = nameOrAdapter;

	      if (!isResolvedHandle(nameOrAdapter)) {
	        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

	        if (adapter === undefined) {
	          throw new AxiosError(`Unknown adapter '${id}'`);
	        }
	      }

	      if (adapter) {
	        break;
	      }

	      rejectedReasons[id || '#' + i] = adapter;
	    }

	    if (!adapter) {

	      const reasons = Object.entries(rejectedReasons)
	        .map(([id, state]) => `adapter ${id} ` +
	          (state === false ? 'is not supported by the environment' : 'is not available in the build')
	        );

	      let s = length ?
	        (reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0])) :
	        'as no adapter specified';

	      throw new AxiosError(
	        `There is no suitable adapter to dispatch the request ` + s,
	        'ERR_NOT_SUPPORT'
	      );
	    }

	    return adapter;
	  },
	  adapters: knownAdapters
	};

	/**
	 * Throws a `CanceledError` if cancellation has been requested.
	 *
	 * @param {Object} config The config that is to be used for the request
	 *
	 * @returns {void}
	 */
	function throwIfCancellationRequested(config) {
	  if (config.cancelToken) {
	    config.cancelToken.throwIfRequested();
	  }

	  if (config.signal && config.signal.aborted) {
	    throw new CanceledError(null, config);
	  }
	}

	/**
	 * Dispatch a request to the server using the configured adapter.
	 *
	 * @param {object} config The config that is to be used for the request
	 *
	 * @returns {Promise} The Promise to be fulfilled
	 */
	function dispatchRequest(config) {
	  throwIfCancellationRequested(config);

	  config.headers = AxiosHeaders$1.from(config.headers);

	  // Transform request data
	  config.data = transformData.call(
	    config,
	    config.transformRequest
	  );

	  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
	    config.headers.setContentType('application/x-www-form-urlencoded', false);
	  }

	  const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter);

	  return adapter(config).then(function onAdapterResolution(response) {
	    throwIfCancellationRequested(config);

	    // Transform response data
	    response.data = transformData.call(
	      config,
	      config.transformResponse,
	      response
	    );

	    response.headers = AxiosHeaders$1.from(response.headers);

	    return response;
	  }, function onAdapterRejection(reason) {
	    if (!isCancel(reason)) {
	      throwIfCancellationRequested(config);

	      // Transform response data
	      if (reason && reason.response) {
	        reason.response.data = transformData.call(
	          config,
	          config.transformResponse,
	          reason.response
	        );
	        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
	      }
	    }

	    return Promise.reject(reason);
	  });
	}

	const VERSION = "1.7.2";

	const validators$1 = {};

	// eslint-disable-next-line func-names
	['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
	  validators$1[type] = function validator(thing) {
	    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
	  };
	});

	const deprecatedWarnings = {};

	/**
	 * Transitional option validator
	 *
	 * @param {function|boolean?} validator - set to false if the transitional option has been removed
	 * @param {string?} version - deprecated version / removed since version
	 * @param {string?} message - some message with additional info
	 *
	 * @returns {function}
	 */
	validators$1.transitional = function transitional(validator, version, message) {
	  function formatMessage(opt, desc) {
	    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
	  }

	  // eslint-disable-next-line func-names
	  return (value, opt, opts) => {
	    if (validator === false) {
	      throw new AxiosError(
	        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
	        AxiosError.ERR_DEPRECATED
	      );
	    }

	    if (version && !deprecatedWarnings[opt]) {
	      deprecatedWarnings[opt] = true;
	      // eslint-disable-next-line no-console
	      console.warn(
	        formatMessage(
	          opt,
	          ' has been deprecated since v' + version + ' and will be removed in the near future'
	        )
	      );
	    }

	    return validator ? validator(value, opt, opts) : true;
	  };
	};

	/**
	 * Assert object's properties type
	 *
	 * @param {object} options
	 * @param {object} schema
	 * @param {boolean?} allowUnknown
	 *
	 * @returns {object}
	 */

	function assertOptions(options, schema, allowUnknown) {
	  if (typeof options !== 'object') {
	    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
	  }
	  const keys = Object.keys(options);
	  let i = keys.length;
	  while (i-- > 0) {
	    const opt = keys[i];
	    const validator = schema[opt];
	    if (validator) {
	      const value = options[opt];
	      const result = value === undefined || validator(value, opt, options);
	      if (result !== true) {
	        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
	      }
	      continue;
	    }
	    if (allowUnknown !== true) {
	      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
	    }
	  }
	}

	var validator = {
	  assertOptions,
	  validators: validators$1
	};

	const validators = validator.validators;

	/**
	 * Create a new instance of Axios
	 *
	 * @param {Object} instanceConfig The default config for the instance
	 *
	 * @return {Axios} A new instance of Axios
	 */
	class Axios {
	  constructor(instanceConfig) {
	    this.defaults = instanceConfig;
	    this.interceptors = {
	      request: new InterceptorManager$1(),
	      response: new InterceptorManager$1()
	    };
	  }

	  /**
	   * Dispatch a request
	   *
	   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
	   * @param {?Object} config
	   *
	   * @returns {Promise} The Promise to be fulfilled
	   */
	  async request(configOrUrl, config) {
	    try {
	      return await this._request(configOrUrl, config);
	    } catch (err) {
	      if (err instanceof Error) {
	        let dummy;

	        Error.captureStackTrace ? Error.captureStackTrace(dummy = {}) : (dummy = new Error());

	        // slice off the Error: ... line
	        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
	        try {
	          if (!err.stack) {
	            err.stack = stack;
	            // match without the 2 top stack lines
	          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
	            err.stack += '\n' + stack;
	          }
	        } catch (e) {
	          // ignore the case where "stack" is an un-writable property
	        }
	      }

	      throw err;
	    }
	  }

	  _request(configOrUrl, config) {
	    /*eslint no-param-reassign:0*/
	    // Allow for axios('example/url'[, config]) a la fetch API
	    if (typeof configOrUrl === 'string') {
	      config = config || {};
	      config.url = configOrUrl;
	    } else {
	      config = configOrUrl || {};
	    }

	    config = mergeConfig(this.defaults, config);

	    const {transitional, paramsSerializer, headers} = config;

	    if (transitional !== undefined) {
	      validator.assertOptions(transitional, {
	        silentJSONParsing: validators.transitional(validators.boolean),
	        forcedJSONParsing: validators.transitional(validators.boolean),
	        clarifyTimeoutError: validators.transitional(validators.boolean)
	      }, false);
	    }

	    if (paramsSerializer != null) {
	      if (utils$3.isFunction(paramsSerializer)) {
	        config.paramsSerializer = {
	          serialize: paramsSerializer
	        };
	      } else {
	        validator.assertOptions(paramsSerializer, {
	          encode: validators.function,
	          serialize: validators.function
	        }, true);
	      }
	    }

	    // Set config.method
	    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

	    // Flatten headers
	    let contextHeaders = headers && utils$3.merge(
	      headers.common,
	      headers[config.method]
	    );

	    headers && utils$3.forEach(
	      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
	      (method) => {
	        delete headers[method];
	      }
	    );

	    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);

	    // filter out skipped interceptors
	    const requestInterceptorChain = [];
	    let synchronousRequestInterceptors = true;
	    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
	      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
	        return;
	      }

	      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

	      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
	    });

	    const responseInterceptorChain = [];
	    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
	      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
	    });

	    let promise;
	    let i = 0;
	    let len;

	    if (!synchronousRequestInterceptors) {
	      const chain = [dispatchRequest.bind(this), undefined];
	      chain.unshift.apply(chain, requestInterceptorChain);
	      chain.push.apply(chain, responseInterceptorChain);
	      len = chain.length;

	      promise = Promise.resolve(config);

	      while (i < len) {
	        promise = promise.then(chain[i++], chain[i++]);
	      }

	      return promise;
	    }

	    len = requestInterceptorChain.length;

	    let newConfig = config;

	    i = 0;

	    while (i < len) {
	      const onFulfilled = requestInterceptorChain[i++];
	      const onRejected = requestInterceptorChain[i++];
	      try {
	        newConfig = onFulfilled(newConfig);
	      } catch (error) {
	        onRejected.call(this, error);
	        break;
	      }
	    }

	    try {
	      promise = dispatchRequest.call(this, newConfig);
	    } catch (error) {
	      return Promise.reject(error);
	    }

	    i = 0;
	    len = responseInterceptorChain.length;

	    while (i < len) {
	      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
	    }

	    return promise;
	  }

	  getUri(config) {
	    config = mergeConfig(this.defaults, config);
	    const fullPath = buildFullPath(config.baseURL, config.url);
	    return buildURL(fullPath, config.params, config.paramsSerializer);
	  }
	}

	// Provide aliases for supported request methods
	utils$3.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, config) {
	    return this.request(mergeConfig(config || {}, {
	      method,
	      url,
	      data: (config || {}).data
	    }));
	  };
	});

	utils$3.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  /*eslint func-names:0*/

	  function generateHTTPMethod(isForm) {
	    return function httpMethod(url, data, config) {
	      return this.request(mergeConfig(config || {}, {
	        method,
	        headers: isForm ? {
	          'Content-Type': 'multipart/form-data'
	        } : {},
	        url,
	        data
	      }));
	    };
	  }

	  Axios.prototype[method] = generateHTTPMethod();

	  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
	});

	var Axios$1 = Axios;

	/**
	 * A `CancelToken` is an object that can be used to request cancellation of an operation.
	 *
	 * @param {Function} executor The executor function.
	 *
	 * @returns {CancelToken}
	 */
	class CancelToken {
	  constructor(executor) {
	    if (typeof executor !== 'function') {
	      throw new TypeError('executor must be a function.');
	    }

	    let resolvePromise;

	    this.promise = new Promise(function promiseExecutor(resolve) {
	      resolvePromise = resolve;
	    });

	    const token = this;

	    // eslint-disable-next-line func-names
	    this.promise.then(cancel => {
	      if (!token._listeners) return;

	      let i = token._listeners.length;

	      while (i-- > 0) {
	        token._listeners[i](cancel);
	      }
	      token._listeners = null;
	    });

	    // eslint-disable-next-line func-names
	    this.promise.then = onfulfilled => {
	      let _resolve;
	      // eslint-disable-next-line func-names
	      const promise = new Promise(resolve => {
	        token.subscribe(resolve);
	        _resolve = resolve;
	      }).then(onfulfilled);

	      promise.cancel = function reject() {
	        token.unsubscribe(_resolve);
	      };

	      return promise;
	    };

	    executor(function cancel(message, config, request) {
	      if (token.reason) {
	        // Cancellation has already been requested
	        return;
	      }

	      token.reason = new CanceledError(message, config, request);
	      resolvePromise(token.reason);
	    });
	  }

	  /**
	   * Throws a `CanceledError` if cancellation has been requested.
	   */
	  throwIfRequested() {
	    if (this.reason) {
	      throw this.reason;
	    }
	  }

	  /**
	   * Subscribe to the cancel signal
	   */

	  subscribe(listener) {
	    if (this.reason) {
	      listener(this.reason);
	      return;
	    }

	    if (this._listeners) {
	      this._listeners.push(listener);
	    } else {
	      this._listeners = [listener];
	    }
	  }

	  /**
	   * Unsubscribe from the cancel signal
	   */

	  unsubscribe(listener) {
	    if (!this._listeners) {
	      return;
	    }
	    const index = this._listeners.indexOf(listener);
	    if (index !== -1) {
	      this._listeners.splice(index, 1);
	    }
	  }

	  /**
	   * Returns an object that contains a new `CancelToken` and a function that, when called,
	   * cancels the `CancelToken`.
	   */
	  static source() {
	    let cancel;
	    const token = new CancelToken(function executor(c) {
	      cancel = c;
	    });
	    return {
	      token,
	      cancel
	    };
	  }
	}

	var CancelToken$1 = CancelToken;

	/**
	 * Syntactic sugar for invoking a function and expanding an array for arguments.
	 *
	 * Common use case would be to use `Function.prototype.apply`.
	 *
	 *  ```js
	 *  function f(x, y, z) {}
	 *  var args = [1, 2, 3];
	 *  f.apply(null, args);
	 *  ```
	 *
	 * With `spread` this example can be re-written.
	 *
	 *  ```js
	 *  spread(function(x, y, z) {})([1, 2, 3]);
	 *  ```
	 *
	 * @param {Function} callback
	 *
	 * @returns {Function}
	 */
	function spread(callback) {
	  return function wrap(arr) {
	    return callback.apply(null, arr);
	  };
	}

	/**
	 * Determines whether the payload is an error thrown by Axios
	 *
	 * @param {*} payload The value to test
	 *
	 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
	 */
	function isAxiosError(payload) {
	  return utils$3.isObject(payload) && (payload.isAxiosError === true);
	}

	const HttpStatusCode = {
	  Continue: 100,
	  SwitchingProtocols: 101,
	  Processing: 102,
	  EarlyHints: 103,
	  Ok: 200,
	  Created: 201,
	  Accepted: 202,
	  NonAuthoritativeInformation: 203,
	  NoContent: 204,
	  ResetContent: 205,
	  PartialContent: 206,
	  MultiStatus: 207,
	  AlreadyReported: 208,
	  ImUsed: 226,
	  MultipleChoices: 300,
	  MovedPermanently: 301,
	  Found: 302,
	  SeeOther: 303,
	  NotModified: 304,
	  UseProxy: 305,
	  Unused: 306,
	  TemporaryRedirect: 307,
	  PermanentRedirect: 308,
	  BadRequest: 400,
	  Unauthorized: 401,
	  PaymentRequired: 402,
	  Forbidden: 403,
	  NotFound: 404,
	  MethodNotAllowed: 405,
	  NotAcceptable: 406,
	  ProxyAuthenticationRequired: 407,
	  RequestTimeout: 408,
	  Conflict: 409,
	  Gone: 410,
	  LengthRequired: 411,
	  PreconditionFailed: 412,
	  PayloadTooLarge: 413,
	  UriTooLong: 414,
	  UnsupportedMediaType: 415,
	  RangeNotSatisfiable: 416,
	  ExpectationFailed: 417,
	  ImATeapot: 418,
	  MisdirectedRequest: 421,
	  UnprocessableEntity: 422,
	  Locked: 423,
	  FailedDependency: 424,
	  TooEarly: 425,
	  UpgradeRequired: 426,
	  PreconditionRequired: 428,
	  TooManyRequests: 429,
	  RequestHeaderFieldsTooLarge: 431,
	  UnavailableForLegalReasons: 451,
	  InternalServerError: 500,
	  NotImplemented: 501,
	  BadGateway: 502,
	  ServiceUnavailable: 503,
	  GatewayTimeout: 504,
	  HttpVersionNotSupported: 505,
	  VariantAlsoNegotiates: 506,
	  InsufficientStorage: 507,
	  LoopDetected: 508,
	  NotExtended: 510,
	  NetworkAuthenticationRequired: 511,
	};

	Object.entries(HttpStatusCode).forEach(([key, value]) => {
	  HttpStatusCode[value] = key;
	});

	var HttpStatusCode$1 = HttpStatusCode;

	/**
	 * Create an instance of Axios
	 *
	 * @param {Object} defaultConfig The default config for the instance
	 *
	 * @returns {Axios} A new instance of Axios
	 */
	function createInstance(defaultConfig) {
	  const context = new Axios$1(defaultConfig);
	  const instance = bind(Axios$1.prototype.request, context);

	  // Copy axios.prototype to instance
	  utils$3.extend(instance, Axios$1.prototype, context, {allOwnKeys: true});

	  // Copy context to instance
	  utils$3.extend(instance, context, null, {allOwnKeys: true});

	  // Factory for creating new instances
	  instance.create = function create(instanceConfig) {
	    return createInstance(mergeConfig(defaultConfig, instanceConfig));
	  };

	  return instance;
	}

	// Create the default instance to be exported
	const axios = createInstance(defaults$1);

	// Expose Axios class to allow class inheritance
	axios.Axios = Axios$1;

	// Expose Cancel & CancelToken
	axios.CanceledError = CanceledError;
	axios.CancelToken = CancelToken$1;
	axios.isCancel = isCancel;
	axios.VERSION = VERSION;
	axios.toFormData = toFormData;

	// Expose AxiosError class
	axios.AxiosError = AxiosError;

	// alias for CanceledError for backward compatibility
	axios.Cancel = axios.CanceledError;

	// Expose all/spread
	axios.all = function all(promises) {
	  return Promise.all(promises);
	};

	axios.spread = spread;

	// Expose isAxiosError
	axios.isAxiosError = isAxiosError;

	// Expose mergeConfig
	axios.mergeConfig = mergeConfig;

	axios.AxiosHeaders = AxiosHeaders$1;

	axios.formToJSON = thing => formDataToJSON(utils$3.isHTMLForm(thing) ? new FormData(thing) : thing);

	axios.getAdapter = adapters.getAdapter;

	axios.HttpStatusCode = HttpStatusCode$1;

	axios.default = axios;

	// this module should only have a default export
	var axios$1 = axios;

	var browser = {};

	// can-promise has a crash in some versions of react native that dont have
	// standard global objects
	// https://github.com/soldair/node-qrcode/issues/157

	var canPromise$1 = function () {
	  return typeof Promise === 'function' && Promise.prototype && Promise.prototype.then
	};

	var qrcode = {};

	var utils$1 = {};

	let toSJISFunction;
	const CODEWORDS_COUNT = [
	  0, // Not used
	  26, 44, 70, 100, 134, 172, 196, 242, 292, 346,
	  404, 466, 532, 581, 655, 733, 815, 901, 991, 1085,
	  1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185,
	  2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706
	];

	/**
	 * Returns the QR Code size for the specified version
	 *
	 * @param  {Number} version QR Code version
	 * @return {Number}         size of QR code
	 */
	utils$1.getSymbolSize = function getSymbolSize (version) {
	  if (!version) throw new Error('"version" cannot be null or undefined')
	  if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40')
	  return version * 4 + 17
	};

	/**
	 * Returns the total number of codewords used to store data and EC information.
	 *
	 * @param  {Number} version QR Code version
	 * @return {Number}         Data length in bits
	 */
	utils$1.getSymbolTotalCodewords = function getSymbolTotalCodewords (version) {
	  return CODEWORDS_COUNT[version]
	};

	/**
	 * Encode data with Bose-Chaudhuri-Hocquenghem
	 *
	 * @param  {Number} data Value to encode
	 * @return {Number}      Encoded value
	 */
	utils$1.getBCHDigit = function (data) {
	  let digit = 0;

	  while (data !== 0) {
	    digit++;
	    data >>>= 1;
	  }

	  return digit
	};

	utils$1.setToSJISFunction = function setToSJISFunction (f) {
	  if (typeof f !== 'function') {
	    throw new Error('"toSJISFunc" is not a valid function.')
	  }

	  toSJISFunction = f;
	};

	utils$1.isKanjiModeEnabled = function () {
	  return typeof toSJISFunction !== 'undefined'
	};

	utils$1.toSJIS = function toSJIS (kanji) {
	  return toSJISFunction(kanji)
	};

	var errorCorrectionLevel = {};

	(function (exports) {
		exports.L = { bit: 1 };
		exports.M = { bit: 0 };
		exports.Q = { bit: 3 };
		exports.H = { bit: 2 };

		function fromString (string) {
		  if (typeof string !== 'string') {
		    throw new Error('Param is not a string')
		  }

		  const lcStr = string.toLowerCase();

		  switch (lcStr) {
		    case 'l':
		    case 'low':
		      return exports.L

		    case 'm':
		    case 'medium':
		      return exports.M

		    case 'q':
		    case 'quartile':
		      return exports.Q

		    case 'h':
		    case 'high':
		      return exports.H

		    default:
		      throw new Error('Unknown EC Level: ' + string)
		  }
		}

		exports.isValid = function isValid (level) {
		  return level && typeof level.bit !== 'undefined' &&
		    level.bit >= 0 && level.bit < 4
		};

		exports.from = function from (value, defaultValue) {
		  if (exports.isValid(value)) {
		    return value
		  }

		  try {
		    return fromString(value)
		  } catch (e) {
		    return defaultValue
		  }
		}; 
	} (errorCorrectionLevel));

	function BitBuffer$1 () {
	  this.buffer = [];
	  this.length = 0;
	}

	BitBuffer$1.prototype = {

	  get: function (index) {
	    const bufIndex = Math.floor(index / 8);
	    return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) === 1
	  },

	  put: function (num, length) {
	    for (let i = 0; i < length; i++) {
	      this.putBit(((num >>> (length - i - 1)) & 1) === 1);
	    }
	  },

	  getLengthInBits: function () {
	    return this.length
	  },

	  putBit: function (bit) {
	    const bufIndex = Math.floor(this.length / 8);
	    if (this.buffer.length <= bufIndex) {
	      this.buffer.push(0);
	    }

	    if (bit) {
	      this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
	    }

	    this.length++;
	  }
	};

	var bitBuffer = BitBuffer$1;

	/**
	 * Helper class to handle QR Code symbol modules
	 *
	 * @param {Number} size Symbol size
	 */

	function BitMatrix$1 (size) {
	  if (!size || size < 1) {
	    throw new Error('BitMatrix size must be defined and greater than 0')
	  }

	  this.size = size;
	  this.data = new Uint8Array(size * size);
	  this.reservedBit = new Uint8Array(size * size);
	}

	/**
	 * Set bit value at specified location
	 * If reserved flag is set, this bit will be ignored during masking process
	 *
	 * @param {Number}  row
	 * @param {Number}  col
	 * @param {Boolean} value
	 * @param {Boolean} reserved
	 */
	BitMatrix$1.prototype.set = function (row, col, value, reserved) {
	  const index = row * this.size + col;
	  this.data[index] = value;
	  if (reserved) this.reservedBit[index] = true;
	};

	/**
	 * Returns bit value at specified location
	 *
	 * @param  {Number}  row
	 * @param  {Number}  col
	 * @return {Boolean}
	 */
	BitMatrix$1.prototype.get = function (row, col) {
	  return this.data[row * this.size + col]
	};

	/**
	 * Applies xor operator at specified location
	 * (used during masking process)
	 *
	 * @param {Number}  row
	 * @param {Number}  col
	 * @param {Boolean} value
	 */
	BitMatrix$1.prototype.xor = function (row, col, value) {
	  this.data[row * this.size + col] ^= value;
	};

	/**
	 * Check if bit at specified location is reserved
	 *
	 * @param {Number}   row
	 * @param {Number}   col
	 * @return {Boolean}
	 */
	BitMatrix$1.prototype.isReserved = function (row, col) {
	  return this.reservedBit[row * this.size + col]
	};

	var bitMatrix = BitMatrix$1;

	var alignmentPattern = {};

	/**
	 * Alignment pattern are fixed reference pattern in defined positions
	 * in a matrix symbology, which enables the decode software to re-synchronise
	 * the coordinate mapping of the image modules in the event of moderate amounts
	 * of distortion of the image.
	 *
	 * Alignment patterns are present only in QR Code symbols of version 2 or larger
	 * and their number depends on the symbol version.
	 */

	(function (exports) {
		const getSymbolSize = utils$1.getSymbolSize;

		/**
		 * Calculate the row/column coordinates of the center module of each alignment pattern
		 * for the specified QR Code version.
		 *
		 * The alignment patterns are positioned symmetrically on either side of the diagonal
		 * running from the top left corner of the symbol to the bottom right corner.
		 *
		 * Since positions are simmetrical only half of the coordinates are returned.
		 * Each item of the array will represent in turn the x and y coordinate.
		 * @see {@link getPositions}
		 *
		 * @param  {Number} version QR Code version
		 * @return {Array}          Array of coordinate
		 */
		exports.getRowColCoords = function getRowColCoords (version) {
		  if (version === 1) return []

		  const posCount = Math.floor(version / 7) + 2;
		  const size = getSymbolSize(version);
		  const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
		  const positions = [size - 7]; // Last coord is always (size - 7)

		  for (let i = 1; i < posCount - 1; i++) {
		    positions[i] = positions[i - 1] - intervals;
		  }

		  positions.push(6); // First coord is always 6

		  return positions.reverse()
		};

		/**
		 * Returns an array containing the positions of each alignment pattern.
		 * Each array's element represent the center point of the pattern as (x, y) coordinates
		 *
		 * Coordinates are calculated expanding the row/column coordinates returned by {@link getRowColCoords}
		 * and filtering out the items that overlaps with finder pattern
		 *
		 * @example
		 * For a Version 7 symbol {@link getRowColCoords} returns values 6, 22 and 38.
		 * The alignment patterns, therefore, are to be centered on (row, column)
		 * positions (6,22), (22,6), (22,22), (22,38), (38,22), (38,38).
		 * Note that the coordinates (6,6), (6,38), (38,6) are occupied by finder patterns
		 * and are not therefore used for alignment patterns.
		 *
		 * let pos = getPositions(7)
		 * // [[6,22], [22,6], [22,22], [22,38], [38,22], [38,38]]
		 *
		 * @param  {Number} version QR Code version
		 * @return {Array}          Array of coordinates
		 */
		exports.getPositions = function getPositions (version) {
		  const coords = [];
		  const pos = exports.getRowColCoords(version);
		  const posLength = pos.length;

		  for (let i = 0; i < posLength; i++) {
		    for (let j = 0; j < posLength; j++) {
		      // Skip if position is occupied by finder patterns
		      if ((i === 0 && j === 0) || // top-left
		          (i === 0 && j === posLength - 1) || // bottom-left
		          (i === posLength - 1 && j === 0)) { // top-right
		        continue
		      }

		      coords.push([pos[i], pos[j]]);
		    }
		  }

		  return coords
		}; 
	} (alignmentPattern));

	var finderPattern = {};

	const getSymbolSize = utils$1.getSymbolSize;
	const FINDER_PATTERN_SIZE = 7;

	/**
	 * Returns an array containing the positions of each finder pattern.
	 * Each array's element represent the top-left point of the pattern as (x, y) coordinates
	 *
	 * @param  {Number} version QR Code version
	 * @return {Array}          Array of coordinates
	 */
	finderPattern.getPositions = function getPositions (version) {
	  const size = getSymbolSize(version);

	  return [
	    // top-left
	    [0, 0],
	    // top-right
	    [size - FINDER_PATTERN_SIZE, 0],
	    // bottom-left
	    [0, size - FINDER_PATTERN_SIZE]
	  ]
	};

	var maskPattern = {};

	/**
	 * Data mask pattern reference
	 * @type {Object}
	 */

	(function (exports) {
		exports.Patterns = {
		  PATTERN000: 0,
		  PATTERN001: 1,
		  PATTERN010: 2,
		  PATTERN011: 3,
		  PATTERN100: 4,
		  PATTERN101: 5,
		  PATTERN110: 6,
		  PATTERN111: 7
		};

		/**
		 * Weighted penalty scores for the undesirable features
		 * @type {Object}
		 */
		const PenaltyScores = {
		  N1: 3,
		  N2: 3,
		  N3: 40,
		  N4: 10
		};

		/**
		 * Check if mask pattern value is valid
		 *
		 * @param  {Number}  mask    Mask pattern
		 * @return {Boolean}         true if valid, false otherwise
		 */
		exports.isValid = function isValid (mask) {
		  return mask != null && mask !== '' && !isNaN(mask) && mask >= 0 && mask <= 7
		};

		/**
		 * Returns mask pattern from a value.
		 * If value is not valid, returns undefined
		 *
		 * @param  {Number|String} value        Mask pattern value
		 * @return {Number}                     Valid mask pattern or undefined
		 */
		exports.from = function from (value) {
		  return exports.isValid(value) ? parseInt(value, 10) : undefined
		};

		/**
		* Find adjacent modules in row/column with the same color
		* and assign a penalty value.
		*
		* Points: N1 + i
		* i is the amount by which the number of adjacent modules of the same color exceeds 5
		*/
		exports.getPenaltyN1 = function getPenaltyN1 (data) {
		  const size = data.size;
		  let points = 0;
		  let sameCountCol = 0;
		  let sameCountRow = 0;
		  let lastCol = null;
		  let lastRow = null;

		  for (let row = 0; row < size; row++) {
		    sameCountCol = sameCountRow = 0;
		    lastCol = lastRow = null;

		    for (let col = 0; col < size; col++) {
		      let module = data.get(row, col);
		      if (module === lastCol) {
		        sameCountCol++;
		      } else {
		        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
		        lastCol = module;
		        sameCountCol = 1;
		      }

		      module = data.get(col, row);
		      if (module === lastRow) {
		        sameCountRow++;
		      } else {
		        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
		        lastRow = module;
		        sameCountRow = 1;
		      }
		    }

		    if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
		    if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
		  }

		  return points
		};

		/**
		 * Find 2x2 blocks with the same color and assign a penalty value
		 *
		 * Points: N2 * (m - 1) * (n - 1)
		 */
		exports.getPenaltyN2 = function getPenaltyN2 (data) {
		  const size = data.size;
		  let points = 0;

		  for (let row = 0; row < size - 1; row++) {
		    for (let col = 0; col < size - 1; col++) {
		      const last = data.get(row, col) +
		        data.get(row, col + 1) +
		        data.get(row + 1, col) +
		        data.get(row + 1, col + 1);

		      if (last === 4 || last === 0) points++;
		    }
		  }

		  return points * PenaltyScores.N2
		};

		/**
		 * Find 1:1:3:1:1 ratio (dark:light:dark:light:dark) pattern in row/column,
		 * preceded or followed by light area 4 modules wide
		 *
		 * Points: N3 * number of pattern found
		 */
		exports.getPenaltyN3 = function getPenaltyN3 (data) {
		  const size = data.size;
		  let points = 0;
		  let bitsCol = 0;
		  let bitsRow = 0;

		  for (let row = 0; row < size; row++) {
		    bitsCol = bitsRow = 0;
		    for (let col = 0; col < size; col++) {
		      bitsCol = ((bitsCol << 1) & 0x7FF) | data.get(row, col);
		      if (col >= 10 && (bitsCol === 0x5D0 || bitsCol === 0x05D)) points++;

		      bitsRow = ((bitsRow << 1) & 0x7FF) | data.get(col, row);
		      if (col >= 10 && (bitsRow === 0x5D0 || bitsRow === 0x05D)) points++;
		    }
		  }

		  return points * PenaltyScores.N3
		};

		/**
		 * Calculate proportion of dark modules in entire symbol
		 *
		 * Points: N4 * k
		 *
		 * k is the rating of the deviation of the proportion of dark modules
		 * in the symbol from 50% in steps of 5%
		 */
		exports.getPenaltyN4 = function getPenaltyN4 (data) {
		  let darkCount = 0;
		  const modulesCount = data.data.length;

		  for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];

		  const k = Math.abs(Math.ceil((darkCount * 100 / modulesCount) / 5) - 10);

		  return k * PenaltyScores.N4
		};

		/**
		 * Return mask value at given position
		 *
		 * @param  {Number} maskPattern Pattern reference value
		 * @param  {Number} i           Row
		 * @param  {Number} j           Column
		 * @return {Boolean}            Mask value
		 */
		function getMaskAt (maskPattern, i, j) {
		  switch (maskPattern) {
		    case exports.Patterns.PATTERN000: return (i + j) % 2 === 0
		    case exports.Patterns.PATTERN001: return i % 2 === 0
		    case exports.Patterns.PATTERN010: return j % 3 === 0
		    case exports.Patterns.PATTERN011: return (i + j) % 3 === 0
		    case exports.Patterns.PATTERN100: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0
		    case exports.Patterns.PATTERN101: return (i * j) % 2 + (i * j) % 3 === 0
		    case exports.Patterns.PATTERN110: return ((i * j) % 2 + (i * j) % 3) % 2 === 0
		    case exports.Patterns.PATTERN111: return ((i * j) % 3 + (i + j) % 2) % 2 === 0

		    default: throw new Error('bad maskPattern:' + maskPattern)
		  }
		}

		/**
		 * Apply a mask pattern to a BitMatrix
		 *
		 * @param  {Number}    pattern Pattern reference number
		 * @param  {BitMatrix} data    BitMatrix data
		 */
		exports.applyMask = function applyMask (pattern, data) {
		  const size = data.size;

		  for (let col = 0; col < size; col++) {
		    for (let row = 0; row < size; row++) {
		      if (data.isReserved(row, col)) continue
		      data.xor(row, col, getMaskAt(pattern, row, col));
		    }
		  }
		};

		/**
		 * Returns the best mask pattern for data
		 *
		 * @param  {BitMatrix} data
		 * @return {Number} Mask pattern reference number
		 */
		exports.getBestMask = function getBestMask (data, setupFormatFunc) {
		  const numPatterns = Object.keys(exports.Patterns).length;
		  let bestPattern = 0;
		  let lowerPenalty = Infinity;

		  for (let p = 0; p < numPatterns; p++) {
		    setupFormatFunc(p);
		    exports.applyMask(p, data);

		    // Calculate penalty
		    const penalty =
		      exports.getPenaltyN1(data) +
		      exports.getPenaltyN2(data) +
		      exports.getPenaltyN3(data) +
		      exports.getPenaltyN4(data);

		    // Undo previously applied mask
		    exports.applyMask(p, data);

		    if (penalty < lowerPenalty) {
		      lowerPenalty = penalty;
		      bestPattern = p;
		    }
		  }

		  return bestPattern
		}; 
	} (maskPattern));

	var errorCorrectionCode = {};

	const ECLevel$1 = errorCorrectionLevel;

	const EC_BLOCKS_TABLE = [
	// L  M  Q  H
	  1, 1, 1, 1,
	  1, 1, 1, 1,
	  1, 1, 2, 2,
	  1, 2, 2, 4,
	  1, 2, 4, 4,
	  2, 4, 4, 4,
	  2, 4, 6, 5,
	  2, 4, 6, 6,
	  2, 5, 8, 8,
	  4, 5, 8, 8,
	  4, 5, 8, 11,
	  4, 8, 10, 11,
	  4, 9, 12, 16,
	  4, 9, 16, 16,
	  6, 10, 12, 18,
	  6, 10, 17, 16,
	  6, 11, 16, 19,
	  6, 13, 18, 21,
	  7, 14, 21, 25,
	  8, 16, 20, 25,
	  8, 17, 23, 25,
	  9, 17, 23, 34,
	  9, 18, 25, 30,
	  10, 20, 27, 32,
	  12, 21, 29, 35,
	  12, 23, 34, 37,
	  12, 25, 34, 40,
	  13, 26, 35, 42,
	  14, 28, 38, 45,
	  15, 29, 40, 48,
	  16, 31, 43, 51,
	  17, 33, 45, 54,
	  18, 35, 48, 57,
	  19, 37, 51, 60,
	  19, 38, 53, 63,
	  20, 40, 56, 66,
	  21, 43, 59, 70,
	  22, 45, 62, 74,
	  24, 47, 65, 77,
	  25, 49, 68, 81
	];

	const EC_CODEWORDS_TABLE = [
	// L  M  Q  H
	  7, 10, 13, 17,
	  10, 16, 22, 28,
	  15, 26, 36, 44,
	  20, 36, 52, 64,
	  26, 48, 72, 88,
	  36, 64, 96, 112,
	  40, 72, 108, 130,
	  48, 88, 132, 156,
	  60, 110, 160, 192,
	  72, 130, 192, 224,
	  80, 150, 224, 264,
	  96, 176, 260, 308,
	  104, 198, 288, 352,
	  120, 216, 320, 384,
	  132, 240, 360, 432,
	  144, 280, 408, 480,
	  168, 308, 448, 532,
	  180, 338, 504, 588,
	  196, 364, 546, 650,
	  224, 416, 600, 700,
	  224, 442, 644, 750,
	  252, 476, 690, 816,
	  270, 504, 750, 900,
	  300, 560, 810, 960,
	  312, 588, 870, 1050,
	  336, 644, 952, 1110,
	  360, 700, 1020, 1200,
	  390, 728, 1050, 1260,
	  420, 784, 1140, 1350,
	  450, 812, 1200, 1440,
	  480, 868, 1290, 1530,
	  510, 924, 1350, 1620,
	  540, 980, 1440, 1710,
	  570, 1036, 1530, 1800,
	  570, 1064, 1590, 1890,
	  600, 1120, 1680, 1980,
	  630, 1204, 1770, 2100,
	  660, 1260, 1860, 2220,
	  720, 1316, 1950, 2310,
	  750, 1372, 2040, 2430
	];

	/**
	 * Returns the number of error correction block that the QR Code should contain
	 * for the specified version and error correction level.
	 *
	 * @param  {Number} version              QR Code version
	 * @param  {Number} errorCorrectionLevel Error correction level
	 * @return {Number}                      Number of error correction blocks
	 */
	errorCorrectionCode.getBlocksCount = function getBlocksCount (version, errorCorrectionLevel) {
	  switch (errorCorrectionLevel) {
	    case ECLevel$1.L:
	      return EC_BLOCKS_TABLE[(version - 1) * 4 + 0]
	    case ECLevel$1.M:
	      return EC_BLOCKS_TABLE[(version - 1) * 4 + 1]
	    case ECLevel$1.Q:
	      return EC_BLOCKS_TABLE[(version - 1) * 4 + 2]
	    case ECLevel$1.H:
	      return EC_BLOCKS_TABLE[(version - 1) * 4 + 3]
	    default:
	      return undefined
	  }
	};

	/**
	 * Returns the number of error correction codewords to use for the specified
	 * version and error correction level.
	 *
	 * @param  {Number} version              QR Code version
	 * @param  {Number} errorCorrectionLevel Error correction level
	 * @return {Number}                      Number of error correction codewords
	 */
	errorCorrectionCode.getTotalCodewordsCount = function getTotalCodewordsCount (version, errorCorrectionLevel) {
	  switch (errorCorrectionLevel) {
	    case ECLevel$1.L:
	      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0]
	    case ECLevel$1.M:
	      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1]
	    case ECLevel$1.Q:
	      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2]
	    case ECLevel$1.H:
	      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3]
	    default:
	      return undefined
	  }
	};

	var polynomial = {};

	var galoisField = {};

	const EXP_TABLE = new Uint8Array(512);
	const LOG_TABLE = new Uint8Array(256)
	/**
	 * Precompute the log and anti-log tables for faster computation later
	 *
	 * For each possible value in the galois field 2^8, we will pre-compute
	 * the logarithm and anti-logarithm (exponential) of this value
	 *
	 * ref {@link https://en.wikiversity.org/wiki/Reed%E2%80%93Solomon_codes_for_coders#Introduction_to_mathematical_fields}
	 */
	;(function initTables () {
	  let x = 1;
	  for (let i = 0; i < 255; i++) {
	    EXP_TABLE[i] = x;
	    LOG_TABLE[x] = i;

	    x <<= 1; // multiply by 2

	    // The QR code specification says to use byte-wise modulo 100011101 arithmetic.
	    // This means that when a number is 256 or larger, it should be XORed with 0x11D.
	    if (x & 0x100) { // similar to x >= 256, but a lot faster (because 0x100 == 256)
	      x ^= 0x11D;
	    }
	  }

	  // Optimization: double the size of the anti-log table so that we don't need to mod 255 to
	  // stay inside the bounds (because we will mainly use this table for the multiplication of
	  // two GF numbers, no more).
	  // @see {@link mul}
	  for (let i = 255; i < 512; i++) {
	    EXP_TABLE[i] = EXP_TABLE[i - 255];
	  }
	}());

	/**
	 * Returns log value of n inside Galois Field
	 *
	 * @param  {Number} n
	 * @return {Number}
	 */
	galoisField.log = function log (n) {
	  if (n < 1) throw new Error('log(' + n + ')')
	  return LOG_TABLE[n]
	};

	/**
	 * Returns anti-log value of n inside Galois Field
	 *
	 * @param  {Number} n
	 * @return {Number}
	 */
	galoisField.exp = function exp (n) {
	  return EXP_TABLE[n]
	};

	/**
	 * Multiplies two number inside Galois Field
	 *
	 * @param  {Number} x
	 * @param  {Number} y
	 * @return {Number}
	 */
	galoisField.mul = function mul (x, y) {
	  if (x === 0 || y === 0) return 0

	  // should be EXP_TABLE[(LOG_TABLE[x] + LOG_TABLE[y]) % 255] if EXP_TABLE wasn't oversized
	  // @see {@link initTables}
	  return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]]
	};

	(function (exports) {
		const GF = galoisField;

		/**
		 * Multiplies two polynomials inside Galois Field
		 *
		 * @param  {Uint8Array} p1 Polynomial
		 * @param  {Uint8Array} p2 Polynomial
		 * @return {Uint8Array}    Product of p1 and p2
		 */
		exports.mul = function mul (p1, p2) {
		  const coeff = new Uint8Array(p1.length + p2.length - 1);

		  for (let i = 0; i < p1.length; i++) {
		    for (let j = 0; j < p2.length; j++) {
		      coeff[i + j] ^= GF.mul(p1[i], p2[j]);
		    }
		  }

		  return coeff
		};

		/**
		 * Calculate the remainder of polynomials division
		 *
		 * @param  {Uint8Array} divident Polynomial
		 * @param  {Uint8Array} divisor  Polynomial
		 * @return {Uint8Array}          Remainder
		 */
		exports.mod = function mod (divident, divisor) {
		  let result = new Uint8Array(divident);

		  while ((result.length - divisor.length) >= 0) {
		    const coeff = result[0];

		    for (let i = 0; i < divisor.length; i++) {
		      result[i] ^= GF.mul(divisor[i], coeff);
		    }

		    // remove all zeros from buffer head
		    let offset = 0;
		    while (offset < result.length && result[offset] === 0) offset++;
		    result = result.slice(offset);
		  }

		  return result
		};

		/**
		 * Generate an irreducible generator polynomial of specified degree
		 * (used by Reed-Solomon encoder)
		 *
		 * @param  {Number} degree Degree of the generator polynomial
		 * @return {Uint8Array}    Buffer containing polynomial coefficients
		 */
		exports.generateECPolynomial = function generateECPolynomial (degree) {
		  let poly = new Uint8Array([1]);
		  for (let i = 0; i < degree; i++) {
		    poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
		  }

		  return poly
		}; 
	} (polynomial));

	const Polynomial = polynomial;

	function ReedSolomonEncoder$1 (degree) {
	  this.genPoly = undefined;
	  this.degree = degree;

	  if (this.degree) this.initialize(this.degree);
	}

	/**
	 * Initialize the encoder.
	 * The input param should correspond to the number of error correction codewords.
	 *
	 * @param  {Number} degree
	 */
	ReedSolomonEncoder$1.prototype.initialize = function initialize (degree) {
	  // create an irreducible generator polynomial
	  this.degree = degree;
	  this.genPoly = Polynomial.generateECPolynomial(this.degree);
	};

	/**
	 * Encodes a chunk of data
	 *
	 * @param  {Uint8Array} data Buffer containing input data
	 * @return {Uint8Array}      Buffer containing encoded data
	 */
	ReedSolomonEncoder$1.prototype.encode = function encode (data) {
	  if (!this.genPoly) {
	    throw new Error('Encoder not initialized')
	  }

	  // Calculate EC for this data block
	  // extends data size to data+genPoly size
	  const paddedData = new Uint8Array(data.length + this.degree);
	  paddedData.set(data);

	  // The error correction codewords are the remainder after dividing the data codewords
	  // by a generator polynomial
	  const remainder = Polynomial.mod(paddedData, this.genPoly);

	  // return EC data blocks (last n byte, where n is the degree of genPoly)
	  // If coefficients number in remainder are less than genPoly degree,
	  // pad with 0s to the left to reach the needed number of coefficients
	  const start = this.degree - remainder.length;
	  if (start > 0) {
	    const buff = new Uint8Array(this.degree);
	    buff.set(remainder, start);

	    return buff
	  }

	  return remainder
	};

	var reedSolomonEncoder = ReedSolomonEncoder$1;

	var version = {};

	var mode = {};

	var versionCheck = {};

	/**
	 * Check if QR Code version is valid
	 *
	 * @param  {Number}  version QR Code version
	 * @return {Boolean}         true if valid version, false otherwise
	 */

	versionCheck.isValid = function isValid (version) {
	  return !isNaN(version) && version >= 1 && version <= 40
	};

	var regex = {};

	const numeric = '[0-9]+';
	const alphanumeric = '[A-Z $%*+\\-./:]+';
	let kanji = '(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|' +
	  '[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|' +
	  '[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|' +
	  '[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+';
	kanji = kanji.replace(/u/g, '\\u');

	const byte = '(?:(?![A-Z0-9 $%*+\\-./:]|' + kanji + ')(?:.|[\r\n]))+';

	regex.KANJI = new RegExp(kanji, 'g');
	regex.BYTE_KANJI = new RegExp('[^A-Z0-9 $%*+\\-./:]+', 'g');
	regex.BYTE = new RegExp(byte, 'g');
	regex.NUMERIC = new RegExp(numeric, 'g');
	regex.ALPHANUMERIC = new RegExp(alphanumeric, 'g');

	const TEST_KANJI = new RegExp('^' + kanji + '$');
	const TEST_NUMERIC = new RegExp('^' + numeric + '$');
	const TEST_ALPHANUMERIC = new RegExp('^[A-Z0-9 $%*+\\-./:]+$');

	regex.testKanji = function testKanji (str) {
	  return TEST_KANJI.test(str)
	};

	regex.testNumeric = function testNumeric (str) {
	  return TEST_NUMERIC.test(str)
	};

	regex.testAlphanumeric = function testAlphanumeric (str) {
	  return TEST_ALPHANUMERIC.test(str)
	};

	(function (exports) {
		const VersionCheck = versionCheck;
		const Regex = regex;

		/**
		 * Numeric mode encodes data from the decimal digit set (0 - 9)
		 * (byte values 30HEX to 39HEX).
		 * Normally, 3 data characters are represented by 10 bits.
		 *
		 * @type {Object}
		 */
		exports.NUMERIC = {
		  id: 'Numeric',
		  bit: 1 << 0,
		  ccBits: [10, 12, 14]
		};

		/**
		 * Alphanumeric mode encodes data from a set of 45 characters,
		 * i.e. 10 numeric digits (0 - 9),
		 *      26 alphabetic characters (A - Z),
		 *   and 9 symbols (SP, $, %, *, +, -, ., /, :).
		 * Normally, two input characters are represented by 11 bits.
		 *
		 * @type {Object}
		 */
		exports.ALPHANUMERIC = {
		  id: 'Alphanumeric',
		  bit: 1 << 1,
		  ccBits: [9, 11, 13]
		};

		/**
		 * In byte mode, data is encoded at 8 bits per character.
		 *
		 * @type {Object}
		 */
		exports.BYTE = {
		  id: 'Byte',
		  bit: 1 << 2,
		  ccBits: [8, 16, 16]
		};

		/**
		 * The Kanji mode efficiently encodes Kanji characters in accordance with
		 * the Shift JIS system based on JIS X 0208.
		 * The Shift JIS values are shifted from the JIS X 0208 values.
		 * JIS X 0208 gives details of the shift coded representation.
		 * Each two-byte character value is compacted to a 13-bit binary codeword.
		 *
		 * @type {Object}
		 */
		exports.KANJI = {
		  id: 'Kanji',
		  bit: 1 << 3,
		  ccBits: [8, 10, 12]
		};

		/**
		 * Mixed mode will contain a sequences of data in a combination of any of
		 * the modes described above
		 *
		 * @type {Object}
		 */
		exports.MIXED = {
		  bit: -1
		};

		/**
		 * Returns the number of bits needed to store the data length
		 * according to QR Code specifications.
		 *
		 * @param  {Mode}   mode    Data mode
		 * @param  {Number} version QR Code version
		 * @return {Number}         Number of bits
		 */
		exports.getCharCountIndicator = function getCharCountIndicator (mode, version) {
		  if (!mode.ccBits) throw new Error('Invalid mode: ' + mode)

		  if (!VersionCheck.isValid(version)) {
		    throw new Error('Invalid version: ' + version)
		  }

		  if (version >= 1 && version < 10) return mode.ccBits[0]
		  else if (version < 27) return mode.ccBits[1]
		  return mode.ccBits[2]
		};

		/**
		 * Returns the most efficient mode to store the specified data
		 *
		 * @param  {String} dataStr Input data string
		 * @return {Mode}           Best mode
		 */
		exports.getBestModeForData = function getBestModeForData (dataStr) {
		  if (Regex.testNumeric(dataStr)) return exports.NUMERIC
		  else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC
		  else if (Regex.testKanji(dataStr)) return exports.KANJI
		  else return exports.BYTE
		};

		/**
		 * Return mode name as string
		 *
		 * @param {Mode} mode Mode object
		 * @returns {String}  Mode name
		 */
		exports.toString = function toString (mode) {
		  if (mode && mode.id) return mode.id
		  throw new Error('Invalid mode')
		};

		/**
		 * Check if input param is a valid mode object
		 *
		 * @param   {Mode}    mode Mode object
		 * @returns {Boolean} True if valid mode, false otherwise
		 */
		exports.isValid = function isValid (mode) {
		  return mode && mode.bit && mode.ccBits
		};

		/**
		 * Get mode object from its name
		 *
		 * @param   {String} string Mode name
		 * @returns {Mode}          Mode object
		 */
		function fromString (string) {
		  if (typeof string !== 'string') {
		    throw new Error('Param is not a string')
		  }

		  const lcStr = string.toLowerCase();

		  switch (lcStr) {
		    case 'numeric':
		      return exports.NUMERIC
		    case 'alphanumeric':
		      return exports.ALPHANUMERIC
		    case 'kanji':
		      return exports.KANJI
		    case 'byte':
		      return exports.BYTE
		    default:
		      throw new Error('Unknown mode: ' + string)
		  }
		}

		/**
		 * Returns mode from a value.
		 * If value is not a valid mode, returns defaultValue
		 *
		 * @param  {Mode|String} value        Encoding mode
		 * @param  {Mode}        defaultValue Fallback value
		 * @return {Mode}                     Encoding mode
		 */
		exports.from = function from (value, defaultValue) {
		  if (exports.isValid(value)) {
		    return value
		  }

		  try {
		    return fromString(value)
		  } catch (e) {
		    return defaultValue
		  }
		}; 
	} (mode));

	(function (exports) {
		const Utils = utils$1;
		const ECCode = errorCorrectionCode;
		const ECLevel = errorCorrectionLevel;
		const Mode = mode;
		const VersionCheck = versionCheck;

		// Generator polynomial used to encode version information
		const G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
		const G18_BCH = Utils.getBCHDigit(G18);

		function getBestVersionForDataLength (mode, length, errorCorrectionLevel) {
		  for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
		    if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
		      return currentVersion
		    }
		  }

		  return undefined
		}

		function getReservedBitsCount (mode, version) {
		  // Character count indicator + mode indicator bits
		  return Mode.getCharCountIndicator(mode, version) + 4
		}

		function getTotalBitsFromDataArray (segments, version) {
		  let totalBits = 0;

		  segments.forEach(function (data) {
		    const reservedBits = getReservedBitsCount(data.mode, version);
		    totalBits += reservedBits + data.getBitsLength();
		  });

		  return totalBits
		}

		function getBestVersionForMixedData (segments, errorCorrectionLevel) {
		  for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
		    const length = getTotalBitsFromDataArray(segments, currentVersion);
		    if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
		      return currentVersion
		    }
		  }

		  return undefined
		}

		/**
		 * Returns version number from a value.
		 * If value is not a valid version, returns defaultValue
		 *
		 * @param  {Number|String} value        QR Code version
		 * @param  {Number}        defaultValue Fallback value
		 * @return {Number}                     QR Code version number
		 */
		exports.from = function from (value, defaultValue) {
		  if (VersionCheck.isValid(value)) {
		    return parseInt(value, 10)
		  }

		  return defaultValue
		};

		/**
		 * Returns how much data can be stored with the specified QR code version
		 * and error correction level
		 *
		 * @param  {Number} version              QR Code version (1-40)
		 * @param  {Number} errorCorrectionLevel Error correction level
		 * @param  {Mode}   mode                 Data mode
		 * @return {Number}                      Quantity of storable data
		 */
		exports.getCapacity = function getCapacity (version, errorCorrectionLevel, mode) {
		  if (!VersionCheck.isValid(version)) {
		    throw new Error('Invalid QR Code version')
		  }

		  // Use Byte mode as default
		  if (typeof mode === 'undefined') mode = Mode.BYTE;

		  // Total codewords for this QR code version (Data + Error correction)
		  const totalCodewords = Utils.getSymbolTotalCodewords(version);

		  // Total number of error correction codewords
		  const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);

		  // Total number of data codewords
		  const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;

		  if (mode === Mode.MIXED) return dataTotalCodewordsBits

		  const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);

		  // Return max number of storable codewords
		  switch (mode) {
		    case Mode.NUMERIC:
		      return Math.floor((usableBits / 10) * 3)

		    case Mode.ALPHANUMERIC:
		      return Math.floor((usableBits / 11) * 2)

		    case Mode.KANJI:
		      return Math.floor(usableBits / 13)

		    case Mode.BYTE:
		    default:
		      return Math.floor(usableBits / 8)
		  }
		};

		/**
		 * Returns the minimum version needed to contain the amount of data
		 *
		 * @param  {Segment} data                    Segment of data
		 * @param  {Number} [errorCorrectionLevel=H] Error correction level
		 * @param  {Mode} mode                       Data mode
		 * @return {Number}                          QR Code version
		 */
		exports.getBestVersionForData = function getBestVersionForData (data, errorCorrectionLevel) {
		  let seg;

		  const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);

		  if (Array.isArray(data)) {
		    if (data.length > 1) {
		      return getBestVersionForMixedData(data, ecl)
		    }

		    if (data.length === 0) {
		      return 1
		    }

		    seg = data[0];
		  } else {
		    seg = data;
		  }

		  return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl)
		};

		/**
		 * Returns version information with relative error correction bits
		 *
		 * The version information is included in QR Code symbols of version 7 or larger.
		 * It consists of an 18-bit sequence containing 6 data bits,
		 * with 12 error correction bits calculated using the (18, 6) Golay code.
		 *
		 * @param  {Number} version QR Code version
		 * @return {Number}         Encoded version info bits
		 */
		exports.getEncodedBits = function getEncodedBits (version) {
		  if (!VersionCheck.isValid(version) || version < 7) {
		    throw new Error('Invalid QR Code version')
		  }

		  let d = version << 12;

		  while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
		    d ^= (G18 << (Utils.getBCHDigit(d) - G18_BCH));
		  }

		  return (version << 12) | d
		}; 
	} (version));

	var formatInfo = {};

	const Utils$3 = utils$1;

	const G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
	const G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);
	const G15_BCH = Utils$3.getBCHDigit(G15);

	/**
	 * Returns format information with relative error correction bits
	 *
	 * The format information is a 15-bit sequence containing 5 data bits,
	 * with 10 error correction bits calculated using the (15, 5) BCH code.
	 *
	 * @param  {Number} errorCorrectionLevel Error correction level
	 * @param  {Number} mask                 Mask pattern
	 * @return {Number}                      Encoded format information bits
	 */
	formatInfo.getEncodedBits = function getEncodedBits (errorCorrectionLevel, mask) {
	  const data = ((errorCorrectionLevel.bit << 3) | mask);
	  let d = data << 10;

	  while (Utils$3.getBCHDigit(d) - G15_BCH >= 0) {
	    d ^= (G15 << (Utils$3.getBCHDigit(d) - G15_BCH));
	  }

	  // xor final data with mask pattern in order to ensure that
	  // no combination of Error Correction Level and data mask pattern
	  // will result in an all-zero data string
	  return ((data << 10) | d) ^ G15_MASK
	};

	var segments = {};

	const Mode$4 = mode;

	function NumericData (data) {
	  this.mode = Mode$4.NUMERIC;
	  this.data = data.toString();
	}

	NumericData.getBitsLength = function getBitsLength (length) {
	  return 10 * Math.floor(length / 3) + ((length % 3) ? ((length % 3) * 3 + 1) : 0)
	};

	NumericData.prototype.getLength = function getLength () {
	  return this.data.length
	};

	NumericData.prototype.getBitsLength = function getBitsLength () {
	  return NumericData.getBitsLength(this.data.length)
	};

	NumericData.prototype.write = function write (bitBuffer) {
	  let i, group, value;

	  // The input data string is divided into groups of three digits,
	  // and each group is converted to its 10-bit binary equivalent.
	  for (i = 0; i + 3 <= this.data.length; i += 3) {
	    group = this.data.substr(i, 3);
	    value = parseInt(group, 10);

	    bitBuffer.put(value, 10);
	  }

	  // If the number of input digits is not an exact multiple of three,
	  // the final one or two digits are converted to 4 or 7 bits respectively.
	  const remainingNum = this.data.length - i;
	  if (remainingNum > 0) {
	    group = this.data.substr(i);
	    value = parseInt(group, 10);

	    bitBuffer.put(value, remainingNum * 3 + 1);
	  }
	};

	var numericData = NumericData;

	const Mode$3 = mode;

	/**
	 * Array of characters available in alphanumeric mode
	 *
	 * As per QR Code specification, to each character
	 * is assigned a value from 0 to 44 which in this case coincides
	 * with the array index
	 *
	 * @type {Array}
	 */
	const ALPHA_NUM_CHARS = [
	  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
	  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
	  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
	  ' ', '$', '%', '*', '+', '-', '.', '/', ':'
	];

	function AlphanumericData (data) {
	  this.mode = Mode$3.ALPHANUMERIC;
	  this.data = data;
	}

	AlphanumericData.getBitsLength = function getBitsLength (length) {
	  return 11 * Math.floor(length / 2) + 6 * (length % 2)
	};

	AlphanumericData.prototype.getLength = function getLength () {
	  return this.data.length
	};

	AlphanumericData.prototype.getBitsLength = function getBitsLength () {
	  return AlphanumericData.getBitsLength(this.data.length)
	};

	AlphanumericData.prototype.write = function write (bitBuffer) {
	  let i;

	  // Input data characters are divided into groups of two characters
	  // and encoded as 11-bit binary codes.
	  for (i = 0; i + 2 <= this.data.length; i += 2) {
	    // The character value of the first character is multiplied by 45
	    let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;

	    // The character value of the second digit is added to the product
	    value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);

	    // The sum is then stored as 11-bit binary number
	    bitBuffer.put(value, 11);
	  }

	  // If the number of input data characters is not a multiple of two,
	  // the character value of the final character is encoded as a 6-bit binary number.
	  if (this.data.length % 2) {
	    bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
	  }
	};

	var alphanumericData = AlphanumericData;

	var encodeUtf8$1 = function encodeUtf8 (input) {
	  var result = [];
	  var size = input.length;

	  for (var index = 0; index < size; index++) {
	    var point = input.charCodeAt(index);

	    if (point >= 0xD800 && point <= 0xDBFF && size > index + 1) {
	      var second = input.charCodeAt(index + 1);

	      if (second >= 0xDC00 && second <= 0xDFFF) {
	        // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
	        point = (point - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
	        index += 1;
	      }
	    }

	    // US-ASCII
	    if (point < 0x80) {
	      result.push(point);
	      continue
	    }

	    // 2-byte UTF-8
	    if (point < 0x800) {
	      result.push((point >> 6) | 192);
	      result.push((point & 63) | 128);
	      continue
	    }

	    // 3-byte UTF-8
	    if (point < 0xD800 || (point >= 0xE000 && point < 0x10000)) {
	      result.push((point >> 12) | 224);
	      result.push(((point >> 6) & 63) | 128);
	      result.push((point & 63) | 128);
	      continue
	    }

	    // 4-byte UTF-8
	    if (point >= 0x10000 && point <= 0x10FFFF) {
	      result.push((point >> 18) | 240);
	      result.push(((point >> 12) & 63) | 128);
	      result.push(((point >> 6) & 63) | 128);
	      result.push((point & 63) | 128);
	      continue
	    }

	    // Invalid character
	    result.push(0xEF, 0xBF, 0xBD);
	  }

	  return new Uint8Array(result).buffer
	};

	const encodeUtf8 = encodeUtf8$1;
	const Mode$2 = mode;

	function ByteData (data) {
	  this.mode = Mode$2.BYTE;
	  if (typeof (data) === 'string') {
	    data = encodeUtf8(data);
	  }
	  this.data = new Uint8Array(data);
	}

	ByteData.getBitsLength = function getBitsLength (length) {
	  return length * 8
	};

	ByteData.prototype.getLength = function getLength () {
	  return this.data.length
	};

	ByteData.prototype.getBitsLength = function getBitsLength () {
	  return ByteData.getBitsLength(this.data.length)
	};

	ByteData.prototype.write = function (bitBuffer) {
	  for (let i = 0, l = this.data.length; i < l; i++) {
	    bitBuffer.put(this.data[i], 8);
	  }
	};

	var byteData = ByteData;

	const Mode$1 = mode;
	const Utils$2 = utils$1;

	function KanjiData (data) {
	  this.mode = Mode$1.KANJI;
	  this.data = data;
	}

	KanjiData.getBitsLength = function getBitsLength (length) {
	  return length * 13
	};

	KanjiData.prototype.getLength = function getLength () {
	  return this.data.length
	};

	KanjiData.prototype.getBitsLength = function getBitsLength () {
	  return KanjiData.getBitsLength(this.data.length)
	};

	KanjiData.prototype.write = function (bitBuffer) {
	  let i;

	  // In the Shift JIS system, Kanji characters are represented by a two byte combination.
	  // These byte values are shifted from the JIS X 0208 values.
	  // JIS X 0208 gives details of the shift coded representation.
	  for (i = 0; i < this.data.length; i++) {
	    let value = Utils$2.toSJIS(this.data[i]);

	    // For characters with Shift JIS values from 0x8140 to 0x9FFC:
	    if (value >= 0x8140 && value <= 0x9FFC) {
	      // Subtract 0x8140 from Shift JIS value
	      value -= 0x8140;

	    // For characters with Shift JIS values from 0xE040 to 0xEBBF
	    } else if (value >= 0xE040 && value <= 0xEBBF) {
	      // Subtract 0xC140 from Shift JIS value
	      value -= 0xC140;
	    } else {
	      throw new Error(
	        'Invalid SJIS character: ' + this.data[i] + '\n' +
	        'Make sure your charset is UTF-8')
	    }

	    // Multiply most significant byte of result by 0xC0
	    // and add least significant byte to product
	    value = (((value >>> 8) & 0xff) * 0xC0) + (value & 0xff);

	    // Convert result to a 13-bit binary string
	    bitBuffer.put(value, 13);
	  }
	};

	var kanjiData = KanjiData;

	var dijkstra = {exports: {}};

	(function (module) {

		/******************************************************************************
		 * Created 2008-08-19.
		 *
		 * Dijkstra path-finding functions. Adapted from the Dijkstar Python project.
		 *
		 * Copyright (C) 2008
		 *   Wyatt Baldwin <self@wyattbaldwin.com>
		 *   All rights reserved
		 *
		 * Licensed under the MIT license.
		 *
		 *   http://www.opensource.org/licenses/mit-license.php
		 *
		 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
		 * THE SOFTWARE.
		 *****************************************************************************/
		var dijkstra = {
		  single_source_shortest_paths: function(graph, s, d) {
		    // Predecessor map for each node that has been encountered.
		    // node ID => predecessor node ID
		    var predecessors = {};

		    // Costs of shortest paths from s to all nodes encountered.
		    // node ID => cost
		    var costs = {};
		    costs[s] = 0;

		    // Costs of shortest paths from s to all nodes encountered; differs from
		    // `costs` in that it provides easy access to the node that currently has
		    // the known shortest path from s.
		    // XXX: Do we actually need both `costs` and `open`?
		    var open = dijkstra.PriorityQueue.make();
		    open.push(s, 0);

		    var closest,
		        u, v,
		        cost_of_s_to_u,
		        adjacent_nodes,
		        cost_of_e,
		        cost_of_s_to_u_plus_cost_of_e,
		        cost_of_s_to_v,
		        first_visit;
		    while (!open.empty()) {
		      // In the nodes remaining in graph that have a known cost from s,
		      // find the node, u, that currently has the shortest path from s.
		      closest = open.pop();
		      u = closest.value;
		      cost_of_s_to_u = closest.cost;

		      // Get nodes adjacent to u...
		      adjacent_nodes = graph[u] || {};

		      // ...and explore the edges that connect u to those nodes, updating
		      // the cost of the shortest paths to any or all of those nodes as
		      // necessary. v is the node across the current edge from u.
		      for (v in adjacent_nodes) {
		        if (adjacent_nodes.hasOwnProperty(v)) {
		          // Get the cost of the edge running from u to v.
		          cost_of_e = adjacent_nodes[v];

		          // Cost of s to u plus the cost of u to v across e--this is *a*
		          // cost from s to v that may or may not be less than the current
		          // known cost to v.
		          cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;

		          // If we haven't visited v yet OR if the current known cost from s to
		          // v is greater than the new cost we just found (cost of s to u plus
		          // cost of u to v across e), update v's cost in the cost list and
		          // update v's predecessor in the predecessor list (it's now u).
		          cost_of_s_to_v = costs[v];
		          first_visit = (typeof costs[v] === 'undefined');
		          if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
		            costs[v] = cost_of_s_to_u_plus_cost_of_e;
		            open.push(v, cost_of_s_to_u_plus_cost_of_e);
		            predecessors[v] = u;
		          }
		        }
		      }
		    }

		    if (typeof d !== 'undefined' && typeof costs[d] === 'undefined') {
		      var msg = ['Could not find a path from ', s, ' to ', d, '.'].join('');
		      throw new Error(msg);
		    }

		    return predecessors;
		  },

		  extract_shortest_path_from_predecessor_list: function(predecessors, d) {
		    var nodes = [];
		    var u = d;
		    while (u) {
		      nodes.push(u);
		      predecessors[u];
		      u = predecessors[u];
		    }
		    nodes.reverse();
		    return nodes;
		  },

		  find_path: function(graph, s, d) {
		    var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
		    return dijkstra.extract_shortest_path_from_predecessor_list(
		      predecessors, d);
		  },

		  /**
		   * A very naive priority queue implementation.
		   */
		  PriorityQueue: {
		    make: function (opts) {
		      var T = dijkstra.PriorityQueue,
		          t = {},
		          key;
		      opts = opts || {};
		      for (key in T) {
		        if (T.hasOwnProperty(key)) {
		          t[key] = T[key];
		        }
		      }
		      t.queue = [];
		      t.sorter = opts.sorter || T.default_sorter;
		      return t;
		    },

		    default_sorter: function (a, b) {
		      return a.cost - b.cost;
		    },

		    /**
		     * Add a new item to the queue and ensure the highest priority element
		     * is at the front of the queue.
		     */
		    push: function (value, cost) {
		      var item = {value: value, cost: cost};
		      this.queue.push(item);
		      this.queue.sort(this.sorter);
		    },

		    /**
		     * Return the highest priority element in the queue.
		     */
		    pop: function () {
		      return this.queue.shift();
		    },

		    empty: function () {
		      return this.queue.length === 0;
		    }
		  }
		};


		// node.js module exports
		{
		  module.exports = dijkstra;
		} 
	} (dijkstra));

	var dijkstraExports = dijkstra.exports;

	(function (exports) {
		const Mode = mode;
		const NumericData = numericData;
		const AlphanumericData = alphanumericData;
		const ByteData = byteData;
		const KanjiData = kanjiData;
		const Regex = regex;
		const Utils = utils$1;
		const dijkstra = dijkstraExports;

		/**
		 * Returns UTF8 byte length
		 *
		 * @param  {String} str Input string
		 * @return {Number}     Number of byte
		 */
		function getStringByteLength (str) {
		  return unescape(encodeURIComponent(str)).length
		}

		/**
		 * Get a list of segments of the specified mode
		 * from a string
		 *
		 * @param  {Mode}   mode Segment mode
		 * @param  {String} str  String to process
		 * @return {Array}       Array of object with segments data
		 */
		function getSegments (regex, mode, str) {
		  const segments = [];
		  let result;

		  while ((result = regex.exec(str)) !== null) {
		    segments.push({
		      data: result[0],
		      index: result.index,
		      mode: mode,
		      length: result[0].length
		    });
		  }

		  return segments
		}

		/**
		 * Extracts a series of segments with the appropriate
		 * modes from a string
		 *
		 * @param  {String} dataStr Input string
		 * @return {Array}          Array of object with segments data
		 */
		function getSegmentsFromString (dataStr) {
		  const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
		  const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
		  let byteSegs;
		  let kanjiSegs;

		  if (Utils.isKanjiModeEnabled()) {
		    byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
		    kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
		  } else {
		    byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
		    kanjiSegs = [];
		  }

		  const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);

		  return segs
		    .sort(function (s1, s2) {
		      return s1.index - s2.index
		    })
		    .map(function (obj) {
		      return {
		        data: obj.data,
		        mode: obj.mode,
		        length: obj.length
		      }
		    })
		}

		/**
		 * Returns how many bits are needed to encode a string of
		 * specified length with the specified mode
		 *
		 * @param  {Number} length String length
		 * @param  {Mode} mode     Segment mode
		 * @return {Number}        Bit length
		 */
		function getSegmentBitsLength (length, mode) {
		  switch (mode) {
		    case Mode.NUMERIC:
		      return NumericData.getBitsLength(length)
		    case Mode.ALPHANUMERIC:
		      return AlphanumericData.getBitsLength(length)
		    case Mode.KANJI:
		      return KanjiData.getBitsLength(length)
		    case Mode.BYTE:
		      return ByteData.getBitsLength(length)
		  }
		}

		/**
		 * Merges adjacent segments which have the same mode
		 *
		 * @param  {Array} segs Array of object with segments data
		 * @return {Array}      Array of object with segments data
		 */
		function mergeSegments (segs) {
		  return segs.reduce(function (acc, curr) {
		    const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
		    if (prevSeg && prevSeg.mode === curr.mode) {
		      acc[acc.length - 1].data += curr.data;
		      return acc
		    }

		    acc.push(curr);
		    return acc
		  }, [])
		}

		/**
		 * Generates a list of all possible nodes combination which
		 * will be used to build a segments graph.
		 *
		 * Nodes are divided by groups. Each group will contain a list of all the modes
		 * in which is possible to encode the given text.
		 *
		 * For example the text '12345' can be encoded as Numeric, Alphanumeric or Byte.
		 * The group for '12345' will contain then 3 objects, one for each
		 * possible encoding mode.
		 *
		 * Each node represents a possible segment.
		 *
		 * @param  {Array} segs Array of object with segments data
		 * @return {Array}      Array of object with segments data
		 */
		function buildNodes (segs) {
		  const nodes = [];
		  for (let i = 0; i < segs.length; i++) {
		    const seg = segs[i];

		    switch (seg.mode) {
		      case Mode.NUMERIC:
		        nodes.push([seg,
		          { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
		          { data: seg.data, mode: Mode.BYTE, length: seg.length }
		        ]);
		        break
		      case Mode.ALPHANUMERIC:
		        nodes.push([seg,
		          { data: seg.data, mode: Mode.BYTE, length: seg.length }
		        ]);
		        break
		      case Mode.KANJI:
		        nodes.push([seg,
		          { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
		        ]);
		        break
		      case Mode.BYTE:
		        nodes.push([
		          { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
		        ]);
		    }
		  }

		  return nodes
		}

		/**
		 * Builds a graph from a list of nodes.
		 * All segments in each node group will be connected with all the segments of
		 * the next group and so on.
		 *
		 * At each connection will be assigned a weight depending on the
		 * segment's byte length.
		 *
		 * @param  {Array} nodes    Array of object with segments data
		 * @param  {Number} version QR Code version
		 * @return {Object}         Graph of all possible segments
		 */
		function buildGraph (nodes, version) {
		  const table = {};
		  const graph = { start: {} };
		  let prevNodeIds = ['start'];

		  for (let i = 0; i < nodes.length; i++) {
		    const nodeGroup = nodes[i];
		    const currentNodeIds = [];

		    for (let j = 0; j < nodeGroup.length; j++) {
		      const node = nodeGroup[j];
		      const key = '' + i + j;

		      currentNodeIds.push(key);
		      table[key] = { node: node, lastCount: 0 };
		      graph[key] = {};

		      for (let n = 0; n < prevNodeIds.length; n++) {
		        const prevNodeId = prevNodeIds[n];

		        if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
		          graph[prevNodeId][key] =
		            getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) -
		            getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);

		          table[prevNodeId].lastCount += node.length;
		        } else {
		          if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;

		          graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) +
		            4 + Mode.getCharCountIndicator(node.mode, version); // switch cost
		        }
		      }
		    }

		    prevNodeIds = currentNodeIds;
		  }

		  for (let n = 0; n < prevNodeIds.length; n++) {
		    graph[prevNodeIds[n]].end = 0;
		  }

		  return { map: graph, table: table }
		}

		/**
		 * Builds a segment from a specified data and mode.
		 * If a mode is not specified, the more suitable will be used.
		 *
		 * @param  {String} data             Input data
		 * @param  {Mode | String} modesHint Data mode
		 * @return {Segment}                 Segment
		 */
		function buildSingleSegment (data, modesHint) {
		  let mode;
		  const bestMode = Mode.getBestModeForData(data);

		  mode = Mode.from(modesHint, bestMode);

		  // Make sure data can be encoded
		  if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
		    throw new Error('"' + data + '"' +
		      ' cannot be encoded with mode ' + Mode.toString(mode) +
		      '.\n Suggested mode is: ' + Mode.toString(bestMode))
		  }

		  // Use Mode.BYTE if Kanji support is disabled
		  if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
		    mode = Mode.BYTE;
		  }

		  switch (mode) {
		    case Mode.NUMERIC:
		      return new NumericData(data)

		    case Mode.ALPHANUMERIC:
		      return new AlphanumericData(data)

		    case Mode.KANJI:
		      return new KanjiData(data)

		    case Mode.BYTE:
		      return new ByteData(data)
		  }
		}

		/**
		 * Builds a list of segments from an array.
		 * Array can contain Strings or Objects with segment's info.
		 *
		 * For each item which is a string, will be generated a segment with the given
		 * string and the more appropriate encoding mode.
		 *
		 * For each item which is an object, will be generated a segment with the given
		 * data and mode.
		 * Objects must contain at least the property "data".
		 * If property "mode" is not present, the more suitable mode will be used.
		 *
		 * @param  {Array} array Array of objects with segments data
		 * @return {Array}       Array of Segments
		 */
		exports.fromArray = function fromArray (array) {
		  return array.reduce(function (acc, seg) {
		    if (typeof seg === 'string') {
		      acc.push(buildSingleSegment(seg, null));
		    } else if (seg.data) {
		      acc.push(buildSingleSegment(seg.data, seg.mode));
		    }

		    return acc
		  }, [])
		};

		/**
		 * Builds an optimized sequence of segments from a string,
		 * which will produce the shortest possible bitstream.
		 *
		 * @param  {String} data    Input string
		 * @param  {Number} version QR Code version
		 * @return {Array}          Array of segments
		 */
		exports.fromString = function fromString (data, version) {
		  const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());

		  const nodes = buildNodes(segs);
		  const graph = buildGraph(nodes, version);
		  const path = dijkstra.find_path(graph.map, 'start', 'end');

		  const optimizedSegs = [];
		  for (let i = 1; i < path.length - 1; i++) {
		    optimizedSegs.push(graph.table[path[i]].node);
		  }

		  return exports.fromArray(mergeSegments(optimizedSegs))
		};

		/**
		 * Splits a string in various segments with the modes which
		 * best represent their content.
		 * The produced segments are far from being optimized.
		 * The output of this function is only used to estimate a QR Code version
		 * which may contain the data.
		 *
		 * @param  {string} data Input string
		 * @return {Array}       Array of segments
		 */
		exports.rawSplit = function rawSplit (data) {
		  return exports.fromArray(
		    getSegmentsFromString(data, Utils.isKanjiModeEnabled())
		  )
		}; 
	} (segments));

	const Utils$1 = utils$1;
	const ECLevel = errorCorrectionLevel;
	const BitBuffer = bitBuffer;
	const BitMatrix = bitMatrix;
	const AlignmentPattern = alignmentPattern;
	const FinderPattern = finderPattern;
	const MaskPattern = maskPattern;
	const ECCode = errorCorrectionCode;
	const ReedSolomonEncoder = reedSolomonEncoder;
	const Version = version;
	const FormatInfo = formatInfo;
	const Mode = mode;
	const Segments = segments;

	/**
	 * QRCode for JavaScript
	 *
	 * modified by Ryan Day for nodejs support
	 * Copyright (c) 2011 Ryan Day
	 *
	 * Licensed under the MIT license:
	 *   http://www.opensource.org/licenses/mit-license.php
	 *
	//---------------------------------------------------------------------
	// QRCode for JavaScript
	//
	// Copyright (c) 2009 Kazuhiko Arase
	//
	// URL: http://www.d-project.com/
	//
	// Licensed under the MIT license:
	//   http://www.opensource.org/licenses/mit-license.php
	//
	// The word "QR Code" is registered trademark of
	// DENSO WAVE INCORPORATED
	//   http://www.denso-wave.com/qrcode/faqpatent-e.html
	//
	//---------------------------------------------------------------------
	*/

	/**
	 * Add finder patterns bits to matrix
	 *
	 * @param  {BitMatrix} matrix  Modules matrix
	 * @param  {Number}    version QR Code version
	 */
	function setupFinderPattern (matrix, version) {
	  const size = matrix.size;
	  const pos = FinderPattern.getPositions(version);

	  for (let i = 0; i < pos.length; i++) {
	    const row = pos[i][0];
	    const col = pos[i][1];

	    for (let r = -1; r <= 7; r++) {
	      if (row + r <= -1 || size <= row + r) continue

	      for (let c = -1; c <= 7; c++) {
	        if (col + c <= -1 || size <= col + c) continue

	        if ((r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
	          (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
	          (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
	          matrix.set(row + r, col + c, true, true);
	        } else {
	          matrix.set(row + r, col + c, false, true);
	        }
	      }
	    }
	  }
	}

	/**
	 * Add timing pattern bits to matrix
	 *
	 * Note: this function must be called before {@link setupAlignmentPattern}
	 *
	 * @param  {BitMatrix} matrix Modules matrix
	 */
	function setupTimingPattern (matrix) {
	  const size = matrix.size;

	  for (let r = 8; r < size - 8; r++) {
	    const value = r % 2 === 0;
	    matrix.set(r, 6, value, true);
	    matrix.set(6, r, value, true);
	  }
	}

	/**
	 * Add alignment patterns bits to matrix
	 *
	 * Note: this function must be called after {@link setupTimingPattern}
	 *
	 * @param  {BitMatrix} matrix  Modules matrix
	 * @param  {Number}    version QR Code version
	 */
	function setupAlignmentPattern (matrix, version) {
	  const pos = AlignmentPattern.getPositions(version);

	  for (let i = 0; i < pos.length; i++) {
	    const row = pos[i][0];
	    const col = pos[i][1];

	    for (let r = -2; r <= 2; r++) {
	      for (let c = -2; c <= 2; c++) {
	        if (r === -2 || r === 2 || c === -2 || c === 2 ||
	          (r === 0 && c === 0)) {
	          matrix.set(row + r, col + c, true, true);
	        } else {
	          matrix.set(row + r, col + c, false, true);
	        }
	      }
	    }
	  }
	}

	/**
	 * Add version info bits to matrix
	 *
	 * @param  {BitMatrix} matrix  Modules matrix
	 * @param  {Number}    version QR Code version
	 */
	function setupVersionInfo (matrix, version) {
	  const size = matrix.size;
	  const bits = Version.getEncodedBits(version);
	  let row, col, mod;

	  for (let i = 0; i < 18; i++) {
	    row = Math.floor(i / 3);
	    col = i % 3 + size - 8 - 3;
	    mod = ((bits >> i) & 1) === 1;

	    matrix.set(row, col, mod, true);
	    matrix.set(col, row, mod, true);
	  }
	}

	/**
	 * Add format info bits to matrix
	 *
	 * @param  {BitMatrix} matrix               Modules matrix
	 * @param  {ErrorCorrectionLevel}    errorCorrectionLevel Error correction level
	 * @param  {Number}    maskPattern          Mask pattern reference value
	 */
	function setupFormatInfo (matrix, errorCorrectionLevel, maskPattern) {
	  const size = matrix.size;
	  const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
	  let i, mod;

	  for (i = 0; i < 15; i++) {
	    mod = ((bits >> i) & 1) === 1;

	    // vertical
	    if (i < 6) {
	      matrix.set(i, 8, mod, true);
	    } else if (i < 8) {
	      matrix.set(i + 1, 8, mod, true);
	    } else {
	      matrix.set(size - 15 + i, 8, mod, true);
	    }

	    // horizontal
	    if (i < 8) {
	      matrix.set(8, size - i - 1, mod, true);
	    } else if (i < 9) {
	      matrix.set(8, 15 - i - 1 + 1, mod, true);
	    } else {
	      matrix.set(8, 15 - i - 1, mod, true);
	    }
	  }

	  // fixed module
	  matrix.set(size - 8, 8, 1, true);
	}

	/**
	 * Add encoded data bits to matrix
	 *
	 * @param  {BitMatrix}  matrix Modules matrix
	 * @param  {Uint8Array} data   Data codewords
	 */
	function setupData (matrix, data) {
	  const size = matrix.size;
	  let inc = -1;
	  let row = size - 1;
	  let bitIndex = 7;
	  let byteIndex = 0;

	  for (let col = size - 1; col > 0; col -= 2) {
	    if (col === 6) col--;

	    while (true) {
	      for (let c = 0; c < 2; c++) {
	        if (!matrix.isReserved(row, col - c)) {
	          let dark = false;

	          if (byteIndex < data.length) {
	            dark = (((data[byteIndex] >>> bitIndex) & 1) === 1);
	          }

	          matrix.set(row, col - c, dark);
	          bitIndex--;

	          if (bitIndex === -1) {
	            byteIndex++;
	            bitIndex = 7;
	          }
	        }
	      }

	      row += inc;

	      if (row < 0 || size <= row) {
	        row -= inc;
	        inc = -inc;
	        break
	      }
	    }
	  }
	}

	/**
	 * Create encoded codewords from data input
	 *
	 * @param  {Number}   version              QR Code version
	 * @param  {ErrorCorrectionLevel}   errorCorrectionLevel Error correction level
	 * @param  {ByteData} data                 Data input
	 * @return {Uint8Array}                    Buffer containing encoded codewords
	 */
	function createData (version, errorCorrectionLevel, segments) {
	  // Prepare data buffer
	  const buffer = new BitBuffer();

	  segments.forEach(function (data) {
	    // prefix data with mode indicator (4 bits)
	    buffer.put(data.mode.bit, 4);

	    // Prefix data with character count indicator.
	    // The character count indicator is a string of bits that represents the
	    // number of characters that are being encoded.
	    // The character count indicator must be placed after the mode indicator
	    // and must be a certain number of bits long, depending on the QR version
	    // and data mode
	    // @see {@link Mode.getCharCountIndicator}.
	    buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version));

	    // add binary data sequence to buffer
	    data.write(buffer);
	  });

	  // Calculate required number of bits
	  const totalCodewords = Utils$1.getSymbolTotalCodewords(version);
	  const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
	  const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;

	  // Add a terminator.
	  // If the bit string is shorter than the total number of required bits,
	  // a terminator of up to four 0s must be added to the right side of the string.
	  // If the bit string is more than four bits shorter than the required number of bits,
	  // add four 0s to the end.
	  if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
	    buffer.put(0, 4);
	  }

	  // If the bit string is fewer than four bits shorter, add only the number of 0s that
	  // are needed to reach the required number of bits.

	  // After adding the terminator, if the number of bits in the string is not a multiple of 8,
	  // pad the string on the right with 0s to make the string's length a multiple of 8.
	  while (buffer.getLengthInBits() % 8 !== 0) {
	    buffer.putBit(0);
	  }

	  // Add pad bytes if the string is still shorter than the total number of required bits.
	  // Extend the buffer to fill the data capacity of the symbol corresponding to
	  // the Version and Error Correction Level by adding the Pad Codewords 11101100 (0xEC)
	  // and 00010001 (0x11) alternately.
	  const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
	  for (let i = 0; i < remainingByte; i++) {
	    buffer.put(i % 2 ? 0x11 : 0xEC, 8);
	  }

	  return createCodewords(buffer, version, errorCorrectionLevel)
	}

	/**
	 * Encode input data with Reed-Solomon and return codewords with
	 * relative error correction bits
	 *
	 * @param  {BitBuffer} bitBuffer            Data to encode
	 * @param  {Number}    version              QR Code version
	 * @param  {ErrorCorrectionLevel} errorCorrectionLevel Error correction level
	 * @return {Uint8Array}                     Buffer containing encoded codewords
	 */
	function createCodewords (bitBuffer, version, errorCorrectionLevel) {
	  // Total codewords for this QR code version (Data + Error correction)
	  const totalCodewords = Utils$1.getSymbolTotalCodewords(version);

	  // Total number of error correction codewords
	  const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);

	  // Total number of data codewords
	  const dataTotalCodewords = totalCodewords - ecTotalCodewords;

	  // Total number of blocks
	  const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel);

	  // Calculate how many blocks each group should contain
	  const blocksInGroup2 = totalCodewords % ecTotalBlocks;
	  const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;

	  const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);

	  const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
	  const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;

	  // Number of EC codewords is the same for both groups
	  const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;

	  // Initialize a Reed-Solomon encoder with a generator polynomial of degree ecCount
	  const rs = new ReedSolomonEncoder(ecCount);

	  let offset = 0;
	  const dcData = new Array(ecTotalBlocks);
	  const ecData = new Array(ecTotalBlocks);
	  let maxDataSize = 0;
	  const buffer = new Uint8Array(bitBuffer.buffer);

	  // Divide the buffer into the required number of blocks
	  for (let b = 0; b < ecTotalBlocks; b++) {
	    const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;

	    // extract a block of data from buffer
	    dcData[b] = buffer.slice(offset, offset + dataSize);

	    // Calculate EC codewords for this data block
	    ecData[b] = rs.encode(dcData[b]);

	    offset += dataSize;
	    maxDataSize = Math.max(maxDataSize, dataSize);
	  }

	  // Create final data
	  // Interleave the data and error correction codewords from each block
	  const data = new Uint8Array(totalCodewords);
	  let index = 0;
	  let i, r;

	  // Add data codewords
	  for (i = 0; i < maxDataSize; i++) {
	    for (r = 0; r < ecTotalBlocks; r++) {
	      if (i < dcData[r].length) {
	        data[index++] = dcData[r][i];
	      }
	    }
	  }

	  // Apped EC codewords
	  for (i = 0; i < ecCount; i++) {
	    for (r = 0; r < ecTotalBlocks; r++) {
	      data[index++] = ecData[r][i];
	    }
	  }

	  return data
	}

	/**
	 * Build QR Code symbol
	 *
	 * @param  {String} data                 Input string
	 * @param  {Number} version              QR Code version
	 * @param  {ErrorCorretionLevel} errorCorrectionLevel Error level
	 * @param  {MaskPattern} maskPattern     Mask pattern
	 * @return {Object}                      Object containing symbol data
	 */
	function createSymbol (data, version, errorCorrectionLevel, maskPattern) {
	  let segments;

	  if (Array.isArray(data)) {
	    segments = Segments.fromArray(data);
	  } else if (typeof data === 'string') {
	    let estimatedVersion = version;

	    if (!estimatedVersion) {
	      const rawSegments = Segments.rawSplit(data);

	      // Estimate best version that can contain raw splitted segments
	      estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
	    }

	    // Build optimized segments
	    // If estimated version is undefined, try with the highest version
	    segments = Segments.fromString(data, estimatedVersion || 40);
	  } else {
	    throw new Error('Invalid data')
	  }

	  // Get the min version that can contain data
	  const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);

	  // If no version is found, data cannot be stored
	  if (!bestVersion) {
	    throw new Error('The amount of data is too big to be stored in a QR Code')
	  }

	  // If not specified, use min version as default
	  if (!version) {
	    version = bestVersion;

	  // Check if the specified version can contain the data
	  } else if (version < bestVersion) {
	    throw new Error('\n' +
	      'The chosen QR Code version cannot contain this amount of data.\n' +
	      'Minimum version required to store current data is: ' + bestVersion + '.\n'
	    )
	  }

	  const dataBits = createData(version, errorCorrectionLevel, segments);

	  // Allocate matrix buffer
	  const moduleCount = Utils$1.getSymbolSize(version);
	  const modules = new BitMatrix(moduleCount);

	  // Add function modules
	  setupFinderPattern(modules, version);
	  setupTimingPattern(modules);
	  setupAlignmentPattern(modules, version);

	  // Add temporary dummy bits for format info just to set them as reserved.
	  // This is needed to prevent these bits from being masked by {@link MaskPattern.applyMask}
	  // since the masking operation must be performed only on the encoding region.
	  // These blocks will be replaced with correct values later in code.
	  setupFormatInfo(modules, errorCorrectionLevel, 0);

	  if (version >= 7) {
	    setupVersionInfo(modules, version);
	  }

	  // Add data codewords
	  setupData(modules, dataBits);

	  if (isNaN(maskPattern)) {
	    // Find best mask pattern
	    maskPattern = MaskPattern.getBestMask(modules,
	      setupFormatInfo.bind(null, modules, errorCorrectionLevel));
	  }

	  // Apply mask pattern
	  MaskPattern.applyMask(maskPattern, modules);

	  // Replace format info bits with correct values
	  setupFormatInfo(modules, errorCorrectionLevel, maskPattern);

	  return {
	    modules: modules,
	    version: version,
	    errorCorrectionLevel: errorCorrectionLevel,
	    maskPattern: maskPattern,
	    segments: segments
	  }
	}

	/**
	 * QR Code
	 *
	 * @param {String | Array} data                 Input data
	 * @param {Object} options                      Optional configurations
	 * @param {Number} options.version              QR Code version
	 * @param {String} options.errorCorrectionLevel Error correction level
	 * @param {Function} options.toSJISFunc         Helper func to convert utf8 to sjis
	 */
	qrcode.create = function create (data, options) {
	  if (typeof data === 'undefined' || data === '') {
	    throw new Error('No input text')
	  }

	  let errorCorrectionLevel = ECLevel.M;
	  let version;
	  let mask;

	  if (typeof options !== 'undefined') {
	    // Use higher error correction level as default
	    errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
	    version = Version.from(options.version);
	    mask = MaskPattern.from(options.maskPattern);

	    if (options.toSJISFunc) {
	      Utils$1.setToSJISFunction(options.toSJISFunc);
	    }
	  }

	  return createSymbol(data, version, errorCorrectionLevel, mask)
	};

	var canvas = {};

	var utils = {};

	(function (exports) {
		function hex2rgba (hex) {
		  if (typeof hex === 'number') {
		    hex = hex.toString();
		  }

		  if (typeof hex !== 'string') {
		    throw new Error('Color should be defined as hex string')
		  }

		  let hexCode = hex.slice().replace('#', '').split('');
		  if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
		    throw new Error('Invalid hex color: ' + hex)
		  }

		  // Convert from short to long form (fff -> ffffff)
		  if (hexCode.length === 3 || hexCode.length === 4) {
		    hexCode = Array.prototype.concat.apply([], hexCode.map(function (c) {
		      return [c, c]
		    }));
		  }

		  // Add default alpha value
		  if (hexCode.length === 6) hexCode.push('F', 'F');

		  const hexValue = parseInt(hexCode.join(''), 16);

		  return {
		    r: (hexValue >> 24) & 255,
		    g: (hexValue >> 16) & 255,
		    b: (hexValue >> 8) & 255,
		    a: hexValue & 255,
		    hex: '#' + hexCode.slice(0, 6).join('')
		  }
		}

		exports.getOptions = function getOptions (options) {
		  if (!options) options = {};
		  if (!options.color) options.color = {};

		  const margin = typeof options.margin === 'undefined' ||
		    options.margin === null ||
		    options.margin < 0
		    ? 4
		    : options.margin;

		  const width = options.width && options.width >= 21 ? options.width : undefined;
		  const scale = options.scale || 4;

		  return {
		    width: width,
		    scale: width ? 4 : scale,
		    margin: margin,
		    color: {
		      dark: hex2rgba(options.color.dark || '#000000ff'),
		      light: hex2rgba(options.color.light || '#ffffffff')
		    },
		    type: options.type,
		    rendererOpts: options.rendererOpts || {}
		  }
		};

		exports.getScale = function getScale (qrSize, opts) {
		  return opts.width && opts.width >= qrSize + opts.margin * 2
		    ? opts.width / (qrSize + opts.margin * 2)
		    : opts.scale
		};

		exports.getImageWidth = function getImageWidth (qrSize, opts) {
		  const scale = exports.getScale(qrSize, opts);
		  return Math.floor((qrSize + opts.margin * 2) * scale)
		};

		exports.qrToImageData = function qrToImageData (imgData, qr, opts) {
		  const size = qr.modules.size;
		  const data = qr.modules.data;
		  const scale = exports.getScale(size, opts);
		  const symbolSize = Math.floor((size + opts.margin * 2) * scale);
		  const scaledMargin = opts.margin * scale;
		  const palette = [opts.color.light, opts.color.dark];

		  for (let i = 0; i < symbolSize; i++) {
		    for (let j = 0; j < symbolSize; j++) {
		      let posDst = (i * symbolSize + j) * 4;
		      let pxColor = opts.color.light;

		      if (i >= scaledMargin && j >= scaledMargin &&
		        i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
		        const iSrc = Math.floor((i - scaledMargin) / scale);
		        const jSrc = Math.floor((j - scaledMargin) / scale);
		        pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
		      }

		      imgData[posDst++] = pxColor.r;
		      imgData[posDst++] = pxColor.g;
		      imgData[posDst++] = pxColor.b;
		      imgData[posDst] = pxColor.a;
		    }
		  }
		}; 
	} (utils));

	(function (exports) {
		const Utils = utils;

		function clearCanvas (ctx, canvas, size) {
		  ctx.clearRect(0, 0, canvas.width, canvas.height);

		  if (!canvas.style) canvas.style = {};
		  canvas.height = size;
		  canvas.width = size;
		  canvas.style.height = size + 'px';
		  canvas.style.width = size + 'px';
		}

		function getCanvasElement () {
		  try {
		    return document.createElement('canvas')
		  } catch (e) {
		    throw new Error('You need to specify a canvas element')
		  }
		}

		exports.render = function render (qrData, canvas, options) {
		  let opts = options;
		  let canvasEl = canvas;

		  if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
		    opts = canvas;
		    canvas = undefined;
		  }

		  if (!canvas) {
		    canvasEl = getCanvasElement();
		  }

		  opts = Utils.getOptions(opts);
		  const size = Utils.getImageWidth(qrData.modules.size, opts);

		  const ctx = canvasEl.getContext('2d');
		  const image = ctx.createImageData(size, size);
		  Utils.qrToImageData(image.data, qrData, opts);

		  clearCanvas(ctx, canvasEl, size);
		  ctx.putImageData(image, 0, 0);

		  return canvasEl
		};

		exports.renderToDataURL = function renderToDataURL (qrData, canvas, options) {
		  let opts = options;

		  if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
		    opts = canvas;
		    canvas = undefined;
		  }

		  if (!opts) opts = {};

		  const canvasEl = exports.render(qrData, canvas, opts);

		  const type = opts.type || 'image/png';
		  const rendererOpts = opts.rendererOpts || {};

		  return canvasEl.toDataURL(type, rendererOpts.quality)
		}; 
	} (canvas));

	var svgTag = {};

	const Utils = utils;

	function getColorAttrib (color, attrib) {
	  const alpha = color.a / 255;
	  const str = attrib + '="' + color.hex + '"';

	  return alpha < 1
	    ? str + ' ' + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"'
	    : str
	}

	function svgCmd (cmd, x, y) {
	  let str = cmd + x;
	  if (typeof y !== 'undefined') str += ' ' + y;

	  return str
	}

	function qrToPath (data, size, margin) {
	  let path = '';
	  let moveBy = 0;
	  let newRow = false;
	  let lineLength = 0;

	  for (let i = 0; i < data.length; i++) {
	    const col = Math.floor(i % size);
	    const row = Math.floor(i / size);

	    if (!col && !newRow) newRow = true;

	    if (data[i]) {
	      lineLength++;

	      if (!(i > 0 && col > 0 && data[i - 1])) {
	        path += newRow
	          ? svgCmd('M', col + margin, 0.5 + row + margin)
	          : svgCmd('m', moveBy, 0);

	        moveBy = 0;
	        newRow = false;
	      }

	      if (!(col + 1 < size && data[i + 1])) {
	        path += svgCmd('h', lineLength);
	        lineLength = 0;
	      }
	    } else {
	      moveBy++;
	    }
	  }

	  return path
	}

	svgTag.render = function render (qrData, options, cb) {
	  const opts = Utils.getOptions(options);
	  const size = qrData.modules.size;
	  const data = qrData.modules.data;
	  const qrcodesize = size + opts.margin * 2;

	  const bg = !opts.color.light.a
	    ? ''
	    : '<path ' + getColorAttrib(opts.color.light, 'fill') +
	      ' d="M0 0h' + qrcodesize + 'v' + qrcodesize + 'H0z"/>';

	  const path =
	    '<path ' + getColorAttrib(opts.color.dark, 'stroke') +
	    ' d="' + qrToPath(data, size, opts.margin) + '"/>';

	  const viewBox = 'viewBox="' + '0 0 ' + qrcodesize + ' ' + qrcodesize + '"';

	  const width = !opts.width ? '' : 'width="' + opts.width + '" height="' + opts.width + '" ';

	  const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + '</svg>\n';

	  if (typeof cb === 'function') {
	    cb(null, svgTag);
	  }

	  return svgTag
	};

	const canPromise = canPromise$1;

	const QRCode = qrcode;
	const CanvasRenderer = canvas;
	const SvgRenderer = svgTag;

	function renderCanvas (renderFunc, canvas, text, opts, cb) {
	  const args = [].slice.call(arguments, 1);
	  const argsNum = args.length;
	  const isLastArgCb = typeof args[argsNum - 1] === 'function';

	  if (!isLastArgCb && !canPromise()) {
	    throw new Error('Callback required as last argument')
	  }

	  if (isLastArgCb) {
	    if (argsNum < 2) {
	      throw new Error('Too few arguments provided')
	    }

	    if (argsNum === 2) {
	      cb = text;
	      text = canvas;
	      canvas = opts = undefined;
	    } else if (argsNum === 3) {
	      if (canvas.getContext && typeof cb === 'undefined') {
	        cb = opts;
	        opts = undefined;
	      } else {
	        cb = opts;
	        opts = text;
	        text = canvas;
	        canvas = undefined;
	      }
	    }
	  } else {
	    if (argsNum < 1) {
	      throw new Error('Too few arguments provided')
	    }

	    if (argsNum === 1) {
	      text = canvas;
	      canvas = opts = undefined;
	    } else if (argsNum === 2 && !canvas.getContext) {
	      opts = text;
	      text = canvas;
	      canvas = undefined;
	    }

	    return new Promise(function (resolve, reject) {
	      try {
	        const data = QRCode.create(text, opts);
	        resolve(renderFunc(data, canvas, opts));
	      } catch (e) {
	        reject(e);
	      }
	    })
	  }

	  try {
	    const data = QRCode.create(text, opts);
	    cb(null, renderFunc(data, canvas, opts));
	  } catch (e) {
	    cb(e);
	  }
	}

	browser.create = QRCode.create;
	browser.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
	browser.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);

	// only svg for now.
	browser.toString = renderCanvas.bind(null, function (data, _, opts) {
	  return SvgRenderer.render(data, opts)
	});

	/* src/components/modals/CreateInvoice.svelte generated by Svelte v4.2.18 */

	const { console: console_1$8 } = globals;
	const file$a = "src/components/modals/CreateInvoice.svelte";

	// (53:2) {#if showForm}
	function create_if_block_1$2(ctx) {
		let div0;
		let label0;
		let t1;
		let input0;
		let t2;
		let div1;
		let label1;
		let t4;
		let input1;
		let t5;
		let button;
		let mounted;
		let dispose;

		const block = {
			c: function create() {
				div0 = element("div");
				label0 = element("label");
				label0.textContent = "Description:";
				t1 = space();
				input0 = element("input");
				t2 = space();
				div1 = element("div");
				label1 = element("label");
				label1.textContent = "Amount (in Satoshis):";
				t4 = space();
				input1 = element("input");
				t5 = space();
				button = element("button");
				button.textContent = "Create Invoice";
				attr_dev(label0, "for", "description");
				add_location(label0, file$a, 61, 6, 1477);
				attr_dev(input0, "type", "text");
				attr_dev(input0, "id", "description");
				add_location(input0, file$a, 62, 6, 1529);
				add_location(div0, file$a, 60, 4, 1465);
				attr_dev(label1, "for", "amountSat");
				add_location(label1, file$a, 66, 6, 1619);
				attr_dev(input1, "type", "number");
				attr_dev(input1, "id", "amountSat");
				attr_dev(input1, "min", "0");
				add_location(input1, file$a, 67, 6, 1678);
				add_location(div1, file$a, 65, 4, 1607);
				attr_dev(button, "class", "svelte-uc892z");
				add_location(button, file$a, 70, 4, 1762);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div0, anchor);
				append_dev(div0, label0);
				append_dev(div0, t1);
				append_dev(div0, input0);
				set_input_value(input0, /*description*/ ctx[0]);
				insert_dev(target, t2, anchor);
				insert_dev(target, div1, anchor);
				append_dev(div1, label1);
				append_dev(div1, t4);
				append_dev(div1, input1);
				set_input_value(input1, /*amountSat*/ ctx[1]);
				insert_dev(target, t5, anchor);
				insert_dev(target, button, anchor);

				if (!mounted) {
					dispose = [
						listen_dev(input0, "input", /*input0_input_handler*/ ctx[10]),
						listen_dev(input1, "input", /*input1_input_handler*/ ctx[11]),
						listen_dev(button, "click", /*createInvoice*/ ctx[7], false, false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				if (dirty & /*description*/ 1 && input0.value !== /*description*/ ctx[0]) {
					set_input_value(input0, /*description*/ ctx[0]);
				}

				if (dirty & /*amountSat*/ 2 && to_number(input1.value) !== /*amountSat*/ ctx[1]) {
					set_input_value(input1, /*amountSat*/ ctx[1]);
				}
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div0);
					detach_dev(t2);
					detach_dev(div1);
					detach_dev(t5);
					detach_dev(button);
				}

				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_1$2.name,
			type: "if",
			source: "(53:2) {#if showForm}",
			ctx
		});

		return block;
	}

	// (68:2) {#if showModal}
	function create_if_block$6(ctx) {
		let div2;
		let div1;
		let span;
		let t1;
		let h2;
		let t3;
		let div0;
		let img;
		let img_src_value;
		let t4;
		let p;
		let t5;
		let t6;
		let t7;
		let textarea;
		let t8;
		let button;
		let mounted;
		let dispose;

		const block = {
			c: function create() {
				div2 = element("div");
				div1 = element("div");
				span = element("span");
				span.textContent = "×";
				t1 = space();
				h2 = element("h2");
				h2.textContent = "Invoice Details";
				t3 = space();
				div0 = element("div");
				img = element("img");
				t4 = space();
				p = element("p");
				t5 = text("Payment Hash: ");
				t6 = text(/*paymentHash*/ ctx[3]);
				t7 = space();
				textarea = element("textarea");
				t8 = space();
				button = element("button");
				button.textContent = "Copy Serialized Data";
				attr_dev(span, "class", "close svelte-uc892z");
				add_location(span, file$a, 77, 8, 1984);
				add_location(h2, file$a, 78, 8, 2049);
				if (!src_url_equal(img.src, img_src_value = /*qrCodeUrl*/ ctx[5])) attr_dev(img, "src", img_src_value);
				attr_dev(img, "alt", "QR Code");
				attr_dev(img, "class", "svelte-uc892z");
				add_location(img, file$a, 80, 10, 2114);
				attr_dev(div0, "class", "qr-code svelte-uc892z");
				add_location(div0, file$a, 79, 8, 2082);
				add_location(p, file$a, 82, 8, 2175);
				attr_dev(textarea, "rows", "6");
				textarea.readOnly = true;
				textarea.value = /*serialized*/ ctx[2];
				attr_dev(textarea, "class", "svelte-uc892z");
				add_location(textarea, file$a, 83, 8, 2218);
				attr_dev(button, "class", "svelte-uc892z");
				add_location(button, file$a, 84, 8, 2278);
				attr_dev(div1, "class", "modal-content svelte-uc892z");
				add_location(div1, file$a, 76, 6, 1923);
				attr_dev(div2, "class", "modal-overlay svelte-uc892z");
				add_location(div2, file$a, 75, 4, 1867);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div2, anchor);
				append_dev(div2, div1);
				append_dev(div1, span);
				append_dev(div1, t1);
				append_dev(div1, h2);
				append_dev(div1, t3);
				append_dev(div1, div0);
				append_dev(div0, img);
				append_dev(div1, t4);
				append_dev(div1, p);
				append_dev(p, t5);
				append_dev(p, t6);
				append_dev(div1, t7);
				append_dev(div1, textarea);
				append_dev(div1, t8);
				append_dev(div1, button);

				if (!mounted) {
					dispose = [
						listen_dev(span, "click", /*closeModal*/ ctx[8], false, false, false, false),
						listen_dev(button, "click", /*click_handler_1*/ ctx[12], false, false, false, false),
						listen_dev(div1, "click", stop_propagation(/*click_handler*/ ctx[9]), false, false, true, false),
						listen_dev(div2, "click", /*closeModal*/ ctx[8], false, false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				if (dirty & /*qrCodeUrl*/ 32 && !src_url_equal(img.src, img_src_value = /*qrCodeUrl*/ ctx[5])) {
					attr_dev(img, "src", img_src_value);
				}

				if (dirty & /*paymentHash*/ 8) set_data_dev(t6, /*paymentHash*/ ctx[3]);

				if (dirty & /*serialized*/ 4) {
					prop_dev(textarea, "value", /*serialized*/ ctx[2]);
				}
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div2);
				}

				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$6.name,
			type: "if",
			source: "(68:2) {#if showModal}",
			ctx
		});

		return block;
	}

	function create_fragment$a(ctx) {
		let main;
		let h2;
		let t1;
		let t2;
		let if_block0 = /*showForm*/ ctx[6] && create_if_block_1$2(ctx);
		let if_block1 = /*showModal*/ ctx[4] && create_if_block$6(ctx);

		const block = {
			c: function create() {
				main = element("main");
				h2 = element("h2");
				h2.textContent = "Create Invoice";
				t1 = space();
				if (if_block0) if_block0.c();
				t2 = space();
				if (if_block1) if_block1.c();
				add_location(h2, file$a, 57, 2, 1419);
				add_location(main, file$a, 56, 0, 1410);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, main, anchor);
				append_dev(main, h2);
				append_dev(main, t1);
				if (if_block0) if_block0.m(main, null);
				append_dev(main, t2);
				if (if_block1) if_block1.m(main, null);
			},
			p: function update(ctx, [dirty]) {
				if (/*showForm*/ ctx[6]) {
					if (if_block0) {
						if_block0.p(ctx, dirty);
					} else {
						if_block0 = create_if_block_1$2(ctx);
						if_block0.c();
						if_block0.m(main, t2);
					}
				} else if (if_block0) {
					if_block0.d(1);
					if_block0 = null;
				}

				if (/*showModal*/ ctx[4]) {
					if (if_block1) {
						if_block1.p(ctx, dirty);
					} else {
						if_block1 = create_if_block$6(ctx);
						if_block1.c();
						if_block1.m(main, null);
					}
				} else if (if_block1) {
					if_block1.d(1);
					if_block1 = null;
				}
			},
			i: noop$1,
			o: noop$1,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(main);
				}

				if (if_block0) if_block0.d();
				if (if_block1) if_block1.d();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$a.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function copyToClipboard(text) {
		navigator.clipboard.writeText(text).then(() => alert('Serialized data copied to clipboard')).catch(err => console.error('Error copying text: ', err));
	}

	function instance$a($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('CreateInvoice', slots, []);
		let description = '';
		let amountSat = '';
		let serialized = '';
		let paymentHash = '';
		let showModal = false;
		let qrCodeUrl = '';
		let showForm = true;

		async function createInvoice() {
			try {
				const response = await axios$1.post('http://localhost:3000/api/createinvoice', {
					description,
					amountSat: parseInt(amountSat, 10)
				});

				$$invalidate(2, serialized = response.data.data.serialized);
				$$invalidate(3, paymentHash = response.data.data.paymentHash);

				// Generate QR code for serialized data
				await generateQRCode(serialized);

				$$invalidate(4, showModal = true);
				$$invalidate(6, showForm = false);
			} catch(error) {
				console.error('Error creating invoice:', error);
				alert('Failed to create invoice. Please try again.');
			}
		}

		async function generateQRCode(data) {
			try {
				$$invalidate(5, qrCodeUrl = await browser.toDataURL(data, { width: 300 }));
			} catch(error) {
				console.error('Error generating QR code:', error);
			}
		}

		function closeModal() {
			$$invalidate(4, showModal = false);
			$$invalidate(6, showForm = true);
			$$invalidate(0, description = '');
			$$invalidate(1, amountSat = '');
		}

		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$8.warn(`<CreateInvoice> was created with unknown prop '${key}'`);
		});

		function click_handler(event) {
			bubble.call(this, $$self, event);
		}

		function input0_input_handler() {
			description = this.value;
			$$invalidate(0, description);
		}

		function input1_input_handler() {
			amountSat = to_number(this.value);
			$$invalidate(1, amountSat);
		}

		const click_handler_1 = () => copyToClipboard(serialized);

		$$self.$capture_state = () => ({
			onMount,
			axios: axios$1,
			QRCode: browser,
			description,
			amountSat,
			serialized,
			paymentHash,
			showModal,
			qrCodeUrl,
			showForm,
			createInvoice,
			generateQRCode,
			closeModal,
			copyToClipboard
		});

		$$self.$inject_state = $$props => {
			if ('description' in $$props) $$invalidate(0, description = $$props.description);
			if ('amountSat' in $$props) $$invalidate(1, amountSat = $$props.amountSat);
			if ('serialized' in $$props) $$invalidate(2, serialized = $$props.serialized);
			if ('paymentHash' in $$props) $$invalidate(3, paymentHash = $$props.paymentHash);
			if ('showModal' in $$props) $$invalidate(4, showModal = $$props.showModal);
			if ('qrCodeUrl' in $$props) $$invalidate(5, qrCodeUrl = $$props.qrCodeUrl);
			if ('showForm' in $$props) $$invalidate(6, showForm = $$props.showForm);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [
			description,
			amountSat,
			serialized,
			paymentHash,
			showModal,
			qrCodeUrl,
			showForm,
			createInvoice,
			closeModal,
			click_handler,
			input0_input_handler,
			input1_input_handler,
			click_handler_1
		];
	}

	class CreateInvoice extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "CreateInvoice",
				options,
				id: create_fragment$a.name
			});
		}
	}

	/* src/components/modals/SendBolt11.svelte generated by Svelte v4.2.18 */

	const { console: console_1$7 } = globals;
	const file$9 = "src/components/modals/SendBolt11.svelte";

	// (45:2) {#if showResponse}
	function create_if_block$5(ctx) {
		let div;
		let p;
		let t0;
		let t1;
		let button;
		let mounted;
		let dispose;

		const block = {
			c: function create() {
				div = element("div");
				p = element("p");
				t0 = text(/*responseMessage*/ ctx[2]);
				t1 = space();
				button = element("button");
				button.textContent = "Close";
				attr_dev(p, "class", "svelte-1os4nhj");
				add_location(p, file$9, 52, 6, 1498);
				attr_dev(button, "class", "close-button svelte-1os4nhj");
				add_location(button, file$9, 53, 6, 1529);
				attr_dev(div, "class", "response-message svelte-1os4nhj");
				add_location(div, file$9, 51, 4, 1461);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				append_dev(div, p);
				append_dev(p, t0);
				append_dev(div, t1);
				append_dev(div, button);

				if (!mounted) {
					dispose = listen_dev(button, "click", /*handleClose*/ ctx[5], false, false, false, false);
					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				if (dirty & /*responseMessage*/ 4) set_data_dev(t0, /*responseMessage*/ ctx[2]);
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$5.name,
			type: "if",
			source: "(45:2) {#if showResponse}",
			ctx
		});

		return block;
	}

	function create_fragment$9(ctx) {
		let main;
		let h2;
		let t1;
		let div0;
		let label0;
		let t3;
		let input0;
		let t4;
		let div1;
		let label1;
		let t6;
		let input1;
		let t7;
		let button;
		let t9;
		let mounted;
		let dispose;
		let if_block = /*showResponse*/ ctx[3] && create_if_block$5(ctx);

		const block = {
			c: function create() {
				main = element("main");
				h2 = element("h2");
				h2.textContent = "Pay Invoice";
				t1 = space();
				div0 = element("div");
				label0 = element("label");
				label0.textContent = "Amount (in Satoshis, optional):";
				t3 = space();
				input0 = element("input");
				t4 = space();
				div1 = element("div");
				label1 = element("label");
				label1.textContent = "BOLT11 Invoice:";
				t6 = space();
				input1 = element("input");
				t7 = space();
				button = element("button");
				button.textContent = "Pay";
				t9 = space();
				if (if_block) if_block.c();
				attr_dev(h2, "class", "svelte-1os4nhj");
				add_location(h2, file$9, 36, 2, 1043);
				attr_dev(label0, "for", "amountSat");
				attr_dev(label0, "class", "svelte-1os4nhj");
				add_location(label0, file$9, 39, 4, 1096);
				attr_dev(input0, "type", "number");
				attr_dev(input0, "id", "amountSat");
				attr_dev(input0, "min", "1");
				attr_dev(input0, "class", "svelte-1os4nhj");
				add_location(input0, file$9, 40, 4, 1163);
				attr_dev(div0, "class", "form-group svelte-1os4nhj");
				add_location(div0, file$9, 38, 2, 1067);
				attr_dev(label1, "for", "invoice");
				attr_dev(label1, "class", "svelte-1os4nhj");
				add_location(label1, file$9, 44, 4, 1274);
				attr_dev(input1, "type", "text");
				attr_dev(input1, "id", "invoice");
				attr_dev(input1, "class", "svelte-1os4nhj");
				add_location(input1, file$9, 45, 4, 1323);
				attr_dev(div1, "class", "form-group svelte-1os4nhj");
				add_location(div1, file$9, 43, 2, 1245);
				attr_dev(button, "class", "svelte-1os4nhj");
				add_location(button, file$9, 48, 2, 1391);
				attr_dev(main, "class", "svelte-1os4nhj");
				add_location(main, file$9, 35, 0, 1034);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, main, anchor);
				append_dev(main, h2);
				append_dev(main, t1);
				append_dev(main, div0);
				append_dev(div0, label0);
				append_dev(div0, t3);
				append_dev(div0, input0);
				set_input_value(input0, /*amountSat*/ ctx[0]);
				append_dev(main, t4);
				append_dev(main, div1);
				append_dev(div1, label1);
				append_dev(div1, t6);
				append_dev(div1, input1);
				set_input_value(input1, /*invoice*/ ctx[1]);
				append_dev(main, t7);
				append_dev(main, button);
				append_dev(main, t9);
				if (if_block) if_block.m(main, null);

				if (!mounted) {
					dispose = [
						listen_dev(input0, "input", /*input0_input_handler*/ ctx[6]),
						listen_dev(input1, "input", /*input1_input_handler*/ ctx[7]),
						listen_dev(button, "click", /*sendPayment*/ ctx[4], false, false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*amountSat*/ 1 && to_number(input0.value) !== /*amountSat*/ ctx[0]) {
					set_input_value(input0, /*amountSat*/ ctx[0]);
				}

				if (dirty & /*invoice*/ 2 && input1.value !== /*invoice*/ ctx[1]) {
					set_input_value(input1, /*invoice*/ ctx[1]);
				}

				if (/*showResponse*/ ctx[3]) {
					if (if_block) {
						if_block.p(ctx, dirty);
					} else {
						if_block = create_if_block$5(ctx);
						if_block.c();
						if_block.m(main, null);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}
			},
			i: noop$1,
			o: noop$1,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(main);
				}

				if (if_block) if_block.d();
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$9.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$9($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('SendBolt11', slots, []);
		const dispatch = createEventDispatcher();
		let amountSat = '';
		let invoice = '';
		let responseMessage = '';
		let showResponse = false;

		async function sendPayment() {
			try {
				const response = await axios$1.post('http://localhost:3000/api/payinvoice', {
					amountSat: parseInt(amountSat, 10),
					invoice
				});

				// Parse response
				const data = response.data;

				$$invalidate(2, responseMessage = `Payment Successful!\n\nRecipient Amount: ${data.recipientAmountSat} sats\nRouting Fee: ${data.routingFeeSat} sats\nPayment ID: ${data.paymentId}\nPayment Hash: ${data.paymentHash}\nPayment Preimage: ${data.paymentPreimage}`);
				$$invalidate(3, showResponse = true);
			} catch(error) {
				console.error('Error sending payment:', error);
				$$invalidate(2, responseMessage = 'Failed to send payment. Please try again.');
				$$invalidate(3, showResponse = true);
			}
		}

		function handleClose() {
			dispatch('close');
		}

		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$7.warn(`<SendBolt11> was created with unknown prop '${key}'`);
		});

		function input0_input_handler() {
			amountSat = to_number(this.value);
			$$invalidate(0, amountSat);
		}

		function input1_input_handler() {
			invoice = this.value;
			$$invalidate(1, invoice);
		}

		$$self.$capture_state = () => ({
			axios: axios$1,
			createEventDispatcher,
			dispatch,
			amountSat,
			invoice,
			responseMessage,
			showResponse,
			sendPayment,
			handleClose
		});

		$$self.$inject_state = $$props => {
			if ('amountSat' in $$props) $$invalidate(0, amountSat = $$props.amountSat);
			if ('invoice' in $$props) $$invalidate(1, invoice = $$props.invoice);
			if ('responseMessage' in $$props) $$invalidate(2, responseMessage = $$props.responseMessage);
			if ('showResponse' in $$props) $$invalidate(3, showResponse = $$props.showResponse);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [
			amountSat,
			invoice,
			responseMessage,
			showResponse,
			sendPayment,
			handleClose,
			input0_input_handler,
			input1_input_handler
		];
	}

	class SendBolt11 extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "SendBolt11",
				options,
				id: create_fragment$9.name
			});
		}
	}

	/* src/components/modals/Bolt12.svelte generated by Svelte v4.2.18 */

	const { console: console_1$6 } = globals;
	const file$8 = "src/components/modals/Bolt12.svelte";

	// (66:0) {#if showQRCodeModal}
	function create_if_block$4(ctx) {
		let div2;
		let div1;
		let span;
		let t1;
		let h2;
		let t3;
		let div0;
		let img;
		let img_src_value;
		let mounted;
		let dispose;

		const block = {
			c: function create() {
				div2 = element("div");
				div1 = element("div");
				span = element("span");
				span.textContent = "×";
				t1 = space();
				h2 = element("h2");
				h2.textContent = "QR Code";
				t3 = space();
				div0 = element("div");
				img = element("img");
				attr_dev(span, "class", "close svelte-kt67mz");
				add_location(span, file$8, 68, 6, 1880);
				add_location(h2, file$8, 69, 6, 1950);
				if (!src_url_equal(img.src, img_src_value = /*qrCodeUrl*/ ctx[0])) attr_dev(img, "src", img_src_value);
				attr_dev(img, "alt", "QR Code");
				attr_dev(img, "class", "svelte-kt67mz");
				add_location(img, file$8, 71, 8, 2003);
				attr_dev(div0, "class", "qr-code svelte-kt67mz");
				add_location(div0, file$8, 70, 6, 1973);
				attr_dev(div1, "class", "modal svelte-kt67mz");
				add_location(div1, file$8, 67, 4, 1829);
				attr_dev(div2, "class", "modal-overlay svelte-kt67mz");
				add_location(div2, file$8, 66, 2, 1768);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div2, anchor);
				append_dev(div2, div1);
				append_dev(div1, span);
				append_dev(div1, t1);
				append_dev(div1, h2);
				append_dev(div1, t3);
				append_dev(div1, div0);
				append_dev(div0, img);

				if (!mounted) {
					dispose = [
						listen_dev(span, "click", /*toggleQRCodeModal*/ ctx[4], false, false, false, false),
						listen_dev(div1, "click", stop_propagation(/*click_handler*/ ctx[7]), false, false, true, false),
						listen_dev(div2, "click", /*toggleQRCodeModal*/ ctx[4], false, false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				if (dirty & /*qrCodeUrl*/ 1 && !src_url_equal(img.src, img_src_value = /*qrCodeUrl*/ ctx[0])) {
					attr_dev(img, "src", img_src_value);
				}
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div2);
				}

				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$4.name,
			type: "if",
			source: "(66:0) {#if showQRCodeModal}",
			ctx
		});

		return block;
	}

	function create_fragment$8(ctx) {
		let div2;
		let div0;
		let textarea;
		let t0;
		let div1;
		let button0;
		let t2;
		let button1;
		let t4;
		let if_block_anchor;
		let mounted;
		let dispose;
		let if_block = /*showQRCodeModal*/ ctx[2] && create_if_block$4(ctx);

		const block = {
			c: function create() {
				div2 = element("div");
				div0 = element("div");
				textarea = element("textarea");
				t0 = space();
				div1 = element("div");
				button0 = element("button");
				button0.textContent = "Copy Bolt12 paycode";
				t2 = space();
				button1 = element("button");
				button1.textContent = "Show QR Code";
				t4 = space();
				if (if_block) if_block.c();
				if_block_anchor = empty();
				textarea.readOnly = true;
				textarea.value = /*jsonText*/ ctx[1];
				attr_dev(textarea, "class", "svelte-kt67mz");
				add_location(textarea, file$8, 57, 6, 1512);
				attr_dev(div0, "class", "text-container svelte-kt67mz");
				add_location(div0, file$8, 56, 4, 1477);
				attr_dev(button0, "class", "svelte-kt67mz");
				add_location(button0, file$8, 60, 6, 1596);
				attr_dev(button1, "class", "svelte-kt67mz");
				add_location(button1, file$8, 61, 6, 1666);
				attr_dev(div1, "class", "buttons svelte-kt67mz");
				add_location(div1, file$8, 59, 4, 1568);
				attr_dev(div2, "class", "display-bar svelte-kt67mz");
				add_location(div2, file$8, 55, 0, 1447);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div2, anchor);
				append_dev(div2, div0);
				append_dev(div0, textarea);
				append_dev(div2, t0);
				append_dev(div2, div1);
				append_dev(div1, button0);
				append_dev(div1, t2);
				append_dev(div1, button1);
				insert_dev(target, t4, anchor);
				if (if_block) if_block.m(target, anchor);
				insert_dev(target, if_block_anchor, anchor);

				if (!mounted) {
					dispose = [
						listen_dev(button0, "click", /*copyToClipboard*/ ctx[3], false, false, false, false),
						listen_dev(button1, "click", /*toggleQRCodeModal*/ ctx[4], false, false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*jsonText*/ 2) {
					prop_dev(textarea, "value", /*jsonText*/ ctx[1]);
				}

				if (/*showQRCodeModal*/ ctx[2]) {
					if (if_block) {
						if_block.p(ctx, dirty);
					} else {
						if_block = create_if_block$4(ctx);
						if_block.c();
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}
			},
			i: noop$1,
			o: noop$1,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div2);
					detach_dev(t4);
					detach_dev(if_block_anchor);
				}

				if (if_block) if_block.d(detaching);
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$8.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$8($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Bolt12', slots, []);
		let { offer } = $$props;
		let { onClose } = $$props;
		let qrCodeUrl = '';
		let jsonText = '';
		let showQRCodeModal = false;

		// Function to generate QR code from the offer data
		async function generateQRCode() {
			try {
				$$invalidate(0, qrCodeUrl = await browser.toDataURL(offer));
			} catch(error) {
				console.error('Error generating QR code:', error);
			}
		}

		// Function to copy offer text to clipboard
		async function copyToClipboard() {
			try {
				if (navigator.clipboard) {
					await navigator.clipboard.writeText(offer);
					alert('Offer copied to clipboard');
				} else {
					// Fallback method for older browsers
					const textarea = document.createElement('textarea');

					textarea.value = offer;
					document.body.appendChild(textarea);
					textarea.select();
					document.execCommand('copy');
					document.body.removeChild(textarea);
					alert('Offer copied to clipboard');
				}
			} catch(err) {
				console.error('Error copying text:', err);
				alert('Failed to copy offer to clipboard. Please try again.');
			}
		}

		// Function to toggle QR code modal visibility
		function toggleQRCodeModal() {
			$$invalidate(2, showQRCodeModal = !showQRCodeModal);
		}

		// Call generateQRCode and set jsonText on component mount
		onMount(async () => {
			await generateQRCode();
			$$invalidate(1, jsonText = offer);
		});

		$$self.$$.on_mount.push(function () {
			if (offer === undefined && !('offer' in $$props || $$self.$$.bound[$$self.$$.props['offer']])) {
				console_1$6.warn("<Bolt12> was created without expected prop 'offer'");
			}

			if (onClose === undefined && !('onClose' in $$props || $$self.$$.bound[$$self.$$.props['onClose']])) {
				console_1$6.warn("<Bolt12> was created without expected prop 'onClose'");
			}
		});

		const writable_props = ['offer', 'onClose'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$6.warn(`<Bolt12> was created with unknown prop '${key}'`);
		});

		function click_handler(event) {
			bubble.call(this, $$self, event);
		}

		$$self.$$set = $$props => {
			if ('offer' in $$props) $$invalidate(5, offer = $$props.offer);
			if ('onClose' in $$props) $$invalidate(6, onClose = $$props.onClose);
		};

		$$self.$capture_state = () => ({
			onMount,
			QRCode: browser,
			offer,
			onClose,
			qrCodeUrl,
			jsonText,
			showQRCodeModal,
			generateQRCode,
			copyToClipboard,
			toggleQRCodeModal
		});

		$$self.$inject_state = $$props => {
			if ('offer' in $$props) $$invalidate(5, offer = $$props.offer);
			if ('onClose' in $$props) $$invalidate(6, onClose = $$props.onClose);
			if ('qrCodeUrl' in $$props) $$invalidate(0, qrCodeUrl = $$props.qrCodeUrl);
			if ('jsonText' in $$props) $$invalidate(1, jsonText = $$props.jsonText);
			if ('showQRCodeModal' in $$props) $$invalidate(2, showQRCodeModal = $$props.showQRCodeModal);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [
			qrCodeUrl,
			jsonText,
			showQRCodeModal,
			copyToClipboard,
			toggleQRCodeModal,
			offer,
			onClose,
			click_handler
		];
	}

	class Bolt12 extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$8, create_fragment$8, safe_not_equal, { offer: 5, onClose: 6 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Bolt12",
				options,
				id: create_fragment$8.name
			});
		}

		get offer() {
			throw new Error("<Bolt12>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set offer(value) {
			throw new Error("<Bolt12>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get onClose() {
			throw new Error("<Bolt12>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set onClose(value) {
			throw new Error("<Bolt12>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/components/modals/SendBolt12.svelte generated by Svelte v4.2.18 */

	const { console: console_1$5 } = globals;
	const file$7 = "src/components/modals/SendBolt12.svelte";

	// (66:8) {#if showResponse}
	function create_if_block$3(ctx) {
		let div;
		let p;
		let t0;
		let t1;
		let button;
		let mounted;
		let dispose;

		const block = {
			c: function create() {
				div = element("div");
				p = element("p");
				t0 = text(/*responseMessage*/ ctx[3]);
				t1 = space();
				button = element("button");
				button.textContent = "Close";
				attr_dev(p, "class", "svelte-123hgzw");
				add_location(p, file$7, 74, 12, 2284);
				attr_dev(button, "class", "close-button svelte-123hgzw");
				add_location(button, file$7, 75, 12, 2321);
				attr_dev(div, "class", "response-message svelte-123hgzw");
				add_location(div, file$7, 73, 10, 2241);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				append_dev(div, p);
				append_dev(p, t0);
				append_dev(div, t1);
				append_dev(div, button);

				if (!mounted) {
					dispose = listen_dev(button, "click", /*handleClose*/ ctx[5], false, false, false, false);
					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				if (dirty & /*responseMessage*/ 8) set_data_dev(t0, /*responseMessage*/ ctx[3]);
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$3.name,
			type: "if",
			source: "(66:8) {#if showResponse}",
			ctx
		});

		return block;
	}

	function create_fragment$7(ctx) {
		let main;
		let div3;
		let div2;
		let div0;
		let h2;
		let t1;
		let button0;
		let t3;
		let div1;
		let form;
		let label0;
		let t4;
		let input0;
		let t5;
		let label1;
		let t6;
		let input1;
		let t7;
		let label2;
		let t8;
		let textarea;
		let t9;
		let button1;
		let t11;
		let mounted;
		let dispose;
		let if_block = /*showResponse*/ ctx[4] && create_if_block$3(ctx);

		const block = {
			c: function create() {
				main = element("main");
				div3 = element("div");
				div2 = element("div");
				div0 = element("div");
				h2 = element("h2");
				h2.textContent = "Pay Bolt12";
				t1 = space();
				button0 = element("button");
				button0.textContent = "×";
				t3 = space();
				div1 = element("div");
				form = element("form");
				label0 = element("label");
				t4 = text("Amount (sats):\n            ");
				input0 = element("input");
				t5 = space();
				label1 = element("label");
				t6 = text("Offer:\n            ");
				input1 = element("input");
				t7 = space();
				label2 = element("label");
				t8 = text("Message (optional):\n            ");
				textarea = element("textarea");
				t9 = space();
				button1 = element("button");
				button1.textContent = "Pay Offer";
				t11 = space();
				if (if_block) if_block.c();
				attr_dev(h2, "class", "svelte-123hgzw");
				add_location(h2, file$7, 52, 8, 1468);
				attr_dev(button0, "class", "close-button svelte-123hgzw");
				add_location(button0, file$7, 53, 8, 1496);
				attr_dev(div0, "class", "modal-header svelte-123hgzw");
				add_location(div0, file$7, 51, 6, 1433);
				attr_dev(input0, "type", "number");
				input0.required = true;
				attr_dev(input0, "class", "modal-input svelte-123hgzw");
				attr_dev(input0, "name", "amount");
				attr_dev(input0, "min", "1");
				add_location(input0, file$7, 59, 12, 1703);
				attr_dev(label0, "class", "svelte-123hgzw");
				add_location(label0, file$7, 57, 10, 1656);
				attr_dev(input1, "type", "text");
				input1.required = true;
				attr_dev(input1, "class", "modal-input svelte-123hgzw");
				attr_dev(input1, "name", "offer");
				add_location(input1, file$7, 63, 12, 1866);
				attr_dev(label1, "class", "svelte-123hgzw");
				add_location(label1, file$7, 61, 10, 1827);
				attr_dev(textarea, "rows", "4");
				attr_dev(textarea, "class", "modal-input svelte-123hgzw");
				attr_dev(textarea, "name", "message");
				add_location(textarea, file$7, 67, 12, 2030);
				attr_dev(label2, "class", "svelte-123hgzw");
				add_location(label2, file$7, 65, 10, 1978);
				attr_dev(button1, "type", "submit");
				attr_dev(button1, "class", "svelte-123hgzw");
				add_location(button1, file$7, 69, 10, 2146);
				attr_dev(form, "class", "svelte-123hgzw");
				add_location(form, file$7, 56, 8, 1614);
				attr_dev(div1, "class", "modal-content svelte-123hgzw");
				add_location(div1, file$7, 55, 6, 1578);
				attr_dev(div2, "class", "modal svelte-123hgzw");
				add_location(div2, file$7, 50, 4, 1382);
				attr_dev(div3, "class", "modal-overlay svelte-123hgzw");
				add_location(div3, file$7, 48, 2, 1300);
				add_location(main, file$7, 46, 0, 1266);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, main, anchor);
				append_dev(main, div3);
				append_dev(div3, div2);
				append_dev(div2, div0);
				append_dev(div0, h2);
				append_dev(div0, t1);
				append_dev(div0, button0);
				append_dev(div2, t3);
				append_dev(div2, div1);
				append_dev(div1, form);
				append_dev(form, label0);
				append_dev(label0, t4);
				append_dev(label0, input0);
				set_input_value(input0, /*amount*/ ctx[0]);
				append_dev(form, t5);
				append_dev(form, label1);
				append_dev(label1, t6);
				append_dev(label1, input1);
				set_input_value(input1, /*offer*/ ctx[1]);
				append_dev(form, t7);
				append_dev(form, label2);
				append_dev(label2, t8);
				append_dev(label2, textarea);
				set_input_value(textarea, /*message*/ ctx[2]);
				append_dev(form, t9);
				append_dev(form, button1);
				append_dev(div1, t11);
				if (if_block) if_block.m(div1, null);

				if (!mounted) {
					dispose = [
						listen_dev(button0, "click", /*handleClose*/ ctx[5], false, false, false, false),
						listen_dev(input0, "input", /*input0_input_handler*/ ctx[8]),
						listen_dev(input1, "input", /*input1_input_handler*/ ctx[9]),
						listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[10]),
						listen_dev(form, "submit", /*handleSubmit*/ ctx[6], false, false, false, false),
						listen_dev(div2, "click", stop_propagation(/*click_handler*/ ctx[7]), false, false, true, false),
						listen_dev(div3, "click", /*handleClose*/ ctx[5], false, false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*amount*/ 1 && to_number(input0.value) !== /*amount*/ ctx[0]) {
					set_input_value(input0, /*amount*/ ctx[0]);
				}

				if (dirty & /*offer*/ 2 && input1.value !== /*offer*/ ctx[1]) {
					set_input_value(input1, /*offer*/ ctx[1]);
				}

				if (dirty & /*message*/ 4) {
					set_input_value(textarea, /*message*/ ctx[2]);
				}

				if (/*showResponse*/ ctx[4]) {
					if (if_block) {
						if_block.p(ctx, dirty);
					} else {
						if_block = create_if_block$3(ctx);
						if_block.c();
						if_block.m(div1, null);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}
			},
			i: noop$1,
			o: noop$1,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(main);
				}

				if (if_block) if_block.d();
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$7.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$7($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('SendBolt12', slots, []);
		const dispatch = createEventDispatcher();
		let amount = '';
		let offer = '';
		let message = '';
		let responseMessage = '';
		let showResponse = false;

		function handleClose() {
			dispatch('close');
		}

		async function handleSubmit(event) {
			event.preventDefault();

			// Perform validation
			if (!amount || !offer) {
				$$invalidate(3, responseMessage = 'Amount and Offer are required.');
				$$invalidate(4, showResponse = true);
				return;
			}

			try {
				// Make the API call
				const response = await axios$1.post('http://localhost:3000/api/payoffer', {
					amountSat: parseInt(amount, 10),
					offer,
					message
				});

				// Handle successful response
				const data = response.data;

				$$invalidate(3, responseMessage = `Payment Successful!\n\nPayment ID: ${data.paymentId}\nPayment Hash: ${data.paymentHash}\nPayment Preimage: ${data.paymentPreimage}`);
				$$invalidate(4, showResponse = true);
			} catch(error) {
				console.error('Error sending payment:', error);

				$$invalidate(3, responseMessage = `Failed to send payment. ${error.response
			? error.response.data.error
			: 'Please try again.'}`);

				$$invalidate(4, showResponse = true);
			}
		}

		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$5.warn(`<SendBolt12> was created with unknown prop '${key}'`);
		});

		function click_handler(event) {
			bubble.call(this, $$self, event);
		}

		function input0_input_handler() {
			amount = to_number(this.value);
			$$invalidate(0, amount);
		}

		function input1_input_handler() {
			offer = this.value;
			$$invalidate(1, offer);
		}

		function textarea_input_handler() {
			message = this.value;
			$$invalidate(2, message);
		}

		$$self.$capture_state = () => ({
			createEventDispatcher,
			axios: axios$1,
			dispatch,
			amount,
			offer,
			message,
			responseMessage,
			showResponse,
			handleClose,
			handleSubmit
		});

		$$self.$inject_state = $$props => {
			if ('amount' in $$props) $$invalidate(0, amount = $$props.amount);
			if ('offer' in $$props) $$invalidate(1, offer = $$props.offer);
			if ('message' in $$props) $$invalidate(2, message = $$props.message);
			if ('responseMessage' in $$props) $$invalidate(3, responseMessage = $$props.responseMessage);
			if ('showResponse' in $$props) $$invalidate(4, showResponse = $$props.showResponse);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [
			amount,
			offer,
			message,
			responseMessage,
			showResponse,
			handleClose,
			handleSubmit,
			click_handler,
			input0_input_handler,
			input1_input_handler,
			textarea_input_handler
		];
	}

	class SendBolt12 extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "SendBolt12",
				options,
				id: create_fragment$7.name
			});
		}
	}

	/* src/components/modals/SendtoLUD16.svelte generated by Svelte v4.2.18 */

	const { console: console_1$4 } = globals;
	const file$6 = "src/components/modals/SendtoLUD16.svelte";

	// (53:2) {#if showResponse}
	function create_if_block$2(ctx) {
		let div;
		let p;
		let t0;
		let t1;
		let button;
		let mounted;
		let dispose;

		const block = {
			c: function create() {
				div = element("div");
				p = element("p");
				t0 = text(/*responseMessage*/ ctx[3]);
				t1 = space();
				button = element("button");
				button.textContent = "Close";
				attr_dev(p, "class", "svelte-xhe57a");
				add_location(p, file$6, 60, 6, 1702);
				attr_dev(button, "class", "svelte-xhe57a");
				add_location(button, file$6, 61, 6, 1733);
				attr_dev(div, "class", "response-message svelte-xhe57a");
				add_location(div, file$6, 59, 4, 1665);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				append_dev(div, p);
				append_dev(p, t0);
				append_dev(div, t1);
				append_dev(div, button);

				if (!mounted) {
					dispose = listen_dev(button, "click", /*handleClose*/ ctx[6], false, false, false, false);
					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				if (dirty & /*responseMessage*/ 8) set_data_dev(t0, /*responseMessage*/ ctx[3]);
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$2.name,
			type: "if",
			source: "(53:2) {#if showResponse}",
			ctx
		});

		return block;
	}

	function create_fragment$6(ctx) {
		let main;
		let h2;
		let t1;
		let div0;
		let label0;
		let t3;
		let input0;
		let t4;
		let div1;
		let label1;
		let t6;
		let input1;
		let t7;
		let div2;
		let label2;
		let t9;
		let input2;
		let t10;
		let button;
		let t12;
		let mounted;
		let dispose;
		let if_block = /*showResponse*/ ctx[4] && create_if_block$2(ctx);

		const block = {
			c: function create() {
				main = element("main");
				h2 = element("h2");
				h2.textContent = "Send Payment to LN Address";
				t1 = space();
				div0 = element("div");
				label0 = element("label");
				label0.textContent = "Amount (in Satoshis):";
				t3 = space();
				input0 = element("input");
				t4 = space();
				div1 = element("div");
				label1 = element("label");
				label1.textContent = "LN Address:";
				t6 = space();
				input1 = element("input");
				t7 = space();
				div2 = element("div");
				label2 = element("label");
				label2.textContent = "Message (optional):";
				t9 = space();
				input2 = element("input");
				t10 = space();
				button = element("button");
				button.textContent = "Send Payment";
				t12 = space();
				if (if_block) if_block.c();
				add_location(h2, file$6, 39, 2, 1144);
				attr_dev(label0, "for", "amountSat");
				attr_dev(label0, "class", "svelte-xhe57a");
				add_location(label0, file$6, 42, 4, 1193);
				attr_dev(input0, "type", "number");
				attr_dev(input0, "id", "amountSat");
				attr_dev(input0, "min", "0");
				attr_dev(input0, "class", "svelte-xhe57a");
				add_location(input0, file$6, 43, 4, 1250);
				attr_dev(div0, "class", "svelte-xhe57a");
				add_location(div0, file$6, 41, 2, 1183);
				attr_dev(label1, "for", "lnAddress");
				attr_dev(label1, "class", "svelte-xhe57a");
				add_location(label1, file$6, 47, 4, 1340);
				attr_dev(input1, "type", "text");
				attr_dev(input1, "id", "lnAddress");
				attr_dev(input1, "class", "svelte-xhe57a");
				add_location(input1, file$6, 48, 4, 1387);
				attr_dev(div1, "class", "svelte-xhe57a");
				add_location(div1, file$6, 46, 2, 1330);
				attr_dev(label2, "for", "message");
				attr_dev(label2, "class", "svelte-xhe57a");
				add_location(label2, file$6, 52, 4, 1467);
				attr_dev(input2, "type", "text");
				attr_dev(input2, "id", "message");
				attr_dev(input2, "class", "svelte-xhe57a");
				add_location(input2, file$6, 53, 4, 1520);
				attr_dev(div2, "class", "svelte-xhe57a");
				add_location(div2, file$6, 51, 2, 1457);
				attr_dev(button, "class", "svelte-xhe57a");
				add_location(button, file$6, 56, 2, 1586);
				add_location(main, file$6, 38, 0, 1135);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, main, anchor);
				append_dev(main, h2);
				append_dev(main, t1);
				append_dev(main, div0);
				append_dev(div0, label0);
				append_dev(div0, t3);
				append_dev(div0, input0);
				set_input_value(input0, /*amountSat*/ ctx[0]);
				append_dev(main, t4);
				append_dev(main, div1);
				append_dev(div1, label1);
				append_dev(div1, t6);
				append_dev(div1, input1);
				set_input_value(input1, /*lnAddress*/ ctx[1]);
				append_dev(main, t7);
				append_dev(main, div2);
				append_dev(div2, label2);
				append_dev(div2, t9);
				append_dev(div2, input2);
				set_input_value(input2, /*message*/ ctx[2]);
				append_dev(main, t10);
				append_dev(main, button);
				append_dev(main, t12);
				if (if_block) if_block.m(main, null);

				if (!mounted) {
					dispose = [
						listen_dev(input0, "input", /*input0_input_handler*/ ctx[7]),
						listen_dev(input1, "input", /*input1_input_handler*/ ctx[8]),
						listen_dev(input2, "input", /*input2_input_handler*/ ctx[9]),
						listen_dev(button, "click", /*sendPayment*/ ctx[5], false, false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*amountSat*/ 1 && to_number(input0.value) !== /*amountSat*/ ctx[0]) {
					set_input_value(input0, /*amountSat*/ ctx[0]);
				}

				if (dirty & /*lnAddress*/ 2 && input1.value !== /*lnAddress*/ ctx[1]) {
					set_input_value(input1, /*lnAddress*/ ctx[1]);
				}

				if (dirty & /*message*/ 4 && input2.value !== /*message*/ ctx[2]) {
					set_input_value(input2, /*message*/ ctx[2]);
				}

				if (/*showResponse*/ ctx[4]) {
					if (if_block) {
						if_block.p(ctx, dirty);
					} else {
						if_block = create_if_block$2(ctx);
						if_block.c();
						if_block.m(main, null);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}
			},
			i: noop$1,
			o: noop$1,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(main);
				}

				if (if_block) if_block.d();
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$6.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$6($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('SendtoLUD16', slots, []);
		const dispatch = createEventDispatcher();
		let amountSat = '';
		let lnAddress = '';
		let message = '';
		let responseMessage = '';
		let showResponse = false;

		async function sendPayment() {
			try {
				const response = await axios$1.post('http://localhost:3000/api/paylnaddress', {
					amountSat: parseInt(amountSat, 10),
					address: lnAddress,
					message
				});

				// Parse response
				const data = response.data;

				$$invalidate(3, responseMessage = `Payment Successful!\n\nRecipient Amount: ${data.recipientAmountSat} sats\nRouting Fee: ${data.routingFeeSat} sats\nPayment ID: ${data.paymentId}\nPayment Hash: ${data.paymentHash}\nPayment Preimage: ${data.paymentPreimage}`);
				$$invalidate(4, showResponse = true); // Show response message
			} catch(error) {
				console.error('Error sending payment:', error);
				$$invalidate(3, responseMessage = 'Failed to send payment. Please try again.');
				$$invalidate(4, showResponse = true);
			}
		}

		function handleClose() {
			dispatch('close');
		}

		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<SendtoLUD16> was created with unknown prop '${key}'`);
		});

		function input0_input_handler() {
			amountSat = to_number(this.value);
			$$invalidate(0, amountSat);
		}

		function input1_input_handler() {
			lnAddress = this.value;
			$$invalidate(1, lnAddress);
		}

		function input2_input_handler() {
			message = this.value;
			$$invalidate(2, message);
		}

		$$self.$capture_state = () => ({
			axios: axios$1,
			createEventDispatcher,
			dispatch,
			amountSat,
			lnAddress,
			message,
			responseMessage,
			showResponse,
			sendPayment,
			handleClose
		});

		$$self.$inject_state = $$props => {
			if ('amountSat' in $$props) $$invalidate(0, amountSat = $$props.amountSat);
			if ('lnAddress' in $$props) $$invalidate(1, lnAddress = $$props.lnAddress);
			if ('message' in $$props) $$invalidate(2, message = $$props.message);
			if ('responseMessage' in $$props) $$invalidate(3, responseMessage = $$props.responseMessage);
			if ('showResponse' in $$props) $$invalidate(4, showResponse = $$props.showResponse);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [
			amountSat,
			lnAddress,
			message,
			responseMessage,
			showResponse,
			sendPayment,
			handleClose,
			input0_input_handler,
			input1_input_handler,
			input2_input_handler
		];
	}

	class SendtoLUD16 extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "SendtoLUD16",
				options,
				id: create_fragment$6.name
			});
		}
	}

	/* src/components/buttons/SendReceive.svelte generated by Svelte v4.2.18 */

	const { console: console_1$3 } = globals;
	const file$5 = "src/components/buttons/SendReceive.svelte";

	// (88:6) {#if showReceiveOptions}
	function create_if_block_6(ctx) {
		let div;
		let button0;
		let t0;
		let icon0;
		let t1;
		let button1;
		let t2;
		let icon1;
		let current;
		let mounted;
		let dispose;

		icon0 = new Icon({
				props: { icon: "hugeicons:money-receive-circle" },
				$$inline: true
			});

		icon1 = new Icon({
				props: { icon: "hugeicons:money-receive-circle" },
				$$inline: true
			});

		const block = {
			c: function create() {
				div = element("div");
				button0 = element("button");
				t0 = text("Invoice ");
				create_component(icon0.$$.fragment);
				t1 = space();
				button1 = element("button");
				t2 = text("Bolt12 ");
				create_component(icon1.$$.fragment);
				attr_dev(button0, "class", "option-button svelte-kcev16");
				add_location(button0, file$5, 104, 10, 2856);
				attr_dev(button1, "class", "option-button svelte-kcev16");
				add_location(button1, file$5, 107, 10, 3021);
				attr_dev(div, "class", "options options-receive svelte-kcev16");
				add_location(div, file$5, 103, 8, 2808);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				append_dev(div, button0);
				append_dev(button0, t0);
				mount_component(icon0, button0, null);
				append_dev(div, t1);
				append_dev(div, button1);
				append_dev(button1, t2);
				mount_component(icon1, button1, null);
				current = true;

				if (!mounted) {
					dispose = [
						listen_dev(button0, "click", /*handleReceiveInvoiceClick*/ ctx[11], false, false, false, false),
						listen_dev(button1, "click", /*handleReceiveBolt12Click*/ ctx[12], false, false, false, false)
					];

					mounted = true;
				}
			},
			p: noop$1,
			i: function intro(local) {
				if (current) return;
				transition_in(icon0.$$.fragment, local);
				transition_in(icon1.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(icon0.$$.fragment, local);
				transition_out(icon1.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				destroy_component(icon0);
				destroy_component(icon1);
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_6.name,
			type: "if",
			source: "(88:6) {#if showReceiveOptions}",
			ctx
		});

		return block;
	}

	// (104:6) {#if showSendOptions}
	function create_if_block_5(ctx) {
		let div;
		let button0;
		let t0;
		let icon0;
		let t1;
		let button1;
		let t2;
		let icon1;
		let t3;
		let button2;
		let t4;
		let icon2;
		let current;
		let mounted;
		let dispose;

		icon0 = new Icon({
				props: { icon: "hugeicons:money-send-circle" },
				$$inline: true
			});

		icon1 = new Icon({
				props: { icon: "hugeicons:money-send-circle" },
				$$inline: true
			});

		icon2 = new Icon({
				props: { icon: "hugeicons:money-send-circle" },
				$$inline: true
			});

		const block = {
			c: function create() {
				div = element("div");
				button0 = element("button");
				t0 = text("Bolt11 ");
				create_component(icon0.$$.fragment);
				t1 = space();
				button1 = element("button");
				t2 = text("Bolt12 ");
				create_component(icon1.$$.fragment);
				t3 = space();
				button2 = element("button");
				t4 = text("LUD16 ");
				create_component(icon2.$$.fragment);
				attr_dev(button0, "class", "option-button svelte-kcev16");
				add_location(button0, file$5, 120, 10, 3462);
				attr_dev(button1, "class", "option-button svelte-kcev16");
				add_location(button1, file$5, 123, 10, 3619);
				attr_dev(button2, "class", "option-button svelte-kcev16");
				add_location(button2, file$5, 126, 10, 3776);
				attr_dev(div, "class", "options options-send svelte-kcev16");
				add_location(div, file$5, 119, 8, 3417);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				append_dev(div, button0);
				append_dev(button0, t0);
				mount_component(icon0, button0, null);
				append_dev(div, t1);
				append_dev(div, button1);
				append_dev(button1, t2);
				mount_component(icon1, button1, null);
				append_dev(div, t3);
				append_dev(div, button2);
				append_dev(button2, t4);
				mount_component(icon2, button2, null);
				current = true;

				if (!mounted) {
					dispose = [
						listen_dev(button0, "click", /*handleSendBolt11Click*/ ctx[13], false, false, false, false),
						listen_dev(button1, "click", /*handleSendBolt12Click*/ ctx[14], false, false, false, false),
						listen_dev(button2, "click", /*handleSendtoLUD16Click*/ ctx[15], false, false, false, false)
					];

					mounted = true;
				}
			},
			p: noop$1,
			i: function intro(local) {
				if (current) return;
				transition_in(icon0.$$.fragment, local);
				transition_in(icon1.$$.fragment, local);
				transition_in(icon2.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(icon0.$$.fragment, local);
				transition_out(icon1.$$.fragment, local);
				transition_out(icon2.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				destroy_component(icon0);
				destroy_component(icon1);
				destroy_component(icon2);
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_5.name,
			type: "if",
			source: "(104:6) {#if showSendOptions}",
			ctx
		});

		return block;
	}

	// (120:2) {#if showCreateInvoiceModal}
	function create_if_block_4(ctx) {
		let div1;
		let div0;
		let createinvoice;
		let current;
		let mounted;
		let dispose;
		createinvoice = new CreateInvoice({ $$inline: true });
		createinvoice.$on("close", /*handleCloseCreateInvoiceModal*/ ctx[16]);

		const block = {
			c: function create() {
				div1 = element("div");
				div0 = element("div");
				create_component(createinvoice.$$.fragment);
				attr_dev(div0, "class", "modal svelte-kcev16");
				add_location(div0, file$5, 136, 6, 4082);
				attr_dev(div1, "class", "modal-backdrop svelte-kcev16");
				add_location(div1, file$5, 135, 4, 4006);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				append_dev(div1, div0);
				mount_component(createinvoice, div0, null);
				current = true;

				if (!mounted) {
					dispose = [
						listen_dev(div0, "click", stop_propagation(/*click_handler*/ ctx[25]), false, false, true, false),
						listen_dev(div1, "click", /*handleCloseCreateInvoiceModal*/ ctx[16], false, false, false, false)
					];

					mounted = true;
				}
			},
			p: noop$1,
			i: function intro(local) {
				if (current) return;
				transition_in(createinvoice.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(createinvoice.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div1);
				}

				destroy_component(createinvoice);
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_4.name,
			type: "if",
			source: "(120:2) {#if showCreateInvoiceModal}",
			ctx
		});

		return block;
	}

	// (128:2) {#if showSendBolt11Modal}
	function create_if_block_3(ctx) {
		let div1;
		let div0;
		let sendbolt11;
		let current;
		let mounted;
		let dispose;
		sendbolt11 = new SendBolt11({ $$inline: true });
		sendbolt11.$on("close", /*handleCloseSendBolt11Modal*/ ctx[17]);

		const block = {
			c: function create() {
				div1 = element("div");
				div0 = element("div");
				create_component(sendbolt11.$$.fragment);
				attr_dev(div0, "class", "modal svelte-kcev16");
				add_location(div0, file$5, 144, 6, 4332);
				attr_dev(div1, "class", "modal-backdrop svelte-kcev16");
				add_location(div1, file$5, 143, 4, 4259);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				append_dev(div1, div0);
				mount_component(sendbolt11, div0, null);
				current = true;

				if (!mounted) {
					dispose = [
						listen_dev(div0, "click", stop_propagation(/*click_handler_1*/ ctx[24]), false, false, true, false),
						listen_dev(div1, "click", /*handleCloseSendBolt11Modal*/ ctx[17], false, false, false, false)
					];

					mounted = true;
				}
			},
			p: noop$1,
			i: function intro(local) {
				if (current) return;
				transition_in(sendbolt11.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(sendbolt11.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div1);
				}

				destroy_component(sendbolt11);
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_3.name,
			type: "if",
			source: "(128:2) {#if showSendBolt11Modal}",
			ctx
		});

		return block;
	}

	// (136:2) {#if showReceiveBolt12Modal}
	function create_if_block_2$1(ctx) {
		let div1;
		let div0;
		let receivebolt12;
		let current;
		let mounted;
		let dispose;

		receivebolt12 = new Bolt12({
				props: { offer: /*offer*/ ctx[1] },
				$$inline: true
			});

		receivebolt12.$on("close", /*handleCloseReceiveBolt12Modal*/ ctx[18]);

		const block = {
			c: function create() {
				div1 = element("div");
				div0 = element("div");
				create_component(receivebolt12.$$.fragment);
				attr_dev(div0, "class", "modal svelte-kcev16");
				add_location(div0, file$5, 152, 6, 4582);
				attr_dev(div1, "class", "modal-backdrop svelte-kcev16");
				add_location(div1, file$5, 151, 4, 4506);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				append_dev(div1, div0);
				mount_component(receivebolt12, div0, null);
				current = true;

				if (!mounted) {
					dispose = [
						listen_dev(div0, "click", stop_propagation(/*click_handler_2*/ ctx[23]), false, false, true, false),
						listen_dev(div1, "click", /*handleCloseReceiveBolt12Modal*/ ctx[18], false, false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				const receivebolt12_changes = {};
				if (dirty & /*offer*/ 2) receivebolt12_changes.offer = /*offer*/ ctx[1];
				receivebolt12.$set(receivebolt12_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(receivebolt12.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(receivebolt12.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div1);
				}

				destroy_component(receivebolt12);
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_2$1.name,
			type: "if",
			source: "(136:2) {#if showReceiveBolt12Modal}",
			ctx
		});

		return block;
	}

	// (144:2) {#if showSendBolt12Modal}
	function create_if_block_1$1(ctx) {
		let div1;
		let div0;
		let sendbolt12;
		let current;
		let mounted;
		let dispose;
		sendbolt12 = new SendBolt12({ $$inline: true });
		sendbolt12.$on("close", /*handleCloseSendBolt12Modal*/ ctx[19]);

		const block = {
			c: function create() {
				div1 = element("div");
				div0 = element("div");
				create_component(sendbolt12.$$.fragment);
				attr_dev(div0, "class", "modal svelte-kcev16");
				add_location(div0, file$5, 160, 6, 4840);
				attr_dev(div1, "class", "modal-backdrop svelte-kcev16");
				add_location(div1, file$5, 159, 4, 4767);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				append_dev(div1, div0);
				mount_component(sendbolt12, div0, null);
				current = true;

				if (!mounted) {
					dispose = [
						listen_dev(div0, "click", stop_propagation(/*click_handler_3*/ ctx[22]), false, false, true, false),
						listen_dev(div1, "click", /*handleCloseSendBolt12Modal*/ ctx[19], false, false, false, false)
					];

					mounted = true;
				}
			},
			p: noop$1,
			i: function intro(local) {
				if (current) return;
				transition_in(sendbolt12.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(sendbolt12.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div1);
				}

				destroy_component(sendbolt12);
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_1$1.name,
			type: "if",
			source: "(144:2) {#if showSendBolt12Modal}",
			ctx
		});

		return block;
	}

	// (152:2) {#if showSendtoLUD16Modal}
	function create_if_block$1(ctx) {
		let div1;
		let div0;
		let sendtolud16;
		let current;
		let mounted;
		let dispose;
		sendtolud16 = new SendtoLUD16({ $$inline: true });
		sendtolud16.$on("close", /*handleCloseSendtoLUD16Modal*/ ctx[20]);

		const block = {
			c: function create() {
				div1 = element("div");
				div0 = element("div");
				create_component(sendtolud16.$$.fragment);
				attr_dev(div0, "class", "modal svelte-kcev16");
				add_location(div0, file$5, 168, 6, 5086);
				attr_dev(div1, "class", "modal-backdrop svelte-kcev16");
				add_location(div1, file$5, 167, 4, 5012);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				append_dev(div1, div0);
				mount_component(sendtolud16, div0, null);
				current = true;

				if (!mounted) {
					dispose = [
						listen_dev(div0, "click", stop_propagation(/*click_handler_4*/ ctx[21]), false, false, true, false),
						listen_dev(div1, "click", /*handleCloseSendtoLUD16Modal*/ ctx[20], false, false, false, false)
					];

					mounted = true;
				}
			},
			p: noop$1,
			i: function intro(local) {
				if (current) return;
				transition_in(sendtolud16.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(sendtolud16.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div1);
				}

				destroy_component(sendtolud16);
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$1.name,
			type: "if",
			source: "(152:2) {#if showSendtoLUD16Modal}",
			ctx
		});

		return block;
	}

	function create_fragment$5(ctx) {
		let main;
		let div0;
		let span;
		let t0;
		let t1;
		let t2;
		let t3;
		let div3;
		let div1;
		let button0;
		let t4;
		let icon0;
		let t5;
		let t6;
		let div2;
		let button1;
		let t7;
		let icon1;
		let t8;
		let t9;
		let t10;
		let t11;
		let t12;
		let t13;
		let current;
		let mounted;
		let dispose;

		icon0 = new Icon({
				props: { icon: "hugeicons:money-receive-circle" },
				$$inline: true
			});

		let if_block0 = /*showReceiveOptions*/ ctx[2] && create_if_block_6(ctx);

		icon1 = new Icon({
				props: { icon: "hugeicons:money-send-circle" },
				$$inline: true
			});

		let if_block1 = /*showSendOptions*/ ctx[3] && create_if_block_5(ctx);
		let if_block2 = /*showCreateInvoiceModal*/ ctx[4] && create_if_block_4(ctx);
		let if_block3 = /*showSendBolt11Modal*/ ctx[5] && create_if_block_3(ctx);
		let if_block4 = /*showReceiveBolt12Modal*/ ctx[6] && create_if_block_2$1(ctx);
		let if_block5 = /*showSendBolt12Modal*/ ctx[7] && create_if_block_1$1(ctx);
		let if_block6 = /*showSendtoLUD16Modal*/ ctx[8] && create_if_block$1(ctx);

		const block = {
			c: function create() {
				main = element("main");
				div0 = element("div");
				span = element("span");
				t0 = text("Balance: ");
				t1 = text(/*balance*/ ctx[0]);
				t2 = text(" sats");
				t3 = space();
				div3 = element("div");
				div1 = element("div");
				button0 = element("button");
				t4 = text("Receive ");
				create_component(icon0.$$.fragment);
				t5 = space();
				if (if_block0) if_block0.c();
				t6 = space();
				div2 = element("div");
				button1 = element("button");
				t7 = text("Send ");
				create_component(icon1.$$.fragment);
				t8 = space();
				if (if_block1) if_block1.c();
				t9 = space();
				if (if_block2) if_block2.c();
				t10 = space();
				if (if_block3) if_block3.c();
				t11 = space();
				if (if_block4) if_block4.c();
				t12 = space();
				if (if_block5) if_block5.c();
				t13 = space();
				if (if_block6) if_block6.c();
				attr_dev(span, "class", "balance svelte-kcev16");
				add_location(span, file$5, 94, 4, 2496);
				attr_dev(div0, "class", "balance-container svelte-kcev16");
				add_location(div0, file$5, 93, 2, 2460);
				attr_dev(button0, "class", "action-button svelte-kcev16");
				add_location(button0, file$5, 99, 6, 2629);
				attr_dev(div1, "class", "action-group svelte-kcev16");
				add_location(div1, file$5, 98, 4, 2596);
				attr_dev(button1, "class", "action-button svelte-kcev16");
				add_location(button1, file$5, 115, 6, 3250);
				attr_dev(div2, "class", "action-group svelte-kcev16");
				add_location(div2, file$5, 114, 4, 3217);
				attr_dev(div3, "class", "action-container svelte-kcev16");
				add_location(div3, file$5, 97, 2, 2561);
				add_location(main, file$5, 92, 0, 2451);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, main, anchor);
				append_dev(main, div0);
				append_dev(div0, span);
				append_dev(span, t0);
				append_dev(span, t1);
				append_dev(span, t2);
				append_dev(main, t3);
				append_dev(main, div3);
				append_dev(div3, div1);
				append_dev(div1, button0);
				append_dev(button0, t4);
				mount_component(icon0, button0, null);
				append_dev(div1, t5);
				if (if_block0) if_block0.m(div1, null);
				append_dev(div3, t6);
				append_dev(div3, div2);
				append_dev(div2, button1);
				append_dev(button1, t7);
				mount_component(icon1, button1, null);
				append_dev(div2, t8);
				if (if_block1) if_block1.m(div2, null);
				append_dev(main, t9);
				if (if_block2) if_block2.m(main, null);
				append_dev(main, t10);
				if (if_block3) if_block3.m(main, null);
				append_dev(main, t11);
				if (if_block4) if_block4.m(main, null);
				append_dev(main, t12);
				if (if_block5) if_block5.m(main, null);
				append_dev(main, t13);
				if (if_block6) if_block6.m(main, null);
				current = true;

				if (!mounted) {
					dispose = [
						listen_dev(button0, "click", /*handleReceiveClick*/ ctx[9], false, false, false, false),
						listen_dev(button1, "click", /*handleSendClick*/ ctx[10], false, false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				if (!current || dirty & /*balance*/ 1) set_data_dev(t1, /*balance*/ ctx[0]);

				if (/*showReceiveOptions*/ ctx[2]) {
					if (if_block0) {
						if_block0.p(ctx, dirty);

						if (dirty & /*showReceiveOptions*/ 4) {
							transition_in(if_block0, 1);
						}
					} else {
						if_block0 = create_if_block_6(ctx);
						if_block0.c();
						transition_in(if_block0, 1);
						if_block0.m(div1, null);
					}
				} else if (if_block0) {
					group_outros();

					transition_out(if_block0, 1, 1, () => {
						if_block0 = null;
					});

					check_outros();
				}

				if (/*showSendOptions*/ ctx[3]) {
					if (if_block1) {
						if_block1.p(ctx, dirty);

						if (dirty & /*showSendOptions*/ 8) {
							transition_in(if_block1, 1);
						}
					} else {
						if_block1 = create_if_block_5(ctx);
						if_block1.c();
						transition_in(if_block1, 1);
						if_block1.m(div2, null);
					}
				} else if (if_block1) {
					group_outros();

					transition_out(if_block1, 1, 1, () => {
						if_block1 = null;
					});

					check_outros();
				}

				if (/*showCreateInvoiceModal*/ ctx[4]) {
					if (if_block2) {
						if_block2.p(ctx, dirty);

						if (dirty & /*showCreateInvoiceModal*/ 16) {
							transition_in(if_block2, 1);
						}
					} else {
						if_block2 = create_if_block_4(ctx);
						if_block2.c();
						transition_in(if_block2, 1);
						if_block2.m(main, t10);
					}
				} else if (if_block2) {
					group_outros();

					transition_out(if_block2, 1, 1, () => {
						if_block2 = null;
					});

					check_outros();
				}

				if (/*showSendBolt11Modal*/ ctx[5]) {
					if (if_block3) {
						if_block3.p(ctx, dirty);

						if (dirty & /*showSendBolt11Modal*/ 32) {
							transition_in(if_block3, 1);
						}
					} else {
						if_block3 = create_if_block_3(ctx);
						if_block3.c();
						transition_in(if_block3, 1);
						if_block3.m(main, t11);
					}
				} else if (if_block3) {
					group_outros();

					transition_out(if_block3, 1, 1, () => {
						if_block3 = null;
					});

					check_outros();
				}

				if (/*showReceiveBolt12Modal*/ ctx[6]) {
					if (if_block4) {
						if_block4.p(ctx, dirty);

						if (dirty & /*showReceiveBolt12Modal*/ 64) {
							transition_in(if_block4, 1);
						}
					} else {
						if_block4 = create_if_block_2$1(ctx);
						if_block4.c();
						transition_in(if_block4, 1);
						if_block4.m(main, t12);
					}
				} else if (if_block4) {
					group_outros();

					transition_out(if_block4, 1, 1, () => {
						if_block4 = null;
					});

					check_outros();
				}

				if (/*showSendBolt12Modal*/ ctx[7]) {
					if (if_block5) {
						if_block5.p(ctx, dirty);

						if (dirty & /*showSendBolt12Modal*/ 128) {
							transition_in(if_block5, 1);
						}
					} else {
						if_block5 = create_if_block_1$1(ctx);
						if_block5.c();
						transition_in(if_block5, 1);
						if_block5.m(main, t13);
					}
				} else if (if_block5) {
					group_outros();

					transition_out(if_block5, 1, 1, () => {
						if_block5 = null;
					});

					check_outros();
				}

				if (/*showSendtoLUD16Modal*/ ctx[8]) {
					if (if_block6) {
						if_block6.p(ctx, dirty);

						if (dirty & /*showSendtoLUD16Modal*/ 256) {
							transition_in(if_block6, 1);
						}
					} else {
						if_block6 = create_if_block$1(ctx);
						if_block6.c();
						transition_in(if_block6, 1);
						if_block6.m(main, null);
					}
				} else if (if_block6) {
					group_outros();

					transition_out(if_block6, 1, 1, () => {
						if_block6 = null;
					});

					check_outros();
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(icon0.$$.fragment, local);
				transition_in(if_block0);
				transition_in(icon1.$$.fragment, local);
				transition_in(if_block1);
				transition_in(if_block2);
				transition_in(if_block3);
				transition_in(if_block4);
				transition_in(if_block5);
				transition_in(if_block6);
				current = true;
			},
			o: function outro(local) {
				transition_out(icon0.$$.fragment, local);
				transition_out(if_block0);
				transition_out(icon1.$$.fragment, local);
				transition_out(if_block1);
				transition_out(if_block2);
				transition_out(if_block3);
				transition_out(if_block4);
				transition_out(if_block5);
				transition_out(if_block6);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(main);
				}

				destroy_component(icon0);
				if (if_block0) if_block0.d();
				destroy_component(icon1);
				if (if_block1) if_block1.d();
				if (if_block2) if_block2.d();
				if (if_block3) if_block3.d();
				if (if_block4) if_block4.d();
				if (if_block5) if_block5.d();
				if (if_block6) if_block6.d();
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$5.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$5($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('SendReceive', slots, []);
		let balance = null;
		let offer = null;
		let showReceiveOptions = false;
		let showSendOptions = false;
		let showCreateInvoiceModal = false;
		let showSendBolt11Modal = false;
		let showReceiveBolt12Modal = false;
		let showSendBolt12Modal = false;
		let showSendtoLUD16Modal = false; // New state for LUD16 modal

		async function fetchData() {
			try {
				const balanceResponse = await fetch('http://localhost:3000/api/getbalance');
				const balanceData = await balanceResponse.json();
				$$invalidate(0, balance = balanceData.data.balanceSat);
				const offerResponse = await fetch('http://localhost:3000/api/getoffer');
				const offerData = await offerResponse.json();
				$$invalidate(1, offer = offerData.data);
			} catch(error) {
				console.error('Error fetching data:', error);
			}
		}

		onMount(fetchData);

		function handleReceiveClick() {
			$$invalidate(2, showReceiveOptions = !showReceiveOptions);
			if (showSendOptions) $$invalidate(3, showSendOptions = false);
		}

		function handleSendClick() {
			$$invalidate(3, showSendOptions = !showSendOptions);
			if (showReceiveOptions) $$invalidate(2, showReceiveOptions = false);
		}

		function handleReceiveInvoiceClick() {
			$$invalidate(4, showCreateInvoiceModal = true);
			$$invalidate(2, showReceiveOptions = false);
		}

		function handleReceiveBolt12Click() {
			$$invalidate(6, showReceiveBolt12Modal = true);
			$$invalidate(2, showReceiveOptions = false);
		}

		function handleSendBolt11Click() {
			$$invalidate(5, showSendBolt11Modal = true);
			$$invalidate(3, showSendOptions = false);
		}

		function handleSendBolt12Click() {
			$$invalidate(7, showSendBolt12Modal = true);
			$$invalidate(3, showSendOptions = false);
		}

		function handleSendtoLUD16Click() {
			$$invalidate(8, showSendtoLUD16Modal = true);
			$$invalidate(3, showSendOptions = false);
		}

		function handleCloseCreateInvoiceModal() {
			$$invalidate(4, showCreateInvoiceModal = false);
		}

		function handleCloseSendBolt11Modal() {
			$$invalidate(5, showSendBolt11Modal = false);
		}

		function handleCloseReceiveBolt12Modal() {
			$$invalidate(6, showReceiveBolt12Modal = false);
		}

		function handleCloseSendBolt12Modal() {
			$$invalidate(7, showSendBolt12Modal = false);
		}

		function handleCloseSendtoLUD16Modal() {
			$$invalidate(8, showSendtoLUD16Modal = false);
		}

		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<SendReceive> was created with unknown prop '${key}'`);
		});

		function click_handler_4(event) {
			bubble.call(this, $$self, event);
		}

		function click_handler_3(event) {
			bubble.call(this, $$self, event);
		}

		function click_handler_2(event) {
			bubble.call(this, $$self, event);
		}

		function click_handler_1(event) {
			bubble.call(this, $$self, event);
		}

		function click_handler(event) {
			bubble.call(this, $$self, event);
		}

		$$self.$capture_state = () => ({
			onMount,
			Icon,
			CreateInvoice,
			SendBolt11,
			ReceiveBolt12: Bolt12,
			SendBolt12,
			SendtoLUD16,
			balance,
			offer,
			showReceiveOptions,
			showSendOptions,
			showCreateInvoiceModal,
			showSendBolt11Modal,
			showReceiveBolt12Modal,
			showSendBolt12Modal,
			showSendtoLUD16Modal,
			fetchData,
			handleReceiveClick,
			handleSendClick,
			handleReceiveInvoiceClick,
			handleReceiveBolt12Click,
			handleSendBolt11Click,
			handleSendBolt12Click,
			handleSendtoLUD16Click,
			handleCloseCreateInvoiceModal,
			handleCloseSendBolt11Modal,
			handleCloseReceiveBolt12Modal,
			handleCloseSendBolt12Modal,
			handleCloseSendtoLUD16Modal
		});

		$$self.$inject_state = $$props => {
			if ('balance' in $$props) $$invalidate(0, balance = $$props.balance);
			if ('offer' in $$props) $$invalidate(1, offer = $$props.offer);
			if ('showReceiveOptions' in $$props) $$invalidate(2, showReceiveOptions = $$props.showReceiveOptions);
			if ('showSendOptions' in $$props) $$invalidate(3, showSendOptions = $$props.showSendOptions);
			if ('showCreateInvoiceModal' in $$props) $$invalidate(4, showCreateInvoiceModal = $$props.showCreateInvoiceModal);
			if ('showSendBolt11Modal' in $$props) $$invalidate(5, showSendBolt11Modal = $$props.showSendBolt11Modal);
			if ('showReceiveBolt12Modal' in $$props) $$invalidate(6, showReceiveBolt12Modal = $$props.showReceiveBolt12Modal);
			if ('showSendBolt12Modal' in $$props) $$invalidate(7, showSendBolt12Modal = $$props.showSendBolt12Modal);
			if ('showSendtoLUD16Modal' in $$props) $$invalidate(8, showSendtoLUD16Modal = $$props.showSendtoLUD16Modal);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [
			balance,
			offer,
			showReceiveOptions,
			showSendOptions,
			showCreateInvoiceModal,
			showSendBolt11Modal,
			showReceiveBolt12Modal,
			showSendBolt12Modal,
			showSendtoLUD16Modal,
			handleReceiveClick,
			handleSendClick,
			handleReceiveInvoiceClick,
			handleReceiveBolt12Click,
			handleSendBolt11Click,
			handleSendBolt12Click,
			handleSendtoLUD16Click,
			handleCloseCreateInvoiceModal,
			handleCloseSendBolt11Modal,
			handleCloseReceiveBolt12Modal,
			handleCloseSendBolt12Modal,
			handleCloseSendtoLUD16Modal,
			click_handler_4,
			click_handler_3,
			click_handler_2,
			click_handler_1,
			click_handler
		];
	}

	class SendReceive extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "SendReceive",
				options,
				id: create_fragment$5.name
			});
		}
	}

	/* src/components/Liquidity.svelte generated by Svelte v4.2.18 */

	const { console: console_1$2 } = globals;
	const file$4 = "src/components/Liquidity.svelte";

	function create_fragment$4(ctx) {
		let div2;
		let div0;
		let span0;
		let t0;
		let t1;
		let t2;
		let t3;
		let div1;
		let span1;
		let t4;
		let t5;
		let t6;

		const block = {
			c: function create() {
				div2 = element("div");
				div0 = element("div");
				span0 = element("span");
				t0 = text("Inbound liquidity ");
				t1 = text(/*inboundLiquiditySat*/ ctx[1]);
				t2 = text(" sats");
				t3 = space();
				div1 = element("div");
				span1 = element("span");
				t4 = text("Outbound liquidity ");
				t5 = text(/*capacitySat*/ ctx[0]);
				t6 = text(" sats");
				attr_dev(span0, "class", "label svelte-qsrfi3");
				add_location(span0, file$4, 80, 4, 1775);
				attr_dev(div0, "class", "bar inbound-bar svelte-qsrfi3");
				set_style(div0, "width", /*inboundLiquiditySat*/ ctx[1] + "px");
				add_location(div0, file$4, 79, 2, 1702);
				attr_dev(span1, "class", "label svelte-qsrfi3");
				add_location(span1, file$4, 83, 4, 1924);
				attr_dev(div1, "class", "bar outbound-bar svelte-qsrfi3");
				set_style(div1, "width", /*capacitySat*/ ctx[0] + "px");
				add_location(div1, file$4, 82, 2, 1858);
				attr_dev(div2, "class", "progress-bar svelte-qsrfi3");
				add_location(div2, file$4, 78, 0, 1673);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div2, anchor);
				append_dev(div2, div0);
				append_dev(div0, span0);
				append_dev(span0, t0);
				append_dev(span0, t1);
				append_dev(span0, t2);
				append_dev(div2, t3);
				append_dev(div2, div1);
				append_dev(div1, span1);
				append_dev(span1, t4);
				append_dev(span1, t5);
				append_dev(span1, t6);
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*inboundLiquiditySat*/ 2) set_data_dev(t1, /*inboundLiquiditySat*/ ctx[1]);

				if (dirty & /*inboundLiquiditySat*/ 2) {
					set_style(div0, "width", /*inboundLiquiditySat*/ ctx[1] + "px");
				}

				if (dirty & /*capacitySat*/ 1) set_data_dev(t5, /*capacitySat*/ ctx[0]);

				if (dirty & /*capacitySat*/ 1) {
					set_style(div1, "width", /*capacitySat*/ ctx[0] + "px");
				}
			},
			i: noop$1,
			o: noop$1,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div2);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$4.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$4($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Liquidity', slots, []);
		let { apiUrl = 'http://localhost:3000/api/getinfo' } = $$props;

		// Reactive variables to hold data
		let capacitySat = 0;

		let inboundLiquiditySat = 0;

		// Fetch data function
		async function fetchData() {
			try {
				const response = await axios$1.get(apiUrl);
				const { data } = response.data;

				// Extract data from API response
				if (data.channels && data.channels.length > 0) {
					$$invalidate(0, capacitySat = data.channels[0].capacitySat);
					$$invalidate(1, inboundLiquiditySat = data.channels[0].inboundLiquiditySat);
				}
			} catch(error) {
				console.error('Error fetching data:', error);
			}
		}

		// Fetch data when component mounts
		onMount(fetchData);

		const writable_props = ['apiUrl'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Liquidity> was created with unknown prop '${key}'`);
		});

		$$self.$$set = $$props => {
			if ('apiUrl' in $$props) $$invalidate(2, apiUrl = $$props.apiUrl);
		};

		$$self.$capture_state = () => ({
			onMount,
			axios: axios$1,
			apiUrl,
			capacitySat,
			inboundLiquiditySat,
			fetchData
		});

		$$self.$inject_state = $$props => {
			if ('apiUrl' in $$props) $$invalidate(2, apiUrl = $$props.apiUrl);
			if ('capacitySat' in $$props) $$invalidate(0, capacitySat = $$props.capacitySat);
			if ('inboundLiquiditySat' in $$props) $$invalidate(1, inboundLiquiditySat = $$props.inboundLiquiditySat);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [capacitySat, inboundLiquiditySat, apiUrl];
	}

	class Liquidity extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$4, create_fragment$4, safe_not_equal, { apiUrl: 2 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Liquidity",
				options,
				id: create_fragment$4.name
			});
		}

		get apiUrl() {
			throw new Error("<Liquidity>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set apiUrl(value) {
			throw new Error("<Liquidity>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/components/NodeInfo.svelte generated by Svelte v4.2.18 */

	const { Object: Object_1, console: console_1$1 } = globals;
	const file$3 = "src/components/NodeInfo.svelte";

	function create_fragment$3(ctx) {
		let div0;
		let h2;
		let t1;
		let pre;
		let t2_value = formatNodeInfo(/*nodeInfo*/ ctx[0]) + "";
		let t2;
		let t3;
		let div1;
		let liquidity;
		let current;
		liquidity = new Liquidity({ $$inline: true });

		const block = {
			c: function create() {
				div0 = element("div");
				h2 = element("h2");
				h2.textContent = "Node Information";
				t1 = space();
				pre = element("pre");
				t2 = text(t2_value);
				t3 = space();
				div1 = element("div");
				create_component(liquidity.$$.fragment);
				attr_dev(h2, "class", "svelte-17gd172");
				add_location(h2, file$3, 76, 2, 1800);
				attr_dev(pre, "class", "svelte-17gd172");
				add_location(pre, file$3, 77, 2, 1828);
				attr_dev(div0, "class", "node-info svelte-17gd172");
				add_location(div0, file$3, 75, 0, 1774);
				add_location(div1, file$3, 79, 0, 1873);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div0, anchor);
				append_dev(div0, h2);
				append_dev(div0, t1);
				append_dev(div0, pre);
				append_dev(pre, t2);
				insert_dev(target, t3, anchor);
				insert_dev(target, div1, anchor);
				mount_component(liquidity, div1, null);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				if ((!current || dirty & /*nodeInfo*/ 1) && t2_value !== (t2_value = formatNodeInfo(/*nodeInfo*/ ctx[0]) + "")) set_data_dev(t2, t2_value);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(liquidity.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(liquidity.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div0);
					detach_dev(t3);
					detach_dev(div1);
				}

				destroy_component(liquidity);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$3.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function formatNodeInfo(nodeInfo) {
		if (!nodeInfo || Object.keys(nodeInfo).length === 0) {
			return 'No data available';
		}

		const { nodeId, channels, chain, blockHeight, version } = nodeInfo;
		const firstChannel = channels && channels.length > 0 ? channels[0] : null;

		return `
      Node ID: ${nodeId}
      Chain: ${chain}
      Block Height: ${blockHeight}
      Version: ${version}
      ${firstChannel
	? `
        Channel ID: ${firstChannel.channelId}
        State: ${firstChannel.state}
        Capacity: ${firstChannel.capacitySat} sat
        Inbound Liquidity: ${firstChannel.inboundLiquiditySat} sat
      `
	: ''}
    `;
	}

	function instance$3($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('NodeInfo', slots, []);
		let { apiUrl = 'http://localhost:3000/api/getinfo' } = $$props;

		// Reactive variables to hold data
		let nodeInfo = {};

		// Fetch data function
		async function fetchData() {
			try {
				const response = await fetch(apiUrl);
				const { data } = await response.json();
				$$invalidate(0, nodeInfo = data);
			} catch(error) {
				console.error('Error fetching data:', error);
			}
		}

		// Fetch data when component mounts
		onMount(fetchData);

		const writable_props = ['apiUrl'];

		Object_1.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<NodeInfo> was created with unknown prop '${key}'`);
		});

		$$self.$$set = $$props => {
			if ('apiUrl' in $$props) $$invalidate(1, apiUrl = $$props.apiUrl);
		};

		$$self.$capture_state = () => ({
			onMount,
			Liquidity,
			apiUrl,
			nodeInfo,
			fetchData,
			formatNodeInfo
		});

		$$self.$inject_state = $$props => {
			if ('apiUrl' in $$props) $$invalidate(1, apiUrl = $$props.apiUrl);
			if ('nodeInfo' in $$props) $$invalidate(0, nodeInfo = $$props.nodeInfo);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [nodeInfo, apiUrl];
	}

	class NodeInfo extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$3, create_fragment$3, safe_not_equal, { apiUrl: 1 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "NodeInfo",
				options,
				id: create_fragment$3.name
			});
		}

		get apiUrl() {
			throw new Error("<NodeInfo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set apiUrl(value) {
			throw new Error("<NodeInfo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/components/Dashboard.svelte generated by Svelte v4.2.18 */
	const file$2 = "src/components/Dashboard.svelte";

	function create_fragment$2(ctx) {
		let div;
		let sendreceive;
		let t;
		let nodeinfo;
		let current;
		sendreceive = new SendReceive({ $$inline: true });
		nodeinfo = new NodeInfo({ $$inline: true });

		const block = {
			c: function create() {
				div = element("div");
				create_component(sendreceive.$$.fragment);
				t = space();
				create_component(nodeinfo.$$.fragment);
				attr_dev(div, "class", "dashboard component svelte-r76rlg");
				add_location(div, file$2, 15, 0, 240);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				mount_component(sendreceive, div, null);
				append_dev(div, t);
				mount_component(nodeinfo, div, null);
				current = true;
			},
			p: noop$1,
			i: function intro(local) {
				if (current) return;
				transition_in(sendreceive.$$.fragment, local);
				transition_in(nodeinfo.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(sendreceive.$$.fragment, local);
				transition_out(nodeinfo.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				destroy_component(sendreceive);
				destroy_component(nodeinfo);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$2.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$2($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Dashboard', slots, []);
		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dashboard> was created with unknown prop '${key}'`);
		});

		$$self.$capture_state = () => ({ SendReceive, NodeInfo, onMount });
		return [];
	}

	class Dashboard extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Dashboard",
				options,
				id: create_fragment$2.name
			});
		}
	}

	/* src/components/TransactionHistory.svelte generated by Svelte v4.2.18 */

	const { console: console_1 } = globals;
	const file$1 = "src/components/TransactionHistory.svelte";

	function get_each_context(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[2] = list[i];
		return child_ctx;
	}

	// (128:6) {:else}
	function create_else_block(ctx) {
		let tr;
		let td;
		let t1;

		const block = {
			c: function create() {
				tr = element("tr");
				td = element("td");
				td.textContent = "No transactions found.";
				t1 = space();
				attr_dev(td, "colspan", "6");
				attr_dev(td, "class", "no-data svelte-wfajmt");
				add_location(td, file$1, 129, 10, 3501);
				attr_dev(tr, "class", "svelte-wfajmt");
				add_location(tr, file$1, 128, 8, 3485);
			},
			m: function mount(target, anchor) {
				insert_dev(target, tr, anchor);
				append_dev(tr, td);
				append_dev(tr, t1);
			},
			p: noop$1,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(tr);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_else_block.name,
			type: "else",
			source: "(128:6) {:else}",
			ctx
		});

		return block;
	}

	// (117:6) {#each payments as payment (payment.paymentId || payment.paymentHash)}
	function create_each_block(key_1, ctx) {
		let tr;
		let td0;

		let t0_value = (/*payment*/ ctx[2].type === 'outgoing'
		? 'Outgoing'
		: 'Incoming') + "";

		let t0;
		let t1;
		let td1;
		let t2_value = (/*payment*/ ctx[2].paymentId || /*payment*/ ctx[2].paymentHash) + "";
		let t2;
		let td1_title_value;
		let t3;
		let td2;
		let t4_value = (/*payment*/ ctx[2].description || 'N/A') + "";
		let t4;
		let t5;
		let td3;
		let t6_value = formatSatoshis(/*payment*/ ctx[2].amountSat || /*payment*/ ctx[2].receivedSat || 0) + "";
		let t6;
		let t7;
		let td4;
		let t8_value = formatSatoshis(/*payment*/ ctx[2].fees || 0) + "";
		let t8;
		let t9;
		let td5;
		let t10_value = new Date(/*payment*/ ctx[2].completedAt).toLocaleString() + "";
		let t10;
		let t11;
		let tr_class_value;

		const block = {
			key: key_1,
			first: null,
			c: function create() {
				tr = element("tr");
				td0 = element("td");
				t0 = text(t0_value);
				t1 = space();
				td1 = element("td");
				t2 = text(t2_value);
				t3 = space();
				td2 = element("td");
				t4 = text(t4_value);
				t5 = space();
				td3 = element("td");
				t6 = text(t6_value);
				t7 = space();
				td4 = element("td");
				t8 = text(t8_value);
				t9 = space();
				td5 = element("td");
				t10 = text(t10_value);
				t11 = space();
				attr_dev(td0, "class", "svelte-wfajmt");
				add_location(td0, file$1, 118, 10, 2983);
				attr_dev(td1, "title", td1_title_value = /*payment*/ ctx[2].paymentId || /*payment*/ ctx[2].paymentHash);
				attr_dev(td1, "class", "svelte-wfajmt");
				add_location(td1, file$1, 119, 10, 3059);
				attr_dev(td2, "class", "svelte-wfajmt");
				add_location(td2, file$1, 122, 10, 3197);
				attr_dev(td3, "class", "svelte-wfajmt");
				add_location(td3, file$1, 123, 10, 3248);
				attr_dev(td4, "class", "svelte-wfajmt");
				add_location(td4, file$1, 124, 10, 3332);
				attr_dev(td5, "class", "svelte-wfajmt");
				add_location(td5, file$1, 125, 10, 3388);
				attr_dev(tr, "class", tr_class_value = "" + (null_to_empty(/*payment*/ ctx[2].type) + " svelte-wfajmt"));
				add_location(tr, file$1, 117, 8, 2946);
				this.first = tr;
			},
			m: function mount(target, anchor) {
				insert_dev(target, tr, anchor);
				append_dev(tr, td0);
				append_dev(td0, t0);
				append_dev(tr, t1);
				append_dev(tr, td1);
				append_dev(td1, t2);
				append_dev(tr, t3);
				append_dev(tr, td2);
				append_dev(td2, t4);
				append_dev(tr, t5);
				append_dev(tr, td3);
				append_dev(td3, t6);
				append_dev(tr, t7);
				append_dev(tr, td4);
				append_dev(td4, t8);
				append_dev(tr, t9);
				append_dev(tr, td5);
				append_dev(td5, t10);
				append_dev(tr, t11);
			},
			p: function update(new_ctx, dirty) {
				ctx = new_ctx;

				if (dirty & /*payments*/ 1 && t0_value !== (t0_value = (/*payment*/ ctx[2].type === 'outgoing'
				? 'Outgoing'
				: 'Incoming') + "")) set_data_dev(t0, t0_value);

				if (dirty & /*payments*/ 1 && t2_value !== (t2_value = (/*payment*/ ctx[2].paymentId || /*payment*/ ctx[2].paymentHash) + "")) set_data_dev(t2, t2_value);

				if (dirty & /*payments*/ 1 && td1_title_value !== (td1_title_value = /*payment*/ ctx[2].paymentId || /*payment*/ ctx[2].paymentHash)) {
					attr_dev(td1, "title", td1_title_value);
				}

				if (dirty & /*payments*/ 1 && t4_value !== (t4_value = (/*payment*/ ctx[2].description || 'N/A') + "")) set_data_dev(t4, t4_value);
				if (dirty & /*payments*/ 1 && t6_value !== (t6_value = formatSatoshis(/*payment*/ ctx[2].amountSat || /*payment*/ ctx[2].receivedSat || 0) + "")) set_data_dev(t6, t6_value);
				if (dirty & /*payments*/ 1 && t8_value !== (t8_value = formatSatoshis(/*payment*/ ctx[2].fees || 0) + "")) set_data_dev(t8, t8_value);
				if (dirty & /*payments*/ 1 && t10_value !== (t10_value = new Date(/*payment*/ ctx[2].completedAt).toLocaleString() + "")) set_data_dev(t10, t10_value);

				if (dirty & /*payments*/ 1 && tr_class_value !== (tr_class_value = "" + (null_to_empty(/*payment*/ ctx[2].type) + " svelte-wfajmt"))) {
					attr_dev(tr, "class", tr_class_value);
				}
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(tr);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block.name,
			type: "each",
			source: "(117:6) {#each payments as payment (payment.paymentId || payment.paymentHash)}",
			ctx
		});

		return block;
	}

	function create_fragment$1(ctx) {
		let div;
		let h2;
		let t1;
		let table;
		let thead;
		let tr;
		let th0;
		let t3;
		let th1;
		let t5;
		let th2;
		let t7;
		let th3;
		let t9;
		let th4;
		let t11;
		let th5;
		let t13;
		let tbody;
		let each_blocks = [];
		let each_1_lookup = new Map();
		let each_value = ensure_array_like_dev(/*payments*/ ctx[0]);
		const get_key = ctx => /*payment*/ ctx[2].paymentId || /*payment*/ ctx[2].paymentHash;
		validate_each_keys(ctx, each_value, get_each_context, get_key);

		for (let i = 0; i < each_value.length; i += 1) {
			let child_ctx = get_each_context(ctx, each_value, i);
			let key = get_key(child_ctx);
			each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
		}

		let each_1_else = null;

		if (!each_value.length) {
			each_1_else = create_else_block(ctx);
		}

		const block = {
			c: function create() {
				div = element("div");
				h2 = element("h2");
				h2.textContent = "Transaction History";
				t1 = space();
				table = element("table");
				thead = element("thead");
				tr = element("tr");
				th0 = element("th");
				th0.textContent = "Type";
				t3 = space();
				th1 = element("th");
				th1.textContent = "ID";
				t5 = space();
				th2 = element("th");
				th2.textContent = "Description";
				t7 = space();
				th3 = element("th");
				th3.textContent = "Amount (Sats)";
				t9 = space();
				th4 = element("th");
				th4.textContent = "Fees (Sats)";
				t11 = space();
				th5 = element("th");
				th5.textContent = "Completed At";
				t13 = space();
				tbody = element("tbody");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				if (each_1_else) {
					each_1_else.c();
				}

				attr_dev(h2, "class", "svelte-wfajmt");
				add_location(h2, file$1, 103, 2, 2587);
				attr_dev(th0, "class", "svelte-wfajmt");
				add_location(th0, file$1, 107, 8, 2661);
				attr_dev(th1, "class", "svelte-wfajmt");
				add_location(th1, file$1, 108, 8, 2684);
				attr_dev(th2, "class", "svelte-wfajmt");
				add_location(th2, file$1, 109, 8, 2705);
				attr_dev(th3, "class", "svelte-wfajmt");
				add_location(th3, file$1, 110, 8, 2735);
				attr_dev(th4, "class", "svelte-wfajmt");
				add_location(th4, file$1, 111, 8, 2767);
				attr_dev(th5, "class", "svelte-wfajmt");
				add_location(th5, file$1, 112, 8, 2797);
				attr_dev(tr, "class", "svelte-wfajmt");
				add_location(tr, file$1, 106, 6, 2647);
				add_location(thead, file$1, 105, 4, 2632);
				add_location(tbody, file$1, 115, 4, 2851);
				attr_dev(table, "class", "svelte-wfajmt");
				add_location(table, file$1, 104, 2, 2619);
				attr_dev(div, "class", "transaction-table svelte-wfajmt");
				add_location(div, file$1, 102, 0, 2552);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				append_dev(div, h2);
				append_dev(div, t1);
				append_dev(div, table);
				append_dev(table, thead);
				append_dev(thead, tr);
				append_dev(tr, th0);
				append_dev(tr, t3);
				append_dev(tr, th1);
				append_dev(tr, t5);
				append_dev(tr, th2);
				append_dev(tr, t7);
				append_dev(tr, th3);
				append_dev(tr, t9);
				append_dev(tr, th4);
				append_dev(tr, t11);
				append_dev(tr, th5);
				append_dev(table, t13);
				append_dev(table, tbody);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(tbody, null);
					}
				}

				if (each_1_else) {
					each_1_else.m(tbody, null);
				}
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*payments, Date, formatSatoshis*/ 1) {
					each_value = ensure_array_like_dev(/*payments*/ ctx[0]);
					validate_each_keys(ctx, each_value, get_each_context, get_key);
					each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, tbody, destroy_block, create_each_block, null, get_each_context);

					if (!each_value.length && each_1_else) {
						each_1_else.p(ctx, dirty);
					} else if (!each_value.length) {
						each_1_else = create_else_block(ctx);
						each_1_else.c();
						each_1_else.m(tbody, null);
					} else if (each_1_else) {
						each_1_else.d(1);
						each_1_else = null;
					}
				}
			},
			i: noop$1,
			o: noop$1,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].d();
				}

				if (each_1_else) each_1_else.d();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$1.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	const backendBaseUrl = 'http://localhost:3000/api'; // Adjust this URL based on your backend setup

	function formatSatoshis(satoshis = 0) {
		return satoshis.toLocaleString(); // Display satoshis with commas for better readability
	}

	function instance$1($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('TransactionHistory', slots, []);
		let payments = [];

		async function fetchPayments() {
			try {
				// Fetch outgoing payments
				const outgoingResponse = await axios$1.get(`${backendBaseUrl}/payments/outgoing`);

				const outgoingPayments = outgoingResponse.data.data;

				// Fetch incoming payments
				const incomingResponse = await axios$1.get(`${backendBaseUrl}/payments/incoming`);

				const incomingPayments = incomingResponse.data.data;

				// Combine both outgoing and incoming payments
				$$invalidate(0, payments = [
					...outgoingPayments.map(payment => ({ ...payment, type: 'outgoing' })),
					...incomingPayments.map(payment => ({ ...payment, type: 'incoming' }))
				]);

				// Sort payments by completedAt date (newest first)
				payments.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
			} catch(error) {
				console.error('Error fetching payments:', error);
			}
		}

		onMount(fetchPayments); // Fetch data when the component mounts
		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<TransactionHistory> was created with unknown prop '${key}'`);
		});

		$$self.$capture_state = () => ({
			onMount,
			axios: axios$1,
			payments,
			backendBaseUrl,
			fetchPayments,
			formatSatoshis
		});

		$$self.$inject_state = $$props => {
			if ('payments' in $$props) $$invalidate(0, payments = $$props.payments);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [payments];
	}

	class TransactionHistory extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "TransactionHistory",
				options,
				id: create_fragment$1.name
			});
		}
	}

	/* src/App.svelte generated by Svelte v4.2.18 */
	const file = "src/App.svelte";

	// (26:4) {#if $isAuthenticated}
	function create_if_block(ctx) {
		let div1;
		let nav;
		let button0;
		let icon0;
		let t0;
		let t1;
		let button1;
		let icon1;
		let t2;
		let t3;
		let logout;
		let t4;
		let version;
		let t5;
		let div0;
		let current_block_type_index;
		let if_block;
		let current;
		let mounted;
		let dispose;

		icon0 = new Icon({
				props: { icon: "mdi-light:home" },
				$$inline: true
			});

		icon1 = new Icon({
				props: { icon: "bitcoin-icons:exchange-filled" },
				$$inline: true
			});

		logout = new LogOut({ $$inline: true });
		version = new Version$1({ $$inline: true });
		const if_block_creators = [create_if_block_1, create_if_block_2];
		const if_blocks = [];

		function select_block_type(ctx, dirty) {
			if (/*currentPage*/ ctx[1] === 'dashboard') return 0;
			if (/*currentPage*/ ctx[1] === 'history') return 1;
			return -1;
		}

		if (~(current_block_type_index = select_block_type(ctx))) {
			if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
		}

		const block = {
			c: function create() {
				div1 = element("div");
				nav = element("nav");
				button0 = element("button");
				create_component(icon0.$$.fragment);
				t0 = text(" Dashboard");
				t1 = space();
				button1 = element("button");
				create_component(icon1.$$.fragment);
				t2 = text(" Transactions");
				t3 = space();
				create_component(logout.$$.fragment);
				t4 = space();
				create_component(version.$$.fragment);
				t5 = space();
				div0 = element("div");
				if (if_block) if_block.c();
				attr_dev(button0, "class", "svelte-1s2jqfk");
				add_location(button0, file, 36, 10, 875);
				attr_dev(button1, "class", "svelte-1s2jqfk");
				add_location(button1, file, 39, 10, 1010);
				attr_dev(nav, "class", "svelte-1s2jqfk");
				add_location(nav, file, 35, 8, 859);
				attr_dev(div0, "class", "main-content svelte-1s2jqfk");
				add_location(div0, file, 47, 8, 1227);
				attr_dev(div1, "class", "container svelte-1s2jqfk");
				add_location(div1, file, 34, 6, 827);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				append_dev(div1, nav);
				append_dev(nav, button0);
				mount_component(icon0, button0, null);
				append_dev(button0, t0);
				append_dev(nav, t1);
				append_dev(nav, button1);
				mount_component(icon1, button1, null);
				append_dev(button1, t2);
				append_dev(nav, t3);
				mount_component(logout, nav, null);
				append_dev(nav, t4);
				mount_component(version, nav, null);
				append_dev(div1, t5);
				append_dev(div1, div0);

				if (~current_block_type_index) {
					if_blocks[current_block_type_index].m(div0, null);
				}

				current = true;

				if (!mounted) {
					dispose = [
						listen_dev(button0, "click", /*click_handler*/ ctx[2], false, false, false, false),
						listen_dev(button1, "click", /*click_handler_1*/ ctx[3], false, false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);

				if (current_block_type_index !== previous_block_index) {
					if (if_block) {
						group_outros();

						transition_out(if_blocks[previous_block_index], 1, 1, () => {
							if_blocks[previous_block_index] = null;
						});

						check_outros();
					}

					if (~current_block_type_index) {
						if_block = if_blocks[current_block_type_index];

						if (!if_block) {
							if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
							if_block.c();
						}

						transition_in(if_block, 1);
						if_block.m(div0, null);
					} else {
						if_block = null;
					}
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(icon0.$$.fragment, local);
				transition_in(icon1.$$.fragment, local);
				transition_in(logout.$$.fragment, local);
				transition_in(version.$$.fragment, local);
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(icon0.$$.fragment, local);
				transition_out(icon1.$$.fragment, local);
				transition_out(logout.$$.fragment, local);
				transition_out(version.$$.fragment, local);
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div1);
				}

				destroy_component(icon0);
				destroy_component(icon1);
				destroy_component(logout);
				destroy_component(version);

				if (~current_block_type_index) {
					if_blocks[current_block_type_index].d();
				}

				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block.name,
			type: "if",
			source: "(26:4) {#if $isAuthenticated}",
			ctx
		});

		return block;
	}

	// (47:46) 
	function create_if_block_2(ctx) {
		let transactionhistory;
		let current;
		transactionhistory = new TransactionHistory({ $$inline: true });

		const block = {
			c: function create() {
				create_component(transactionhistory.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(transactionhistory, target, anchor);
				current = true;
			},
			i: function intro(local) {
				if (current) return;
				transition_in(transactionhistory.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(transactionhistory.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(transactionhistory, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_2.name,
			type: "if",
			source: "(47:46) ",
			ctx
		});

		return block;
	}

	// (43:10) {#if currentPage === 'dashboard'}
	function create_if_block_1(ctx) {
		let dashboard;
		let current;
		dashboard = new Dashboard({ $$inline: true });

		const block = {
			c: function create() {
				create_component(dashboard.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(dashboard, target, anchor);
				current = true;
			},
			i: function intro(local) {
				if (current) return;
				transition_in(dashboard.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(dashboard.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(dashboard, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_1.name,
			type: "if",
			source: "(43:10) {#if currentPage === 'dashboard'}",
			ctx
		});

		return block;
	}

	// (24:2) <Route path="/app/*">
	function create_default_slot_1(ctx) {
		let if_block_anchor;
		let current;
		let if_block = /*$isAuthenticated*/ ctx[0] && create_if_block(ctx);

		const block = {
			c: function create() {
				if (if_block) if_block.c();
				if_block_anchor = empty();
			},
			m: function mount(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert_dev(target, if_block_anchor, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				if (/*$isAuthenticated*/ ctx[0]) {
					if (if_block) {
						if_block.p(ctx, dirty);

						if (dirty & /*$isAuthenticated*/ 1) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(if_block_anchor);
				}

				if (if_block) if_block.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot_1.name,
			type: "slot",
			source: "(24:2) <Route path=\\\"/app/*\\\">",
			ctx
		});

		return block;
	}

	// (21:0) <Router>
	function create_default_slot(ctx) {
		let route0;
		let t;
		let route1;
		let current;

		route0 = new Route({
				props: { path: "/", component: Welcome },
				$$inline: true
			});

		route1 = new Route({
				props: {
					path: "/app/*",
					$$slots: { default: [create_default_slot_1] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		const block = {
			c: function create() {
				create_component(route0.$$.fragment);
				t = space();
				create_component(route1.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(route0, target, anchor);
				insert_dev(target, t, anchor);
				mount_component(route1, target, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				const route1_changes = {};

				if (dirty & /*$$scope, currentPage, $isAuthenticated*/ 19) {
					route1_changes.$$scope = { dirty, ctx };
				}

				route1.$set(route1_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(route0.$$.fragment, local);
				transition_in(route1.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(route0.$$.fragment, local);
				transition_out(route1.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(t);
				}

				destroy_component(route0, detaching);
				destroy_component(route1, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot.name,
			type: "slot",
			source: "(21:0) <Router>",
			ctx
		});

		return block;
	}

	function create_fragment(ctx) {
		let router;
		let current;

		router = new Router({
				props: {
					$$slots: { default: [create_default_slot] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		const block = {
			c: function create() {
				create_component(router.$$.fragment);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				mount_component(router, target, anchor);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				const router_changes = {};

				if (dirty & /*$$scope, currentPage, $isAuthenticated*/ 19) {
					router_changes.$$scope = { dirty, ctx };
				}

				router.$set(router_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(router.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(router.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(router, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance($$self, $$props, $$invalidate) {
		let $isAuthenticated;
		validate_store(isAuthenticated, 'isAuthenticated');
		component_subscribe($$self, isAuthenticated, $$value => $$invalidate(0, $isAuthenticated = $$value));
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('App', slots, []);

		onMount(() => {
			initializeAuth();
		});

		let currentPage = 'dashboard';
		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
		});

		const click_handler = () => $$invalidate(1, currentPage = 'dashboard');
		const click_handler_1 = () => $$invalidate(1, currentPage = 'history');

		$$self.$capture_state = () => ({
			onMount,
			Icon,
			Router,
			Route,
			navigate,
			Welcome,
			LogOut,
			Version: Version$1,
			Dashboard,
			TransactionHistory,
			isAuthenticated,
			initializeAuth,
			readable,
			currentPage,
			$isAuthenticated
		});

		$$self.$inject_state = $$props => {
			if ('currentPage' in $$props) $$invalidate(1, currentPage = $$props.currentPage);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*$isAuthenticated*/ 1) {
				if (!$isAuthenticated) {
					navigate('/');
				}
			}
		};

		return [$isAuthenticated, currentPage, click_handler, click_handler_1];
	}

	class App extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance, create_fragment, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "App",
				options,
				id: create_fragment.name
			});
		}
	}

	const app = new App({
	  target: document.body,
	});

	return app;

})();
//# sourceMappingURL=bundle.js.map
