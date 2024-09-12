<script lang="ts">
    import { AppController } from "../lib/app.controller";
    import { tasksStore } from "../stores/store";

    export let appController: AppController;

    let selectedTask = "";
    let taskNameInput = "";
</script>

<div class="grid">
    <div>
        <select size={Math.min(15, Math.max($tasksStore.length, 5))} bind:value={selectedTask}>
            {#each $tasksStore as task}
                <option>{task}</option>
            {/each}
        </select>
    </div>

    <div>
        <form>
            <fieldset role="group">
                <input type="text" placeholder="Create a new task" bind:value={taskNameInput} />
                <input
                    type="submit"
                    value="Add"
                    disabled={taskNameInput.length < 1}
                    on:click|preventDefault={() => {
                        appController.addTask(taskNameInput);
                        taskNameInput = "";
                        selectedTask = "";
                    }}
                />
            </fieldset>
        </form>

        <div class="controls">
            <fieldset>
                <button disabled={!selectedTask} on:click={() => appController.moveTask(selectedTask, "up")}>
                    ↑
                </button>
                <button disabled={!selectedTask} on:click={() => appController.moveTask(selectedTask, "down")}>
                    ↓
                </button>
                <button
                    disabled={!selectedTask}
                    class="secondary"
                    on:click={() => {
                        confirm(`Delete task ${selectedTask}?`) && appController.removeTask(selectedTask);
                        selectedTask = "";
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
                            selectedTask = "";
                        }
                    }}
                >
                    Reset tasks
                </button>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    .controls {
        display: flex;
        justify-content: space-between;
        white-space: nowrap;
    }
</style>
