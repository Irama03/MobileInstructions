import { ControllerFN } from "../types";
import * as DevicesService from "../services/devices";

export const getDevices: ControllerFN = async (req, res) => {
  const devices = await DevicesService.findDevices();
  return res.status(200).json(devices);
};
