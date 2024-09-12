import { writable } from "svelte/store";
import { Booking } from "./booking";

// TODO mapFn type and make it optional
function localStorageStore<T>(key: string, initialValue: T, mapFn: any) {
    let initialized = false;
    const storedValue = localStorage.getItem(key) ?? JSON.stringify(initialValue);
    const data = storedValue && JSON.parse(storedValue).map(mapFn);

    const store = writable<T>(data);

    store.subscribe((value) => {
        if (!initialized) return (initialized = true);
        console.log(`Store '${key}' updated`, value);
        localStorage.setItem(key, JSON.stringify(value));
    });

    return store;
}

export const bookingsStore = localStorageStore<Booking[]>(
    "bookings",
    [new Booking("00:00", "00:00")],
    (item: any) => new Booking(item.from, item.to, item.task, item.id)
);

export const tasksStore = localStorageStore<string[]>(
    "tasks",
    ["Daily", "Zeiterfassung", "Team-Kommunikation", "Arbeitsplatz"],
    (item: any) => item
);
