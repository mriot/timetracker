<script lang="ts">
    import { fade } from "svelte/transition";

    export let open: boolean = true;
    export let title: string = "";
    export let okFunction: () => void = () => {};
    export let cancelFunction: () => void = () => {};
</script>

{#if open}
    <dialog open in:fade>
        <article>
            <header>
                <button aria-label="Close" rel="prev" on:click={cancelFunction}></button>
                <p>
                    <strong>{title}</strong>
                </p>
            </header>
            <p>
                <slot></slot>
            </p>
            <footer>
                <button on:click={okFunction}>OK</button>
                <button on:click={cancelFunction}>Cancel</button>
            </footer>
        </article>
    </dialog>
{/if}
