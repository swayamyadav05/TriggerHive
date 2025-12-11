import { PrismaClient } from "@/generated/prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { polar, checkout, portal } from "@polar-sh/better-auth";
import { polarClient } from "./polar";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Define the global type for Prisma
const globalForPrisma = globalThis as unknown as {
  prismaAuth: PrismaClient | undefined;
};

// Get the connection string
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Function to create a new PrismaClient instance
function createPrismaClient() {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

// Create or reuse PrismaClient instance
const prisma = globalForPrisma.prismaAuth ?? createPrismaClient();

// In development, save the instance to global to prevent hot-reload issues
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaAuth = prisma;
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "78b89703-1ea7-4e50-90a7-a487f719378e",
              slug: "pro",
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
        portal(),
      ],
    }),
  ],
});
