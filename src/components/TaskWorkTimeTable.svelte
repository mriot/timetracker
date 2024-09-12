<script lang="ts">
    import { quintOut } from "svelte/easing";
    import type { Readable } from "svelte/store";
    import { crossfade } from "svelte/transition";

    export let stackVertically: boolean = false;
    export let taskWorkTimeStore: Readable<Map<string, string>>;

    // TODO add crossfade transition
    const [send, receive] = crossfade({
        fallback(node, params) {
            const style = getComputedStyle(node);
            const transform = style.transform === "none" ? "" : style.transform;

            return {
                duration: 600,
                easing: quintOut,
                css: (t, u) => `
                    transform: ${transform} scale(${t});
                    opacity: ${t}
                `,
            };
        },
    });
</script>

<!-- popout mode will set stackVertically -->
{#if stackVertically}
    <article>
        Last updated: {new Date().toLocaleTimeString()}
        (<a href="javascript: location.reload()">refresh</a>)
    </article>
    {#each $taskWorkTimeStore.entries() as [key, value]}
        <article class="popout-view">
            <label>
                <input type="checkbox" />
                <h3>{key}</h3>
                <p>{@html value}</p>
            </label>
        </article>
    {/each}
    <input type="button" value="Close" on:click={() => window.close()} />
{:else}
    <div class="overflow-auto">
        <table class="work-times">
            <thead>
                <tr>
                    {#each $taskWorkTimeStore.keys() as key}
                        <th>
                            <span>
                                {key}
                            </span>
                        </th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                <tr>
                    {#each $taskWorkTimeStore.entries() as [key, value]}
                        <td>{@html value}</td>
                    {/each}
                </tr>
            </tbody>
        </table>
    </div>
    <hr />
{/if}

<style lang="scss">
    hr {
        margin-top: 0;
    }

    table.work-times {
        white-space: nowrap;

        th,
        td {
            text-align: center;
            border: none;

            &:not(:last-child) {
                border-right: 1px solid var(--pico-muted-border-color);
            }
        }
    }

    // styles only apply if stackVertically is true
    .popout-view {
        position: relative;

        &:has(input[type="checkbox"]:checked) {
            text-decoration: line-through;
            background-color: rgba($color: green, $alpha: 0.25);
        }

        label {
            width: 100%;
            text-align: center;
        }

        input[type="checkbox"] {
            position: absolute;
            right: 0;
        }
    }
</style>
