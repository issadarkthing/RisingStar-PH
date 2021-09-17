import { Random, MersenneTwister19937 } from "random-js";

export const random = () => new Random(MersenneTwister19937.autoSeed());

export function sleep(seconds: number) {
  return new Promise(res => {
    setTimeout(res, seconds * 1000);
  })
}
