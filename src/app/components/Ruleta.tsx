'use client';

import { useState, useEffect } from 'react';
import { RuletaConfig } from '@/types/api';
import { getRuletaConfig } from '@/lib/api';
import SpinWheel from './SpinWheel';
import WinnerModal from './WinnerModal';

interface RuletaProps {
  juegoId: number;
  onBack: () => void;
}

interface Prize {
  id: string;
  text: string;
  color: string;
  probability?: number;
  positive?: boolean;
}

type RuletaState = 'loading' | 'playing';

export default function Ruleta({ juegoId, onBack }: RuletaProps) {
  const [state, setState] = useState<RuletaState>('loading');
  const [ruletaConfig, setRuletaConfig] = useState<RuletaConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [winner, setWinner] = useState<Prize | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  useEffect(() => {
    const loadRuletaConfig = async () => {
      try {
        setState('loading');
        const config = await getRuletaConfig(juegoId);
        setRuletaConfig(config);
        
        // Transform API prizes to Prize format
        const transformedPrizes: Prize[] = config.premios
          .filter(premio => premio.activo)
          .sort((a, b) => a.id - b.id)
          .map((premio, index) => ({
            id: premio.id.toString(),
            text: premio.nombre,
            color: '', // Will be assigned from company colors
            probability: premio.probabilidad,
            positive: premio.positive,
          }));

        // Ensure we always have exactly 8 prizes by repeating them
        const targetPrizeCount = 8;
        const finalPrizes: Prize[] = [];
        
        if (transformedPrizes.length === 0) {
          // If no prizes from API, create default ones
          for (let i = 0; i < targetPrizeCount; i++) {
            finalPrizes.push({
              id: `default-${i}`,
              text: 'Premio',
              color: '',
              probability: 100 / targetPrizeCount,
            });
          }
        } else {
          // Repeat prizes until we have exactly 8
          for (let i = 0; i < targetPrizeCount; i++) {
            const sourcePrize = transformedPrizes[i % transformedPrizes.length];
            finalPrizes.push({
              ...sourcePrize,
              id: `${sourcePrize.id}-${i}`, // Make sure each has a unique ID
            });
          }
        }

        // Create color array from company colors
        const colors = [
          config.company.color_primario,
          config.company.color_secundario,
          config.company.color_terciario,
        ];

        // Assign colors to prizes in a cycling pattern
        finalPrizes.forEach((prize, index) => {
          prize.color = colors[index % colors.length];
        });

        console.log('🎮 Final wheel configuration:', {
          totalPrizes: finalPrizes.length,
          prizeOrder: finalPrizes.map((p, i) => ({ index: i, id: p.id, text: p.text })),
          colors: colors
        });

        setPrizes(finalPrizes);
        setState('playing');
        setError(null);
      } catch (err) {
        console.error('Error al cargar la configuración de la ruleta:', err);
        setError('Error al cargar la ruleta. Por favor, intenta de nuevo.');
        setState('playing'); // Mostrar ruleta aunque haya error con premios por defecto
      }
    };

    loadRuletaConfig();
  }, [juegoId]);

  const handleWin = (prize: Prize, isPositive?: boolean) => {
    setWinner({...prize, positive: isPositive});
    setShowWinnerModal(true);
  };

  const closeWinnerModal = () => {
    setShowWinnerModal(false);
    setWinner(null);
  };

  const handleBack = () => {
    onBack();
  };

  if (state === 'loading') {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl text-app-primary">Cargando ruleta...</p>
        </div>
      </div>
    );
  }

  if (error && !ruletaConfig) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl text-app-primary mb-2">Error</h2>
          <p className="text-app-primary mb-4">{error}</p>
          <button 
            onClick={handleBack}
            className="bg-blue-600 text-app-primary px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Menú
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col overflow-hidden relative">
      {/* Error message */}
      {error && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-30 bg-red-600 text-app-primary px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Main Wheel Container - Takes most of the screen */}
      <div className="flex-1 flex items-center justify-center p-2">
        <SpinWheel 
          prizes={prizes} 
          onWin={handleWin} 
          colors={ruletaConfig ? [
            ruletaConfig.company.color_primario,
            ruletaConfig.company.color_secundario,
            ruletaConfig.company.color_terciario,
          ] : undefined}
          logo={ruletaConfig?.company.logo}
          ruletaId={juegoId}
        />
      </div>

      {/* Winner Modal */}
      <WinnerModal
        winner={winner}
        isOpen={showWinnerModal}
        onClose={closeWinnerModal}
      />
    </div>
  );
}

