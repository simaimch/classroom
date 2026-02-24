import type { Place } from "./Place";

export default class Room {
    label: string = "Unbenannt";
    places: Record<string, Place> = {};
};