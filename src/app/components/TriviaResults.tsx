'use client';

import { useEffect } from 'react';
import { TriviaConfig } from '@/types/api';
import confetti from 'canvas-confetti';

interface TriviaResultsProps {
  triviaConfig: TriviaConfig;
  score: number;
  total: number;
  onPlayAgain: () => void;
  onBack: () => void;
}

export default function TriviaResults({ triviaConfig, score, total, onPlayAgain, onBack }: TriviaResultsProps) {
  const percentage = Math.round((score / total) * 100);
  const isPerfect = score === total;

  // Lanzar confetti si ganó
  useEffect(() => {
    if (isPerfect) {
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
  }, [isPerfect]);

  const getResultMessage = () => {
    if (isPerfect) return "¡GANASTE!";
    return "¡GRACIAS POR PARTICIPAR!";
  };

  const getResultColor = () => {
    if (isPerfect) return "text-white";
    return "text-white";
  };

  return (
    <div className="h-full flex flex-col">
      {/* Contenido principal sin header */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-4xl w-full flex flex-col items-center justify-center">
          {/* Logo de la empresa en grande */}
          {/* {triviaConfig.company.logo && (
            <div className="mb-12 mt-4">
              <img 
                src={triviaConfig.company.logo} 
                alt={`Logo de ${triviaConfig.company.nombre}`}
                className="h-64 w-auto mx-auto"
              />
            </div>
          )} */}

          {/* Mensaje de resultado */}
          <div className="mb-10">
          
            <h2 className={`text-9xl mb-48 ${getResultColor()}`}>
              {getResultMessage()}
            </h2>
          </div>

          {/* Puntuación */}
          {/* <div 
            className="bg-white rounded-2xl shadow-2xl p-12 mb-12 max-w-3xl w-full"
            style={{ border: `4px solid ${triviaConfig.company.color_primario}` }}
          >
            <h3 className="text-3xl text-gray-800 mb-6">Tu Puntuación</h3>
            
            <div className="relative w-40 h-40 mx-auto mb-8">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
               
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
               
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke={triviaConfig.company.color_primario}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
                  className="transition-all duration-1000"
                  style={{
                    strokeLinecap: 'round'
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl text-gray-800">{score}</div>
                <div className="text-lg text-gray-600">de {total}</div>
              </div>
            </div>

          
            <div className="text-5xl mb-3" style={{ color: triviaConfig.company.color_primario }}>
              {percentage}%
            </div>
            <p className="text-gray-600 text-xl">
              {score} respuesta{score !== 1 ? 's' : ''} correcta{score !== 1 ? 's' : ''} de {total} pregunta{total !== 1 ? 's' : ''}
            </p>
          </div> */}

          <p className="text-white text-5xl mb-48">
                        {score} respuesta{score !== 1 ? 's' : ''} correcta{score !== 1 ? 's' : ''} de {total} pregunta{total !== 1 ? 's' : ''}
                      </p>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-8">
            <button
              onClick={onPlayAgain}
              className="relative px-24 py-10 text-white text-5xl rounded-2xl hover:scale-105 transition-all duration-500 shadow-xl hover:shadow-2xl overflow-hidden group"
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
              className="px-24 py-10 bg-gray-600 text-white text-5xl rounded-2xl hover:bg-gray-700 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Volver al Menú
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
