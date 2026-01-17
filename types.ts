
export enum UserRole {
  CLIENT = 'CLIENT',
  MECHANIC_AMATEUR = 'MECHANIC_AMATEUR',
  MECHANIC_PRO = 'MECHANIC_PRO',
  ADMIN = 'ADMIN'
}

export enum ServiceType {
  OIL_CHANGE = 'Vidange',
  BRAKES = 'Freins',
  TIRES = 'Pneus',
  DIAGNOSTIC = 'Diagnostic',
  BATTERY = 'Batterie',
  GENERAL_REPAIR = 'Réparation Générale',
  CAR_SOS = 'Car SOS / Dépannage'
}

export type Language = 'fr' | 'en';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Mechanic extends User {
  location: 'Montreal' | 'Ottawa';
  bio: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  isVerified: boolean;
  services: ServiceType[];
  availability: string[];
  avatar: string;
}

export interface Booking {
  id: string;
  clientId: string;
  mechanicId: string;
  service: ServiceType;
  date: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  price: number;
  mechanicName?: string;
}

export interface Review {
  id: string;
  mechanicId: string;
  clientId: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password?: string;
  isConnected: boolean;
}
