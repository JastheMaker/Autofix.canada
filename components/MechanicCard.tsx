import React from 'react';
import { Mechanic, UserRole } from '../types';
import { Star, MapPin, CheckCircle, Award } from 'lucide-react';
import { Button } from './Button';

interface MechanicCardProps {
  mechanic: Mechanic;
  onBook: (mechanic: Mechanic) => void;
}

export const MechanicCard: React.FC<MechanicCardProps> = ({ mechanic, onBook }) => {
  const isPro = mechanic.role === UserRole.MECHANIC_PRO;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6 flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <img 
            src={mechanic.avatar} 
            alt={mechanic.name} 
            className="w-24 h-24 rounded-full object-cover border-4 border-slate-50"
          />
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                {mechanic.name}
                {isPro && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                    <CheckCircle className="w-3 h-3" /> PRO VÉRIFIÉ
                  </span>
                )}
                {!isPro && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                    <Award className="w-3 h-3" /> AMATEUR
                  </span>
                )}
              </h3>
              <div className="flex items-center text-slate-500 mt-1 text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                {mechanic.location}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">{mechanic.hourlyRate}$<span className="text-sm font-normal text-slate-500">/h</span></div>
            </div>
          </div>

          <div className="flex items-center mt-2 mb-3">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="font-semibold ml-1 text-slate-900">{mechanic.rating}</span>
            <span className="text-slate-500 text-sm ml-1">({mechanic.reviewCount} avis)</span>
          </div>

          <p className="text-slate-600 text-sm mb-4 line-clamp-2">{mechanic.bio}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {mechanic.services.slice(0, 3).map((service, idx) => (
              <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                {service}
              </span>
            ))}
            {mechanic.services.length > 3 && (
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                +{mechanic.services.length - 3}
              </span>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={() => onBook(mechanic)}>Réserver un rendez-vous</Button>
          </div>
        </div>
      </div>
    </div>
  );
};