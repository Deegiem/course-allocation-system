export abstract class BaseService {
  protected validateRequiredFields(data: any, requiredFields: string[]): void {
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }

  protected async handleError(error: any): Promise<never> {
    console.error('Service Error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}