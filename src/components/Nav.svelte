<script lang="ts">
    import { AppController } from "../lib/app.controller";

    export let appController: AppController;
    export let showTaskManager = false;
    export let debugMode = false;

    let popoutWindow: Window | null = null;

    function popout() {
        if (popoutWindow?.closed === false) {
            popoutWindow.focus();
            return;
        }
        popoutWindow = window.open(window.location.href + "?popout", "_blank", "width=400, height=600");
    }
</script>

<nav>
    <a href="https://github.com/mriot/timetracker" class="github-link">
        <img src="github.svg" alt="github logo" />
    </a>

    <ul>
        <li>
            <div class="title">
                <img src="icon.svg" alt="timetracker logo" on:dblclick={() => (debugMode = !debugMode)} />
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
            <a
                href=""
                on:click|preventDefault={() => (showTaskManager = !showTaskManager)}
                class="task-manager-toggle"
                data-open={showTaskManager}
            >
                Task Manager
            </a>
        </li>
        <li>
            <a href="" on:click|preventDefault={popout}> Popout </a>
        </li>
        <li>
            <a
                href=""
                on:click|preventDefault={() => {
                    if (confirm("Remove all bookings?")) appController.clearBookings();
                }}
            >
                Clear Bookings
            </a>
        </li>
    </ul>
</nav>

<style lang="scss">
    .github-link {
        position: absolute;
        top: 0.25rem;
        left: 0.25rem;
        opacity: 0.2;
        transition: opacity 0.2s;

        &:hover {
            opacity: 1;
        }

        img {
            width: 1.6rem;
        }
    }

    .task-manager-toggle {
        &::before {
            content: "";
            width: 1rem;
            height: 1rem;
            display: inline-block;
            margin-right: 0.25rem;
            transform: translateY(0.2rem);
            background-image: var(--pico-icon-chevron);
            background-size: contain;
            background-position: bottom;
            transition: transform 0.2s ease;
        }

        &[data-open="true"]::before {
            transform: rotate3d(1, 0, 0, 180deg) translateY(-0.2rem);
        }
    }

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
