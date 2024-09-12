<script lang="ts">
    import { debounce } from "../lib/actions/debounce";
    import { AppController } from "../lib/app.controller";
    import type { ApiKey } from "../lib/types";
    import { apiKeyStore, tasksStore } from "../stores/store";
    import ApiKeyManager from "./ApiKeyManager.svelte";

    export let appController: AppController;

    let selectedTask = "";
    let workPackages: any[] = [];
    let searchQuery = "";

    function handleSearch(event: any) {
        if (event.target.value.length < 3) return;

        workPackages = []; // TODO type
        console.log("Cleared");

        $apiKeyStore.forEach(async (ApiKey: ApiKey) => {
            const params = new URLSearchParams();
            params.append("apikey", ApiKey.key);
            params.append("url", ApiKey.url);
            params.append("filters", `[{"subjectOrId":{"operator":"**","values":["${searchQuery}"]}}]`);

            // TODO dont't hardcode the url
            const res = await fetch(`https://riotcoding.com/timetracker/proxy.php?${params}`);
            const json = await res.json();

            workPackages = [
                ...workPackages,
                json._embedded.elements.map((element: any) => `${element.id} ${element.subject}`),
            ];
            console.log(workPackages);
        });
    }
</script>

<div class="grid">
    <div>
        <select size="5" bind:value={selectedTask}>
            {#each $tasksStore as task}
                <option>{task}</option>
            {/each}
        </select>
        <ApiKeyManager />
    </div>

    <div>
        <form>
            <fieldset role="group">
                {#if $apiKeyStore.length === 0}
                    <input type="text" placeholder="Create a new task" bind:value={searchQuery} />
                {:else}
                    <input
                        type="text"
                        placeholder="Search or create a new task"
                        list="search-results"
                        bind:value={searchQuery}
                        use:debounce={{ eventTypeToDebounce: "input" }}
                        on:debounced={handleSearch}
                    />
                    <datalist id="search-results">
                        {#each workPackages as pack}
                            <option>{pack}</option>
                        {/each}
                    </datalist>
                {/if}
                <input
                    type="submit"
                    value="Add"
                    disabled={searchQuery.length < 1}
                    on:click|preventDefault={() => {
                        appController.addTask(searchQuery);
                        searchQuery = "";
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
