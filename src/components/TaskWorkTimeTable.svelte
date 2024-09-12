<script lang="ts">
    import { quintOut } from "svelte/easing";
    import { crossfade } from "svelte/transition";

    export let taskWorkTimeStore;

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
                    <td>{value}</td>
                {/each}
            </tr>
        </tbody>
    </table>
</div>

<hr />

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
</style>
