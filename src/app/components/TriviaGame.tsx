'use client';

import { useState, useEffect, useCallback } from 'react';
import { TriviaConfig, TriviaQuestion } from '@/types/api';

interface TriviaGameProps {
  triviaConfig: TriviaConfig;
  onFinish: (score: number, total: number) => void;
  onBack: () => void;
}

type GameState = 'question' | 'timeout' | 'answered';

export default function TriviaGame({ triviaConfig, onFinish, onBack }: TriviaGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameState, setGameState] = useState<GameState>('question');
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showTimeout, setShowTimeout] = useState(false);

  const currentQuestion = triviaConfig.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === triviaConfig.questions.length - 1;

  // Temporizador
  useEffect(() => {
    if (gameState !== 'question') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Reset timer cuando cambia la pregunta
  useEffect(() => {
    if (gameState === 'question') {
      setTimeLeft(20);
      setSelectedAnswer(null);
    }
  }, [currentQuestionIndex, gameState]);

  const handleTimeout = useCallback(() => {
    setGameState('timeout');
    setShowTimeout(true);
    
    setTimeout(() => {
      setShowTimeout(false);
      nextQuestion();
    }, 2000);
  }, [currentQuestionIndex, isLastQuestion]);

  const handleAnswer = (answer: string) => {
    if (gameState !== 'question') return;
    
    setSelectedAnswer(answer);
    setGameState('answered');
    
    // Verificar si es correcta
    if (answer === currentQuestion.respuesta_correcta) {
      setScore(prev => prev + 1);
    }

    // Mostrar resultado por 2 segundos antes de continuar
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = () => {
    if (isLastQuestion) {
      onFinish(score, triviaConfig.questions.length);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setGameState('question');
    }
  };

  const getOptionLetter = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  const getOptionText = (index: number) => {
    const options = [
      currentQuestion.opcion_a,
      currentQuestion.opcion_b,
      currentQuestion.opcion_c,
      currentQuestion.opcion_d
    ].filter(Boolean);
    return options[index];
  };

  const isCorrectAnswer = (answer: string) => {
    return answer === currentQuestion.respuesta_correcta;
  };

  const isSelectedAnswer = (answer: string) => {
    return selectedAnswer === answer;
  };

  const getAnswerStyle = (answer: string) => {
    if (gameState !== 'answered' && gameState !== 'timeout') {
      return 'hover:scale-105 hover:shadow-lg';
    }
    
    if (isCorrectAnswer(answer)) {
      return 'bg-green-500 text-white border-green-600';
    }
    
    if (isSelectedAnswer(answer) && !isCorrectAnswer(answer)) {
      return 'bg-red-500 text-white border-red-600';
    }
    
    return 'bg-gray-200 text-gray-600';
  };

  const progressPercentage = (timeLeft / 20) * 100;
  const isLowTime = timeLeft <= 5;

  return (
    <div className="h-full flex flex-col">
      {/* Header fijo */}
      <header 
        className="text-white p-4 flex items-center justify-between"
        style={{
          background: `linear-gradient(135deg, ${triviaConfig.company.color_primario} 0%, ${triviaConfig.company.color_secundario} 100%)`
        }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Volver al Menú</span>
        </button>
        
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold">
            Pregunta {currentQuestionIndex + 1} de {triviaConfig.questions.length}
          </span>
          <span className="text-lg font-bold">Puntuación: {score}</span>
        </div>
        
        <div></div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 p-8">
        {showTimeout ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">⏰</div>
              <h2 className="text-3xl font-bold text-red-600 mb-4">¡Tiempo agotado!</h2>
              <p className="text-xl text-gray-600">Pasando a la siguiente pregunta...</p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
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
                <div className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${isLowTime ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
                  {timeLeft}
                </div>
              </div>
            </div>

            {/* Pregunta */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {currentQuestion.pregunta}
              </h2>
              {currentQuestion.pregunta_imagen && (
                <img 
                  src={currentQuestion.pregunta_imagen} 
                  alt="Imagen de la pregunta"
                  className="max-w-md mx-auto rounded-lg shadow-lg"
                />
              )}
            </div>

            {/* Opciones de respuesta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[currentQuestion.opcion_a, currentQuestion.opcion_b, currentQuestion.opcion_c, currentQuestion.opcion_d]
                .filter(Boolean)
                .map((option, index) => {
                  const letter = getOptionLetter(index);
                  const isCorrect = isCorrectAnswer(letter);
                  const isSelected = isSelectedAnswer(letter);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(letter)}
                      disabled={gameState !== 'question'}
                      className={`
                        p-6 rounded-xl border-2 shadow-lg transition-all duration-300 text-left
                        ${getAnswerStyle(letter)}
                        ${gameState === 'question' ? 'cursor-pointer' : 'cursor-not-allowed'}
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                          ${gameState === 'question' 
                            ? 'bg-blue-500 text-white' 
                            : isCorrect 
                              ? 'bg-green-500 text-white' 
                              : isSelected 
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-300 text-gray-600'
                          }
                        `}>
                          {letter}
                        </div>
                        <div className="flex-1">
                          <p className="text-lg font-medium">{option}</p>
                        </div>
                        {gameState === 'answered' && isCorrect && (
                          <div className="text-green-600 text-2xl">✓</div>
                        )}
                        {gameState === 'answered' && isSelected && !isCorrect && (
                          <div className="text-red-600 text-2xl">✗</div>
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
