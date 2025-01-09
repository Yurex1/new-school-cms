import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const school = await prisma.school.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      type: 'Admin',
    },
  });
  const password = 'admin';
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { login: 'admin' },
    update: {},
    create: {
      login: 'admin',
      password: hashedPassword,
      name: 'Admin Admin',
      isAdmin: true,
      schoolId: school.id,
    },
  });

  console.log('School and Admin user created');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
