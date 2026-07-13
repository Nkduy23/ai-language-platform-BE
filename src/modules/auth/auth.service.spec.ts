// auth.service.spec.ts — Unit test cho logic đăng ký/đăng nhập (mock Prisma/Jwt, không cần DB thật)
import { Test } from '@nestjs/testing'
import { ConflictException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { AuthService } from './auth.service'
import { PrismaService } from '../../database/prisma.service'
import { EmailService } from '../../common/email/email.service'

describe('AuthService', () => {
  let service: AuthService
  let prisma: any

  const mockPrisma = {
    user: { findUnique: jest.fn(), create: jest.fn() },
    userProfile: { update: jest.fn() },
    $transaction: jest.fn((cb: any) => cb(mockPrisma)),
  }

  const mockJwtService = { signAsync: jest.fn().mockResolvedValue('fake.jwt.token') }
  const mockConfigService = { get: jest.fn().mockReturnValue('fake-secret') }
  const mockEmailService = { sendWelcomeEmail: jest.fn().mockResolvedValue(undefined) }

  beforeEach(async () => {
    jest.clearAllMocks()
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile()

    service = module.get(AuthService)
    prisma = mockPrisma
  })

  describe('register', () => {
    it('nên throw ConflictException nếu email đã tồn tại', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'existing-user' })

      await expect(
        service.register({ email: 'test@test.com', password: '123456', displayName: 'Test' }),
      ).rejects.toThrow(ConflictException)
    })

    it('nên tạo user mới + gửi welcome email khi email chưa tồn tại', async () => {
      prisma.user.findUnique.mockResolvedValue(null)
      prisma.user.create.mockResolvedValue({
        id: 'new-user-id',
        email: 'new@test.com',
        role: 'USER',
        profile: { displayName: 'New User', avatarUrl: null },
      })

      const result = await service.register({ email: 'new@test.com', password: '123456', displayName: 'New User' })

      expect(result.user.email).toBe('new@test.com')
      expect(result.accessToken).toBe('fake.jwt.token')
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith('new@test.com', 'New User')
    })
  })

  describe('login', () => {
    it('nên throw UnauthorizedException nếu email không tồn tại', async () => {
      prisma.user.findUnique.mockResolvedValue(null)

      await expect(service.login({ email: 'notfound@test.com', password: '123456' })).rejects.toThrow(
        UnauthorizedException,
      )
    })

    it('nên throw UnauthorizedException nếu tài khoản bị khoá (isActive=false)', async () => {
      const passwordHash = await bcrypt.hash('123456', 12)
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        passwordHash,
        isActive: false,
        role: 'USER',
        profile: { displayName: 'Test' },
      })

      await expect(service.login({ email: 'test@test.com', password: '123456' })).rejects.toThrow(
        UnauthorizedException,
      )
    })

    it('nên throw UnauthorizedException nếu sai mật khẩu', async () => {
      const passwordHash = await bcrypt.hash('correct-password', 12)
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        passwordHash,
        isActive: true,
        role: 'USER',
        profile: { displayName: 'Test' },
      })

      await expect(service.login({ email: 'test@test.com', password: 'wrong-password' })).rejects.toThrow(
        UnauthorizedException,
      )
    })

    it('nên login thành công và trả về token khi đúng thông tin', async () => {
      const passwordHash = await bcrypt.hash('123456', 12)
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        passwordHash,
        isActive: true,
        role: 'USER',
        profile: { displayName: 'Test User', avatarUrl: null },
      })
      prisma.userProfile.update.mockResolvedValue({})

      const result = await service.login({ email: 'test@test.com', password: '123456' })

      expect(result.accessToken).toBe('fake.jwt.token')
      expect(result.user.displayName).toBe('Test User')
      expect(prisma.userProfile.update).toHaveBeenCalled() // cập nhật lastActiveAt
    })
  })
})
