// roadmap.controller.ts — Placement test, recommendations, leaderboard, badges
import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { RoadmapService } from "./roadmap.service";
import { StartPlacementTestDto, SubmitPlacementTestDto } from "./roadmap.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("roadmap")
@UseGuards(JwtAuthGuard)
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Post("placement-test/start")
  startPlacementTest(@Body() dto: StartPlacementTestDto) {
    return this.roadmapService.startPlacementTest(dto);
  }

  @Post("placement-test/submit")
  submitPlacementTest(@CurrentUser("id") userId: string, @Body() dto: SubmitPlacementTestDto) {
    return this.roadmapService.submitPlacementTest(userId, dto);
  }

  @Get("recommendations")
  getRecommendations(@CurrentUser("id") userId: string) {
    return this.roadmapService.getRecommendations(userId);
  }

  @Get("leaderboard")
  getLeaderboard(@Query("limit") limit?: string) {
    return this.roadmapService.getLeaderboard(limit ? parseInt(limit, 10) : 10);
  }

  @Get("badges")
  getBadges(@CurrentUser("id") userId: string) {
    return this.roadmapService.getBadges(userId);
  }
}
