import prisma from "./prisma";
import { Prisma } from "@prisma/client";

type InstructionFilters = {
  categoryIds: number[];
  deviceIds: number[];
  name?: string;
};

type CreateInstructionPayload = {
  name: string;
  categoryId: number;
  deviceIds: number[];
  steps: {
    content: string;
    order?: number;
  }[];
};

type UpdateInstructionPayload = CreateInstructionPayload & {
  likes_quant: number;
  dislikes_quant: number;
};

const instructionIncludedData: Prisma.InstructionInclude = {
  steps: {
    orderBy: { order: "asc" },
  },
  category: true,
  devices: true,
};

export const findInstructions = async ({
  categoryIds,
  deviceIds,
  name,
}: InstructionFilters) => {
  const instructionsWhereInput = (() => {
    const res: Prisma.InstructionWhereInput = {};
    if (categoryIds.length > 0) {
      res.category_id = { in: categoryIds };
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
    include: instructionIncludedData,
  });

  return instructions;
};

export const findInstructionById = async (instructionId: number) => {
  const instruction = await prisma.instruction.findFirstOrThrow({
    where: { id: instructionId },
    orderBy: {
      createdAt: "desc",
    },
    include: instructionIncludedData,
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

export const createInstruction = async (payload: CreateInstructionPayload) => {
  const instruction = await prisma.instruction.create({
    data: {
      name: payload.name,
      likes_quant: 0,
      dislikes_quant: 0,
      category_id: payload.categoryId,
      devices: {
        connect: payload.deviceIds.map((id) => ({ id })),
      },
      steps: {
        createMany: {
          data: payload.steps.map((step, i) => ({
            content: step.content,
            order: step.order || i + 1,
          })),
        },
      },
    },
    include: instructionIncludedData,
  });

  return instruction;
};

export const updateInstruction = async (
  id: number,
  payload: UpdateInstructionPayload
) => {
  const instruction = await prisma.instruction.update({
    data: {
      name: payload.name,
      likes_quant: payload.likes_quant,
      dislikes_quant: payload.dislikes_quant,
      category: {
        connect: {
          id: payload.categoryId,
        },
      },
      devices: {
        connect: payload.deviceIds.map((id) => ({ id })),
      },
      steps: {
        deleteMany: {},
        createMany: {
          data: payload.steps.map((step, i) => ({
            content: step.content,
            order: step.order || i + 1,
          })),
        },
      },
    },
    where: {
      id: id,
    },
    include: instructionIncludedData,
  });

  return instruction;
};

export const deleteInstruction = async (id: number) => {
  await prisma.instruction.delete({
    where: { id },
  });
};
