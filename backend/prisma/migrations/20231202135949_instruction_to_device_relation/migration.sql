/*
  Warnings:

  - You are about to drop the `InstructionDeviceType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InstructionDeviceType" DROP CONSTRAINT "InstructionDeviceType_device_type_id_fkey";

-- DropForeignKey
ALTER TABLE "InstructionDeviceType" DROP CONSTRAINT "InstructionDeviceType_instruction_id_fkey";

-- DropTable
DROP TABLE "InstructionDeviceType";

-- CreateTable
CREATE TABLE "_DeviceTypeToInstruction" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DeviceTypeToInstruction_AB_unique" ON "_DeviceTypeToInstruction"("A", "B");

-- CreateIndex
CREATE INDEX "_DeviceTypeToInstruction_B_index" ON "_DeviceTypeToInstruction"("B");

-- AddForeignKey
ALTER TABLE "_DeviceTypeToInstruction" ADD CONSTRAINT "_DeviceTypeToInstruction_A_fkey" FOREIGN KEY ("A") REFERENCES "DeviceType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeviceTypeToInstruction" ADD CONSTRAINT "_DeviceTypeToInstruction_B_fkey" FOREIGN KEY ("B") REFERENCES "Instruction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
