import { LecturerService } from '../../../src/application/services/LecturerService';
import { LecturerRepository } from '../../../src/infrastructure/repositories/LecturerRepository';
import { Rank, TeachingStyle } from '../../../src/domain/enums';
import { PrismaClient } from '@prisma/client';

// Mock the repository
jest.mock('../../../src/infrastructure/repositories/LecturerRepository');

describe('LecturerService', () => {
  let lecturerService: LecturerService;
  let mockRepository: jest.Mocked<LecturerRepository>;

  const mockLecturerData = {
    id: 1,
    staffId: 'LEC001',
    name: 'Dr. Test Lecturer',
    email: 'test@university.edu',
    rank: Rank.PROFESSOR,
    specialization: ['Computer Science', 'AI'],
    teachingStyle: TeachingStyle.MIXED_METHOD,
    yearsOfExperience: 10,
    maxHours: 18,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const validInputData = {
    staffId: 'LEC001',
    name: 'Dr. Test Lecturer',
    email: 'test@university.edu',
    rank: Rank.PROFESSOR,
    specialization: ['Computer Science', 'AI'],
    teachingStyle: TeachingStyle.MIXED_METHOD,
    yearsOfExperience: 10,
    maxHours: 18,
  };

  beforeEach(() => {
    const prisma = new PrismaClient();
    mockRepository = new LecturerRepository(prisma) as jest.Mocked<LecturerRepository>;
    lecturerService = new LecturerService(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createLecturer', () => {
    it('should create a lecturer successfully', async () => {
      // Arrange
      mockRepository.findByStaffId.mockResolvedValue(null);
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(mockLecturerData as any);

      // Act
      const result = await lecturerService.createLecturer(validInputData);

      // Assert
      expect(result).toBeDefined();
      expect(result.name).toBe('Dr. Test Lecturer');
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw error if staff ID already exists', async () => {
      // Arrange
      mockRepository.findByStaffId.mockResolvedValue(mockLecturerData as any);

      // Act & Assert
      await expect(lecturerService.createLecturer(validInputData)).rejects.toThrow(
        'Lecturer with staff ID LEC001 already exists'
      );
    });

    it('should throw error if email already exists', async () => {
      // Arrange
      mockRepository.findByStaffId.mockResolvedValue(null);
      mockRepository.findByEmail.mockResolvedValue(mockLecturerData as any);

      // Act & Assert
      await expect(lecturerService.createLecturer(validInputData)).rejects.toThrow(
        'Lecturer with email test@university.edu already exists'
      );
    });
  });

  describe('getLecturer', () => {
    it('should return lecturer by ID', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(mockLecturerData as any);

      // Act
      const result = await lecturerService.getLecturer(1);

      // Assert
      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should return null if lecturer not found', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(null);

      // Act
      const result = await lecturerService.getLecturer(999);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('updateLecturer', () => {
    it('should update lecturer successfully', async () => {
      // Arrange
      const updateData = { name: 'Updated Name' };
      const updatedLecturer = { ...mockLecturerData, name: 'Updated Name' };
      
      mockRepository.findById.mockResolvedValue(mockLecturerData as any);
      mockRepository.update.mockResolvedValue(updatedLecturer as any);

      // Act
      const result = await lecturerService.updateLecturer(1, updateData);

      // Assert
      expect(result.name).toBe('Updated Name');
      expect(mockRepository.update).toHaveBeenCalledWith(1, updateData);
    });
  });

  describe('deleteLecturer', () => {
    it('should delete lecturer successfully', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(mockLecturerData as any);
      mockRepository.delete.mockResolvedValue();

      // Act
      await lecturerService.deleteLecturer(1);

      // Assert
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw error if lecturer not found', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(lecturerService.deleteLecturer(999)).rejects.toThrow(
        'Lecturer with ID 999 not found'
      );
    });
  });
});