<script lang="ts">
    import { AppController } from "../lib/app.controller";

    export let appController: AppController;
    export let showTaskManager = false;
    export let debugMode = false;
</script>

<nav>
    <ul>
        <li>
            <div class="title">
                <img src="icon.svg" on:dblclick={() => (debugMode = !debugMode)} />
                <strong>TimeTracker</strong>
            </div>
        </li>
    </ul>
    <ul class="nav-items">
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
            <!-- TODO maybe show only the task booking list -->
            <a
                href=""
                on:click|preventDefault={() => {
                    window.open(window.location.href, "_blank", "width=1000,height=500");
                }}
            >
                Popout
            </a>
        </li>
        <li>
            <a
                href=""
                on:click|preventDefault={() => {
                    if (confirm("Remove all bookings?")) appController.clearBookings();
                }}
            >
                Clear bookings
            </a>
        </li>
        <li>
            <a
                href=""
                on:click|preventDefault={() => {
                    alert(
                        "Free TimeTracker app that collects absolutely no data about you." +
                            "\nEverything is stored in your browser's local storage." +
                            "\n\nMade with Svelte."
                    );
                }}>About</a
            >
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

    .nav-items li:not(:first-child) {
        &::before {
            content: "|";
            color: #7b8495;
            margin-left: 0;
            margin-right: 1rem;
            opacity: 0.5;
        }
    }
</style>
