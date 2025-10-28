'use client';

import { useState, useEffect, useCallback } from 'react';
import { MemotestConfig, MemotestPareja } from '@/types/api';

interface MemotestGameProps {
  memotestConfig: MemotestConfig;
  onFinish: (pairsFound: number, totalPairs: number, timeUsed: number) => void;
  onBack: () => void;
}

interface Card {
  id: number;
  imagen: string;
  uniqueId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemotestGame({ memotestConfig, onFinish, onBack }: MemotestGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [pairsFound, setPairsFound] = useState(0);
  const [gameStarted, setGameStarted] = useState(true);
  const [gameEnded, setGameEnded] = useState(false);

  const gameTime = memotestConfig.memotest.tiempo || 60;
  const totalPairs = cards.length / 2;

  // Inicializar cartas
  useEffect(() => {
    const initializeCards = () => {
      let selectedParejas = memotestConfig.parejas;
      
      // Si hay cantidad_de_parejas específica, seleccionar random
      if (memotestConfig.memotest.cantidad_de_parejas) {
        const shuffled = [...memotestConfig.parejas].sort(() => Math.random() - 0.5);
        selectedParejas = shuffled.slice(0, memotestConfig.memotest.cantidad_de_parejas);
      }

      // Duplicar cada pareja y mezclar
      const duplicatedCards = selectedParejas.flatMap(pareja => [
        { ...pareja, uniqueId: `${pareja.id}-1` },
        { ...pareja, uniqueId: `${pareja.id}-2` }
      ]);

      const shuffledCards = duplicatedCards.sort(() => Math.random() - 0.5);
      
      setCards(shuffledCards.map(card => ({
        id: card.id,
        imagen: card.imagen,
        uniqueId: card.uniqueId,
        isFlipped: false,
        isMatched: false
      })));
    };

    initializeCards();
    setTimeLeft(gameTime);
  }, [memotestConfig, gameTime]);

  // Temporizador
  useEffect(() => {
    if (!gameStarted || gameEnded || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameEnded, timeLeft]);

  // Verificar si todas las parejas están encontradas
  useEffect(() => {
    if (pairsFound === totalPairs && totalPairs > 0) {
      setGameEnded(true);
      const timeUsed = gameTime - timeLeft;
      onFinish(pairsFound, totalPairs, timeUsed);
    }
  }, [pairsFound, totalPairs, gameTime, timeLeft, onFinish]);

  const handleTimeUp = useCallback(() => {
    setGameEnded(true);
    const timeUsed = gameTime - timeLeft;
    onFinish(pairsFound, totalPairs, timeUsed);
  }, [pairsFound, totalPairs, gameTime, timeLeft, onFinish]);

  const handleCardClick = (cardIndex: number) => {
    if (gameEnded || flippedCards.length >= 2) return;

    const card = cards[cardIndex];
    if (card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, cardIndex];
    setFlippedCards(newFlippedCards);

    setCards(prev => prev.map((c, index) => 
      index === cardIndex ? { ...c, isFlipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      const [firstIndex, secondIndex] = newFlippedCards;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.id === secondCard.id) {
        // Pareja encontrada
        setTimeout(() => {
          setCards(prev => prev.map((c, index) => 
            index === firstIndex || index === secondIndex 
              ? { ...c, isMatched: true }
              : c
          ));
          setPairsFound(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No coinciden, voltear de vuelta
        setTimeout(() => {
          setCards(prev => prev.map((c, index) => 
            index === firstIndex || index === secondIndex 
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const progressPercentage = (timeLeft / gameTime) * 100;
  const isLowTime = timeLeft <= gameTime * 0.2;

  // Calcular grid columns basado en cantidad de cartas
  const getGridCols = () => {
    const cardCount = cards.length;
    if (cardCount <= 8) return 'grid-cols-4';
    if (cardCount <= 12) return 'grid-cols-4';
    if (cardCount <= 16) return 'grid-cols-4';
    return 'grid-cols-6';
  };

  // Calcular tamaño del logo basado en cantidad de cartas
  const getLogoSize = () => {
    const cardCount = cards.length;
    if (cardCount <= 8) return 'w-48 h-48';      // 4x2 = 8 cartas
    if (cardCount <= 12) return 'w-36 h-36';     // 4x3 = 12 cartas
    if (cardCount <= 16) return 'w-20 h-20';     // 4x4 = 16 cartas
    if (cardCount <= 24) return 'w-16 h-16';       // 6x4 = 24 cartas
    return 'w-6 h-6';                            // Más de 24 cartas
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
        
        {/* Imagen del memotest centrada */}
        {memotestConfig.company.memotest_logo ? (
          <img 
            src={memotestConfig.company.memotest_logo} 
            alt="Memotest"
            className="h-16 w-auto"
          />
        ) : (
          <h1 className="text-2xl text-gray-800">Memotest</h1>
        )}
      </header>

      {/* Contenido principal */}
      <main className="flex-1 p-4 flex flex-col">
        {/* Temporizador circular */}
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
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
                stroke={isLowTime ? "#ef4444" : "#3b82f6"}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`}
                className={`transition-all duration-1000 ${isLowTime ? 'animate-pulse' : ''}`}
                style={{
                  strokeLinecap: 'round'
                }}
              />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center text-2xl  ${isLowTime ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
              {timeLeft}
            </div>
          </div>
        </div>

        {/* Grid de cartas */}
        <div className={`grid ${getGridCols()} gap-4 w-full flex-1`}>
          {cards.map((card, index) => (
            <div
              key={card.uniqueId}
              className="w-full h-full cursor-pointer animate-shuffleIn"
              onClick={() => handleCardClick(index)}
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'backwards'
              }}
            >
              <div className="relative w-full h-full">
                {/* Carta */}
                <div className={`relative w-full h-full transition-transform duration-600 transform-style-preserve-3d ${
                  card.isFlipped ? 'rotate-y-180' : ''
                }`}>
                  {/* Reverso (logo de empresa) */}
                  <div className="absolute inset-0 w-full h-full backface-hidden">
                    <div 
                      className="w-full h-full rounded-xl flex items-center justify-center shadow-lg border-2"
                      style={{ 
                        background: `linear-gradient(135deg, ${memotestConfig.company.color_primario} 0%, ${memotestConfig.company.color_secundario} 100%)`,
                        borderColor: memotestConfig.company.color_primario
                      }}
                    >
                      {memotestConfig.company.logo && (
                        <img 
                          src={memotestConfig.company.logo} 
                          alt="Logo"
                          className={`${getLogoSize()} object-contain`}
                        />
                      )}
                    </div>
                  </div>

                  {/* Frente (imagen de la carta) */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                    <div className={`w-full h-full rounded-xl shadow-lg border-4 overflow-hidden ${
                      card.isMatched 
                        ? 'bg-[#8ecc4f] border-[#004c40]' 
                        : 'bg-white border-gray-300'
                    }`}>
                      <img 
                        src={card.imagen} 
                        alt={`Carta ${card.id}`}
                        className="w-full h-full object-contain p-2"
                      />
                      {card.isMatched && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#8ecc4f] bg-opacity-80 border-2 border-[#004c40] rounded-xl">
                          <img 
                            src="/tick.png" 
                            alt="Correcto"
                            className="w-16 h-16 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
