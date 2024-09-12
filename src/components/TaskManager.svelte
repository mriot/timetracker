<script lang="ts">
    import { AppController } from "../lib/app.controller";
    import { tasksStore } from "../stores/store";

    export let appController: AppController;

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
                        appController.addTask(input);
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
                <button disabled={!selected} on:click={() => appController.moveTask(selected, "up")}> ↑ </button>
                <button disabled={!selected} on:click={() => appController.moveTask(selected, "down")}> ↓ </button>
                &nbsp;
                <button
                    disabled={!selected}
                    class="secondary"
                    on:click={() => {
                        confirm(`Delete task ${selected}?`) && appController.removeTask(selected);
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
                            appController.resetTasks();
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
