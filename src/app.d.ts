declare global {
    // https://kit.svelte.dev/docs/types#app
    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        // interface Platform {}
    }

    declare namespace svelteHTML {
        interface HTMLAttributes<T> {
            "on:debounced"?: (event: CustomEvent<any>) => void;
        }
    }
}

export {};
