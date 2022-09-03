import { Controller, Get, Logger, Param, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SmartContractsService } from "./smart_contracts.service";

@Controller("smart-contracts")
@ApiTags("Smart Contracts")
export class SmartContractsController {
  constructor(private readonly smartContractsService: SmartContractsService) {}

  @Post("create")
  createTokenization(
    @Query("effectiveOwner") effectiveOwner: string,
    @Query("assetAddress") assetAddress: string,
    @Query("assetUsableArea") assetUsableArea: number,
    @Query("assetId") assetId: number,
  ): Promise<string> {
    return this.smartContractsService.createTokenization(
      effectiveOwner,
      assetAddress,
      assetUsableArea,
      assetId,
    );
  }

  @Get("methods")
  testMethods() {
    return this.smartContractsService.testMethods();
  }
}
