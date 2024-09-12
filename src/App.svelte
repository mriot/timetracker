<script lang="ts">
    import { fade } from "svelte/transition";
    import { Booking } from "./booking";
    import { bookingsStore, tasksStore } from "./store";
    import Modal from "./components/Modal.svelte";
    import { BookingTable } from "./booking-table";
    import { derived, get, type Readable, writable } from "svelte/store";

    let taskWorkTimeStore: Readable<Map<string, string>>;
    let totalWorkTimeStore: Readable<string>;
    let debugMode: boolean = false;
    let modalOpen: boolean = false;

    const bookingTable = new BookingTable(bookingsStore, tasksStore);

    $: totalWorkTimeStore = bookingTable.totalWorkTimeString;

    $: taskWorkTimeStore = bookingTable.taskWorkTimeMap;
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
                <a
                    href="#"
                    on:click={() => {
                        const newtask = prompt();
                        newtask && tasksStore.update((tasks) => [...tasks, newtask]);
                    }}>Add task</a
                >
            </li>
            <li>
                <a href="#" on:click={() => confirm("Clear bookings?") && localStorage.removeItem("bookings")}
                    >Clear bookings</a
                >
            </li>
            <li>
                <a href="#" on:click={() => (debugMode = !debugMode)}>Debug</a>
            </li>
        </ul>
    </nav>
</header>

<hr />

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
                <th>Options</th>
                {#if debugMode}
                    <th>ID</th>
                {/if}
            </tr>
        </thead>
        <tbody>
            {#each $bookingsStore as booking (booking.id)}
                <tr transition:fade>
                    <td>
                        <input type="time" bind:value={booking.from} />
                    </td>
                    <td>
                        <input
                            type="time"
                            bind:value={booking.to}
                            on:blur={() => {
                                console.log("Sorting");
                                bookingsStore.update((rows) => rows.sort((a, b) => a.from.localeCompare(b.from)));
                            }}
                        />
                    </td>
                    <td>{booking.formatDuration()}</td>
                    <td>
                        <select bind:value={booking.task}>
                            {#each $tasksStore as task}
                                <option value={task} selected={task === booking.task}>{task}</option>
                            {/each}
                        </select>
                    </td>
                    <td>
                        <button
                            on:click={() => {
                                if (confirm("Remove this row?")) {
                                    bookingTable.removeBooking(booking.id);
                                }
                            }}
                        >
                            <span>✕</span>
                        </button>
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
    }
</style>
