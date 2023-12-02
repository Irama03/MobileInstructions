import prisma from "./prisma";
import { Prisma } from "@prisma/client";

type InstructionFilters = {
  categoryId?: number;
  deviceIds: number[];
  name?: string;
};

export const findInstructions = async ({
  categoryId,
  deviceIds,
  name,
}: InstructionFilters) => {
  const instructionsWhereInput = (() => {
    const res: Prisma.InstructionWhereInput = {};
    if (categoryId) {
      res.category_id = categoryId;
    }
    if (name) {
      res.name = {
        contains: name,
        mode: "insensitive",
      };
    }
    if (deviceIds.length > 0) {
      res.devices = {
        some: {
          id: {
            in: deviceIds,
          },
        },
      };
    }
    return res;
  })();

  const instructions = await prisma.instruction.findMany({
    where: instructionsWhereInput,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      steps: {
        orderBy: { order: "asc" },
      },
      category: true,
      devices: true,
    },
  });

  return instructions;
};

export const findInstructionById = async (instructionId: number) => {
  const instruction = await prisma.instruction.findFirstOrThrow({
    where: { id: instructionId },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      steps: {
        orderBy: { order: "asc" },
      },
      category: true,
      devices: true,
    },
  });

  return instruction;
};

export const likeInstruction = async (instructionId: number) => {
  await prisma.instruction.update({
    where: { id: instructionId },
    data: {
      likes_quant: {
        increment: 1,
      },
    },
  });
};

export const dislikeInstruction = async (instructionId: number) => {
  await prisma.instruction.update({
    where: { id: instructionId },
    data: {
      dislikes_quant: {
        increment: 1,
      },
    },
  });
};
