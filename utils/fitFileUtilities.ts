import FitParser from "fit-file-parser";
import { FitDeviceInfo, FitRecordDatum, FitUserProfile } from "./types/fit";

export type FitFile = {
  user_profile: FitUserProfile;
  records: Array<FitRecordDatum>;
  device_infos: Array<FitDeviceInfo>;
};

export class FitFileUtilities {
  public static async loadFile(blob: Blob) {
    const rawData = await this.readFile(blob);
    return this.parseFitFile(rawData);
  }

  private static readFile(blob: Blob) {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (res) => {
        const result = res.target?.result;
        if (result === undefined || result === null) {
          throw new Error("Could not read file");
        }
        if (typeof result === "string") {
          resolve(new TextEncoder().encode(result));
        } else {
          resolve(result);
        }
      };
      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(blob);
    });
  }

  private static async parseFitFile(data: ArrayBuffer) {
    const parser = new FitParser();

    const rawData = await new Promise<FitFile>((resolve, reject) => {
      parser.parse(data, (error: unknown, data: unknown) => {
        if (data) {
          resolve(data as FitFile);
        } else if (error) {
          reject(error);
        }
        reject(new Error("unknown error parsing fit file"));
      });
    });

    rawData.records = rawData.records.map((record) => ({
      ...record,
      timestamp: new Date(record.timestamp),
    }));

    return rawData;
  }
}
