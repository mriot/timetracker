import type { Booking } from "../booking";

export function bindFocus(node: HTMLElement, booking: Booking) {
    if (!booking.isReady()) {
        console.log("activated", booking);
        booking.isActive = true;
    }

    const handleFocusIn = (evt: FocusEvent) => {
        if (!booking.isActive) {
            console.log("started editing");
            booking.isActive = true;
        }

        if (evt.relatedTarget && node.contains(evt.relatedTarget as Node)) {
            console.log("still editing");
        }
    };

    const handleFocusOut = (evt: FocusEvent) => {
        if (booking.isActive && !node.contains(evt.relatedTarget as Node)) {
            console.log("stopped editing");
            booking.isActive = false;
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
