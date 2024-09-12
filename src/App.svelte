<script lang="ts">
    import { flip } from "svelte/animate";
    import { quintOut } from "svelte/easing";
    import { type Readable } from "svelte/store";
    import { crossfade, slide } from "svelte/transition";
    import { Booking } from "./booking";
    import { BookingTable } from "./booking-table";
    import { bookingsStore, tasksStore } from "./store";
    import TaskManager from "./TaskManager.svelte";

    let taskWorkTimeStore: Readable<Map<string, string>>;
    let totalWorkTimeStore: Readable<string>;
    let debugMode: boolean = false;
    let modalOpen: boolean = false;
    let showTaskManager: boolean = false;

    const bookingTable = new BookingTable(bookingsStore, tasksStore);

    $: totalWorkTimeStore = bookingTable.totalWorkTimeString;

    $: taskWorkTimeStore = bookingTable.taskWorkTimeMap;

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

<header>
    <nav>
        <ul>
            <li>
                <strong>TimeTracker</strong>
            </li>
        </ul>
        <ul>
            <li>
                <details class="dropdown">
                    <summary>☰ Options</summary>
                    <ul>
                        <li>
                            <label>
                                <input type="checkbox" bind:checked={showTaskManager} />
                                Manage Tasks
                            </label>
                        </li>
                        <li>
                            <a
                                href="#"
                                on:click={() => confirm("Clear bookings?") && localStorage.removeItem("bookings")}
                            >
                                Clear bookings
                            </a>
                        </li>
                        <li>
                            <a href="#" on:click={() => confirm("Clear tasks?") && localStorage.removeItem("tasks")}>
                                Clear tasks
                            </a>
                        </li>
                        <li>
                            <label>
                                <input type="checkbox" bind:checked={debugMode} />
                                Debug
                            </label>
                        </li>
                    </ul>
                </details>
            </li>
        </ul>
    </nav>
</header>

<hr />

{#if showTaskManager}
    <div transition:slide>
        <TaskManager {bookingTable}></TaskManager>
        <hr />
    </div>
{/if}

<main>
    <table class="work-times">
        <thead>
            <tr>
                {#each $taskWorkTimeStore.keys() as key}
                    {#if key}
                        <th>
                            <span>
                                {key}
                            </span>
                        </th>
                    {/if}
                {/each}
            </tr>
        </thead>
        <tbody>
            <tr>
                {#each $taskWorkTimeStore.entries() as [key, value]}
                    {#if key}
                        <td>{value}</td>
                    {/if}
                {/each}
            </tr>
        </tbody>
    </table>
    <!-- ----------------------------------------- -->
    <table class="bookings">
        <thead>
            <tr>
                <td colspan="2" class="total-work-time">
                    ┌─── <span> {$totalWorkTimeStore} </span> ───┐
                </td>
            </tr>
            <tr>
                <th>From</th>
                <th>To</th>
                <th>Duration</th>
                <th>Task</th>
                <th></th>
                {#if debugMode}
                    <th>ID</th>
                {/if}
            </tr>
        </thead>
        <tbody>
            {#each $bookingsStore as booking (booking.id)}
                <tr in:receive={{ key: booking.id }} out:send={{ key: booking.id }} animate:flip>
                    <td>
                        <input type="time" bind:value={booking.from} />
                    </td>
                    <td>
                        <input type="time" bind:value={booking.to} on:blur={() => bookingTable.sortBookingsByTime()} />
                    </td>
                    <td>{booking.formatDuration()}</td>
                    <td>
                        <select bind:value={booking.task}>
                            {#each $tasksStore as task}
                                <option value={task} selected={task === booking.task}>{task}</option>
                            {/each}
                        </select>
                    </td>
                    <td class="center">
                        <div
                            style="cursor: pointer;"
                            on:click={() => {
                                if (confirm("Remove this row?")) {
                                    bookingTable.removeBooking(booking.id);
                                }
                            }}
                        >
                            <span>✕</span>
                        </div>
                    </td>
                    {#if debugMode}
                        <td>{booking.id}</td>
                    {/if}
                </tr>
            {/each}
            <tr>
                <td colspan="2" class="total-work-time">
                    └── <span> {$totalWorkTimeStore} </span> ──┘
                </td>
            </tr>
        </tbody>
    </table>
    <button on:click={() => bookingTable.addBooking(new Booking("", ""))}> Add booking </button>
</main>

<style lang="scss">
    header strong {
        font-size: 1.5rem;
    }

    table.work-times {
        margin-bottom: 2rem;

        th,
        td {
            text-align: center;
        }
    }

    table.bookings {
        th,
        td {
            text-align: center;
        }

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
            border: none;
        }

        .center {
            text-align: center;
        }
    }
</style>
