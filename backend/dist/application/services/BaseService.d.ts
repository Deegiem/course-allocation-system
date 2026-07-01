export declare abstract class BaseService {
    protected validateRequiredFields(data: any, requiredFields: string[]): void;
    protected handleError(error: any): Promise<never>;
}
