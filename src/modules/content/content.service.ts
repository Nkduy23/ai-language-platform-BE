// content.service.ts — Blog CMS (SEO content, Phase 3)
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CreateBlogPostDto, UpdateBlogPostDto } from "./content.dto";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  // GET /content/blog — public, chỉ trả bài đã publish
  async listPublished(language?: string, page = 1, limit = 10) {
    const where = {
      isPublished: true,
      ...(language ? { language: language as any } : {}),
    };
    const [data, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          coverImage: true,
          language: true,
          authorName: true,
          publishedAt: true,
        },
      }),
      this.prisma.blogPost.count({ where }),
    ]);
    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  // GET /content/blog/:slug
  async getBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (!post || !post.isPublished) throw new NotFoundException("Không tìm thấy bài viết");
    return post;
  }

  // Admin: GET /content/blog/admin/all — lấy cả bài draft
  async listAll(page = 1, limit = 20) {
    const [data, total] = await Promise.all([this.prisma.blogPost.findMany({ orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }), this.prisma.blogPost.count()]);
    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  // POST /content/blog — admin only
  async create(dto: CreateBlogPostDto) {
    let slug = slugify(dto.title);
    const existing = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    return this.prisma.blogPost.create({
      data: {
        ...dto,
        slug,
        publishedAt: dto.isPublished ? new Date() : null,
      },
    });
  }

  // PATCH /content/blog/:id — admin only
  async update(id: string, dto: UpdateBlogPostDto) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException("Không tìm thấy bài viết");

    const wasPublished = post.isPublished;
    const willPublish = dto.isPublished ?? wasPublished;

    return this.prisma.blogPost.update({
      where: { id },
      data: {
        ...dto,
        publishedAt: !wasPublished && willPublish ? new Date() : post.publishedAt,
      },
    });
  }
}
