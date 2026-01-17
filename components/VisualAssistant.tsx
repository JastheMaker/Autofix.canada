
import React, { useState } from 'react';
import { Button } from './Button';
import { Sparkles, Image as ImageIcon, Video, Loader2, Key } from 'lucide-react';
import { editCarImage, generateRepairVideo, blobToBase64 } from '../services/geminiService';

export const VisualAssistant: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'IMAGE' | 'VIDEO'>('IMAGE');

  const handleOpenKey = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
  };

  const handleProcess = async () => {
    setLoading(true);
    try {
      if (mode === 'IMAGE' && image) {
        const result = await editCarImage(image.split(',')[1], prompt);
        if (result) setImage(result);
      } else if (mode === 'VIDEO') {
        const result = await generateRepairVideo(prompt);
        setVideo(result);
      }
    } catch (err) {
      alert("Erreur lors de la génération. Vérifiez votre clé API.");
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      setImage(base64);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="text-blue-600" /> AutoFix Studio Visuel
        </h3>
        <Button size="sm" variant="outline" onClick={handleOpenKey}>
          <Key className="w-4 h-4 mr-2" /> Clé API Veo
        </Button>
      </div>

      <div className="flex gap-4 mb-6 p-1 bg-slate-100 rounded-lg">
        <button 
          onClick={() => setMode('IMAGE')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${mode === 'IMAGE' ? 'bg-white shadow text-blue-600' : 'text-slate-600'}`}
        >
          <ImageIcon className="inline w-4 h-4 mr-2" /> Édition Photo
        </button>
        <button 
          onClick={() => setMode('VIDEO')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${mode === 'VIDEO' ? 'bg-white shadow text-blue-600' : 'text-slate-600'}`}
        >
          <Video className="inline w-4 h-4 mr-2" /> Générateur Vidéo (Veo)
        </button>
      </div>

      <div className="space-y-4">
        {mode === 'IMAGE' && (
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
            {image ? (
              <img src={image} className="max-h-64 mx-auto rounded-lg mb-4" />
            ) : (
              <div className="py-8">
                <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">Uploadez une photo de votre carrosserie ou moteur</p>
              </div>
            )}
            <input type="file" accept="image/*" onChange={onFileChange} className="hidden" id="car-upload" />
            <label htmlFor="car-upload" className="cursor-pointer text-blue-600 text-sm font-semibold hover:underline">
              {image ? "Changer l'image" : "Sélectionner un fichier"}
            </label>
          </div>
        )}

        {mode === 'VIDEO' && video && (
          <video src={video} controls className="w-full rounded-xl shadow-inner mb-4" />
        )}

        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={mode === 'IMAGE' ? "Ex: Simule une peinture noir mat et enlève la rayure" : "Ex: Tutoriel 16:9 montrant comment changer une roue en sécurité"}
          className="w-full rounded-lg border-slate-200 text-sm p-3 h-24 focus:ring-blue-500 focus:border-blue-500"
        />

        <Button 
          className="w-full py-4 text-lg" 
          disabled={loading || !prompt || (mode === 'IMAGE' && !image)}
          onClick={handleProcess}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
          Générer avec l'IA
        </Button>
      </div>
    </div>
  );
};
