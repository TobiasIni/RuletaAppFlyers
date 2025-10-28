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
    return "¡PERDISTE!";
  };

  const getResultColor = () => {
    if (isPerfect) return "text-[#8ecc4f]";
    return "text-[#ff288d]";
  };

  return (
    <div className="h-full flex flex-col">
      {/* Contenido principal sin header */}
      <main className="flex-1 flex p-8 pt-4">
        <div className="text-center max-w-4xl w-full flex flex-col items-center justify-start">
          {/* Logo de la empresa en grande */}
          {triviaConfig.company.logo && (
            <div className="mb-12 mt-4">
              <img 
                src={triviaConfig.company.logo} 
                alt={`Logo de ${triviaConfig.company.nombre}`}
                className="h-64 w-auto mx-auto"
              />
            </div>
          )}

          {/* Mensaje de resultado */}
          <div className="mb-10">
          
            <h2 className={`text-9xl mb-6 ${getResultColor()}`}>
              {getResultMessage()}
            </h2>
          </div>

          {/* Puntuación */}
          <div 
            className="bg-white rounded-2xl shadow-2xl p-12 mb-12 max-w-3xl w-full"
            style={{ border: `4px solid ${triviaConfig.company.color_primario}` }}
          >
            <h3 className="text-3xl text-gray-800 mb-6">Tu Puntuación</h3>
            
            {/* Círculo de progreso */}
            <div className="relative w-40 h-40 mx-auto mb-8">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                {/* Fondo del círculo */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Círculo de progreso */}
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

            {/* Porcentaje */}
            <div className="text-5xl mb-3" style={{ color: triviaConfig.company.color_primario }}>
              {percentage}%
            </div>
            <p className="text-gray-600 text-xl">
              {score} respuesta{score !== 1 ? 's' : ''} correcta{score !== 1 ? 's' : ''} de {total} pregunta{total !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-8">
            <button
              onClick={onPlayAgain}
              className="px-24 py-10 text-white text-5xl rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${triviaConfig.company.color_primario} 0%, ${triviaConfig.company.color_secundario} 100%)`
              }}
            >
              Jugar de Nuevo
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
