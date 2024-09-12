<script lang="ts">
    import { onMount } from "svelte";
    import { fade, slide } from "svelte/transition";
    import { TableRow } from "./table-row";
    import { tableRowStore } from "./store";
    import { tasks } from "./tasks";

    let hasMounted: boolean = false;
    let totalWorkMinutes: number = 0;

    onMount(() => {
        tableRowStore.set($tableRowStore.map((row) => new TableRow(row.from, row.to, row.task)));
        hasMounted = true;
    });

    $: if (hasMounted) {
        console.table($tableRowStore);
    }
</script>

<header>
    <nav>
        <ul>
            <li>
                <strong>TimeTracker</strong>
                <!-- <hgroup>
                    <small>Total Work Time</small>
                </hgroup> -->
            </li>
        </ul>
        <ul>
            <li>
                <input type="button" value="Add Task" />
            </li>
        </ul>
    </nav>
</header>

<hr />

<main>
    <table>
        <thead>
            <tr>
                {#each tasks as task}
                    <th>{task}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1h</td>
                <td>2h</td>
                <td>3h</td>
                <td>4h</td>
            </tr>
        </tbody>
    </table>
    <table>
        <thead>
            <tr>
                <td colspan="2" class="total-work-time">
                    ┌─── <span> 07h 15m (7.25h) </span> ───┐
                </td>
            </tr>
            <tr>
                <th>From</th>
                <th>To</th>
                <th>Duration</th>
                <th>Task</th>
                <th>Options</th>
                <th>ID</th>
            </tr>
        </thead>
        <tbody>
            {#each $tableRowStore as row (row.id)}
                <tr transition:fade>
                    <td>
                        <input type="time" bind:value={row.from} />
                    </td>
                    <td>
                        <input type="time" bind:value={row.to} />
                    </td>
                    <td>{row}</td>
                    <td>
                        <select bind:value={row.task}>
                            {#each tasks as task}
                                <option value={task} selected={task === row.task}>{task}</option>
                            {/each}
                        </select>
                    </td>
                    <td>
                        <button
                            on:click={() => {
                                confirm("Remove this row?") && row.remove(); // TODO find a better way
                            }}
                        >
                            <span>✕</span>
                        </button>
                    </td>
                    <td>{row.id}</td>
                </tr>
            {/each}
            <tr>
                <td colspan="2" class="total-work-time">
                    └── <span> 07h 15m (7.25h) </span> ──┘
                </td>
            </tr>
        </tbody>
    </table>
    <button
        on:click={() => {
            tableRowStore.update((rows) => {
                rows.push(new TableRow("", "", ""));
                return rows;
            });
        }}
    >
        Add Row
    </button>
</main>

<style lang="scss">
    header strong {
        font-size: 1.5rem;
    }

    table {
        input[type="time"],
        select {
            margin: 0;
            height: auto;
            padding: 0.5em;

            &:not(select) {
                text-align: center;
            }
        }

        .total-work-time {
            text-align: center;
        }
    }
</style>
