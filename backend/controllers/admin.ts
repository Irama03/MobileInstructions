import * as CategoriesService from "../services/categories";
import * as DevicesService from "../services/devices";
import { ControllerFN } from "../types";
import * as InstructionsService from "../services/instructions";

export const TOKEN = "72a2d74e-0e47-457c-a123-e11b9e4cf7eb";

export const validateAdminToken: ControllerFN = async (req, res, next) => {
  if (req.headers?.token !== TOKEN) {
    next(new Error("Invalid token"));
  }
  next();
};

export const adminLogin: ControllerFN = async (req, res) => {
  return res.status(200).json({ token: TOKEN });
};

export const createCategory: ControllerFN = async (req, res) => {
  const { name } = req.body;
  const category = await CategoriesService.createCategory(name);
  return res.status(201).json(category);
};

export const updateCategory: ControllerFN = async (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  const category = await CategoriesService.updateCategory(id, name);
  return res.status(200).json(category);
};

export const deleteCategory: ControllerFN = async (req, res) => {
  const id = Number(req.params.id);
  await CategoriesService.deleteCategory(id);
  return res.status(200).json({ success: true });
};

export const createDeviceType: ControllerFN = async (req, res) => {
  const { name } = req.body;
  const device = await DevicesService.createDevice(name);
  return res.status(201).json(device);
};

export const updateDeviceType: ControllerFN = async (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  const device = await DevicesService.updateDevice(id, name);
  return res.status(200).json(device);
};

export const deleteDeviceType: ControllerFN = async (req, res) => {
  const id = Number(req.params.id);
  await DevicesService.deleteDevice(id);
  return res.status(200).json({ success: true });
};

export const createInstruction: ControllerFN = async (req, res) => {
  const instruction = await InstructionsService.createInstruction(req.body);
  return res.status(201).json(instruction);
};

export const updateInstruction: ControllerFN = async (req, res) => {
  const instructionId = Number(req.params.id);
  const instruction = await InstructionsService.updateInstruction(
    instructionId,
    req.body
  );
  return res.status(200).json(instruction);
};

export const deleteInstruction: ControllerFN = async (req, res) => {
  const id = Number(req.params.id);
  await InstructionsService.deleteInstruction(id);
  return res.status(200).json({ success: true });
};
