export enum TeachingStyle {
  LECTURE_BASED = 'LECTURE_BASED',
  PRACTICAL_BASED = 'PRACTICAL_BASED',
  MIXED_METHOD = 'MIXED_METHOD',
  RESEARCH_ORIENTED = 'RESEARCH_ORIENTED',
  STUDENT_CENTRIC = 'STUDENT_CENTRIC'
}

export const TeachingStyleLabels: Record<TeachingStyle, string> = {
  [TeachingStyle.LECTURE_BASED]: 'Lecture Based',
  [TeachingStyle.PRACTICAL_BASED]: 'Practical Based',
  [TeachingStyle.MIXED_METHOD]: 'Mixed Method',
  [TeachingStyle.RESEARCH_ORIENTED]: 'Research Oriented',
  [TeachingStyle.STUDENT_CENTRIC]: 'Student Centric'
};