import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import { randomUUID } from 'node:crypto';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.argv[2] || 'admin@smartrecruit.com';
  const plainPassword = process.argv[3] || 'SuperSecretAdminPassword123';

  console.log('🌱 Starting database seeding...');

  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingUser) {
    console.log(`⚠️ User with email "${adminEmail}" already exists. Skipping.`);
    return;
  }

  const userId = randomUUID();
  const accountId = randomUUID();
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  const now = new Date();

  await prisma.user.create({
    data: {
      id: userId,
      name: adminEmail.split('@')[0],
      email: adminEmail,
      emailVerified: true,
      image: null,
      createdAt: now,
      updatedAt: now,
    },
  });

  await prisma.account.create({
    data: {
      id: accountId,
      accountId: userId,
      providerId: 'credential',
      userId,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    },
  });

  console.log(`✅ Admin seeded successfully!`);
  console.log(`📧 Email: ${adminEmail}`);
  console.log(`🔑 Password: ${plainPassword}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
