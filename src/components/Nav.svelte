<script lang="ts">
    export let showTaskManager = false;
    export let debugMode = false;
</script>

<nav>
    <ul>
        <li>
            <div class="title">
                <img src="/icon.svg" on:dblclick={() => (debugMode = !debugMode)} />
                <strong>TimeTracker</strong>
            </div>
        </li>
    </ul>
    <ul>
        {#if debugMode}
            <li>
                <small>debug mode</small>
            </li>
        {/if}
        <li>
            <a href="" on:click|preventDefault={() => (showTaskManager = !showTaskManager)}>
                {#if showTaskManager}
                    Close task manager
                {:else}
                    Show task manager
                {/if}
            </a>
        </li>
        <li>
            <a
                href=""
                on:click|preventDefault={() => {
                    if (confirm("Remove all bookings?")) {
                        localStorage.removeItem("bookings");
                        location.reload();
                    }
                }}
            >
                Reset bookings
            </a>
        </li>
        <li>
            <a
                href=""
                on:click|preventDefault={() => {
                    if (confirm("Reset tasks to default?")) {
                        localStorage.removeItem("tasks");
                        location.reload();
                    }
                }}
            >
                Reset tasks
            </a>
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
