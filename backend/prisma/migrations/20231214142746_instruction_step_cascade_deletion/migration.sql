-- DropForeignKey
ALTER TABLE "InstructionStep" DROP CONSTRAINT "InstructionStep_instruction_id_fkey";

-- AddForeignKey
ALTER TABLE "InstructionStep" ADD CONSTRAINT "InstructionStep_instruction_id_fkey" FOREIGN KEY ("instruction_id") REFERENCES "Instruction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
