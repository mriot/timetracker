import type { Action } from "svelte/action";

type DebounceOptions = {
    delay?: number;
    eventTypeToDebounce: string;
};

/**
 * Svelte action that debounces an event.
 *
 * Example usage: use:debounce={{ delay: 300, eventTypeToDebounce: "keydown" }} on:debounced={yourEventHandler}
 *
 * This will debounce the specified event on the element this action is bound to.
 * If the delay is exceeded, a custom "debounced" event will be dispatched.
 */
export const debounce: Action<HTMLElement, DebounceOptions> = (node: HTMLElement, options: DebounceOptions) => {
    let timeoutId: number;

    const handleDebounce = (event: Event) => {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            node.dispatchEvent(new CustomEvent("debounced", { detail: event }));
        }, options.delay ?? 300);
    };

    node.addEventListener(options.eventTypeToDebounce, handleDebounce);

    return {
        destroy() {
            node.removeEventListener(options.eventTypeToDebounce, handleDebounce);
        },
    };
};
