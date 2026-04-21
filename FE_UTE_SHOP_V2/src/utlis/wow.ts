function isIn(needle: string, haystack: string[]): boolean {
  return haystack.indexOf(needle) >= 0;
}

function extend<T extends Record<string, any>>(custom: Partial<T>, defaults: T): T {
  for (const key in defaults) {
    if (custom[key] == null) {
      const value = defaults[key];
      custom[key] = value;
    }
  }
  return custom as T;
}

function isMobile(agent: string): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    agent
  );
}

function createEvent(event: string, bubble: boolean = false, cancel: boolean = false, detail: any = null): any {
  let customEvent: any;
  if (document.createEvent != null) {
    // W3C DOM
    customEvent = document.createEvent("CustomEvent");
    customEvent.initCustomEvent(event, bubble, cancel, detail);
  } else if ((document as any).createEventObject != null) {
    // IE DOM < 9
    customEvent = (document as any).createEventObject();
    customEvent.eventType = event;
  } else {
    customEvent = { eventName: event };
  }

  return customEvent;
}

function emitEvent(elem: any, event: string): void {
  if (elem.dispatchEvent != null) {
    // W3C DOM
    elem.dispatchEvent(event);
  } else if (elem != null && typeof elem === "object" && event in elem) {
    (elem as any)[event]();
  } else if (elem != null && typeof elem === "object" && `on${event}` in elem) {
    (elem as any)[`on${event}`]();
  }
}

function addEvent(elem: any, event: string, fn: EventListener): void {
  if (elem.addEventListener != null) {
    // W3C DOM
    elem.addEventListener(event, fn, false);
  } else if (elem.attachEvent != null) {
    // IE DOM
    elem.attachEvent(`on${event}`, fn);
  } else {
    // fallback
    elem[event] = fn;
  }
}

function removeEvent(elem: any, event: string, fn: EventListener): void {
  if (elem.removeEventListener != null) {
    // W3C DOM
    elem.removeEventListener(event, fn, false);
  } else if (elem.detachEvent != null) {
    // IE DOM
    elem.detachEvent(`on${event}`, fn);
  } else {
    // fallback
    delete elem[event];
  }
}

function getInnerHeight(): number {
  if ("innerHeight" in window) {
    return window.innerHeight;
  }

  return document.documentElement.clientHeight;
}

// Minimalistic WeakMap shim, just in case.
const WeakMapPolyfill = class WeakMapPolyfill {
  keys: any[] = [];
  values: any[] = [];

  get(key: any): any {
    for (let i = 0; i < this.keys.length; i++) {
      const item = this.keys[i];
      if (item === key) {
        return this.values[i];
      }
    }
    return undefined;
  }

  set(key: any, value: any): WeakMapPolyfill {
    for (let i = 0; i < this.keys.length; i++) {
      const item = this.keys[i];
      if (item === key) {
        this.values[i] = value;
        return this;
      }
    }
    this.keys.push(key);
    this.values.push(value);
    return this;
  }
};

const WeakMapShim: typeof WeakMap = (window.WeakMap || WeakMapPolyfill) as typeof WeakMap;

// Dummy MutationObserver, to avoid raising exceptions.
const MutationObserverShim = class MutationObserver {
    constructor(_callback?: MutationCallback) {
      if (typeof console !== "undefined" && console !== null) {
        console.warn("MutationObserver is not supported by your browser.");
        console.warn(
          "WOW.js cannot detect dom mutations, please call .sync() after loading new content."
        );
      }
    }

    static notSupported = true;

    observe(_target?: Node, _options?: MutationObserverInit) {}
  };

const MutationObserver: typeof window.MutationObserver = (window.MutationObserver || MutationObserverShim) as typeof window.MutationObserver;

// getComputedStyle shim, from http://stackoverflow.com/a/21797294
const getComputedStyleShim = function getComputedStyle(el: HTMLElement): CSSStyleDeclaration {
  const getComputedStyleRX = /(\-([a-z]){1})/g;
  return {
    getPropertyValue(prop: string): string {
      if (prop === "float") {
        prop = "styleFloat";
      }
      if (getComputedStyleRX.test(prop)) {
        prop.replace(getComputedStyleRX, (_: string, _char: string) => _char.toUpperCase());
      }
      const currentStyle = (el as any).currentStyle;
      return (currentStyle != null ? currentStyle[prop] : void 0) || null;
    },
  } as CSSStyleDeclaration;
};

const getComputedStyle = window.getComputedStyle || getComputedStyleShim;

import type { WOWOptions } from "@/types";

export default class WOW {
  defaults: Required<WOWOptions> = {
    boxClass: "wow",
    animateClass: "animated",
    offset: 0,
    mobile: true,
    live: true,
    callback: null,
    scrollContainer: null,
  };

  config: Required<WOWOptions> & { scrollContainer?: HTMLElement | null };
  scrolled: boolean;
  element: HTMLElement;
  boxes: HTMLElement[];
  all: HTMLElement[];
  stopped: boolean;
  finished: HTMLElement[];
  interval?: ReturnType<typeof setInterval>;
  animationNameCache: WeakMap<HTMLElement, string>;
  wowEvent: any;

  constructor(options: WOWOptions = {}) {
    this.start = this.start.bind(this);
    this.resetAnimation = this.resetAnimation.bind(this);
    this.scrollHandler = this.scrollHandler.bind(this);
    this.scrollCallback = this.scrollCallback.bind(this);
    this.scrolled = true;
    this.config = extend(options, this.defaults) as Required<WOWOptions> & { scrollContainer?: HTMLElement | null };
    if (options.scrollContainer != null) {
      if (typeof options.scrollContainer === "string") {
        const container = document.querySelector<HTMLElement>(
          options.scrollContainer
        );
        if (container) {
          this.config.scrollContainer = container;
        }
      } else {
        this.config.scrollContainer = options.scrollContainer;
      }
    }
    // Map of elements to animation names:
    this.animationNameCache = new WeakMapShim<HTMLElement, string>() as WeakMap<HTMLElement, string>;
    this.wowEvent = createEvent(this.config.boxClass);
    // Initialize required properties
    this.element = document.documentElement;
    this.boxes = [];
    this.all = [];
    this.stopped = false;
    this.finished = [];
  }

  init(): void {
    this.element = window.document.documentElement;
    if (isIn(document.readyState, ["interactive", "complete"])) {
      this.start();
    } else {
      addEvent(document, "DOMContentLoaded", this.start);
    }
    this.finished = [];
  }

  start(): void {
    this.stopped = false;
    this.boxes = Array.from(
      this.element.querySelectorAll<HTMLElement>(`.${this.config.boxClass}`)
    );
    this.all = this.boxes.slice(0);
    if (this.boxes.length) {
      if (this.disabled()) {
        this.resetStyle();
      } else {
        for (let i = 0; i < this.boxes.length; i++) {
          const box = this.boxes[i];
          this.applyStyle(box, true);
        }
      }
    }
    if (!this.disabled()) {
      addEvent(
        this.config.scrollContainer || window,
        "scroll",
        this.scrollHandler
      );
      addEvent(window, "resize", this.scrollHandler);
      this.interval = setInterval(this.scrollCallback, 50);
    }
    if (this.config.live) {
      const mut = new MutationObserverShim((records: MutationRecord[]) => {
        for (let j = 0; j < records.length; j++) {
          const record = records[j];
          for (let k = 0; k < record.addedNodes.length; k++) {
            const node = record.addedNodes[k];
            if (node.nodeType === 1) {
              this.doSync(node as HTMLElement);
            }
          }
        }
        return undefined;
      });
      mut.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  // unbind the scroll event
  stop(): void {
    this.stopped = true;
    removeEvent(
      (this.config.scrollContainer as any) || window,
      "scroll",
      this.scrollHandler
    );
    removeEvent(window, "resize", this.scrollHandler);
    if (this.interval != null) {
      clearInterval(this.interval);
    }
  }

  sync(): void {
    if ((MutationObserver as any).notSupported) {
      this.doSync(this.element);
    }
  }

  doSync(element?: HTMLElement | null): void {
    let targetElement = element;
    if (typeof targetElement === "undefined" || targetElement === null) {
      targetElement = this.element;
    }
    if (targetElement.nodeType !== 1) {
      return;
    }
    targetElement = targetElement.parentNode as HTMLElement || targetElement;
    const iterable = targetElement.querySelectorAll<HTMLElement>(`.${this.config.boxClass}`);
    for (let i = 0; i < iterable.length; i++) {
      const box = iterable[i];
      if (!this.all.includes(box)) {
        this.boxes.push(box);
        this.all.push(box);
        if (this.stopped || this.disabled()) {
          this.resetStyle();
        } else {
          this.applyStyle(box, true);
        }
        this.scrolled = true;
      }
    }
  }

  // show box element
  show(box: HTMLElement): HTMLElement {
    this.applyStyle(box);
    box.className = `${box.className} ${this.config.animateClass}`;
    if (this.config.callback != null) {
      this.config.callback(box);
    }
    emitEvent(box, this.wowEvent);

    addEvent(box, "animationend", this.resetAnimation);
    addEvent(box, "oanimationend", this.resetAnimation);
    addEvent(box, "webkitAnimationEnd", this.resetAnimation);
    addEvent(box, "MSAnimationEnd", this.resetAnimation);

    return box;
  }

  applyStyle(box: HTMLElement, hidden?: boolean): HTMLElement {
    const duration = box.getAttribute("data-wow-duration");
    const delay = box.getAttribute("data-wow-delay");
    const iteration = box.getAttribute("data-wow-iteration");

    this.animate(() =>
      this.customStyle(box, hidden, duration, delay, iteration)
    );
    return box;
  }

  animate = (function animateFactory() {
    if ("requestAnimationFrame" in window) {
      return (callback: FrameRequestCallback) => window.requestAnimationFrame(callback);
    }
    return (callback: FrameRequestCallback) => callback(0);
  })();

  resetStyle(): void {
    for (let i = 0; i < this.boxes.length; i++) {
      const box = this.boxes[i];
      box.style.visibility = "visible";
    }
  }

  resetAnimation = (event: Event): void => {
    if (event.type.toLowerCase().indexOf("animationend") >= 0) {
      const target = (event.target || (event as any).srcElement) as HTMLElement;
      target.className = target.className
        .replace(this.config.animateClass, "")
        .trim();
    }
  };

  customStyle(box: HTMLElement, hidden?: boolean | null, duration?: string | null, delay?: string | null, iteration?: string | null): HTMLElement {
    if (hidden) {
      this.cacheAnimationName(box);
    }
    box.style.visibility = hidden ? "hidden" : "visible";

    if (duration) {
      this.vendorSet(box.style, { animationDuration: duration });
    }
    if (delay) {
      this.vendorSet(box.style, { animationDelay: delay });
    }
    if (iteration) {
      this.vendorSet(box.style, { animationIterationCount: iteration });
    }
    this.vendorSet(box.style, {
      animationName: hidden ? "none" : (this.cachedAnimationName(box) || ""),
    });

    return box;
  }

  vendors = ["moz", "webkit"];
  vendorSet(elem: CSSStyleDeclaration, properties: Record<string, string>): void {
    for (const name in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, name)) {
        const value = properties[name];
        (elem as any)[name] = value;
        for (let i = 0; i < this.vendors.length; i++) {
          const vendor = this.vendors[i];
          const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
          (elem as any)[`${vendor}${capitalizedName}`] = value;
        }
      }
    }
  }
  vendorCSS(elem: HTMLElement, property: string): string | null {
    const style = getComputedStyle(elem);
    let result = style.getPropertyValue(property);

    for (let i = 0; i < this.vendors.length; i++) {
      const vendor = this.vendors[i];
      if (!result || result.trim() === "") {
        result = style.getPropertyValue(`-${vendor}-${property}`);
      }
    }

    return result || null;
  }

  animationName(box: HTMLElement): string {
    let aName: string | null;
    try {
      aName = this.vendorCSS(box, "animation-name");
    } catch (error) {
      aName = getComputedStyle(box).getPropertyValue("animation-name");
    }

    if (!aName || aName === "none") {
      return "";
    }

    return aName;
  }

  cacheAnimationName(box: HTMLElement): WeakMap<HTMLElement, string> {
    // https://bugzilla.mozilla.org/show_bug.cgi?id=921834
    // box.dataset is not supported for SVG elements in Firefox
    return this.animationNameCache.set(box, this.animationName(box));
  }
  cachedAnimationName(box: HTMLElement): string | undefined {
    return this.animationNameCache.get(box);
  }

  // fast window.scroll callback
  scrollHandler = (): void => {
    this.scrolled = true;
  };

  scrollCallback = (): void => {
    if (this.scrolled) {
      this.scrolled = false;
      const results: HTMLElement[] = [];
      for (let i = 0; i < this.boxes.length; i++) {
        const box = this.boxes[i];
        if (box) {
          if (this.isVisible(box)) {
            this.show(box);
            continue;
          }
          results.push(box);
        }
      }
      this.boxes = results;
      if (!this.boxes.length && !this.config.live) {
        this.stop();
      }
    }
  };

  // Calculate element offset top
  offsetTop(element: HTMLElement): number {
    // SVG elements don't have an offsetTop in Firefox.
    // This will use their nearest parent that has an offsetTop.
    // Also, using ('offsetTop' of element) causes an exception in Firefox.
    let currentElement: HTMLElement = element;
    while ((currentElement as any).offsetTop === undefined) {
      const parent = currentElement.parentNode as HTMLElement;
      if (!parent) break;
      currentElement = parent;
    }
    let top = (currentElement as any).offsetTop;
    while (currentElement.offsetParent) {
      currentElement = currentElement.offsetParent as HTMLElement;
      top += (currentElement as any).offsetTop;
    }
    return top;
  }

  // check if box is visible
  isVisible(box: HTMLElement): boolean {
    const offsetAttr = box.getAttribute("data-wow-offset");
    const offset = offsetAttr ? parseInt(offsetAttr, 10) : this.config.offset;
    const viewTop =
      (this.config.scrollContainer && this.config.scrollContainer.scrollTop) ||
      window.pageYOffset;
    const viewBottom =
      viewTop + Math.min(this.element.clientHeight, getInnerHeight()) - offset;
    const top = this.offsetTop(box);
    const bottom = top + box.clientHeight;

    return top <= viewBottom && bottom >= viewTop;
  }

  disabled(): boolean {
    return !this.config.mobile && isMobile(navigator.userAgent);
  }
}
