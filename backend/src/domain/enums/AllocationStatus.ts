export enum AllocationStatus {
  PENDING = 'PENDING',
  AUTO_ALLOCATED = 'AUTO_ALLOCATED',
  OVERRIDDEN = 'OVERRIDDEN',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export const AllocationStatusLabels: Record<AllocationStatus, string> = {
  [AllocationStatus.PENDING]: 'Pending',
  [AllocationStatus.AUTO_ALLOCATED]: 'Auto Allocated',
  [AllocationStatus.OVERRIDDEN]: 'Overridden',
  [AllocationStatus.APPROVED]: 'Approved',
  [AllocationStatus.REJECTED]: 'Rejected'
};