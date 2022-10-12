import { Module } from "@nestjs/common";
import { CollateralService } from "./collateral.service";
import { CollateralController } from "./collateral.controller";

@Module({
    controllers: [CollateralController],
    providers: [CollateralService],
})
export class CollateralModule {}
