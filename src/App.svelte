<script lang="ts">
    import { onMount } from "svelte";
    import { fade, scale, slide } from "svelte/transition";

    type Times = { id: number; start: string; end: string };

    class Task {
        id: number;
        name: string;
        times: Times[];

        constructor(id: number, name: string, times: Times[]) {
            this.id = id;
            this.name = name;
            this.times = times;
        }

        sumTotalTime() {
            const totalWorkMinutes = this.times.reduce((minutes, time) => {
                const [startHours, startMinutes] = time.start.split(":").map(Number);
                const [endHours, endMinutes] = time.end.split(":").map(Number);

                minutes += endHours * 60 + endMinutes - (startHours * 60 + startMinutes);

                // add 24 hours if we crossed midnight
                if (minutes < 0) {
                    minutes += 24 * 60;
                }

                return minutes;
            }, 0);

            return `${Math.floor(totalWorkMinutes / 60)}h ${totalWorkMinutes % 60}m (${(totalWorkMinutes / 60).toFixed(2)}h)`;
        }

        addTime(start: string, end: string) {
            this.times = [
                ...this.times,
                {
                    id: Math.max(0, ...this.times.map((time) => time.id)) + 1,
                    start: start,
                    end: end,
                },
            ];
        }

        removeTime(id: number) {
            this.times = this.times.filter((time) => time.id !== id);
        }

        toJSON() {
            return {
                id: this.id,
                name: this.name,
                times: this.times,
            };
        }

        toString() {
            return JSON.stringify(this.toJSON());
        }
    }

    let tasks: Task[] = [];
    let taskNameInput = "";
    let hasMounted = false;

    onMount(() => {
        tasks = JSON.parse(localStorage.getItem("tasks") ?? "[]").map(
            (task: any) => new Task(task.id, task.name, task.times)
        );
        hasMounted = true;
    });

    $: if (hasMounted) {
        console.table("Tasks updated", tasks as any);
        localStorage.setItem("tasks", JSON.stringify(tasks.map((task) => task.toJSON())));
    }

    function addTask(evt: SubmitEvent) {
        const formData = new FormData(evt.target as HTMLFormElement);

        tasks = [
            new Task(Math.max(0, ...tasks.map((task) => task.id)) + 1, formData.get("text") as string, []),
            ...tasks,
        ];

        taskNameInput = "";
    }

    function removeTask(id: number) {
        if (confirm("Are you sure you want to delete this task?")) {
            tasks = tasks.filter((task) => task.id !== id);
        }
    }

    function addTime(evt: SubmitEvent) {
        const formElement = evt.target as HTMLFormElement;
        const formData = new FormData(formElement);
        const id = parseInt(formData.get("id") as string);
        const task = tasks.find((task) => task.id === id);

        if (task) {
            task.addTime(formData.get("start") as string, formData.get("end") as string);
            tasks = tasks; // trigger reactivity
            formElement.reset();
        }
    }
</script>

<header>
    <h1>Sane TimeTracker</h1>
</header>

<section class="add-task">
    <form role="group" on:submit|preventDefault={addTask}>
        <input type="submit" value="Add" />
        <input
            type="text"
            name="text"
            placeholder="Task Name"
            aria-label="Text"
            tabindex="0"
            bind:value={taskNameInput}
        />
        <input
            type="reset"
            value="Delete all tasks"
            on:click={() => {
                if (confirm("Are you sure?")) tasks = [];
            }}
        />
    </form>
</section>

<section class="grid">
    {#each tasks as task (task.id)}
        <article in:scale out:fade>
            <h2>{task.name}</h2>

            <h3>{task.sumTotalTime()}</h3>

            <div class="delete-task" on:click={() => removeTask(task.id)}>✕</div>

            <ul>
                {#each task.times as time}
                    <li in:slide out:fade>
                        <div class="time-row">
                            <span>
                                {time.start} - {time.end}
                            </span>
                            <span
                                class="delete-time"
                                on:click={() => {
                                    if (confirm("Are you sure?")) {
                                        task.removeTime(time.id);
                                        tasks = tasks;
                                    }
                                }}
                            >
                                ✕
                            </span>
                        </div>
                    </li>
                {/each}
            </ul>
            <form role="group" on:submit|preventDefault={addTime}>
                <input type="time" name="start" required />
                <input type="time" name="end" required />
                <input type="submit" value="Add" />
                <input type="hidden" name="id" value={task.id} />
            </form>
        </article>
    {/each}
</section>

<style>
    article {
        position: relative;
    }

    h3 {
        text-align: right;
    }

    .time-row {
        display: flex;
        justify-content: space-between;
    }

    .delete-task {
        position: absolute;
        top: 0.2rem;
        right: 0.5rem;
        cursor: pointer;
    }

    .delete-time {
        cursor: pointer;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 1rem;
    }
</style>
