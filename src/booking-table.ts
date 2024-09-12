import { type Writable, get, derived, writable } from "svelte/store";
import type { Booking } from "./booking";
import type { Readable } from "svelte/motion";

export class BookingTable {
    bookings: Writable<Booking[]>;
    tasks: Writable<string[]>;

    totalWorkTimeString: Readable<string>;

    constructor(bookings: Writable<Booking[]>, tasks: Writable<string[]>) {
        this.bookings = bookings;
        this.tasks = tasks;

        this.totalWorkTimeString = derived(this.bookings, () => {
            return this.formatWorkTime(this.getTotalWorkTime());
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

    private getTotalWorkTime(): number {
        return get(this.bookings).reduce((acc, booking) => acc + booking.getWorkMinutes(), 0);
    }

    private formatWorkTime(totalWorkTime: number) {
        return `${Math.floor(totalWorkTime / 60)}h ${totalWorkTime % 60}m (${(totalWorkTime / 60).toFixed(2)}h)`;
    }
}
