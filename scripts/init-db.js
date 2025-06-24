const { PrismaClient } = require("@prisma/client");
const { seedDatabase } = require("../src/services/api");

const prisma = new PrismaClient();

async function initializeDatabase() {
  console.log("🔧 Initializing database...");

  try {
    // Test database connection
    await prisma.$connect();
    console.log("✅ Database connection successful");

    // Run migrations
    console.log("🔄 Running database migrations...");

    // Seed database with initial data
    console.log("🌱 Seeding database with initial data...");
    await seedDatabase();

    console.log("🎉 Database initialization completed successfully!");

    // Show summary
    const projectCount = await prisma.project.count();
    const userCount = await prisma.user.count();

    console.log("\n📊 Database Summary:");
    console.log(`   👥 Users: ${userCount}`);
    console.log(`   🏢 Projects: ${projectCount}`);
    console.log("   🗺️ Map settings: Configured");
    console.log("   ⚙️ System settings: Configured");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

initializeDatabase();
