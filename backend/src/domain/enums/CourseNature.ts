export enum CourseNature {
  THEORY_ONLY = 'THEORY_ONLY',
  THEORY_AND_PRACTICAL = 'THEORY_AND_PRACTICAL',
  PRACTICAL_ONLY = 'PRACTICAL_ONLY'
}

export const CourseNatureLabels: Record<CourseNature, string> = {
  [CourseNature.THEORY_ONLY]: 'Theory Only',
  [CourseNature.THEORY_AND_PRACTICAL]: 'Theory & Practical',
  [CourseNature.PRACTICAL_ONLY]: 'Practical Only'
};