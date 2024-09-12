import { formatWorkTime } from "./utils";

/**
 * Represents a booking - a single row in the booking table.
 */
export class Booking {
    id: number;
    duration: number | undefined;
    task: string;
    overlapsFrom: boolean = false;
    overlapsTo: boolean = false;
    hasGapBefore: boolean = false;
    #from!: BookingTime;
    #to!: BookingTime;

    constructor(from: string, to: string, task?: string, id?: number) {
        this.id = id ?? crypto.getRandomValues(new Uint32Array(1))[0]!;
        this.from = from;
        this.to = to;
        this.task = task ?? "";
        this.duration = this.calculateDuration();
    }

    set from(value: string) {
        this.#from = BookingTime.fromString(value);
        this.duration = this.calculateDuration();
    }

    get from(): BookingTime {
        return this.#from;
    }

    set to(value: string) {
        this.#to = BookingTime.fromString(value);
        this.duration = this.calculateDuration();
    }

    get to(): BookingTime {
        return this.#to;
    }

    isReady(): boolean {
        return this.from.isFilled() && this.to.isFilled() && this.task.length > 0;
    }

    // TODO: we should date compare here prob. Currently no support for crossing midnight.
    isBefore(other: Booking): boolean {
        return this.from.toMinutes() <= other.from.toMinutes();
    }

    // TODO: we should date compare here prob. Currently no support for crossing midnight.
    hasOverlap(other: Booking): boolean {
        return this.to.toMinutes() > other.from.toMinutes();
    }

    calculateDuration(): number {
        if (!this.#from || !this.#to) return 0;
        return this.#to.minutesBetween(this.#from);
    }

    formatDuration(): string {
        if (!this.duration) return "--:--";
        return formatWorkTime(this.duration);
    }

    toJSON() {
        return {
            id: this.id,
            duration: this.duration,
            task: this.task,
            from: this.from.toString(),
            to: this.to.toString(),
        };
    }
}

/**
 * Represents the time of a booking.
 * Exposes methods to work with time related calculations.
 */
class BookingTime {
    hours: number;
    minutes: number;

    constructor(hours: number, minutes: number) {
        this.hours = hours;
        this.minutes = minutes;
    }

    static fromString(time: string): BookingTime {
        if (!time) return new BookingTime(-1, -1);

        const [hours, minutes] = time.split(":").map(Number);

        if (hours === undefined || hours < 0 || hours > 23 || minutes === undefined || minutes < 0 || minutes > 59) {
            throw new Error(`Invalid time string: ${time}`);
        }

        return new BookingTime(hours, minutes);
    }

    static fromMinutes(minutes: number): BookingTime {
        return new BookingTime(Math.floor(minutes / 60), minutes % 60);
    }

    isFilled(): boolean {
        return this.hours > -1 && this.minutes > -1;
    }

    minutesBetween(other: BookingTime): number {
        let mins = this.toMinutes() - other.toMinutes();

        // crossed midnight
        if (mins < 0) {
            mins += 24 * 60;
        }

        return mins;
    }

    toMinutes(): number {
        return this.hours * 60 + this.minutes;
    }

    toHours(): number {
        return this.hours + this.minutes / 60;
    }

    toString(): string {
        if (this.hours === -1 && this.minutes === -1) return "";
        return `${String(this.hours).padStart(2, "0")}:${String(this.minutes).padStart(2, "0")}`;
    }
}
