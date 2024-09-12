import type { Booking } from "../booking";

export function editState(node: HTMLElement, booking: Booking) {
    if (!booking.isReady()) {
        booking.isBeingEdited = true;
    }

    const handleFocusIn = (evt: FocusEvent) => {
        booking.isBeingEdited = true;

        // if (evt.relatedTarget && node.contains(evt.relatedTarget as Node)) {
        //     console.log("still editing");
        // }
    };

    const handleFocusOut = (evt: FocusEvent) => {
        if (booking.isBeingEdited && !node.contains(evt.relatedTarget as Node)) {
            booking.isBeingEdited = false;
        }
    };

    node.addEventListener("focusin", handleFocusIn);
    node.addEventListener("focusout", handleFocusOut);

    return {
        destroy() {
            node.removeEventListener("focusin", handleFocusIn);
            node.removeEventListener("focusout", handleFocusOut);
        },
    };
}
