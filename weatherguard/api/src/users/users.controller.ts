import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { RequestStatusDto } from './dto/request-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: any) {
    const userId = req.user._id ? req.user._id.toString() : (req.user.id || req.user.sub);
    return this.usersService.findOne(userId);
  }

  @Get('request-status')
  @UseGuards(JwtAuthGuard)
  async getRequestStatus(@Req() req: any): Promise<RequestStatusDto> {
    const userId = req.user._id ? req.user._id.toString() : (req.user.id || req.user.sub);
    const user = await this.usersService.findOne(userId);
    return { status: user.status };
  }

  @Patch('preferences')
  @UseGuards(JwtAuthGuard)
  async updatePreferences(@Req() req: any, @Body() updatePreferencesDto: UpdatePreferencesDto) {
    const userId = req.user._id ? req.user._id.toString() : (req.user.id || req.user.sub);
    return this.usersService.updatePreferences(userId, updatePreferencesDto);
  }

  @Post('me/telegram/token')
  @UseGuards(JwtAuthGuard)
  async generateTelegramToken(@Req() req: any) {
    const userId = req.user._id ? req.user._id.toString() : (req.user.id || req.user.sub);
    return this.usersService.generateTelegramToken(userId);
  }

  @Delete('me/telegram')
  @UseGuards(JwtAuthGuard)
  async disconnectTelegram(@Req() req: any) {
    const userId = req.user._id ? req.user._id.toString() : (req.user.id || req.user.sub);
    return this.usersService.disconnectTelegram(userId);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
