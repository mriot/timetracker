<script lang="ts">
    import { BookingTable } from "../lib/booking-table";
    import { tasksStore } from "../stores/store";

    export let bookingTable: BookingTable;

    let input = "";
    let selected = "";
</script>

<div class="grid">
    <select size="5" bind:value={selected}>
        {#each $tasksStore as task}
            <option>{task}</option>
        {/each}
    </select>

    <form>
        <input type="text" bind:value={input} placeholder="Enter a new task name" />
        <button
            disabled={input.length < 1}
            on:click={() => {
                bookingTable.addTask(input);
                input = "";
                selected = "";
            }}
        >
            Add</button
        >
        <button
            disabled={!selected}
            on:click={() => {
                confirm(`Delete task ${selected}?`) && bookingTable.removeTask(selected);
                selected = "";
            }}
        >
            Remove
        </button>
    </form>
</div>
