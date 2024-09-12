export class Booking {
    id: number;
    duration: number | undefined;
    task: string | undefined;
    private _from: string;
    private _to: string;

    constructor(from: string, to: string, task?: string) {
        this.id = Math.floor(Math.random() * 999); // TODO
        this._from = from;
        this._to = to;
        this.task = task;
        this.duration = this.calculateElapsedMinutes();
    }

    set from(value: string) {
        this._from = value;
        this.duration = this.calculateElapsedMinutes();
    }

    get from(): string {
        return this._from;
    }

    set to(value: string) {
        this._to = value;
        this.duration = this.calculateElapsedMinutes();
    }

    get to(): string {
        return this._to;
    }

    calculateElapsedMinutes(): number | undefined {
        if (!this._from || !this._to) return undefined;

        const [startHours, startMinutes] = this.from.split(":").map(Number);
        const [endHours, endMinutes] = this.to.split(":").map(Number);

        let elapsedMinutes = endHours * 60 + endMinutes - (startHours * 60 + startMinutes);

        // add 24 hours if we crossed midnight
        if (elapsedMinutes < 0) {
            elapsedMinutes += 24 * 60;
        }

        return elapsedMinutes;
    }

    formatDuration(): string {
        if (!this.duration) return "--:--";
        return `${Math.floor(this.duration / 60)}h ${this.duration % 60}m (${(this.duration / 60).toFixed(2)}h)`;
    }

    toJSON() {
        return {
            id: this.id,
            duration: this.duration,
            task: this.task,
            from: this._from,
            to: this._to,
        };
    }
}
