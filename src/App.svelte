<script lang="ts">
    import { onMount } from "svelte";
    import { fade, slide } from "svelte/transition";
    import { TableRow } from "./table-row";

    let tasks = ["Daily", "Zeiterfassung", "Team-Kommunikation", "Arbeitsplatz"];

    let tableRows: TableRow[] = [
        new TableRow("10:00", "11:00", "Zeiterfassung"),
        new TableRow("", "", ""),
        new TableRow("", "", ""),
        new TableRow("", "", ""),
    ];

    let hasMounted: boolean = false;
    let totalWorkMinutes: number = 0;

    onMount(() => {
        // hasMounted = true;
        // tasks = JSON.parse(localStorage.getItem("tasks") ?? "[]").map(
        //     (task: any) => new Task(task.id, task.name, task.times)
        // );
    });
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
                <th>From</th>
                <th>To</th>
                <th>Duration</th>
                <th>Task</th>
                <th>Options</th>
                <th>ID</th>
            </tr>
        </thead>
        <tbody>
            {#each tableRows as row (row.id)}
                <tr transition:fade>
                    <td>
                        <input type="time" bind:value={row.from} />
                    </td>
                    <td>
                        <input type="time" bind:value={row.to} />
                    </td>
                    <td>{row.formatDuration()}</td>
                    <td>
                        <select>
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
            tableRows = [...tableRows, new TableRow("", "")];
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
