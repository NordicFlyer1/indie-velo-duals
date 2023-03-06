import { defineStore, storeToRefs } from "pinia";

import { FitDeviceInfo, FitRecordSelector } from "./types/fit";
import PowerCurveUtilities from "~~/utils/PowerCurveUtilities";
import { FitFileUtilities, FitFile } from "~~/utils/fitFileUtilities";

export interface CriticalPowerComparison {
  duration: number;
  primary: number;
  secondary: number;
  diff: number;
}

const primaryPowerSelector: FitRecordSelector = (record) => record.power;
const secondaryPowerSelector: FitRecordSelector = (record) =>
  record["Powermeter Power"];

const isDevelopmentDevice = (device: FitDeviceInfo) =>
  device.manufacturer === "development";

export const useWorkoutFileStore = defineStore("workoutFileStore", () => {
  const loading = ref(false);
  const loaded = ref(false);

  const fitFileData = ref<FitFile>();

  const loadFile = async (file: File) => {
    try {
      loading.value = true;
      fitFileData.value = await FitFileUtilities.loadFile(file);
    } finally {
      loading.value = false;
      loaded.value = true;
    }
  };

  const totalDuration = computed(() => {
    const records = fitFileData.value?.records;
    if (records === undefined) {
      return;
    }

    return (
      new Date(records[records.length - 1].timestamp).getTime() -
      new Date(records[0].timestamp).getTime()
    );
  });

  const criticalPowerCurve = computed(() => {
    if (!fitFileData.value) {
      return;
    }

    return PowerCurveUtilities.getPowerCurve(
      fitFileData.value?.records,
      primaryPowerSelector
    );
  });

  const secondaryCriticalPowerCurve = computed(() => {
    if (!fitFileData.value) {
      return;
    }

    return PowerCurveUtilities.getPowerCurve(
      fitFileData.value?.records,
      secondaryPowerSelector
    );
  });

  const criticalPowerDifferences = computed(() => {
    const primaryCriticalPowerValues = criticalPowerCurve.value;
    const secondaryCriticalPowerValues = secondaryCriticalPowerCurve.value;

    if (!primaryCriticalPowerValues || !secondaryCriticalPowerValues) {
      return;
    }

    return [...primaryCriticalPowerValues].map((entry) => {
      const primary = entry[1];
      const secondary = secondaryCriticalPowerValues.get(entry[0])!;
      return {
        duration: entry[0] * 1000,
        primary,
        secondary,
        diff: relDiff(primary, secondary),
      };
    });
  });

  const visibleDevices = computed(() =>
    fitFileData.value?.device_infos.filter(
      (device) => !isDevelopmentDevice(device)
    )
  );

  const devices = computed(() => {
    return {
      primary: fitFileData.value?.device_infos.find(
        (device) => device.device_type === "fitness_equipment"
      ),
      secondary: fitFileData.value?.device_infos.find(
        (device) => device.device_type === "bike_power"
      ),
    };
  });

  const averagePower = computed(() => {
    if (!records.value) {
      return;
    }
    const primary = average(records.value, (datum) => datum.power);
    const secondary = average(
      records.value,
      (datum) => datum["Powermeter Power"]
    );
    const difference = relDiff(primary, secondary);
    return {
      primary,
      secondary,
      difference,
    };
  });

  const records = computed(() => fitFileData.value?.records);

  const currentRecordIndex = ref<number>();
  const setCurrentRecordIndex = (newValue: number) =>
    (currentRecordIndex.value = newValue);

  const userProfile = computed(() => fitFileData.value?.user_profile);
  return {
    loading,
    loaded,
    criticalPowerCurve,
    secondaryCriticalPowerCurve,
    criticalPowerDifferences,
    records,
    visibleDevices,
    totalDuration,
    currentRecordIndex,
    averagePower,
    devices,
    userProfile,
    setCurrentRecordIndex,
    loadFile,
  };
});

export const workoutFileStoreToRefs = () => storeToRefs(useWorkoutFileStore());
