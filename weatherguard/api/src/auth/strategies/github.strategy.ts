import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID') || 'placeholder_client_id',
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET') || 'placeholder_secret',
      callbackURL: 'http://localhost:3000/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
    const { id, displayName, username, emails, photos, provider } = profile;
    
    let email = '';
    if (emails && emails.length > 0) {
      email = emails[0].value;
    }

    const user = {
      providerId: id,
      provider: provider,
      email: email,
      name: displayName || username,
      avatar: photos && photos.length > 0 ? photos[0].value : '',
    };
    done(null, user);
  }
}
