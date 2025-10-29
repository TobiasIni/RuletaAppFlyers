'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { TriviaConfig, TriviaQuestion } from '@/types/api';

interface TriviaGameProps {
  triviaConfig: TriviaConfig;
  onFinish: (score: number, total: number) => void;
  onBack: () => void;
}

type GameState = 'question' | 'timeout' | 'answered';

export default function TriviaGame({ triviaConfig, onFinish, onBack }: TriviaGameProps) {
  // Mezclar preguntas una sola vez al montar el componente
  const selectedQuestions = useMemo(() => {
    const allQuestions = triviaConfig.questions;
    const cantidadPreguntas = triviaConfig.trivia.cantidad_preguntas;

    const shuffled = [...allQuestions];
   /*  for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
 */
    if (cantidadPreguntas && cantidadPreguntas > 0 && cantidadPreguntas <= shuffled.length) {
      return shuffled.slice(0, cantidadPreguntas);
    }

    return shuffled;
  // Dependencias vacías para que no se remezcle durante la partida
  }, []);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameState, setGameState] = useState<GameState>('question');
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showTimeout, setShowTimeout] = useState(false);

  const currentQuestion = selectedQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === selectedQuestions.length - 1;

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
      // Verificar que no estamos en la última pregunta antes de continuar
      if (currentQuestionIndex < selectedQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setGameState('question');
      } else {
        onFinish(score, selectedQuestions.length);
      }
    }, 2000);
  }, [currentQuestionIndex, selectedQuestions.length, score, onFinish]);

  const handleAnswer = (answer: string) => {
    if (gameState !== 'question') return;
    
    setSelectedAnswer(answer);
    setGameState('answered');
    
    // Verificar si es correcta - comparar la letra con respuesta_correcta
    const isCorrect = answer === currentQuestion.respuesta_correcta;
    
    let newScore = score;
    if (isCorrect) {
      newScore = score + 1;
      setScore(newScore);
    }

    // Mostrar resultado por 2 segundos antes de continuar
    setTimeout(() => {
      if (isLastQuestion) {
        onFinish(newScore, selectedQuestions.length);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
        setGameState('question');
      }
    }, 2000);
  };

  const nextQuestion = () => {
    if (isLastQuestion) {
      onFinish(score, selectedQuestions.length);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setGameState('question');
    }
  };

  const getOptionLetter = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  const getOptionText = (index: number) => {
    if (!currentQuestion) return '';
    const options = [
      currentQuestion.opcion_a,
      currentQuestion.opcion_b,
      currentQuestion.opcion_c,
      currentQuestion.opcion_d
    ].filter(Boolean);
    return options[index];
  };

  const getOptionImage = (index: number) => {
    if (!currentQuestion) return null;
    const images = [
      currentQuestion.opcion_a_imagen,
      currentQuestion.opcion_b_imagen,
      currentQuestion.opcion_c_imagen,
      currentQuestion.opcion_d_imagen
    ];
    return images[index];
  };

  const isCorrectAnswer = (answer: string) => {
    return currentQuestion ? answer === currentQuestion.respuesta_correcta : false;
  };

  const isSelectedAnswer = (answer: string) => {
    return selectedAnswer === answer;
  };

  const getAnswerStyle = (answer: string) => {
    if (gameState !== 'answered' && gameState !== 'timeout') {
      return 'border-gray-800 hover:scale-105 hover:shadow-lg';
    }
    
    if (isCorrectAnswer(answer)) {
      return 'text-white border-green-600';
    }
    
    if (isSelectedAnswer(answer) && !isCorrectAnswer(answer)) {
      return 'text-white border-red-600';
    }
    
    return 'border-gray-800';
  };

  const getAnswerBackground = (answer: string) => {
    if (gameState !== 'answered' && gameState !== 'timeout') {
      return 'rgba(255, 255, 255, 0.1)';
    }
    
    if (isCorrectAnswer(answer)) {
      return 'rgba(142, 204, 79, 0.8)'; // Verde con transparencia
    }
    
    if (isSelectedAnswer(answer) && !isCorrectAnswer(answer)) {
      return 'rgba(199, 35, 43, 0.8)'; // Rojo con transparencia
    }
    
    return 'rgba(255, 255, 255, 0.1)';
  };

  const progressPercentage = (timeLeft / 20) * 100;
  const isLowTime = timeLeft <= 5;

  // Validar que existe la pregunta actual después de todos los hooks
  if (!currentQuestion) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-white">Error: No se encontró la pregunta</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Contenido principal sin header */}
      <main className="flex-1 p-8 flex flex-col">
        {showTimeout ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <img 
                src="/tiempo.png" 
                alt="Tiempo agotado"
                className="w-264 h-264 mx-auto mb-8 object-contain"
              />
              <p className="text-2xl text-gray-600">Pasando a la siguiente pregunta...</p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto flex flex-col flex-1 w-full">
            {/* Temporizador circular (más grande) */}
            <div className="flex justify-center mb-8">
              <div className="relative w-40 h-40">
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
                    stroke={isLowTime ? "#ef4444" : "#22c55e"}
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
                <div className={`absolute inset-0 flex items-center justify-center text-5xl ${isLowTime ? 'text-red-600 animate-pulse' : 'text-white'}`}>
                  {timeLeft}
                </div>
              </div>
            </div>

            {/* Pregunta */}
            <div className="text-center mb-12">
              <h2 className="text-6xl text-white font-bold mb-4 " style={{ letterSpacing: '0.05em' }}>
                {currentQuestion?.pregunta || 'Pregunta no disponible'}
              </h2>
              {currentQuestion?.pregunta_imagen && (
                <img 
                  src={currentQuestion.pregunta_imagen} 
                  alt="Imagen de la pregunta"
                  className="max-w-xs mx-auto rounded-lg"
                />
              )}
            </div>

            {/* Opciones de respuesta */}
            <div className="flex flex-col gap-10 flex-1">
              {currentQuestion && [currentQuestion.opcion_a, currentQuestion.opcion_b, currentQuestion.opcion_c, currentQuestion.opcion_d]
                .filter(Boolean)
                .map((option, index) => {
                  const letter = getOptionLetter(index);
                  const isCorrect = isCorrectAnswer(letter);
                  const isSelected = isSelectedAnswer(letter);
                  const optionImage = getOptionImage(index);
                  
                  return (
                    <button
                      key={`${currentQuestionIndex}-${index}`}
                      onClick={() => handleAnswer(letter)}
                      disabled={gameState !== 'question'}
                      className={`
                        relative p-10 rounded-2xl border-4 shadow-lg transition-all duration-500 text-left flex-1 w-full overflow-hidden group
                        ${getAnswerStyle(letter)}
                        ${gameState === 'question' ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-not-allowed'}
                        animate-slideUp
                      `}
                      style={{
                        color: 'white',
                        background: getAnswerBackground(letter),
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: 'backwards',
                        backdropFilter: 'blur(10px)',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2), inset 0 0 15px rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {/* Efecto de brillo líquido */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, transparent 70%)`,
                          animation: 'liquidMove 3s ease-in-out infinite'
                        }}
                      />
                      {/* Reflejo superior */}
                      <div 
                        className="absolute top-0 left-0 right-0 h-1/3 opacity-20 pointer-events-none"
                        style={{
                          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, transparent 100%)',
                          borderRadius: '1rem 1rem 0 0'
                        }}
                      />
                      <div className="flex items-center gap-8 h-full relative z-10">
                        {optionImage ? (
                          <div className="flex items-center justify-center w-36 h-36 flex-shrink-0">
                            <img 
                              src={optionImage} 
                              alt={`Opción ${letter}`}
                              className="max-w-full max-h-full object-contain rounded-lg"
                            />
                          </div>
                        ) : (
                          <div className={`
                            flex items-center justify-center 
                            ${gameState === 'question' 
                              ? 'text-blue-500' 
                              : isCorrect 
                                ? 'text-green-500' 
                                : isSelected 
                                  ? 'text-red-500'
                                  : 'text-gray-800'
                            }
                          `}>
                          </div>
                        )}
                        <div className="flex-1 flex items-center">
                          <p className="text-6xl font-medium">{option}</p>
                        </div>
                        {gameState === 'answered' && isCorrect && (
                          <div className="text-white text-4xl flex-shrink-0">✓</div>
                        )}
                        {gameState === 'answered' && isSelected && !isCorrect && (
                          <div className="text-white text-4xl flex-shrink-0">✗</div>
                        )}
                      </div>
                      <style jsx>{`
                        @keyframes liquidMove {
                          0%, 100% { transform: translate(0%, 0%) scale(1); }
                          33% { transform: translate(30%, -30%) scale(1.2); }
                          66% { transform: translate(-30%, 30%) scale(1.1); }
                        }
                      `}</style>
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
