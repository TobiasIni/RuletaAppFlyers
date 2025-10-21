'use client';

import { TriviaConfig } from '@/types/api';

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
  const isGood = percentage >= 70;
  const isPassing = percentage >= 50;

  const getResultMessage = () => {
    if (isPerfect) return "¡Perfecto! 🎉";
    if (isGood) return "¡Excelente! 👏";
    if (isPassing) return "¡Bien hecho! 👍";
    return "¡Perdiste!";
  };

  const getResultColor = () => {
    if (isPerfect) return "text-green-600";
    if (isGood) return "text-blue-600";
    if (isPassing) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header fijo */}
      <header 
        className="bg-white p-4 flex items-center justify-center relative"
      >
        <button
          onClick={onBack}
          className="group absolute left-4 px-6 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center group-hover:bg-gray-100 transition-all duration-300">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="font-semibold text-sm tracking-wide text-gray-800">Menú</span>
          </div>
        </button>
        
        {/* Imagen de la trivia centrada */}
        {triviaConfig.company.trivia_logo ? (
          <img 
            src={triviaConfig.company.trivia_logo} 
            alt="Trivia"
            className="h-16 w-auto"
          />
        ) : (
          <h1 className="text-2xl text-gray-800">Resultados</h1>
        )}
      </header>

      {/* Contenido principal */}
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
          
            <h2 className={`text-5xl mb-6 ${getResultColor()}`}>
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
              className="px-16 py-6 text-white text-3xl rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${triviaConfig.company.color_primario} 0%, ${triviaConfig.company.color_secundario} 100%)`
              }}
            >
              Jugar de Nuevo
            </button>
            
            <button
              onClick={onBack}
              className="px-16 py-6 bg-gray-600 text-white text-3xl rounded-2xl hover:bg-gray-700 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Volver al Menú
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
