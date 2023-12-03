import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const categories = [{ id: 1, name: "Загальні інструкціі" }, { id: 2, name: "Інструкціі для браузерів" }, { id: 3, name: "Налаштування" }];

const deviceTypes = [
  { id: 1, name: "Телефон" },
  { id: 2, name: "Ноутбук" },
  { id: 3, name: "Планшет" },
];

const instructions = [
  {
    id: 1,
    name: "Перезавантаження телефона",
    category_id: 1,
    steps: [
      {
        content: "Зажати кнопку включення",
        order: 1,
        instruction_id: 1,
      },
      {
        content: 'Вибрати пункт "Перезавантажити"',
        order: 2,
        instruction_id: 1,
      },
      {
        content: 'Натиснути кнопку "Перезавантажити"',
        order: 3,
        instruction_id: 1,
      },
    ],
    devices: [deviceTypes[0]],
  },
  {
    id: 2,
    name: 'Виконання пошукового запиту в браузері "Google Chrome"',
    category_id: 2,
    steps: [
      {
        content: 'Відкрити браузер "Google Chrome"',
        order: 1,
        instruction_id: 2,
      },
      {
        content: 'Ввести пошуковий запит в поле "Пошук або введіть URL-адресу"',
        order: 2,
        instruction_id: 2,
      },
      {
        content: 'Натиснути кнопку "Пошук"',
        order: 3,
        instruction_id: 2,
      },
    ],
    devices: [deviceTypes[0], deviceTypes[1], deviceTypes[2]],
  },
  {
    id: 3,
    name: 'Налаштування гучності',
    category_id: 3,
    steps: [
      {
        content: 'Відкрити налаштування смартфона',
        order: 1,
        instruction_id: 3,
      },
      {
        content: 'Знайти параметр "Гучність',
        order: 2,
        instruction_id: 3,
      },
      {
        content: 'Виставити бажану гучніть',
        order: 3,
        instruction_id: 3,
      },
    ],
    devices: [deviceTypes[0], deviceTypes[1]],
  },
];

async function main() {
  console.log(`Creating ${categories.length} categories...`);
  for (const category of categories) {
    await prisma.instructionCategory.upsert({
      where: { id: category.id },
      update: { name: category.name },
      create: {
        id: category.id,
        name: category.name,
      },
    });
  }
  console.log(`Creating ${deviceTypes.length} devices...`);
  for (const device of deviceTypes) {
    await prisma.deviceType.upsert({
      where: { id: device.id },
      update: { name: device.name },
      create: {
        id: device.id,
        name: device.name,
      },
    });
  }
  console.log(`Creating ${instructions.length} instructions...`);
  for (const instructionData of instructions) {
    const { steps, devices, ...instruction } = instructionData;
    console.log(`Creating instruction - ${instruction.id}`);
    const updateInput = {
        name: instruction.name,
        category_id: instruction.category_id,
        devices: {
          connect: devices.map((device) => ({ id: device.id })),
        },
    }
    await prisma.instruction.upsert({
      where: { id: instruction.id },
      update: updateInput,
      create: {
        id: instruction.id,
        ...updateInput
      },
    });
    console.log(`Creating instruction steps - ${instruction.id}`);
    await prisma.instructionStep.deleteMany({
      where: { instruction_id: instruction.id },
    });
    await prisma.instructionStep.createMany({
      data: steps,
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
