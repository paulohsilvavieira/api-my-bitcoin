import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RegisterAuthProtocol, SignInProtocol } from './protocols/usecases';
import { SignInUsecase } from './usecases';
import { AuthenticationEntity } from '@entities/AuthenticationEntity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthRepoProtocol } from './protocols/repository';
import { AuthenticationRepository } from './repositories';
import { BcryptProtocol, JwtProtocol } from './protocols/cryptography';
import { BcryptService } from './services/bcrypt-service';
import { RegisterAuthUsecase } from './usecases/';
import { JsonWebTokenService } from './services/jwt-service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthenticationEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get('SECRET_JWT'),
          signOptions: { expiresIn: '300s' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthRepoProtocol,
      useClass: AuthenticationRepository,
    },
    {
      provide: BcryptProtocol,
      useFactory: () => new BcryptService(10),
    },
    {
      provide: JwtProtocol,
      useClass: JsonWebTokenService,
    },
    {
      provide: SignInProtocol,
      useClass: SignInUsecase,
    },
    {
      provide: RegisterAuthProtocol,
      useClass: RegisterAuthUsecase,
    },
  ],

  exports: [
    BcryptProtocol,
    SignInProtocol,
    JwtProtocol,
    RegisterAuthProtocol,
    AuthRepoProtocol,
  ],
})
export class AuthModule {}
