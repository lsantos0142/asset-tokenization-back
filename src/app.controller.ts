import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";

@Controller({
    path: "/api",
    version: "1.0",
})
@ApiTags("Base Routes")
export class AppController {
    constructor(private readonly appService: AppService) {}
}
