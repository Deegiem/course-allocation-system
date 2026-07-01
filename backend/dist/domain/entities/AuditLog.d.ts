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
export declare class AuditLog implements IAuditLog {
    id: number;
    actionType: string;
    entity: string;
    entityId: number;
    timestamp: Date;
    payload?: any | undefined;
    lecturerId?: number | undefined;
    courseId?: number | undefined;
    allocationId?: number | undefined;
    constructor(id: number, actionType: string, entity: string, entityId: number, timestamp?: Date, payload?: any | undefined, lecturerId?: number | undefined, courseId?: number | undefined, allocationId?: number | undefined);
    static createLecturerAction(action: string, lecturerId: number, payload?: any): AuditLog;
    static createCourseAction(action: string, courseId: number, payload?: any): AuditLog;
    static createAllocationAction(action: string, allocationId: number, lecturerId: number, courseId: number, payload?: any): AuditLog;
}
