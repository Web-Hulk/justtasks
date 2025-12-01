-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" VARCHAR(255) NOT NULL,
    "userAgent" VARCHAR(255) NOT NULL,
    "deviceName" VARCHAR(255),
    "location" VARCHAR(255),
    "oauthProvider" VARCHAR(255),
    "refreshToken" VARCHAR(255) NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
