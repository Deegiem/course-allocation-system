export interface IAuditLog {
  id: number;
  actionType: string;
  entity: string;
  entityId: number;
  payload?: any;
  timestamp: Date;
  lecturerId?: number;
  courseId?: number;
  allocationId?: number;
}

export class AuditLog implements IAuditLog {
  constructor(
    public id: number,
    public actionType: string,
    public entity: string,
    public entityId: number,
    public timestamp: Date = new Date(),
    public payload?: any,
    public lecturerId?: number,
    public courseId?: number,
    public allocationId?: number
  ) {}

  static createLecturerAction(
    action: string,
    lecturerId: number,
    payload?: any
  ): AuditLog {
    return new AuditLog(
      0,
      action,
      'Lecturer',
      lecturerId,
      new Date(),
      payload,
      lecturerId
    );
  }

  static createCourseAction(
    action: string,
    courseId: number,
    payload?: any
  ): AuditLog {
    return new AuditLog(
      0,
      action,
      'Course',
      courseId,
      new Date(),
      payload,
      undefined,
      courseId
    );
  }

  static createAllocationAction(
    action: string,
    allocationId: number,
    lecturerId: number,
    courseId: number,
    payload?: any
  ): AuditLog {
    return new AuditLog(
      0,
      action,
      'Allocation',
      allocationId,
      new Date(),
      payload,
      lecturerId,
      courseId,
      allocationId
    );
  }
}