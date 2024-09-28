<script lang="ts">
    import { flip } from "svelte/animate";
    import { quintOut } from "svelte/easing";
    import type { Readable } from "svelte/store";
    import { crossfade } from "svelte/transition";
    import { editState } from "../lib/actions/edit-state";
    import { keybind } from "../lib/actions/keybind";
    import { requestFocus } from "../lib/actions/request-focus";
    import type { AppController } from "../lib/app.controller";
    import { Booking } from "../lib/booking";
    import { bookingsStore, tasksStore } from "../stores/store";

    export let appController: AppController;
    export let totalWorkTimeStore: Readable<string>;
    export let debugMode: boolean;

    const [send, receive] = crossfade({
        fallback(node, params) {
            const style = getComputedStyle(node);
            const transform = style.transform === "none" ? "" : style.transform;

            return {
                duration: 600,
                easing: quintOut,
                css: (t, u) => `
                    transform: ${transform} scale(${t});
                    opacity: ${t}
                `,
            };
        },
    });

    // if we press tab while only the body is focused, we focus the first incomplete booking instead
    function tabKeyPress(event: Event) {
        if (document.activeElement?.tagName === "BODY") {
            const booking = $bookingsStore.findLast((booking) => !booking.isReady());
            if (!booking) return;
            event.preventDefault();
            (document.querySelector(`#booking-${booking?.id} input`) as HTMLElement)?.focus();
        }
    }
</script>

<table class="bookings">
    <thead>
        <tr>
            <td colspan="2" class="total-work-time">
                ┌─── <span> {@html $totalWorkTimeStore} </span> ───┐
            </td>
        </tr>
        <tr>
            <th>From</th>
            <th>To</th>
            <th>Duration</th>
            <th>Task</th>
            <th></th>
            {#if debugMode}
                <th>ID</th>
            {/if}
        </tr>
    </thead>
    <tbody use:keybind={{ key: "tab", callback: tabKeyPress, allowDefault: true }}>
        {#each $bookingsStore as booking (booking.id)}
            <!-- NOTE: action editState before the focusout event to verify the booking's edit state before trying to sort -->
            <tr
                use:editState={booking}
                on:focusout={() => appController.sortBookingsByTime(booking)}
                in:receive={{ key: booking.id }}
                out:send={{ key: booking.id }}
                animate:flip={{ duration: 250 }}
                class:has-time-gap={booking.hasTimeGap}
                id={`booking-${booking.id}`}
            >
                <td>
                    <input
                        type="time"
                        bind:value={booking.from}
                        use:requestFocus={!booking.from.isFilled()}
                        class:has-time-overlap={booking.overlapsFrom}
                    />
                </td>
                <td>
                    <input
                        type="time"
                        bind:value={booking.to}
                        use:requestFocus={booking.from.isFilled() && !booking.to.isFilled()}
                        class:has-time-overlap={booking.overlapsTo}
                    />
                </td>
                <td>{@html booking.formatDuration()}</td>
                <td>
                    <select
                        bind:value={booking.task}
                        use:requestFocus={booking.from.isFilled() && booking.to.isFilled() && !booking.task.length}
                    >
                        {#each $tasksStore as task}
                            <option value={task} selected={task === booking.task}>{task}</option>
                        {/each}
                    </select>
                </td>
                <td class="center">
                    <div
                        style="cursor: pointer;"
                        on:click={() => {
                            if (confirm("Remove this booking?")) {
                                appController.removeBooking(booking.id);
                            }
                        }}
                    >
                        <span>✕</span>
                    </div>
                </td>
                {#if debugMode}
                    <td>{booking.id}</td>
                {/if}
            </tr>
        {/each}
        <!-- <tr>
            <td colspan="2" class="total-work-time">
                └── <span> {@html $totalWorkTimeStore} </span> ──┘
            </td>
        </tr> -->
    </tbody>
</table>
<button
    on:click={() => appController.addBooking(new Booking("", ""))}
    use:keybind={{ ctrl: true, shift: true, key: "a", trigger: "click" }}
>
    Add booking
</button>

<style lang="scss">
    table.bookings {
        th,
        td {
            text-align: center;
        }

        input[type="time"],
        select {
            margin: 0;
            height: auto;
            padding: 0.5em;
            text-align: center;
            min-width: 150px;
        }

        select {
            text-align: left;
            max-width: 500px;
        }

        .total-work-time {
            text-align: center;
            border: none;
        }

        .center {
            text-align: center;
        }

        tr.has-time-gap {
            td {
                border-bottom: 0.4rem solid var(--pico-table-border-color);
                padding-bottom: 0.6rem;
            }

            // we can't apply margin on the affected TR/TD - so we fake it by adding padding on the next sibling
            & + tr td {
                padding-top: 0.6rem;
            }
        }

        .has-time-overlap {
            outline: 1px dashed red;
            background-image: var(--pico-icon-invalid) !important;
        }
    }
</style>
