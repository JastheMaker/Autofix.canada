import React, { useState } from 'react';
import { diagnoseCarIssue } from '../services/geminiService';
import { Button } from './Button';
import { ServiceType } from '../types';
import { Sparkles, Loader2 } from 'lucide-react';

interface AIDiagnosisProps {
  onServiceRecommended: (service: ServiceType) => void;
}

export const AIDiagnosis: React.FC<AIDiagnosisProps> = ({ onServiceRecommended }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ suggestion: string, service: ServiceType | null } | null>(null);

  const handleDiagnose = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const diagnosis = await diagnoseCarIssue(description);
      setResult(diagnosis);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold text-indigo-900">Assistant Diagnostic AI</h3>
      </div>
      
      <p className="text-sm text-indigo-700 mb-4">
        Vous ne savez pas quel service choisir ? Décrivez votre problème (ex: "Bruit aigu quand je freine") et notre IA vous guidera.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez le problème..."
          className="flex-1 rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
        />
        <Button 
          onClick={handleDiagnose} 
          disabled={loading || !description}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Analyser
        </Button>
      </div>

      {result && (
        <div className="mt-4 p-4 bg-white rounded-lg border border-indigo-100 shadow-sm animate-in fade-in slide-in-from-top-2">
          <p className="text-slate-700 font-medium mb-2">{result.suggestion}</p>
          {result.service && (
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-slate-500">Service recommandé :</span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onServiceRecommended(result.service!)}
              >
                Rechercher des mécaniciens pour : {result.service}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};