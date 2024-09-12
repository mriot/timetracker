<script lang="ts">
    import { type Readable } from "svelte/store";
    import { slide } from "svelte/transition";
    import BookingsTable from "./components/BookingsTable.svelte";
    import Nav from "./components/Nav.svelte";
    import TaskManager from "./components/TaskManager.svelte";
    import TaskWorkTimeTable from "./components/TaskWorkTimeTable.svelte";
    import { BookingTable } from "./lib/booking-table";
    import { bookingsStore, tasksStore } from "./stores/store";

    let taskWorkTimeStore: Readable<Map<string, string>>;
    let totalWorkTimeStore: Readable<string>;
    let debugMode: boolean = false;
    let modalOpen: boolean = false;
    let showTaskManager: boolean = false;

    const bookingTable = new BookingTable(bookingsStore, tasksStore);

    $: totalWorkTimeStore = bookingTable.totalWorkTimeString;

    $: taskWorkTimeStore = bookingTable.taskWorkTimeMap;
</script>

<header>
    <Nav bind:showTaskManager bind:debugMode {bookingTable} />
</header>

<hr />

{#if showTaskManager}
    <div transition:slide>
        <TaskManager {bookingTable}></TaskManager>
        <hr />
    </div>
{/if}

<main>
    <TaskWorkTimeTable {taskWorkTimeStore} />
    <BookingsTable {bookingTable} {totalWorkTimeStore} {debugMode} />
</main>
