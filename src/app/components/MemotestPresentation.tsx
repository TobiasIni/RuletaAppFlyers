'use client';

import { MemotestConfig } from '@/types/api';

interface MemotestPresentationProps {
  memotestConfig: MemotestConfig;
  onStart: () => void;
  onBack: () => void;
}

export default function MemotestPresentation({ memotestConfig, onStart, onBack }: MemotestPresentationProps) {
  const { memotest, company } = memotestConfig;
  const gameTime = memotest.tiempo || 60;

  return (
    <div className="h-full flex flex-col">
      {/* Header fijo con botón volver */}
      <header 
        className="text-white p-4 flex items-center justify-between"
        style={{
          background: `linear-gradient(135deg, ${company.color_primario} 0%, ${company.color_secundario} 100%)`
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
        <h1 className="text-2xl font-bold">Memotest</h1>
        <div></div> {/* Spacer para centrar el título */}
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          {/* Logo de la empresa si existe */}
          {company.logo && (
            <div className="mb-8">
              <img 
                src={company.logo} 
                alt={`Logo de ${company.nombre}`}
                className="h-20 w-auto mx-auto"
              />
            </div>
          )}

          {/* Título del memotest */}
          <h2 
            className="text-4xl font-bold mb-4"
            style={{ color: company.color_primario }}
          >
            {memotest.nombre}
          </h2>

          {/* Descripción */}
          <p className="text-xl text-gray-600 mb-8">
            {memotest.descripcion}
          </p>

          {/* Instrucciones */}
          <div 
            className="bg-gray-100 rounded-xl p-6 mb-8"
            style={{ borderColor: company.color_secundario }}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Instrucciones:</h3>
            <ul className="text-gray-600 space-y-2">
              <li>• Tienes {gameTime} segundos para encontrar todas las parejas</li>
              <li>• Haz clic en las cartas para voltearlas</li>
              <li>• Encuentra las parejas que coincidan</li>
              <li>• ¡Memoriza las posiciones y diviértete!</li>
            </ul>
          </div>

          {/* Botón comenzar */}
          <button
            onClick={onStart}
            className="px-8 py-4 text-white font-bold text-xl rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            style={{
              background: `linear-gradient(135deg, ${company.color_primario} 0%, ${company.color_secundario} 100%)`
            }}
          >
            Comenzar Memotest
          </button>
        </div>
      </main>
    </div>
  );
}
