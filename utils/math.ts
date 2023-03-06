import { FitRecordDatum } from "./types/fit";

export function average<T>(data: T[], selector: (datum: T) => number): number {
  const sum = data.reduce((acc, c) => acc + selector(c), 0);
  return sum / data.length;
}

export function relDiff(a: number, b: number) {
  return (100 * (a - b)) / ((a + b) / 2);
}

export function weightedMovingAverage(
  data: FitRecordDatum[],
  selector: (datum: FitRecordDatum) => number
): number {
  const length = data.length;

  const windowDurationMs = 30000;

  const ret = [];
  const denominator = (windowDurationMs * (windowDurationMs + 1)) / 2;
  const prepare = windowDurationMs - 1;
  let sum = 0;
  let numerator = 0;
  let datum = 0;
  let i = 0;
  let real = -1;

  for (; i < prepare; i++) {
    datum = selector(data[i]);

    if (datum) {
      sum += datum;
      numerator += (i + 1) * datum;
    }
  }

  for (; i < length; i++, real++) {
    datum = selector(data[i]);

    if (datum) {
      sum += datum;
      numerator += windowDurationMs * datum;
    }

    const realData = selector(data[real]);
    if (real >= 0 && realData) {
      sum -= realData;
    }

    ret[i] = numerator / denominator;
    numerator -= sum;
  }

  const sum2 = ret.reduce((acc, c) => acc + c, 0);
  return sum2 / ret.length;
}
