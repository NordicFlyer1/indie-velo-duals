import { FitRecordDatum, FitRecordSelector } from "./types/fit";

export default class PowerCurveUtilities {
  public static getDurations() {
    let index = 3600;
    const durations: number[] = [];
    while (index > 0) {
      durations.push(index);
      if (index > 20 * 60) {
        index = index - 30;
      } else if (index > 10 * 60) {
        index = index - 15;
      } else if (index > 5 * 60) {
        index = index - 5;
      } else {
        index = index - 1;
      }
    }
    return durations;
  }

  public static getPowerCurve(
    records: FitRecordDatum[],
    recordSelector: FitRecordSelector
  ) {
    if (!records) {
      return;
    }
    const cumulativePower = this.getCumulativePower(records, recordSelector);
    const durations = this.getDurations();
    const powerCurve: Map<number, number | undefined> = new Map();
    durations.forEach((duration: number) => {
      const max = this.getMaxPowerForDuration(duration, cumulativePower);
      powerCurve.set(duration, max);
    });
    return powerCurve;
  }

  static getMaxPowerForDuration(duration: number, cumulativePower: number[]) {
    let maxObserved = 0;
    for (let index = 0; index < cumulativePower.length; index++) {
      if (index + duration > cumulativePower.length - 1) {
        return maxObserved;
      }
      const average =
        (cumulativePower[index + duration] - cumulativePower[index]) / duration;
      maxObserved = Math.max(maxObserved, average);
    }
  }

  static interpolateRecords(records: FitRecordDatum[]): FitRecordDatum[] {
    const interpolatedData: FitRecordDatum[] = [];
    let previousRecord: FitRecordDatum;

    if (records.length) {
      interpolatedData.push(records[0]);
      previousRecord = records[0];
    }

    records.slice(1).forEach((record: FitRecordDatum) => {
      const timeDelta =
        (record.timestamp.getTime() - previousRecord.timestamp.getTime()) /
        1000;
      const powerAverage = (record.power + previousRecord.power) / 2;
      for (let offset = 1; offset < timeDelta; offset++) {
        const interpolatedRecord = { ...previousRecord };
        interpolatedRecord.timestamp = new Date(
          previousRecord.timestamp.getTime() + offset * 1000
        );

        interpolatedRecord.power = powerAverage;
        interpolatedData.push(interpolatedRecord);
      }
      interpolatedData.push(record);
      previousRecord = record;
    });
    return interpolatedData;
  }

  static getCumulativePower(
    records: FitRecordDatum[],
    recordSelector: FitRecordSelector
  ): number[] {
    const cumulativePower: number[] = [0];
    const interpolateRecords = this.interpolateRecords(records);

    interpolateRecords.forEach((record: FitRecordDatum) => {
      cumulativePower.push(
        recordSelector(record) + cumulativePower[cumulativePower.length - 1]
      );
    });

    return cumulativePower;
  }
}
