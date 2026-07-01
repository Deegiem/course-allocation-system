export enum Rank {
  PROFESSOR = 'PROFESSOR',
  READER = 'READER',
  SENIOR_LECTURER = 'SENIOR_LECTURER',
  LECTURER_I = 'LECTURER_I',
  LECTURER_II = 'LECTURER_II',
  ASSISTANT_LECTURER = 'ASSISTANT_LECTURER',
  GRADUATE_ASSISTANT = 'GRADUATE_ASSISTANT',
  ADJUNCT_LECTURER = 'ADJUNCT_LECTURER',
  VISITING_LECTURER = 'VISITING_LECTURER'
}

export const RankLabels: Record<Rank, string> = {
  [Rank.PROFESSOR]: 'Professor',
  [Rank.READER]: 'Reader',
  [Rank.SENIOR_LECTURER]: 'Senior Lecturer',
  [Rank.LECTURER_I]: 'Lecturer I',
  [Rank.LECTURER_II]: 'Lecturer II',
  [Rank.ASSISTANT_LECTURER]: 'Assistant Lecturer',
  [Rank.GRADUATE_ASSISTANT]: 'Graduate Assistant',
  [Rank.ADJUNCT_LECTURER]: 'Adjunct Lecturer',
  [Rank.VISITING_LECTURER]: 'Visiting Lecturer'
};

export const RankWeight: Record<Rank, number> = {
  [Rank.PROFESSOR]: 10,
  [Rank.READER]: 9,
  [Rank.SENIOR_LECTURER]: 8,
  [Rank.LECTURER_I]: 7,
  [Rank.LECTURER_II]: 6,
  [Rank.ASSISTANT_LECTURER]: 5,
  [Rank.GRADUATE_ASSISTANT]: 4,
  [Rank.ADJUNCT_LECTURER]: 3,
  [Rank.VISITING_LECTURER]: 2
};