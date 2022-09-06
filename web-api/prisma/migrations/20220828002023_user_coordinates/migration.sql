-- CreateTable
CREATE TABLE "Coordinates" (
    "id" TEXT NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Coordinates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Coordinates" ADD CONSTRAINT "Coordinates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
