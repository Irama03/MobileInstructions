import prisma from "./prisma";

export const findCategories = async () => {
  const categories = await prisma.instructionCategory.findMany({});
  return categories;
};

export const createCategory = async (name: string) => {
  const lastCategory = await prisma.instructionCategory.findFirst({
    orderBy: { id: "desc" },
  });
  const category = await prisma.instructionCategory.create({
    data: {
      // autoincrement does not work for some reason
      id: lastCategory ? lastCategory.id + 1 : 1,
      name,
    },
  });

  return category;
};

export const updateCategory = async (id: number, name: string) => {
  const category = await prisma.instructionCategory.update({
    where: { id },
    data: {
      name,
    },
  });

  return category;
};

export const deleteCategory = async (id: number) => {
  await prisma.instructionCategory.delete({
    where: { id },
  });
};
