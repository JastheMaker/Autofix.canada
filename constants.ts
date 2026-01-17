
import { Mechanic, UserRole, ServiceType, Booking, Review } from './types';

export const CITIES = ['Montreal', 'Ottawa'];

export const MOCK_MECHANICS: Mechanic[] = [
  {
    id: 'm1',
    name: 'Jean Tremblay',
    email: 'jean@autofix.com',
    role: UserRole.MECHANIC_PRO,
    location: 'Montreal',
    bio: 'Mécanicien certifié avec 15 ans d\'expérience. Spécialiste des véhicules européens.',
    rating: 4.8,
    reviewCount: 124,
    hourlyRate: 85,
    isVerified: true,
    services: [ServiceType.BRAKES, ServiceType.DIAGNOSTIC, ServiceType.GENERAL_REPAIR],
    availability: ['Lundi', 'Mardi', 'Jeudi', 'Vendredi'],
    avatar: 'https://picsum.photos/100/100?random=1'
  },
  {
    id: 'm2',
    name: 'Alexandre Roy',
    email: 'alex@autofix.com',
    role: UserRole.MECHANIC_AMATEUR,
    location: 'Montreal',
    bio: 'Passionné de mécanique le week-end. Idéal pour vos changements d\'huile et freins à petit prix.',
    rating: 4.2,
    reviewCount: 15,
    hourlyRate: 40,
    isVerified: false,
    services: [ServiceType.OIL_CHANGE, ServiceType.TIRES, ServiceType.BATTERY, ServiceType.CAR_SOS],
    availability: ['Samedi', 'Dimanche'],
    avatar: 'https://picsum.photos/100/100?random=2'
  },
  {
    id: 'm3',
    name: 'Sarah Connor',
    email: 'sarah@autofix.com',
    role: UserRole.MECHANIC_PRO,
    location: 'Ottawa',
    bio: 'Atelier mobile complet. Je viens à vous pour tout type de réparation d\'urgence.',
    rating: 4.9,
    reviewCount: 210,
    hourlyRate: 95,
    isVerified: true,
    services: [ServiceType.BRAKES, ServiceType.DIAGNOSTIC, ServiceType.OIL_CHANGE, ServiceType.CAR_SOS],
    availability: ['Lundi', 'Mercredi', 'Vendredi'],
    avatar: 'https://picsum.photos/100/100?random=3'
  },
  {
    id: 'm4',
    name: 'Service SOS Plus',
    email: 'sos@autofix.com',
    role: UserRole.MECHANIC_PRO,
    location: 'Montreal',
    bio: 'Spécialiste de l\'assistance routière 24/7. Pneus, batterie et remorquage léger.',
    rating: 4.7,
    reviewCount: 89,
    hourlyRate: 110,
    isVerified: true,
    services: [ServiceType.CAR_SOS, ServiceType.TIRES, ServiceType.BATTERY],
    availability: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
    avatar: 'https://picsum.photos/100/100?random=4'
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    mechanicId: 'm1',
    clientId: 'c1',
    clientName: 'Marc D.',
    rating: 5,
    comment: 'Service impeccable et rapide. Jean connait son métier.',
    date: '2023-10-15'
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    clientId: 'user1',
    mechanicId: 'm1',
    mechanicName: 'Jean Tremblay',
    service: ServiceType.BRAKES,
    date: '2023-11-01',
    status: 'COMPLETED',
    price: 170
  }
];
