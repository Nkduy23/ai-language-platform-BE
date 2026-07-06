import { Module } from "@nestjs/common";
import { ContentService } from "./content.service";
import { ContentController } from "./content.controller";
import { RolesGuard } from "../../common/guards/roles.guard";

@Module({
  controllers: [ContentController],
  providers: [ContentService, RolesGuard],
  exports: [ContentService],
})
export class ContentModule {}
