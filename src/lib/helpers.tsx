import { START_DATE } from "./constants";
import { CONNECTION_GAMES } from "./games";

function DaysBetween(date1: Date, date2: Date): number {
    let timeDifference = Math.abs(date1.getTime() - date2.getTime())
    return Math.round(timeDifference / (1000 * 3600 * 24));
}

export function DaysSinceStart() {
    return DaysBetween(new Date(), START_DATE);
}

export function GetTodaysGame() {
    let index = DaysSinceStart() % CONNECTION_GAMES.length
    return CONNECTION_GAMES[index];
}

export function ShuffleArray(arr: Array<any>) {
    let shuffled = arr
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)

    return shuffled;
}

