import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get('live') @ApiOkResponse({ schema: { example: { status: 'ok' } } }) live() { return { status: 'ok' as const }; }
  @Get('ready') @ApiOkResponse({ schema: { example: { status: 'ready' } } }) ready() { return { status: 'ready' as const }; }
}
