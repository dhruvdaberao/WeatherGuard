export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum Status {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface User {
  id?: string;
  telegramChatId?: string;
  telegramConnected?: boolean;
  telegramConnectedAt?: Date;
  name: string;
  email: string;
  avatar?: string;
  provider?: string;
  role: Role;
  status: Status;
  city?: string;
  weatherPreferences?: string[];
  autoAlertsEnabled?: boolean;
  alertsPerDay?: number;
  createdAt: string;
  updatedAt: string;
}
