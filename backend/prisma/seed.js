import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = 'admin@smartrecruit.com'; // 🎯 Change to your admin email
  const plainPassword = 'SuperSecretAdminPassword123'; // 🎯 Change to your admin password

  console.log('🌱 Starting database seeding...');

  // Check if an admin already exists to prevent duplicates
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`⚠️ Admin with email "${adminEmail}" already exists. Skipping.`);
    return;
  }

  // Hash the password securely
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Insert the admin into MySQL
  const newAdmin = await prisma.admin.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
    },
  });

  console.log(`✅ Admin seeded successfully!`);
  console.log(`📧 Email: ${newAdmin.email}`);
  console.log(`🔑 Password: ${plainPassword} (Stored securely as hashed text)`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });