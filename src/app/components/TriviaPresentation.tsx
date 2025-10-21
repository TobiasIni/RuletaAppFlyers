'use client';

import { TriviaConfig } from '@/types/api';

interface TriviaPresentationProps {
  triviaConfig: TriviaConfig;
  onStart: () => void;
  onBack: () => void;
}

export default function TriviaPresentation({ triviaConfig, onStart, onBack }: TriviaPresentationProps) {
  const { trivia, company } = triviaConfig;

  console.log('TriviaPresentation - company.trivia_logo:', company.trivia_logo);

  return (
    <div className="h-full flex flex-col">
      {/* Header fijo con botón volver */}
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
        {company.trivia_logo ? (
          <img 
            src={company.trivia_logo} 
            alt="Trivia"
            className="h-16 w-auto"
            onError={(e) => {
              console.error('Error al cargar imagen de trivia:', company.trivia_logo);
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <h1 className="text-2xl text-gray-800">Trivia</h1>
        )}
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex  p-8 pt-4">
        <div className="text-center max-w-4xl w-full flex flex-col items-center justify-start">
          {/* Logo de la empresa en grande */}
          {company.logo && (
            <div className="mb-12 mt-4">
              <img 
                src={company.logo} 
                alt={`Logo de ${company.nombre}`}
                className="h-64 w-auto mx-auto"
              />
            </div>
          )}

          {/* Instrucciones con tamaño más grande */}
          <div 
            className="bg-gray-100 rounded-2xl p-12 mb-16 w-full max-w-3xl"
            style={{ borderColor: company.color_secundario }}
          >
            <h3 className="text-4xl mb-8 text-gray-800">Instrucciones:</h3>
            <ul className="text-gray-700 space-y-5 text-2xl">
              <li>• Tienes 20 segundos por pregunta</li>
              <li>• Selecciona la respuesta correcta</li>
              <li>• ¡Piensa rápido y diviértete!</li>
            </ul>
          </div>

          {/* Botón comenzar */}
          <button
            onClick={onStart}
            className="mt-20 px-16 py-6 text-white text-3xl rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${company.color_primario} 0%, ${company.color_secundario} 100%)`
            }}
          >
            A jugar!
          </button>
        </div>
      </main>
    </div>
  );
}
