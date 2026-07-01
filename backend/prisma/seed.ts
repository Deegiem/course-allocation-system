import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default policies - using string values
  const policies = [
    {
      key: 'maxWeeklyHours',
      value: JSON.stringify(18),
      description: 'Maximum weekly workload hours per lecturer'
    },
    {
      key: 'allowOverride',
      value: JSON.stringify(true),
      description: 'Allow administrators to override allocations'
    },
    {
      key: 'specializationStrictMode',
      value: JSON.stringify(true),
      description: 'Enforce specialization matching for allocations'
    },
    {
      key: 'autoAllocationEnabled',
      value: JSON.stringify(true),
      description: 'Enable automatic allocation feature'
    },
    {
      key: 'weights',
      value: JSON.stringify({
        expertise: 0.40,
        experience: 0.20,
        workload: 0.25,
        preference: 0.10,
        performance: 0.05
      }),
      description: 'Scoring weights for allocation algorithm'
    }
  ];

  for (const policy of policies) {
    await prisma.policy.upsert({
      where: { key: policy.key },
      update: {
        value: policy.value,
        description: policy.description
      },
      create: {
        key: policy.key,
        value: policy.value,
        description: policy.description
      },
    });
  }

  // Create sample lecturers - using strings instead of enums and arrays
  const lecturers = [
    {
      staffId: 'LEC001',
      name: 'Dr. Adebayo Ogunleye',
      email: 'a.ogunleye@university.edu',
      rank: 'PROFESSOR',
      specialization: 'Computer Science,Artificial Intelligence,Machine Learning',
      teachingStyle: 'MIXED_METHOD',
      yearsOfExperience: 20,
      maxHours: 18,
    },
    {
      staffId: 'LEC002',
      name: 'Dr. Funke Adeyemi',
      email: 'f.adeyemi@university.edu',
      rank: 'SENIOR_LECTURER',
      specialization: 'Data Science,Statistics,Mathematics',
      teachingStyle: 'LECTURE_BASED',
      yearsOfExperience: 12,
      maxHours: 18,
    },
    {
      staffId: 'LEC003',
      name: 'Dr. Chidi Okonkwo',
      email: 'c.okonkwo@university.edu',
      rank: 'LECTURER_I',
      specialization: 'Software Engineering,Database Systems,Web Development',
      teachingStyle: 'PRACTICAL_BASED',
      yearsOfExperience: 8,
      maxHours: 18,
    },
    {
      staffId: 'LEC004',
      name: 'Dr. Ngozi Eze',
      email: 'n.eze@university.edu',
      rank: 'LECTURER_II',
      specialization: 'Computer Networks,Cybersecurity,Information Security',
      teachingStyle: 'RESEARCH_ORIENTED',
      yearsOfExperience: 5,
      maxHours: 18,
    },
    {
      staffId: 'LEC005',
      name: 'Dr. Olumide Johnson',
      email: 'o.johnson@university.edu',
      rank: 'ASSISTANT_LECTURER',
      specialization: 'Human-Computer Interaction,UI/UX Design',
      teachingStyle: 'STUDENT_CENTRIC',
      yearsOfExperience: 3,
      maxHours: 18,
    }
  ];

  for (const lecturer of lecturers) {
    await prisma.lecturer.upsert({
      where: { staffId: lecturer.staffId },
      update: lecturer,
      create: lecturer,
    });
  }

  // Create sample courses - using strings instead of enums
  const courses = [
    {
      code: 'CSC401',
      title: 'Software Engineering',
      units: 3,
      level: 400,
      nature: 'THEORY_AND_PRACTICAL',
      lectureHours: 2,
      practicalHours: 2,
    },
    {
      code: 'CSC402',
      title: 'Database Management Systems',
      units: 3,
      level: 400,
      nature: 'THEORY_AND_PRACTICAL',
      lectureHours: 2,
      practicalHours: 2,
    },
    {
      code: 'CSC403',
      title: 'Artificial Intelligence Fundamentals',
      units: 3,
      level: 400,
      nature: 'THEORY_ONLY',
      lectureHours: 3,
      practicalHours: 0,
    },
    {
      code: 'CSC404',
      title: 'Computer Networks and Security',
      units: 3,
      level: 400,
      nature: 'THEORY_AND_PRACTICAL',
      lectureHours: 2,
      practicalHours: 2,
    },
    {
      code: 'CSC405',
      title: 'Data Science and Analytics',
      units: 3,
      level: 500,
      nature: 'THEORY_AND_PRACTICAL',
      lectureHours: 2,
      practicalHours: 2,
    },
    {
      code: 'CSC406',
      title: 'Web Application Development',
      units: 3,
      level: 500,
      nature: 'PRACTICAL_ONLY',
      lectureHours: 0,
      practicalHours: 4,
    },
    {
      code: 'CSC407',
      title: 'Cybersecurity Principles',
      units: 3,
      level: 500,
      nature: 'THEORY_ONLY',
      lectureHours: 3,
      practicalHours: 0,
    },
    {
      code: 'CSC408',
      title: 'Machine Learning',
      units: 3,
      level: 500,
      nature: 'THEORY_AND_PRACTICAL',
      lectureHours: 2,
      practicalHours: 2,
    }
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { code: course.code },
      update: course,
      create: course,
    });
  }

  console.log('✅ Seeding completed successfully!');
  console.log(`📊 Created ${lecturers.length} lecturers and ${courses.length} courses`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });