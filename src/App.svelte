<script lang="ts">
    import { fade } from "svelte/transition";
    import { Booking } from "./booking";
    import { bookingsStore, tasksStore } from "./store";
    import Modal from "./components/Modal.svelte";

    let taskWorkTimeMap = new Map<string, number>();
    let totalWorkTime: string;
    let debugMode: boolean = false;
    let modalOpen: boolean = false;

    $: {
        console.log("Calculating");

        taskWorkTimeMap.clear();

        const totalWorkMinutes = $bookingsStore.reduce((total, booking) => {
            taskWorkTimeMap.set(booking.task, (taskWorkTimeMap.get(booking.task) || 0) + booking.getWorkMinutes());
            return total + booking.getWorkMinutes();
        }, 0);

        // sort by most worked on task
        taskWorkTimeMap = new Map([...taskWorkTimeMap.entries()].sort(([, valueA], [, valueB]) => valueB - valueA));

        totalWorkTime = `${Math.floor(totalWorkMinutes / 60)}h ${totalWorkMinutes % 60}m (${(totalWorkMinutes / 60).toFixed(2)}h)`;
    }
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
                {#each taskWorkTimeMap.keys() as key}
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
                {#each taskWorkTimeMap.entries() as [key, value]}
                    {#if key}
                        <td>{`${Math.floor(value / 60)}h ${value % 60}m (${(value / 60).toFixed(2)}h)`}</td>
                    {/if}
                {/each}
            </tr>
        </tbody>
    </table>
    <table class="bookings">
        <thead>
            <tr>
                <td colspan="2" class="total-work-time">
                    ┌─── <span> {totalWorkTime} </span> ───┐
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
                                    bookingsStore.update((rows) => rows.filter((row) => row.id !== booking.id));
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
                    └── <span> {totalWorkTime} </span> ──┘
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
        Add booking
    </button>
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
