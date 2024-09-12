import { writable } from "svelte/store";
import { DEFAULT_TASKS } from "../config";
import { Booking } from "../lib/booking";
import type { ApiKey } from "../lib/types";

/**
 * Creates a store that persists data in the browser's local storage.
 *
 * @template T - The type of data stored in the store.
 * @param {string} key - The key used to store the data in local storage.
 * @param {T} initialValue - The initial value of the store.
 * @param {Function} [mapFn] - An optional function used to map the stored data before returning it.
 * @returns {Writable<T>} - The writable store object.
 */
function createLocalStorageStore<T>(key: string, initialValue: T, mapFn?: Function) {
    const storedValue = localStorage.getItem(key);
    const data = storedValue ? JSON.parse(storedValue) : initialValue;

    const mappedData = mapFn ? data.map(mapFn) : data;

    const store = writable<T>(mappedData);

    let initialized = false;
    store.subscribe((value) => {
        // skip the first update to avoid overwriting the stored data with the initial value.
        if (!initialized) {
            initialized = true;
            return;
        }
        console.log(`Store '${key}' updated`, value);
        localStorage.setItem(key, JSON.stringify(value));
    });

    return store;
}

/**
 *  ======== STORES ========
 */

export const bookingsStore = createLocalStorageStore<Booking[]>(
    "bookings",
    [new Booking("00:00", "00:00")],
    (item: any) => new Booking(item.from, item.to, item.task, item.id)
);

export const tasksStore = createLocalStorageStore<string[]>("tasks", DEFAULT_TASKS);

export const apiKeyStore = createLocalStorageStore<ApiKey[]>("api-keys", []);
