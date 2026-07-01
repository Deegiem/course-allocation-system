export enum OverrideAction {
  FORCE_ASSIGN = 'FORCE_ASSIGN',
  REJECT = 'REJECT',
  MODIFY = 'MODIFY'
}

export const OverrideActionLabels: Record<OverrideAction, string> = {
  [OverrideAction.FORCE_ASSIGN]: 'Force Assign',
  [OverrideAction.REJECT]: 'Reject',
  [OverrideAction.MODIFY]: 'Modify'
};