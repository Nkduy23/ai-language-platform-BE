// common/cloudinary/cloudinary.service.ts — Upload ảnh (avatar, flashcard, blog cover) lên Cloudinary
import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v2 as cloudinary } from 'cloudinary'

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name)
  private configured = false

  constructor(private readonly configService: ConfigService) {
    const cloudName = this.configService.get<string>('cloudinary.cloudName')
    const apiKey = this.configService.get<string>('cloudinary.apiKey')
    const apiSecret = this.configService.get<string>('cloudinary.apiSecret')

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret })
      this.configured = true
    } else {
      this.logger.warn('Cloudinary chưa được cấu hình — upload ảnh sẽ báo lỗi cho tới khi điền CLOUDINARY_* vào .env')
    }
  }

  // folder: "avatars" | "flashcards" | "blog" — tự phân loại theo mục đích dùng
  async uploadImage(buffer: Buffer, folder: string): Promise<string> {
    if (!this.configured) {
      throw new BadRequestException('Upload ảnh chưa khả dụng — server chưa cấu hình Cloudinary')
    }

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: `ai-language-platform/${folder}`, resource_type: 'image', transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
        (error, result) => {
          if (error || !result) return reject(error)
          resolve(result.secure_url)
        },
      )
      stream.end(buffer)
    })
  }

  async deleteImage(publicUrl: string) {
    if (!this.configured) return
    try {
      const publicId = this.extractPublicId(publicUrl)
      if (publicId) await cloudinary.uploader.destroy(publicId)
    } catch (err) {
      this.logger.warn(`Xoá ảnh Cloudinary thất bại: ${(err as Error).message}`)
    }
  }

  private extractPublicId(url: string): string | null {
    // vd: https://res.cloudinary.com/xxx/image/upload/v123/ai-language-platform/avatars/abc.jpg
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/)
    return match ? match[1] : null
  }
}
