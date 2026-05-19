/**
 * Database seed — sample house plan designs for development.
 * Run: npm run seed
 */
import { prisma } from "./config/prisma";

const sampleDesigns = [
  {
    title: "Modern 3-Bed Bungalow",
    description: "Compact modern layout with open-plan living.",
    price: 45000,
    category: "bungalow",
    bedrooms: 3,
    bathrooms: 2,
    squareMeters: 145,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    ],
    videos: [] as string[],
    documents: [] as string[],
    featured: true,
  },
  {
    title: "Luxury 4-Bed Maisonette",
    description: "Two-storey family home with master ensuite.",
    price: 85000,
    category: "maisonette",
    bedrooms: 4,
    bathrooms: 3,
    squareMeters: 220,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    videos: [],
    documents: [],
    featured: true,
  },
  {
    title: "Starter 2-Bed Cottage",
    description: "Affordable starter home ideal for small plots.",
    price: 28000,
    category: "cottage",
    bedrooms: 2,
    bathrooms: 1,
    squareMeters: 95,
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    ],
    videos: [],
    documents: [],
    featured: false,
  },
];

const seedDB = async () => {
  try {
    await prisma.design.deleteMany({});
    console.log("Cleared existing designs");

    const result = await prisma.design.createMany({ data: sampleDesigns });
    console.log(`Created ${result.count} sample designs`);
    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
};

seedDB();
