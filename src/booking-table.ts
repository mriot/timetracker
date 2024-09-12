import type { Readable } from "svelte/motion";
import { type Writable, derived, get } from "svelte/store";
import type { Booking } from "./booking";

export class BookingTable {
    bookings: Writable<Booking[]>;
    tasks: Writable<string[]>;

    totalWorkTimeString: Readable<string>;
    taskWorkTimeMap: Readable<Map<string, string>>;

    constructor(bookings: Writable<Booking[]>, tasks: Writable<string[]>) {
        this.bookings = bookings;
        this.tasks = tasks;

        this.totalWorkTimeString = derived(this.bookings, () => {
            return this.formatWorkTime(this.getTotalWorkTime());
        });

        this.taskWorkTimeMap = derived(this.bookings, () => {
            // sort by total work time in descending order
            const taskWorkTimeEntries = Array.from(this.getTotalWorkTimeByTask().entries()).sort(
                ([, valueA], [, valueB]) => valueB - valueA
            );

            return new Map(taskWorkTimeEntries.map(([task, workTime]) => [task, this.formatWorkTime(workTime)]));
        });
    }

    addBooking(booking: Booking) {
        this.bookings.update((bookings) => [...bookings, booking]);
    }

    removeBooking(id: number) {
        this.bookings.update((bookings) => bookings.filter((booking) => booking.id !== id));
    }

    getTasks() {
        return derived(this.tasks, ($tasks) => $tasks);
    }

    addTask(task: string) {
        this.tasks.update((tasks) => [...tasks, task]);
    }

    removeTask(task: string) {
        this.tasks.update((tasks) => tasks.filter((t) => t !== task));
    }

    sortBookingsByTime() {
        this.bookings.update((bookings) => bookings.sort((a, b) => a.from.localeCompare(b.from)));
    }

    private getTotalWorkTime(): number {
        return get(this.bookings).reduce((acc, booking) => acc + booking.getWorkMinutes(), 0);
    }

    private getTotalWorkTimeByTask(): Map<string, number> {
        const taskWorkTimeMap = new Map<string, number>();

        get(this.bookings).forEach((booking) => {
            const task = booking.task;
            const workTime = booking.getWorkMinutes();
            taskWorkTimeMap.set(task, (taskWorkTimeMap.get(task) ?? 0) + workTime);
        });

        return taskWorkTimeMap;
    }

    private formatWorkTime(totalWorkTime: number) {
        return `${Math.floor(totalWorkTime / 60)}h ${totalWorkTime % 60}m (${(totalWorkTime / 60).toFixed(2)}h)`;
    }
}
