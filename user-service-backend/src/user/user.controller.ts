import { Controller, Get, Post, Body, Param, Query, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('search') search?: string,
  ) {
    return this.userService.getUsers(Number(page), Number(pageSize), search);
  }

  @Get(':id')
  async getUser(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Post('save')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createUser(@Body() userData: CreateUserDto) {
    return this.userService.createUser(userData);
  }

  @Put('update/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateUser(@Param('id') id: number, @Body() userData: UpdateUserDto) {
    return this.userService.updateUser(Number(id), userData);
  }

  
}
