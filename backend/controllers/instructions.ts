import { ControllerFN } from "../types";
import * as InstructionsService from "../services/instructions";

export const getInstructions: ControllerFN = async (req, res) => {
  const { categoryIds, deviceIds, name } = req.query;
  const instructions = await InstructionsService.findInstructions({
    categoryIds: typeof categoryIds === "string" ? categoryIds.split(",").map(Number) : [],
    deviceIds:
      typeof deviceIds === "string" ? deviceIds.split(",").map(Number) : [],
    name: typeof name === "string" ? name : undefined,
  });

  return res.status(200).json(instructions);
};

export const getInstructionById: ControllerFN = async (req, res) => {
  const { id } = req.params;
  const instructions = await InstructionsService.findInstructionById(
    Number(id)
  );

  return res.status(200).json(instructions);
};

export const rateInstruction: ControllerFN = async (req, res) => {
  const { id } = req.params;
  const { isLiked } = req.body;

  if (typeof isLiked !== "boolean") {
    return res
      .status(400)
      .json({ success: false, error: "isLiked must be a boolean" });
  }

  if (isLiked) {
    await InstructionsService.likeInstruction(Number(id));
  } else {
    await InstructionsService.dislikeInstruction(Number(id));
  }

  return res.status(200).json({ success: true });
};
