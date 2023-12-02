import prisma from "./prisma";

export const findCategories = async () => {
  const categories = await prisma.instructionCategory.findMany({});
  return categories
};
