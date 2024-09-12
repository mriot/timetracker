import { formatWorkTime } from "./utils";

export class Booking {
    id: number;
    duration: number | undefined;
    task: string;
    #from: string;
    #to: string;

    constructor(from: string, to: string, task?: string, id?: number) {
        this.id = id ?? crypto.getRandomValues(new Uint32Array(1))[0]!;
        this.#from = from;
        this.#to = to;
        this.task = task ?? "";
        this.duration = this.getWorkMinutes();
    }

    set from(value: string) {
        this.#from = value;
        this.duration = this.getWorkMinutes();
    }

    get from(): string {
        return this.#from;
    }

    set to(value: string) {
        this.#to = value;
        this.duration = this.getWorkMinutes();
    }

    get to(): string {
        return this.#to;
    }

    getWorkMinutes(): number {
        if (!this.#from || !this.#to) return 0;

        const [startHours, startMinutes] = this.from.split(":").map(Number);
        const [endHours, endMinutes] = this.to.split(":").map(Number);

        // TODO might change
        let elapsedMinutes = (endHours ?? 0) * 60 + (endMinutes ?? 0) - ((startHours ?? 0) * 60 + (startMinutes ?? 0));

        // add 24 hours if we crossed midnight
        if (elapsedMinutes < 0) {
            elapsedMinutes += 24 * 60;
        }

        return elapsedMinutes;
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
            from: this.#from,
            to: this.#to,
        };
    }
}
