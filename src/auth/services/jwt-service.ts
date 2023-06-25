import { JwtProtocol } from '@auth/protocols/cryptography';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JsonWebTokenService implements JwtProtocol {
  constructor(private jwtService: JwtService) {}

  async createToken(payload: any): Promise<{ token: string }> {
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }
  async verifyToken(
    token: string,
  ): Promise<{ isValid: boolean; payload: any }> {
    try {
      const validated = await this.jwtService.verifyAsync(token);
      return {
        isValid: true,
        payload: validated,
      };
    } catch (error) {
      return {
        isValid: false,
        payload: undefined,
      };
    }
  }
}