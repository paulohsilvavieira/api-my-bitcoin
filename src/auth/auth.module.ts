import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SignInProtocol } from './protocols/usecases';
import { SignInUsecase } from './usecases';
import { AuthenticationEntity } from '@entities/AuthenticationEntity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IVerifyAuthRepo } from './protocols/repository';
import { AuthenticationRepository } from './repositories';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: IVerifyAuthRepo,
      useClass: AuthenticationRepository,
    },
    {
      provide: SignInProtocol,
      useClass: SignInUsecase,
    },
  ],
  imports: [TypeOrmModule.forFeature([AuthenticationEntity])],
})
export class AuthModule {}
