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
          {/* {company.logo && (
            <div className="mb-12 mt-4">
              <img 
                src={company.logo} 
                alt={`Logo de ${company.nombre}`}
                className="h-64 w-auto mx-auto"
              />
            </div>
          )} */}

          {/* Instrucciones con tamaño más grande */}
          <div 
            className="rounded-2xl p-12 mb-16 w-full max-w-3xl"
            style={{ borderColor: company.color_secundario }}
          >
            <h3 className="text-9xl mb-8 text-app-primary mt-12">Instrucciones</h3>
            <ul className="text-app-primary space-y-5 text-5xl mt-36">
              <li>• Tienes 20 segundos por pregunta</li>
              <li>• Selecciona la respuesta correcta</li>
              <li>• ¡Piensa rápido y diviértete!</li>
            </ul>
          </div>

          {/* Botón comenzar */}
          <button
            onClick={onStart}
            className="relative mt-20 px-24 py-10 text-app-primary text-5xl rounded-2xl hover:scale-105 transition-all duration-500 shadow-xl hover:shadow-2xl overflow-hidden group"
            style={{
              background: `transparent`,
              backdropFilter: 'blur(10px)',
              border: '2px solid rgb(255, 255, 255)',
          
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
              <span className="relative z-10" style={{ letterSpacing: '0.1em' }}>¡A jugar!</span>
            <style jsx>{`
              @keyframes liquidMove {
                0%, 100% { transform: translate(0%, 0%) scale(1); }
                33% { transform: translate(30%, -30%) scale(1.2); }
                66% { transform: translate(-30%, 30%) scale(1.1); }
              }
            `}</style>
          </button>
        </div>
      </main>
    </div>
  );
}
