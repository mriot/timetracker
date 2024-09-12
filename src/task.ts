type Times = { id: number; start: string; end: string };

export class Task {
    id: number;
    name: string;
    times: Times[];

    constructor(id: number, name: string, times: Times[]) {
        this.id = id;
        this.name = name;
        this.times = times;
    }

    sumTotalTime() {
        const totalWorkMinutes = this.times.reduce((minutes, time) => {
            const [startHours, startMinutes] = time.start.split(":").map(Number);
            const [endHours, endMinutes] = time.end.split(":").map(Number);

            minutes += endHours * 60 + endMinutes - (startHours * 60 + startMinutes);

            // add 24 hours if we crossed midnight
            if (minutes < 0) {
                minutes += 24 * 60;
            }

            return minutes;
        }, 0);

        return totalWorkMinutes;
    }

    addTime(start: string, end: string) {
        this.times = [
            ...this.times,
            {
                id: Math.max(0, ...this.times.map((time) => time.id)) + 1,
                start: start,
                end: end,
            },
        ];
    }

    removeTime(id: number) {
        this.times = this.times.filter((time) => time.id !== id);
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            times: this.times,
        };
    }

    toString() {
        return JSON.stringify(this.toJSON());
    }
}
