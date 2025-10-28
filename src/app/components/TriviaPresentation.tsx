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
      {/* Contenido principal sin header */}
      <main className="flex-1 flex p-8">
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
            className="mt-20 px-24 py-10 text-white text-5xl rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
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
