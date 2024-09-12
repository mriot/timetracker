<script lang="ts">
    import { AppController } from "../lib/app.controller";
    import { tasksStore } from "../stores/store";

    export let appController: AppController;

    let input = "";
    let selected = "";
    let workPackages: any[] = [];
    let search = "";

    // const OP_TOKEN = "0d6b669af3cf7aa2869b1cc5dce78ddb50eaa5f476c18bb5ab6ca506f919e0e4";
    // const myHeaders = new Headers();
    // myHeaders.append(
    //     "Authorization",
    //     "Basic YXBpa2V5OjBkNmI2NjlhZjNjZjdhYTI4NjliMWNjNWRjZTc4ZGRiNTBlYWE1ZjQ3NmMxOGJiNWFiNmNhNTA2ZjkxOWUwZTQ="
    // );

    // $: {
    //     fetch(
    //         `https://wintec.openproject.com/api/v3/work_packages?filters=[{"subjectOrId":{"operator":"**","values":["${search}"]}}]`,
    //         { headers: myHeaders }
    //     )
    //         .then((res) => res.json())
    //         .then((data) => {
    //             workPackages = data._embedded.elements.map((pack: any) => pack.subject);
    //         });
    // }

    const myHeaders = new Headers();
    myHeaders.append(
        "Authorization",
        "Basic YXBpa2V5OjBkNmI2NjlhZjNjZjdhYTI4NjliMWNjNWRjZTc4ZGRiNTBlYWE1ZjQ3NmMxOGJiNWFiNmNhNTA2ZjkxOWUwZTQ="
    );

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow" as RequestRedirect | undefined,
    };

    fetch(
        "https://wintec.openproject.com/api/v3/work_packages?filters=[{%22subjectOrId%22:{%22operator%22:%22**%22,%22values%22:[%225509%22]}}]",
        requestOptions
    )
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
</script>

<fieldset>
    <input type="search" bind:value={search} />
    <select size="5">
        {#each workPackages as pack}
            <option>{pack}</option>
        {:else}
            <option disabled>n/a</option>
        {/each}
    </select>
</fieldset>

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
