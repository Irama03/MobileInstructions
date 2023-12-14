import prisma from "./prisma";

export const findDevices = async () => {
  const devices = await prisma.deviceType.findMany({});
  return devices;
};

export const createDevice = async (name: string) => {
  const lastDevice = await prisma.deviceType.findFirst({
    orderBy: { id: "desc" },
  });
  const device = await prisma.deviceType.create({
    data: {
      // autoincrement does not work for some reason
      id: lastDevice ? lastDevice.id + 1 : 1,
      name,
    },
  });

  return device;
};

export const updateDevice = async (id: number, name: string) => {
  const device = await prisma.deviceType.update({
    where: { id },
    data: {
      name,
    },
  });

  return device;
};

export const deleteDevice = async (id: number) => {
  await prisma.deviceType.delete({
    where: { id },
  });
};
