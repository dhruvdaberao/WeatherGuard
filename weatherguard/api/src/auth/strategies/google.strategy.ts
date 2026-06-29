import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    const backendUrl = configService.get<string>('BACKEND_URL') || 'http://localhost:3000';
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || 'placeholder_client_id',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || 'placeholder_secret',
      callbackURL: `${backendUrl}/api/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { id, name, emails, photos, provider } = profile;
    const user = {
      providerId: id,
      provider: provider,
      email: emails[0].value,
      name: name.givenName + ' ' + name.familyName,
      avatar: photos[0].value,
    };
    done(null, user);
  }
}
