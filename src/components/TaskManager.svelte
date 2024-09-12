<script lang="ts">
    import { AppController } from "../lib/app.controller";
    import { tasksStore } from "../stores/store";

    export let taskBookingController: AppController;

    let input = "";
    let selected = "";
</script>

<div class="grid">
    <div>
        <select size="5" bind:value={selected}>
            {#each $tasksStore as task}
                <option>{task}</option>
            {/each}
        </select>
    </div>

    <div>
        <form>
            <fieldset role="group">
                <input type="text" bind:value={input} placeholder="New task name..." />
                <button
                    disabled={input.length < 1}
                    on:click={() => {
                        taskBookingController.addTask(input);
                        input = "";
                        selected = "";
                    }}
                >
                    Add</button
                >
            </fieldset>
        </form>

        <div class="controls">
            <fieldset>
                <button disabled={!selected} on:click={() => taskBookingController.moveTask(selected, "up")}>
                    ↑
                </button>
                <button disabled={!selected} on:click={() => taskBookingController.moveTask(selected, "down")}>
                    ↓
                </button>
                &nbsp;
                <button
                    disabled={!selected}
                    class="secondary"
                    on:click={() => {
                        confirm(`Delete task ${selected}?`) && taskBookingController.removeTask(selected);
                        selected = "";
                    }}
                >
                    Remove
                </button>
            </fieldset>
            <div>
                <button
                    class="secondary"
                    on:click={() => {
                        if (confirm("Reset tasks to default?\nThis will delete all custom tasks!")) {
                            taskBookingController.resetTasks();
                            selected = "";
                        }
                    }}
                >
                    Reset
                </button>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    .controls {
        display: flex;
        justify-content: space-between;
    }
</style>
