import { writable } from 'svelte/store';

export const latOrigin = writable(null);
export const lonOrigin = writable(null);
export const latDest = writable(null);
export const lonDest = writable(null);

export const selectedVehicle = writable(null);

export const itineraryDistance = writable(null);
export const itineraryDuration = writable(null);
export const itineraryCost = writable(null);

export const showSidebar = writable(true);