export enum ReportType {
  ALLOCATION_REPORT = 'ALLOCATION_REPORT',
  WORKLOAD_SUMMARY = 'WORKLOAD_SUMMARY',
  LEVEL_BASED_LIST = 'LEVEL_BASED_LIST'
}

export const ReportTypeLabels: Record<ReportType, string> = {
  [ReportType.ALLOCATION_REPORT]: 'Allocation Report',
  [ReportType.WORKLOAD_SUMMARY]: 'Workload Summary',
  [ReportType.LEVEL_BASED_LIST]: 'Level Based List'
};