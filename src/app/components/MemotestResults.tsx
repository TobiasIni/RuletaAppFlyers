'use client';

import { useEffect } from 'react';
import { MemotestConfig } from '@/types/api';
import confetti from 'canvas-confetti';

interface MemotestResultsProps {
  memotestConfig: MemotestConfig;
  pairsFound: number;
  totalPairs: number;
  timeUsed: number;
  gameTime: number;
  onPlayAgain: () => void;
  onBack: () => void;
}

export default function MemotestResults({ 
  memotestConfig, 
  pairsFound, 
  totalPairs, 
  timeUsed, 
  gameTime,
  onPlayAgain, 
  onBack 
}: MemotestResultsProps) {
  const isWin = pairsFound === totalPairs;
  const isTimeUp = timeUsed >= gameTime;
  const percentage = Math.round((pairsFound / totalPairs) * 100);

  // Lanzar confetti si ganó
  useEffect(() => {
    if (isWin) {
      // Confetti inicial
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Más confetti después de 200ms
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
      }, 200);

      // Más confetti después de 400ms
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 400);
    }
  }, [isWin]);

  const getResultMessage = () => {
    if (isWin) return "¡GANASTE!";
    return "¡GRACIAS POR PARTICIPAR!";
  };

  return (
    <div className="h-full flex flex-col">
      {/* Contenido principal sin header */}
      <main className="flex-1 flex p-8 pt-4">
        <div className="text-center max-w-4xl w-full flex flex-col items-center justify-start">
          {/* Logo de la empresa en grande */}
        {/*   {memotestConfig.company.logo && (
            <div className="mb-12 mt-4">
              <img 
                src={memotestConfig.company.logo} 
                alt={`Logo de ${memotestConfig.company.nombre}`}
                className="h-64 w-auto mx-auto"
              />
            </div>
          )} */}

          {/* Estadísticas */}
          {/* <div 
            className="bg-white rounded-2xl shadow-2xl p-12 mb-12 max-w-3xl w-full"
            style={{ border: `4px solid ${memotestConfig.company.color_primario}` }}
          >
            <h3 className="text-3xl text-gray-800 mb-8">Estadísticas</h3>
            
            <div className="grid grid-cols-2 gap-8 mb-8">
             
              <div className="text-center">
                <div className="text-5xl mb-3" style={{ color: memotestConfig.company.color_primario }}>
                  {pairsFound}
                </div>
                <div className="text-gray-600 text-xl mb-1">Parejas encontradas</div>
                <div className="text-lg text-gray-500">de {totalPairs} total</div>
              </div>

              
              <div className="text-center">
                <div className="text-5xl mb-3" style={{ color: memotestConfig.company.color_secundario }}>
                  {timeUsed}s
                </div>
                <div className="text-gray-600 text-xl mb-1">Tiempo usado</div>
                <div className="text-lg text-gray-500">de {gameTime}s disponibles</div>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-6 mb-5">
              <div 
                className="h-6 rounded-full transition-all duration-1000"
                style={{ 
                  width: `${percentage}%`,
                  background: `linear-gradient(135deg, ${memotestConfig.company.color_primario} 0%, ${memotestConfig.company.color_secundario} 100%)`
                }}
              ></div>
            </div>
            <div className="text-center text-2xl text-gray-700">
              {percentage}% completado
            </div>
          </div>| 

          

          {/* Mensaje adicional */}

        <div className="mb-10">
                  
            <h2 className={`text-9xl mb-32 mt-24 text-app-primary`}>
              {getResultMessage()}
            </h2>
          </div>
          {isWin ? (
            <div className="mb-10 p-6 rounded-2xl max-w-3xl w-full">
              <p className="text-app-primary text-6xl mt-24">
                ¡Excelente memoria! Encontraste todas las parejas en {timeUsed} segundos.
              </p>
            </div>
          ) : (
            <div className="mb-10 p-6 rounded-2xl max-w-3xl w-full">
              <p className="text-app-primary text-6xl mt-24">
                Se acabó el tiempo. 
              </p>
              <p className="text-app-primary text-6xl mt-24">
              Encontraste {pairsFound} de {totalPairs} parejas. 
              </p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-20">
          <button
              onClick={onPlayAgain}
              className="relative px-24 py-10 text-app-primary text-5xl rounded-2xl hover:scale-105 transition-all duration-500 shadow-xl hover:shadow-2xl overflow-hidden group"
              style={{
                background: `transparent`,
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 0 20px rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Efecto de brillo líquido */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)`,
                  animation: 'liquidMove 3s ease-in-out infinite'
                }}
              />
              {/* Reflejo superior */}
              <div 
                className="absolute top-0 left-0 right-0 h-1/3 opacity-30"
                style={{
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, transparent 100%)',
                  borderRadius: '1rem 1rem 0 0'
                }}
              />
              <span className="relative z-10">Jugar de Nuevo</span>
              <style jsx>{`
                @keyframes liquidMove {
                  0%, 100% { transform: translate(0%, 0%) scale(1); }
                  33% { transform: translate(30%, -30%) scale(1.2); }
                  66% { transform: translate(-30%, 30%) scale(1.1); }
                }
              `}</style>
            </button>
            
            <button
              onClick={onBack}
              className="px-24 py-10 bg-gray-600 text-app-primary text-5xl rounded-2xl hover:bg-gray-700 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Volver al Menú
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
