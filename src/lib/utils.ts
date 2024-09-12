export function formatWorkTime(totalWorkTime: number): string {
    return `
        ${Math.floor(totalWorkTime / 60).toString()}h ${(totalWorkTime % 60).toString()}m 
        <span style="opacity: 0.5;">(${(totalWorkTime / 60).toFixed(2)}h)</span>
    `;
}
