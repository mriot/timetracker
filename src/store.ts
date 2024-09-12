import { writable } from "svelte/store";
import { TableRow } from "./table-row";

function localStorageStore<T>(key: string) {
    const storedValue = localStorage.getItem(key);
    const data = storedValue ? JSON.parse(storedValue) : [];

    const store = writable<T>(data);

    store.subscribe((value) => {
        console.log("Store updated", value);
        localStorage.setItem(key, JSON.stringify(value));
    });

    return store;
}

export const tableRowStore = localStorageStore<TableRow[]>("bookings");
