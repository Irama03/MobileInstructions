import prisma from "./prisma";

export const findDevices = async () => {
  const devices = await prisma.deviceType.findMany({});
  return devices
};
