<script lang="ts">
    export let showTaskManager = false;
    export let debugMode = false;
</script>

<nav>
    <ul>
        <li>
            <strong>TimeTracker</strong>
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
    nav strong {
        font-size: 1.5rem;
    }
</style>
