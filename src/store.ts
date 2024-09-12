import { writable, type Writable } from "svelte/store";
import { Booking } from "./booking";

function localStorageStore<T>(key: string, mapFn: (item: any) => T) {
    let initialized = false;
    const storedValue = localStorage.getItem(key);
    const data = storedValue && JSON.parse(storedValue).map(mapFn);

    const store = writable<T>(data);

    store.subscribe((value) => {
        if (!initialized) return (initialized = true);
        console.log("Store updated", value);
        localStorage.setItem(key, JSON.stringify(value));
    });

    return store;
}

export const bookingsStore = localStorageStore<Booking[]>(
    "bookings",
    (item: any) => new Booking(item._from, item._to, item.task)
);
