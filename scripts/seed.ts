const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        { name: "Programming Languages" },
        { name: "Web Development" },
        { name: "Mobile App Development" },
        { name: "Data Science" },
        { name: "Artificial Intelligence" },
        { name: "Machine Learning" },
        { name: "Cybersecurity" },
        { name: "Network Administration" },
        { name: "Database Management" },
        { name: "Software Engineering" },
        { name: "Game Development" },
        { name: "UX/UI Design" },
        { name: "Cloud Computing" },
        { name: "IT Project Management" },
        { name: "Computer Hardware" },
        { name: "Operating Systems" },
        { name: "Computer Graphics" },
        { name: "Computer Networks" },
        { name: "Digital Marketing" },
        { name: "E-commerce" },
      ],
    });

    console.log("Seeding completed.");
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main();