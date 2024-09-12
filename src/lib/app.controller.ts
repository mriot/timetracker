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
        this.bookings.update((bookings) => bookings.filter((booking) => booking.id !== id));
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

    sortBookingsByTime(triggeringBookingId?: number) {
        const booking = get(this.bookings).find((booking) => booking.id === triggeringBookingId);

        this.markOverlappingBookings();

        if (booking && (!booking.from || !booking.to || !booking.task)) {
            return;
        }

        this.bookings.update((bookings) => bookings.sort((a, b) => a.from.localeCompare(b.from)));
    }

    // TODO make a visual connection bookings?
    markOverlappingBookings(): void {
        const bookings = get(this.bookings);

        bookings.forEach((booking, i, arr) => {
            const nextBooking = arr[i + 1];
            if (!nextBooking) return;

            const hasOverlap = booking.to > nextBooking.from;

            booking.isOverlappingTo = hasOverlap;
            nextBooking.isOverlappingFrom = hasOverlap;
        });
    }

    private getTotalWorkTime(): number {
        return get(this.bookings).reduce((acc, booking) => acc + booking.getWorkMinutes(), 0);
    }

    private getTotalWorkTimeByTask(): Map<string, number> {
        const taskWorkTimeMap = new Map<string, number>();

        get(this.bookings).forEach((booking) => {
            const task = get(this.tasks).includes(booking.task) ? booking.task : "Not assigned";
            const workTime = booking.getWorkMinutes();
            taskWorkTimeMap.set(task, (taskWorkTimeMap.get(task) ?? 0) + workTime);
        });

        return taskWorkTimeMap;
    }
}
