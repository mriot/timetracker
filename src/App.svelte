<script lang="ts">
    import { onMount } from "svelte";
    import { fade, scale, slide } from "svelte/transition";
    import { Task } from "./task";

    let tasks: Task[] = [];
    let taskNameInput: string = "";
    let hasMounted: boolean = false;
    let totalWorkTime: number;

    onMount(() => {
        hasMounted = true;
        tasks = JSON.parse(localStorage.getItem("tasks") ?? "[]").map(
            (task: any) => new Task(task.id, task.name, task.times)
        );
    });

    $: if (hasMounted) {
        console.table("Tasks updated", tasks as any);
        localStorage.setItem("tasks", JSON.stringify(tasks.map((task) => task.toJSON())));
        totalWorkTime = tasks.reduce((total, task) => total + task.sumTotalTime(), 0);
    }

    function addTask(evt: SubmitEvent) {
        const formData = new FormData(evt.target as HTMLFormElement);
        const name = (formData.get("text") as string) || "⏱️";

        tasks = [new Task(Math.max(0, ...tasks.map((task) => task.id)) + 1, name, []), ...tasks];

        taskNameInput = "";
    }

    function removeTask(id: number) {
        if (confirm("Remove this task?")) {
            tasks = tasks.filter((task) => task.id !== id);
        }
    }

    function addTime(evt: SubmitEvent) {
        const formElement = evt.target as HTMLFormElement;
        const formData = new FormData(formElement);
        const task = tasks.find((task) => task.id === parseInt(formData.get("id") as string));

        if (task) {
            task.addTime(formData.get("start") as string, formData.get("end") as string);
            tasks = tasks; // trigger reactivity
            formElement.reset();
        }
    }

    function convertMinutesToTimeString(workMinutes: number) {
        return `${Math.floor(workMinutes / 60)}h ${workMinutes % 60}m (${(workMinutes / 60).toFixed(2)}h)`;
    }
</script>

<header>
    <hgroup>
        <h1>TimeTracker</h1>
        <span>{convertMinutesToTimeString(totalWorkTime)}</span>
    </hgroup>
</header>

<section>
    <nav>
        <form role="group" on:submit|preventDefault={addTask}>
            <input
                type="text"
                name="text"
                placeholder="Task Name"
                aria-label="Text"
                tabindex="0"
                bind:value={taskNameInput}
            />
            <input type="submit" value="Add" />
            <input
                type="reset"
                value="Clear"
                class="delete-all-tasks-btn"
                on:click={() => {
                    if (confirm("Remove all tasks?")) tasks = [];
                }}
            />
        </form>
    </nav>
</section>

<section class="grid">
    {#each tasks as task (task.id)}
        <article class="task" in:scale out:fade>
            <h2>{task.name}</h2>

            <hr />

            <h3 class="task-work-time">{convertMinutesToTimeString(task.sumTotalTime())}</h3>

            <div class="delete-task-btn" on:click={() => removeTask(task.id)}>✕</div>

            <ul>
                {#each task.times as time}
                    <li in:slide out:fade>
                        <div class="time-row">
                            <span>
                                {time.start} - {time.end}
                            </span>
                            <span
                                class="delete-time-btn"
                                on:click={() => {
                                    if (confirm("Remove this time?")) {
                                        task.removeTime(time.id);
                                    }
                                }}
                            >
                                ✕
                            </span>
                        </div>
                    </li>
                {/each}
            </ul>
            <form on:submit|preventDefault={addTime}>
                <!-- workaround: https://github.com/picocss/pico/issues/425 -->
                <input type="hidden" name="id" value={task.id} />
                <fieldset role="group">
                    <input type="time" name="start" required />
                    <input type="time" name="end" required />
                    <input type="submit" value="Add" />
                </fieldset>
            </form>
        </article>
    {/each}
</section>

<style>
    header {
        text-align: center;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }

    .task {
        position: relative;
    }

    .task-work-time {
        text-align: right;
    }

    .time-row {
        display: flex;
        justify-content: space-between;
    }

    .delete-task-btn {
        position: absolute;
        top: 0.2rem;
        right: 0.5rem;
        cursor: pointer;
    }

    .delete-time-btn {
        cursor: pointer;
    }

    @media (max-width: 1024px) {
        .task {
            grid-column: span 3;
        }
    }
</style>
