<script lang="ts">
    import { type Readable } from "svelte/store";
    import { slide } from "svelte/transition";
    import BookingsTable from "./components/BookingsTable.svelte";
    import Nav from "./components/Nav.svelte";
    import TaskManager from "./components/TaskManager.svelte";
    import TaskWorkTimeTable from "./components/TaskWorkTimeTable.svelte";
    import { AppController } from "./lib/app.controller";
    import { bookingsStore, tasksStore } from "./stores/store";

    let taskWorkTimeStore: Readable<Map<string, string>>;
    let totalWorkTimeStore: Readable<string>;
    let debugMode: boolean = false;
    let showTaskManager: boolean = false;

    const isPopout = window.location.search.includes("popout");

    const appController = new AppController(bookingsStore, tasksStore);

    $: totalWorkTimeStore = appController.totalWorkTimeString;

    $: taskWorkTimeStore = appController.taskWorkTimeMap;
</script>

{#if !isPopout}
    <header>
        <Nav bind:showTaskManager bind:debugMode {appController} />
    </header>
    <hr />
{/if}

{#if showTaskManager && !isPopout}
    <div transition:slide>
        <TaskManager {appController}></TaskManager>
        <hr />
    </div>
{/if}

<main>
    <TaskWorkTimeTable {taskWorkTimeStore} stackVertically={isPopout} />

    {#if !isPopout}
        <BookingsTable {appController} {totalWorkTimeStore} {debugMode} />
    {/if}
</main>
