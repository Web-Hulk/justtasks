-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "activationExpires" TIMESTAMP(3),
ADD COLUMN     "activationToken" TEXT,
ADD COLUMN     "isActivated" BOOLEAN NOT NULL DEFAULT false;
