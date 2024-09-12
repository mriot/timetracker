import type { Action } from "svelte/action";

type KeybindOptions = {
    alt?: boolean;
    shift?: boolean;
    ctrl?: boolean;
    key: string;
    allowDefault?: boolean;
    trigger?: "click" | "focus";
    callback?: () => void;
};

/**
 * Binds a keyboard shortcut to a Svelte action.
 *
 * Example usage: use:keybind={{ ctrl: true, key: "a", trigger: "click" }}
 * Pressing Ctrl+A will trigger a click event on the element this action is bound to.
 *
 * You can also use the `callback` option to run a custom function when the keybind is triggered.
 */
export const keybind: Action<HTMLElement, KeybindOptions> = (node: HTMLElement, options: KeybindOptions) => {
    const handleKeyDown = (event: KeyboardEvent) => {
        // if not specified, mod keys are undefined - so we default to false to make the comparison easier
        const { alt = false, shift = false, ctrl = false } = options;

        if (alt === event.altKey && shift === event.shiftKey && ctrl === event.ctrlKey) {
            if (event.key.toLowerCase() === options.key.toLowerCase()) {
                if (!options.allowDefault) event.preventDefault();
                if (options.trigger === "click") node.click();
                if (options.trigger === "focus") node.focus();
                options.callback?.();
            }
        }
    };

    window.addEventListener("keydown", handleKeyDown);

    return {
        update(bar) {},

        destroy() {
            window.removeEventListener("keydown", handleKeyDown);
        },
    };
};
