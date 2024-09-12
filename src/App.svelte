<script lang="ts">
    import { onMount } from "svelte";
    import { fade, slide } from "svelte/transition";
    import { Booking } from "./booking";
    import { bookingsStore } from "./store";
    import { tasks } from "./tasks";

    let hasMounted: boolean = false;
    let totalWorkMinutes: number = 0;

    console.log("bookingsStore", $bookingsStore);

    onMount(() => {
        hasMounted = true;
    });

    $: if (hasMounted) {
        // console.table($tableRowStore);
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
            {#each $bookingsStore as booking (booking.id)}
                <tr transition:fade>
                    <td>
                        <input type="time" bind:value={booking.from} />
                    </td>
                    <td>
                        <input type="time" bind:value={booking.to} />
                    </td>
                    <td>{booking.formatDuration()}</td>
                    <td>
                        <select bind:value={booking.task}>
                            {#each tasks as task}
                                <option value={task} selected={task === booking.task}>{task}</option>
                            {/each}
                        </select>
                    </td>
                    <td>
                        <button
                            on:click={() => {
                                if (confirm("Remove this row?")) {
                                    bookingsStore.update((rows) => rows.filter((row) => row.id !== booking.id));
                                }
                            }}
                        >
                            <span>✕</span>
                        </button>
                    </td>
                    <td>{booking.id}</td>
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
            bookingsStore.update((rows) => {
                rows.push(new Booking("", ""));
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
