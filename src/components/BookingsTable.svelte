<script lang="ts">
    import { flip } from "svelte/animate";
    import { quintOut } from "svelte/easing";
    import type { Readable } from "svelte/store";
    import { crossfade } from "svelte/transition";
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
</script>

<table class="bookings">
    <thead>
        <tr>
            <td colspan="2" class="total-work-time">
                ┌─── <span> {$totalWorkTimeStore} </span> ───┐
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
    <tbody>
        {#each $bookingsStore as booking (booking.id)}
            <tr in:receive={{ key: booking.id }} out:send={{ key: booking.id }} animate:flip>
                <td>
                    <input
                        type="time"
                        bind:value={booking.from}
                        on:blur={() => appController.sortBookingsByTime(booking.id)}
                    />
                </td>
                <td>
                    <input
                        type="time"
                        bind:value={booking.to}
                        on:blur={() => appController.sortBookingsByTime(booking.id)}
                    />
                </td>
                <td>{booking.formatDuration()}</td>
                <td>
                    <select bind:value={booking.task} on:change={() => appController.sortBookingsByTime(booking.id)}>
                        {#each $tasksStore as task}
                            <option value={task} selected={task === booking.task}>{task}</option>
                        {/each}
                    </select>
                </td>
                <td class="center">
                    <div
                        style="cursor: pointer;"
                        on:click={() => {
                            if (confirm("Remove this row?")) {
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
        <tr>
            <td colspan="2" class="total-work-time">
                └── <span> {$totalWorkTimeStore} </span> ──┘
            </td>
        </tr>
    </tbody>
</table>
<button on:click={() => appController.addBooking(new Booking("00:00", "00:00"))}> Add booking </button>

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

            &:not(select) {
                text-align: center;
            }
        }

        .total-work-time {
            text-align: center;
            border: none;
        }

        .center {
            text-align: center;
        }
    }
</style>
