'use client';

import { MemotestConfig } from '@/types/api';

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

  const getResultMessage = () => {
    if (isWin) return "¡Ganaste! 🎉";
    if (isTimeUp) return "Tiempo agotado ⏰";
    return "¡Bien hecho! 👏";
  };

  const getResultColor = () => {
    if (isWin) return "text-green-600";
    if (isTimeUp) return "text-red-600";
    return "text-blue-600";
  };

  const getResultEmoji = () => {
    if (isWin) return "🏆";
    if (isTimeUp) return "⏰";
    return "👍";
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header fijo */}
      <header 
        className="text-white p-4 flex items-center justify-between"
        style={{
          background: `linear-gradient(135deg, ${memotestConfig.company.color_primario} 0%, ${memotestConfig.company.color_secundario} 100%)`
        }}
      >
        <button
          onClick={onBack}
          className="group relative px-6 py-3 bg-white rounded-xl hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-all duration-300">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="font-semibold text-sm tracking-wide text-gray-800">Menú</span>
          </div>
        </button>
        
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          {/* Logo de la empresa si existe */}
          {memotestConfig.company.logo && (
            <div className="mb-8">
              <img 
                src={memotestConfig.company.logo} 
                alt={`Logo de ${memotestConfig.company.nombre}`}
                className="h-20 w-auto mx-auto"
              />
            </div>
          )}


          {/* Estadísticas */}
          <div 
            className="bg-white rounded-2xl shadow-2xl p-8 mb-8"
            style={{ border: `4px solid ${memotestConfig.company.color_primario}` }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Estadísticas</h3>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Parejas encontradas */}
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: memotestConfig.company.color_primario }}>
                  {pairsFound}
                </div>
                <div className="text-gray-600">Parejas encontradas</div>
                <div className="text-sm text-gray-500">de {totalPairs} total</div>
              </div>

              {/* Tiempo usado */}
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: memotestConfig.company.color_secundario }}>
                  {timeUsed}s
                </div>
                <div className="text-gray-600">Tiempo usado</div>
                <div className="text-sm text-gray-500">de {gameTime}s disponibles</div>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className="h-4 rounded-full transition-all duration-1000"
                style={{ 
                  width: `${percentage}%`,
                  background: `linear-gradient(135deg, ${memotestConfig.company.color_primario} 0%, ${memotestConfig.company.color_secundario} 100%)`
                }}
              ></div>
            </div>
            <div className="text-center text-lg font-semibold text-gray-700">
              {percentage}% completado
            </div>
          </div>

          {/* Mensaje adicional */}
          {isWin && (
            <div className="mb-8 p-4 bg-green-100 rounded-xl">
              <p className="text-green-800 font-semibold">
                ¡Excelente memoria! Encontraste todas las parejas en {timeUsed} segundos.
              </p>
            </div>
          )}

          {isTimeUp && !isWin && (
            <div className="mb-8 p-4 bg-red-100 rounded-xl">
              <p className="text-red-800 font-semibold">
                Se acabó el tiempo. Encontraste {pairsFound} de {totalPairs} parejas.
              </p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onPlayAgain}
              className="px-8 py-4 text-white font-bold text-xl rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${memotestConfig.company.color_primario} 0%, ${memotestConfig.company.color_secundario} 100%)`
              }}
            >
              Jugar de Nuevo
            </button>
            
            <button
              onClick={onBack}
              className="px-8 py-4 bg-gray-600 text-white font-bold text-xl rounded-xl hover:bg-gray-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Volver al Menú
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
