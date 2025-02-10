import { IsEmail, IsNotEmpty, IsOptional, IsString, IsInt, Min, MinLength,IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() surname: string;
  @IsEmail()  @IsNotEmpty() email: string;
  @IsString() @IsNotEmpty() @MinLength(6) password: string;
  @IsString()  phone: string;
  @IsInt()    @IsNotEmpty() @Min(0) age: number;
  @IsString()  country: string;
  @IsString()  district: string;
  @IsString() @IsOptional() @IsIn(['admin', 'user']) role: string = 'user';
}
