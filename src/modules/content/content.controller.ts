// content.controller.ts — Blog public routes + admin CMS routes
import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ContentService } from "./content.service";
import { CreateBlogPostDto, UpdateBlogPostDto } from "./content.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("content")
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  // GET /content/blog — public
  @Get("blog")
  listPublished(@Query("language") language?: string, @Query("page") page?: string, @Query("limit") limit?: string) {
    return this.contentService.listPublished(language, page ? +page : 1, limit ? +limit : 10);
  }

  // GET /content/blog/admin/all — admin, đặt trước :slug để không bị nuốt route
  @Get("blog/admin/all")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  listAll(@Query("page") page?: string, @Query("limit") limit?: string) {
    return this.contentService.listAll(page ? +page : 1, limit ? +limit : 20);
  }

  // GET /content/blog/:slug — public
  @Get("blog/:slug")
  getBySlug(@Param("slug") slug: string) {
    return this.contentService.getBySlug(slug);
  }

  // POST /content/blog — admin only
  @Post("blog")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  create(@Body() dto: CreateBlogPostDto) {
    return this.contentService.create(dto);
  }

  // PATCH /content/blog/:id — admin only
  @Patch("blog/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  update(@Param("id") id: string, @Body() dto: UpdateBlogPostDto) {
    return this.contentService.update(id, dto);
  }
}
