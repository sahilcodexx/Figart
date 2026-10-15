const nib = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 2l3 15 8-2 4-8L3 2z" fill="#252525" stroke="white" stroke-width="2" stroke-linejoin="round"/><path d="M3 2l8 9m-5 6l8-2 4 5-8 3-4-6z" fill="#252525" stroke="white" stroke-width="1.5" stroke-linejoin="round"/><circle cx="11" cy="11" r="1.5" fill="white"/></svg>`;
export const penCursor = `url("data:image/svg+xml,${encodeURIComponent(nib)}") 3 2, crosshair`;

const openHand = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M11 17V8a2 2 0 0 1 4 0v7-10a2 2 0 0 1 4 0v10-8a2 2 0 0 1 4 0v9-5a2 2 0 0 1 4 0v10c0 6-4 10-9 10-4 0-6-2-8-5l-5-7a2 2 0 0 1 3-3l3 3z" fill="white" stroke="#202020" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const closedHand = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M9 17v-5a2 2 0 0 1 4 0v-2a2 2 0 0 1 4 0v1a2 2 0 0 1 4 0v2a2 2 0 0 1 4 0v7c0 5-3 9-8 9-4 0-6-2-8-5l-4-6a2 2 0 0 1 3-3l1 2z" fill="white" stroke="#202020" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export const grabCursor = `url("data:image/svg+xml,${encodeURIComponent(openHand)}") 16 16, grab`;
export const grabbingCursor = `url("data:image/svg+xml,${encodeURIComponent(closedHand)}") 16 16, grabbing`;
