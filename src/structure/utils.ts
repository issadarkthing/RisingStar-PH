import { Random, MersenneTwister19937 } from "random-js";

export const random = () => new Random(MersenneTwister19937.autoSeed());

export function sleep(seconds: number) {
  return new Promise(res => {
    setTimeout(res, seconds * 1000);
  })
}

export const RED = "#FF0000";
export const GREEN = "#008000";
export const GOLD = "#ffd700";
export const BROWN = "#c66a10";
export const SILVER = "#c0c0c0";
