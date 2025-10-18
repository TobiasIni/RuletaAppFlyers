'use client';

import { useState, useEffect } from 'react';
import { TriviaConfig } from '@/types/api';
import { getTriviaConfig } from '@/lib/api';
import TriviaPresentation from './TriviaPresentation';
import TriviaGame from './TriviaGame';
import TriviaResults from './TriviaResults';

interface TriviaProps {
  juegoId: number;
  onBack: () => void;
}

type TriviaState = 'loading' | 'presentation' | 'playing' | 'results';

export default function Trivia({ juegoId, onBack }: TriviaProps) {
  const [state, setState] = useState<TriviaState>('loading');
  const [triviaConfig, setTriviaConfig] = useState<TriviaConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gameScore, setGameScore] = useState({ score: 0, total: 0 });

  useEffect(() => {
    const loadTriviaConfig = async () => {
      try {
        setState('loading');
        const config = await getTriviaConfig(juegoId);
        setTriviaConfig(config);
        setState('presentation');
        setError(null);
      } catch (err) {
        console.error('Error al cargar la configuración de la trivia:', err);
        setError('Error al cargar la trivia. Por favor, intenta de nuevo.');
        setState('presentation'); // Mostrar presentación aunque haya error
      }
    };

    loadTriviaConfig();
  }, [juegoId]);

  const handleStart = () => {
    setState('playing');
  };

  const handleGameFinish = (score: number, total: number) => {
    setGameScore({ score, total });
    setState('results');
  };

  const handlePlayAgain = () => {
    setState('playing');
  };

  const handleBack = () => {
    onBack();
  };

  if (state === 'loading') {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Cargando trivia...</p>
        </div>
      </div>
    );
  }

  if (error && !triviaConfig) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={handleBack}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Menú
          </button>
        </div>
      </div>
    );
  }

  if (state === 'presentation' && triviaConfig) {
    return (
      <TriviaPresentation 
        triviaConfig={triviaConfig}
        onStart={handleStart}
        onBack={handleBack}
      />
    );
  }

  if (state === 'playing' && triviaConfig) {
    return (
      <TriviaGame 
        triviaConfig={triviaConfig}
        onFinish={handleGameFinish}
        onBack={handleBack}
      />
    );
  }

  if (state === 'results' && triviaConfig) {
    return (
      <TriviaResults 
        triviaConfig={triviaConfig}
        score={gameScore.score}
        total={gameScore.total}
        onPlayAgain={handlePlayAgain}
        onBack={handleBack}
      />
    );
  }

  return null;
}
