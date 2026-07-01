-- CreateEnum
CREATE TYPE "Rank" AS ENUM ('PROFESSOR', 'READER', 'SENIOR_LECTURER', 'LECTURER_I', 'LECTURER_II', 'ASSISTANT_LECTURER', 'GRADUATE_ASSISTANT', 'ADJUNCT_LECTURER', 'VISITING_LECTURER');

-- CreateEnum
CREATE TYPE "TeachingStyle" AS ENUM ('LECTURE_BASED', 'PRACTICAL_BASED', 'MIXED_METHOD', 'RESEARCH_ORIENTED', 'STUDENT_CENTRIC');

-- CreateEnum
CREATE TYPE "CourseNature" AS ENUM ('THEORY_ONLY', 'THEORY_AND_PRACTICAL', 'PRACTICAL_ONLY');

-- CreateEnum
CREATE TYPE "AllocationStatus" AS ENUM ('PENDING', 'AUTO_ALLOCATED', 'OVERRIDDEN', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "OverrideAction" AS ENUM ('FORCE_ASSIGN', 'REJECT', 'MODIFY');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('ALLOCATION_REPORT', 'WORKLOAD_SUMMARY', 'LEVEL_BASED_LIST');

-- CreateTable
CREATE TABLE "lecturers" (
    "id" SERIAL NOT NULL,
    "staffId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "teachingStyle" TEXT NOT NULL,
    "yearsOfExperience" INTEGER NOT NULL,
    "maxHours" INTEGER NOT NULL DEFAULT 18,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lecturers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "units" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "nature" TEXT NOT NULL,
    "lectureHours" INTEGER NOT NULL,
    "practicalHours" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "allocations" (
    "id" SERIAL NOT NULL,
    "lecturerId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "score" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "overrideReason" TEXT,
    "assignedBy" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policies" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "actionType" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL,
    "payload" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lecturerId" INTEGER,
    "courseId" INTEGER,
    "allocationId" INTEGER,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" SERIAL NOT NULL,
    "generatedBy" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reportType" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "filePath" TEXT,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lecturers_staffId_key" ON "lecturers"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "lecturers_email_key" ON "lecturers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "courses_code_key" ON "courses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "allocations_lecturerId_courseId_key" ON "allocations"("lecturerId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "policies_key_key" ON "policies"("key");

-- AddForeignKey
ALTER TABLE "allocations" ADD CONSTRAINT "allocations_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "lecturers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allocations" ADD CONSTRAINT "allocations_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
