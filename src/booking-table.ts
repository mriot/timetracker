import type { Booking } from "./booking";

export class BookingTable {
    bookings: Booking[] = [];

    constructor(bookings: Booking[]) {
        this.bookings = bookings;
    }

    add(booking: Booking) {
        this.bookings.push(booking);
    }

    remove(booking: Booking) {
        this.bookings = this.bookings.filter((b) => b.id !== booking.id);
    }

    getFormattedDuration(): string {
        const duration = this.bookings.reduce((acc, booking) => {
            return acc + booking.getWorkMinutes();
        }, 0);

        return `${Math.floor(duration / 60)}h ${duration % 60}m (${(duration / 60).toFixed(2)}h)`;
    }
}
