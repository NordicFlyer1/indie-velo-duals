export type FitUserProfile = {
  weight: number;
  age: number;
  friendly_name: string;
};

export type FitRecordDatum = {
  timestamp: Date;
  position_lat: number;
  position_long: number;
  altitude: number;
  grade: number;
  power: number;
  cadence: number;
  heart_rate: number;
  distance: number;
  speed: number;
  left_torque_effectiveness: number;
  right_torque_effectiveness: number;
  left_pedal_smoothness: number;
  right_pedal_smoothness: number;
  "Powermeter Power": number;
};

export type FitDeviceInfo = {
  timestamp: string;
  device_index: number;
  device_type: string;
  manufacturer: string;
  product: number;
  product_name: string;
  serial_number: number;
  hardware_version: number;
  software_version: number;
  calibration: number;
  crank_length: number;
};

export type FitRecordSelector = (item: FitRecordDatum) => number;
