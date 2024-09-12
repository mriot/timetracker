<script lang="ts">
    export let open: boolean = true;
    export let title: string = "";
    export let content: string = "";
</script>

{#if open}
    <dialog open>
        <article>
            <header>
                <button aria-label="Close" rel="prev"></button>
                <p>
                    <strong>{title}</strong>
                </p>
            </header>
            <p>{content}</p>
            <footer>
                <button>OK</button>
                <button>Cancel</button>
            </footer>
        </article>
    </dialog>
{/if}
