import type { Readable } from "svelte/motion";
import { type Writable, derived, get } from "svelte/store";
import { DEFAULT_TASKS } from "../config";
import { Booking } from "./booking";
import { formatWorkTime } from "./utils";

export class AppController {
    bookings: Writable<Booking[]>;
    tasks: Writable<string[]>;

    totalWorkTimeString: Readable<string>;
    taskWorkTimeMap: Readable<Map<string, string>>;

    constructor(bookings: Writable<Booking[]>, tasks: Writable<string[]>) {
        this.bookings = bookings;
        this.tasks = tasks;

        this.bookings.subscribe(() => {
            this.markOverlappingBookings();
        });

        this.totalWorkTimeString = derived(this.bookings, () => {
            return formatWorkTime(this.getTotalWorkTime());
        });

        this.taskWorkTimeMap = derived([this.bookings, this.tasks], () => {
            // sort by total work time in descending order
            const taskWorkTimeEntries = Array.from(this.getTotalWorkTimeByTask().entries()).sort(
                ([, valueA], [, valueB]) => valueB - valueA
            );

            return new Map(taskWorkTimeEntries.map(([task, workTime]) => [task, formatWorkTime(workTime)]));
        });
    }

    addBooking(booking: Booking) {
        this.bookings.update((bookings) => [...bookings, booking]);
    }

    removeBooking(id: number) {
        this.bookings.update((bookings) => {
            if (bookings.length === 1) return [new Booking("", "")];
            return bookings.filter((booking) => booking.id !== id);
        });
    }

    clearBookings() {
        this.bookings.update(() => [new Booking("", "")]);
    }

    addTask(task: string) {
        this.tasks.update((tasks) => [task, ...tasks]);
    }

    removeTask(task: string) {
        this.tasks.update((tasks) => tasks.filter((t) => t !== task));
    }

    resetTasks() {
        this.tasks.update(() => DEFAULT_TASKS);
    }

    moveTask(task: string, direction: "up" | "down") {
        this.tasks.update((tasks) => {
            const index = tasks.indexOf(task);
            if (index === -1) return tasks;

            let newIndex;
            if (direction === "up") {
                newIndex = index === 0 ? tasks.length - 1 : index - 1;
            } else {
                newIndex = index === tasks.length - 1 ? 0 : index + 1;
            }

            [tasks[index], tasks[newIndex]] = [tasks[newIndex] as string, tasks[index] as string];

            return tasks;
        });
    }

    sortBookingsByTime(triggeringBooking?: Booking) {
        // don't sort if the triggering booking is not fully filled out
        if (triggeringBooking && !triggeringBooking.isReady()) {
            return;
        }

        this.bookings.update((bookings) =>
            bookings.sort((bookingA, bookingB) => {
                if (bookingA && (!bookingA.from || !bookingA.to)) {
                    return 0;
                }

                if (bookingB && (!bookingB.from || !bookingB.to)) {
                    return 0;
                }

                return bookingA.isBefore(bookingB) ? -1 : 1;
            })
        );

        this.markOverlappingBookings();
    }

    markOverlappingBookings(): void {
        const bookings = get(this.bookings);

        bookings.reduce((prevBooking: Booking | null, booking: Booking, idx: number, arr: Booking[]) => {
            // NOTE: prevBooking is the current booking - IF there was an overlap previously

            // if we had no overlap in the previous iteration, we can reset the flags
            if (!prevBooking) {
                booking.overlapsFrom = false;
                booking.overlapsTo = false;
            }

            const nextBooking = arr[idx + 1];
            if (!nextBooking) {
                // we're currently dealing with the last booking - can't have an overlap here
                booking.overlapsTo = false;
                return null;
            }

            // don't compare with bookings where the time is not set
            if (!nextBooking.isReady()) {
                return null;
            }

            // finally check if <current to> and <next from> overlap
            booking.overlapsTo = booking.hasOverlap(nextBooking);
            nextBooking.overlapsFrom = booking.overlapsTo;

            // only feed the next booking back in if it has an overlap
            if (nextBooking.overlapsFrom) {
                return nextBooking;
            }

            return null;
        }, null);
    }

    private getTotalWorkTime(): number {
        return get(this.bookings).reduce((acc, booking) => acc + booking.calculateDuration(), 0);
    }

    private getTotalWorkTimeByTask(): Map<string, number> {
        const taskWorkTimeMap = new Map<string, number>();

        get(this.bookings).forEach((booking) => {
            const task = get(this.tasks).includes(booking.task) ? booking.task : "Not assigned";
            const workTime = booking.calculateDuration();
            taskWorkTimeMap.set(task, (taskWorkTimeMap.get(task) ?? 0) + workTime);
        });

        return taskWorkTimeMap;
    }
}
