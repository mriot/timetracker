// using an action here might be overkill, but it's still better than repeating it inline multiple times ¯\_(ツ)_/¯
export function requestFocus(node: HTMLElement, isLatestUnfilledBooking: boolean) {
    if (isLatestUnfilledBooking) {
        node.focus();
    }
}
