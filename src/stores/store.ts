import { writable, type Writable } from "svelte/store";
import { DEFAULT_TASKS } from "../config";
import { Booking } from "../lib/booking";

/**
 * Creates a writable Svelte store that persists its value in local storage.
 *
 * @template T - The type of the store value.
 * @template U - The transformed type of the store value, if a transform function is provided.
 * @param {string} key - The key used to store the value in the local storage.
 * @param {T} initialValue - The initial value of the store.
 * @param {(item: U) => U} [transformFn] - Optional transform function to apply to the store value.
 * @returns {Writable<T>} - The created writable store.
 */
function createLocalStorageStore<T, U = T>(key: string, initialValue: T, transformFn?: (item: U) => U): Writable<T> {
    const storedValue = localStorage.getItem(key);
    const data = storedValue ? (JSON.parse(storedValue) as T) : initialValue;

    const storeData = transformFn && Array.isArray(data) ? (data.map(transformFn) as T) : data;

    const store = writable<T>(storeData);

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

// ======== STORES ========

export const bookingsStore = createLocalStorageStore<Booking[], Booking>(
    "bookings",
    [new Booking("", "")],
    (item: Booking) => new Booking(item.from.toString(), item.to.toString(), item.task, item.id)
);

export const tasksStore = createLocalStorageStore<string[]>("tasks", DEFAULT_TASKS);
