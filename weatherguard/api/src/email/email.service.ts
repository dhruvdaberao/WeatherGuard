import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {}

  async sendApprovalEmail(userEmail: string, userName?: string): Promise<boolean> {
    const apiKey = this.configService.get<string>('BREVO_API_KEY');
    const senderEmail = this.configService.get<string>('BREVO_SENDER_EMAIL') || 'dumbotteroffical@gmail.com';

    if (!apiKey) {
      this.logger.warn(`BREVO_API_KEY is not configured in environment. Skipping approval email to ${userEmail}`);
      return false;
    }

    const loginUrl = 'https://weather-guard-two.vercel.app/login';
    const recipientName = userName || 'WeatherGuard User';

    // SVG Logo converted to base64 data URI for reliable display across all email clients
    const logoSvg = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48" style="display:inline-block; vertical-align:middle;">
      <defs>
        <linearGradient id="sunGrad" x1="42" y1="18" x2="82" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFDE4D" />
          <stop offset="100%" stopColor="#FFA800" />
        </linearGradient>
        <linearGradient id="cloudGrad" x1="15" y1="45" x2="85" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
      </defs>
      <g stroke="#ffffff" stroke-width="3.5" stroke-linecap="round">
        <line x1="62" y1="13" x2="62" y2="5" />
        <line x1="80" y1="20" x2="85.5" y2="14.5" />
        <line x1="87" y1="38" x2="95" y2="38" />
        <line x1="80" y1="56" x2="85.5" y2="61.5" />
        <line x1="44.5" y1="20.5" x2="39" y2="15" />
      </g>
      <circle cx="62" cy="38" r="20" fill="url(#sunGrad)" stroke="#ffffff" stroke-width="3.5" />
      <circle cx="55" cy="34" r="2.2" fill="#1e293b" />
      <circle cx="67" cy="34" r="2.2" fill="#1e293b" />
      <circle cx="49" cy="40" r="3" fill="#FB7185" />
      <circle cx="73" cy="40" r="3" fill="#FB7185" />
      <path d="M 57 40 Q 61 45 65 40" stroke="#1e293b" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <path d="M 28 78 C 10 78 8 58 24 54 C 26 36 54 36 60 52 C 76 52 82 68 70 78 Z" fill="url(#cloudGrad)" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round" />
      <path d="M 34 60 Q 37.5 55 41 60" stroke="#1e293b" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M 49 60 Q 52.5 55 56 60" stroke="#1e293b" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="29" cy="66" r="3.2" fill="#FB7185" />
      <circle cx="61" cy="66" r="3.2" fill="#FB7185" />
      <path d="M 42 65 Q 45 68.5 48 65" stroke="#1e293b" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Approved - WeatherGuard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0b0f19;
      color: #e2e8f0;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #0b0f19;
      padding: 40px 15px;
    }
    .card {
      max-width: 560px;
      margin: 0 auto;
      background-color: #111827;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #1f2937;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    .header {
      background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
      padding: 32px 30px;
      text-align: center;
      border-bottom: 1px solid #2563eb;
    }
    .brand-title {
      color: #ffffff;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.3px;
      margin: 14px 0 0 0;
      font-family: 'Poppins', sans-serif;
    }
    .body-content {
      padding: 40px 36px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      background-color: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      margin-bottom: 24px;
    }
    .greeting {
      color: #f8fafc;
      font-size: 22px;
      font-weight: 600;
      margin: 0 0 14px 0;
      letter-spacing: -0.4px;
    }
    .lead-text {
      color: #94a3b8;
      font-size: 14.5px;
      line-height: 1.65;
      margin: 0 0 28px 0;
    }
    .instructions-box {
      background-color: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
    }
    .box-header {
      display: flex;
      align-items: center;
      color: #e2e8f0;
      font-size: 13.5px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .step-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 14px;
    }
    .step-item:last-child {
      margin-bottom: 0;
    }
    .step-num {
      background-color: #1e293b;
      color: #38bdf8;
      width: 22px;
      height: 22px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      margin-right: 12px;
      flex-shrink: 0;
    }
    .step-desc {
      color: #cbd5e1;
      font-size: 13px;
      line-height: 1.5;
      margin: 0;
    }
    .btn-wrap {
      text-align: center;
      margin: 36px 0 24px 0;
    }
    .action-btn {
      background: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      padding: 15px 32px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 14.5px;
      display: inline-block;
      transition: background-color 0.2s;
    }
    .fallback-text {
      font-size: 12px;
      color: #64748b;
      text-align: center;
      line-height: 1.6;
      border-top: 1px solid #1f2937;
      padding-top: 24px;
      margin: 0;
    }
    .fallback-link {
      color: #60a5fa;
      word-break: break-all;
      text-decoration: none;
    }
    .footer {
      padding: 24px 36px;
      background-color: #0b0f19;
      text-align: center;
      font-size: 11.5px;
      color: #475569;
      border-top: 1px solid #1f2937;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        ${logoSvg}
        <h1 class="brand-title">WeatherGuard Intelligence</h1>
      </div>
      <div class="body-content">
        <div class="badge">
          <span style="display:inline-block; width:6px; height:6px; background-color:#34d399; border-radius:50%; margin-right:8px;"></span>
          Access Approved
        </div>
        <h2 class="greeting">Welcome aboard, ${recipientName}</h2>
        <p class="lead-text">
          Your account request has been officially verified and approved by the WeatherGuard Administrator. You now have full executive clearance to access real-time meteorological telemetry and configure automated dispatches.
        </p>
        
        <div class="instructions-box">
          <div class="box-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; vertical-align: middle;">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            Activation Protocol
          </div>
          <div class="step-item">
            <span class="step-num">1</span>
            <p class="step-desc">Log into the web dashboard using the secure portal link below.</p>
          </div>
          <div class="step-item">
            <span class="step-num">2</span>
            <p class="step-desc">Navigate to <strong>Preferences</strong> and initiate the <strong>Connect Telegram</strong> protocol.</p>
          </div>
          <div class="step-item">
            <span class="step-num">3</span>
            <p class="step-desc">Select your desired daily briefing frequency (1x to 6x daily intervals).</p>
          </div>
        </div>

        <div class="btn-wrap">
          <a href="${loginUrl}" class="action-btn">Enter Dashboard Portal</a>
        </div>

        <p class="fallback-text">
          If you encounter issues accessing the portal button, navigate directly via:<br>
          <a href="${loginUrl}" class="fallback-link">${loginUrl}</a>
        </p>
      </div>
      <div class="footer">
        &copy; 2026 WeatherGuard Intelligence Systems &bull; Enterprise Telemetry Infrastructure
      </div>
    </div>
  </div>
</body>
</html>
    `;

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'WeatherGuard Intelligence', email: senderEmail },
          to: [{ email: userEmail, name: recipientName }],
          subject: 'WeatherGuard Intelligence — Access Approved',
          htmlContent,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Brevo API error (${response.status}): ${errorText}`);
        return false;
      }

      this.logger.log(`Approval email successfully sent to ${userEmail} via Brevo`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send approval email to ${userEmail}: ${error.message}`);
      return false;
    }
  }
}
