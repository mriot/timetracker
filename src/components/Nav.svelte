<script lang="ts">
    export let showTaskManager = false;
    export let debugMode = false;
</script>

<nav>
    <ul>
        <li>
            <div class="title">
                <img src="/icon.svg" />
                <strong>TimeTracker</strong>
            </div>
        </li>
    </ul>
    <ul>
        <li>
            <details class="dropdown">
                <summary>☰ Options</summary>
                <ul>
                    <li>
                        <label>
                            <input type="checkbox" bind:checked={showTaskManager} />
                            Manage Tasks
                        </label>
                    </li>
                    <li>
                        <a href="#" on:click={() => confirm("Clear bookings?") && localStorage.removeItem("bookings")}>
                            Clear bookings
                        </a>
                    </li>
                    <li>
                        <a href="#" on:click={() => confirm("Clear tasks?") && localStorage.removeItem("tasks")}>
                            Clear tasks
                        </a>
                    </li>
                    <li>
                        <label>
                            <input type="checkbox" bind:checked={debugMode} />
                            Debug
                        </label>
                    </li>
                </ul>
            </details>
        </li>
    </ul>
</nav>

<style lang="scss">
    .title {
        display: flex;
        align-items: center;
        font-size: 1.5rem;

        img {
            max-width: 3rem;
            margin-right: 1rem;
        }
    }
</style>
