// users.service.spec.ts — Unit test cho logic tính streak (touchDailyActivity)
import { Test } from '@nestjs/testing'
import { UsersService } from './users.service'
import { PrismaService } from '../../database/prisma.service'
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service'

describe('UsersService', () => {
  let service: UsersService
  let prisma: any

  const mockPrisma = {
    userProfile: { findUnique: jest.fn(), update: jest.fn() },
  }
  const mockCloudinary = { uploadImage: jest.fn(), deleteImage: jest.fn() }

  beforeEach(async () => {
    jest.clearAllMocks()
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CloudinaryService, useValue: mockCloudinary },
      ],
    }).compile()
    service = module.get(UsersService)
    prisma = mockPrisma
  })

  describe('touchDailyActivity', () => {
    it('streak = 1 nếu đây là lần hoạt động đầu tiên (lastActiveAt = null)', async () => {
      prisma.userProfile.findUnique.mockResolvedValue({ userId: 'u1', streakDays: 0, lastActiveAt: null })
      prisma.userProfile.update.mockResolvedValue({})

      await service.touchDailyActivity('u1', 10)

      expect(prisma.userProfile.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ streakDays: 1 }) }),
      )
    })

    it('streak +1 nếu hoạt động gần nhất là hôm qua (cách đúng 1 ngày)', async () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      prisma.userProfile.findUnique.mockResolvedValue({ userId: 'u1', streakDays: 5, lastActiveAt: yesterday })
      prisma.userProfile.update.mockResolvedValue({})

      await service.touchDailyActivity('u1', 10)

      expect(prisma.userProfile.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ streakDays: 6 }) }),
      )
    })

    it('streak reset về 1 nếu bỏ lỡ hơn 1 ngày', async () => {
      const threeDaysAgo = new Date()
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
      prisma.userProfile.findUnique.mockResolvedValue({ userId: 'u1', streakDays: 10, lastActiveAt: threeDaysAgo })
      prisma.userProfile.update.mockResolvedValue({})

      await service.touchDailyActivity('u1', 10)

      expect(prisma.userProfile.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ streakDays: 1 }) }),
      )
    })

    it('streak giữ nguyên nếu đã hoạt động trong cùng ngày hôm nay', async () => {
      const today = new Date() // cùng thời điểm gọi hàm → daysDiff = 0
      prisma.userProfile.findUnique.mockResolvedValue({ userId: 'u1', streakDays: 7, lastActiveAt: today })
      prisma.userProfile.update.mockResolvedValue({})

      await service.touchDailyActivity('u1', 10)

      expect(prisma.userProfile.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ streakDays: 7 }) }),
      )
    })

    it('không làm gì nếu không tìm thấy profile', async () => {
      prisma.userProfile.findUnique.mockResolvedValue(null)

      await service.touchDailyActivity('u1', 10)

      expect(prisma.userProfile.update).not.toHaveBeenCalled()
    })
  })
})
