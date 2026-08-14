// Type declarations for @nseaprotector/acme-script.
// Hand-authored, kept in sync with the JS source by hand — see acmescript.js / src/*.js.

// ---- core.js ----------------------------------------------------------

/** Chains unary functions, `|>`-style. */
export function pipe<A>(value: A): A;
export function pipe<A, B>(value: A, fn1: (a: A) => B): B;
export function pipe<A, B, C>(value: A, fn1: (a: A) => B, fn2: (b: B) => C): C;
export function pipe<A, B, C, D>(
  value: A,
  fn1: (a: A) => B,
  fn2: (b: B) => C,
  fn3: (c: C) => D
): D;
export function pipe<A, B, C, D, E>(
  value: A,
  fn1: (a: A) => B,
  fn2: (b: B) => C,
  fn3: (c: C) => D,
  fn4: (d: D) => E
): E;
export function pipe(value: unknown, ...fns: Array<(x: any) => any>): unknown;

export type OkResult<T> = [true, T] & { ok: true; data: T; error: null };
export type ErrResult<E> = [false, E] & { ok: false; data: null; error: E };

/** A `{:ok, data}` / `{:error, err}`-style tagged result, also destructurable as `[bool, data|err]`. */
export type Result<T = unknown, E = unknown> = OkResult<T> | ErrResult<E>;

export function ok<T>(data: T): OkResult<T>;
export function error<E>(err: E): ErrResult<E>;

export function match<T, E = never, R = unknown>(
  result: Result<T, E>,
  clauses: { ok?: (data: T) => R; error?: (err: E) => R; _?: (result: Result<T, E>) => R }
): R | Result<T, E>;

/** `resultOrFn` may be a plain value or a zero-arg function, called lazily only for the matching branch. */
export function cond<R>(pairs: Array<[test: unknown, resultOrFn: R | (() => R)]>): R | undefined;

export function unless<R>(test: unknown, branch: R | (() => R)): R | undefined;

/** `IO.inspect`-style: logs the value (with an optional label) and passes it through unchanged. */
export function inspect<T>(label?: string): (value: T) => T;

// ---- sigils.js ----------------------------------------------------------

/** Parses a template literal into an `HTMLElement` (single root) or `DocumentFragment`. */
export function H(strings: TemplateStringsArray, ...values: unknown[]): HTMLElement | DocumentFragment;

/** Parses a JSON template literal; never throws. */
export function J<T = unknown>(strings: TemplateStringsArray, ...values: unknown[]): Result<T, string>;

// ---- dom.js ----------------------------------------------------------

export interface DomWrapper<T extends Element = Element> {
  readonly ok: true;
  readonly data: T;
  readonly error: null;
  el: T;
  attr(name: string, val: string): DomWrapper<T>;
  attr(name: string): string | null;
  addClass(...cls: string[]): DomWrapper<T>;
  removeClass(...cls: string[]): DomWrapper<T>;
  on(evt: string, cb: (e: Event) => void): DomWrapper<T>;
}

/** Selects an element and returns a fluent wrapper (`ok`/`error` + chainable methods). */
export function find<T extends Element = Element>(
  selector: string | T,
  parent?: ParentNode
): DomWrapper<T> | ErrResult<string>;

// ---- transitions.js ----------------------------------------------------------

export interface TransitionOpts {
  transition: string;
  from: string;
  to: string;
  duration?: number;
}

export function transition(target: string | Element, opts: TransitionOpts): void;
export function show(target: string | Element, opts?: Partial<TransitionOpts>): void;
export function hide(target: string | Element, opts?: Partial<TransitionOpts>): void;

// ---- hook.js ----------------------------------------------------------

export interface HookContext {
  el: HTMLElement;
  push(event: string, payload?: object): void;
  pushTo(target: string | HTMLElement, event: string, payload?: object): void;
  handle(event: string, callback: (payload: any) => void): void;
  upload(name: string, files: File[] | FileList): void;
}

/**
 * The raw LiveView `ViewHook` instance `this` is bound to inside `mounted`/`updated`/
 * `destroyed` — not just `el`, but `pushEvent`/`upload`/etc, and any custom fields a
 * hook assigns on itself (e.g. `this._onClick = ...` in every hooks/*.js file).
 */
export interface ViewHookInstance {
  el: HTMLElement;
  pushEvent(event: string, payload?: object, onReply?: (reply: any, ref: number) => void): void;
  pushEventTo(
    target: string | HTMLElement,
    event: string,
    payload?: object,
    onReply?: (reply: any, ref: number) => void
  ): void;
  handleEvent(event: string, callback: (payload: any) => void): void;
  upload(name: string, files: File[] | FileList): void;
  [key: string]: any;
}

export interface HookSpec {
  mounted?(this: ViewHookInstance, ctx: HookContext): void;
  updated?(this: ViewHookInstance, ctx: HookContext): void;
  destroyed?(this: ViewHookInstance, ctx: HookContext): void;
}

/** Structurally compatible with `phoenix_live_view`'s `ViewHook` — pass straight into `LiveSocket`'s `hooks` option. */
export interface LiveViewHook {
  mounted?(): void;
  updated?(): void;
  destroyed?(): void;
}

/** LiveView hook wrapper: injects a `ctx` (`push`, `pushTo`, `handle`, `upload`) into `mounted/updated/destroyed`. */
export function createHook(spec: HookSpec): LiveViewHook;

// ---- live_component.js ----------------------------------------------------------

export interface LiveComponentSpec<S = any> {
  mount?(initialState: S): S;
  handleEvent?: Record<string, (state: S, payload: any) => S>;
  render?(state: S, send: (event: string, payload?: object) => void): Node;
}

/** Returns a `HTMLElement` subclass; register it with `customElements.define(tag, createLiveComponent(spec))`. */
export function createLiveComponent<S = any>(spec: LiveComponentSpec<S>): CustomElementConstructor;

// ---- enum.js ----------------------------------------------------------

export const Enum: {
  map<T, R>(fn: (item: T, index: number, list: T[]) => R): (list: T[]) => R[];
  filter<T>(predicate: (item: T, index: number, list: T[]) => unknown): (list: T[]) => T[];
  reject<T>(predicate: (item: T, index: number, list: T[]) => unknown): (list: T[]) => T[];
  reduce<T, R>(initial: R, fn: (acc: R, item: T, index: number, list: T[]) => R): (list: T[]) => R;
  take<T>(count: number): (list: T[]) => T[];
  chunkEvery<T>(size: number): (list: T[]) => T[][];
  uniq<T>(): (list: T[]) => T[];
  sort<T>(sorter?: (a: T, b: T) => number): (list: T[]) => T[];
  each<T>(fn: (item: T, index: number, list: T[]) => void): (list: T[]) => T[];
  any<T>(predicate?: (item: T, index: number, list: T[]) => unknown): (list: T[]) => boolean;
  all<T>(predicate?: (item: T, index: number, list: T[]) => unknown): (list: T[]) => boolean;
  count<T>(predicate?: (item: T, index: number, list: T[]) => unknown): (list: T[]) => number;
  find<T>(predicate: (item: T, index: number, list: T[]) => unknown, defaultVal?: T | null): (list: T[]) => T | null;
  groupBy<T, K extends PropertyKey>(keyFn: (item: T) => K): (list: T[]) => Record<K, T[]>;
  sum(): (list: number[]) => number;
};

// ---- access.js ----------------------------------------------------------

export function getIn<T = unknown>(obj: unknown, path: PropertyKey[], defaultVal?: T | null): T | null;
export function putIn<T = unknown>(obj: T, path: PropertyKey[], val: unknown): T;
export function updateIn<T = unknown>(obj: T, path: PropertyKey[], updateFn: (val: unknown) => unknown): T;

// ---- pubsub.js ----------------------------------------------------------

export const PubSub: {
  subscribe<T = unknown>(topic: string, callback: (payload: T) => void): () => void;
  broadcast<T = unknown>(topic: string, payload: T): void;
};

// ---- with.js ----------------------------------------------------------

/** Chains steps returning `ok(data)`/`error(err)`, short-circuits on the first error, `with`-style. */
export function withDo(...steps: Array<(ctx: Record<string, unknown>) => Result<any, any>>): Result<any, any>;
