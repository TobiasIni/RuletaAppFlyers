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
  // Seleccionar preguntas aleatorias si hay cantidad_preguntas definida
  const selectedQuestions = useMemo(() => {
    const allQuestions = triviaConfig.questions;
    const cantidadPreguntas = triviaConfig.trivia.cantidad_preguntas;
    
    if (cantidadPreguntas && cantidadPreguntas < allQuestions.length) {
      // Crear una copia del array y mezclarla
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      // Tomar solo la cantidad solicitada
      return shuffled.slice(0, cantidadPreguntas);
    }
    
    return allQuestions;
  }, [triviaConfig]);

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
      nextQuestion();
    }, 2000);
  }, [currentQuestionIndex, isLastQuestion]);

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
    const options = [
      currentQuestion.opcion_a,
      currentQuestion.opcion_b,
      currentQuestion.opcion_c,
      currentQuestion.opcion_d
    ].filter(Boolean);
    return options[index];
  };

  const getOptionImage = (index: number) => {
    const images = [
      currentQuestion.opcion_a_imagen,
      currentQuestion.opcion_b_imagen,
      currentQuestion.opcion_c_imagen,
      currentQuestion.opcion_d_imagen
    ];
    return images[index];
  };

  const isCorrectAnswer = (answer: string) => {
    return answer === currentQuestion.respuesta_correcta;
  };

  const isSelectedAnswer = (answer: string) => {
    return selectedAnswer === answer;
  };

  const getAnswerStyle = (answer: string) => {
    if (gameState !== 'answered' && gameState !== 'timeout') {
      return 'bg-white border-gray-800 text-black hover:scale-105 hover:shadow-lg';
    }
    
    if (isCorrectAnswer(answer)) {
      return 'bg-[#8ecc4f] text-white border-green-600';
    }
    
    if (isSelectedAnswer(answer) && !isCorrectAnswer(answer)) {
      return 'bg-[#c7232b] text-white border-red-600';
    }
    
    return 'bg-white border-gray-800 text-black';
  };

  const progressPercentage = (timeLeft / 20) * 100;
  const isLowTime = timeLeft <= 5;

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
          <h1 className="text-2xl  text-gray-800">Trivia</h1>
        )}
        
        
      </header>

      {/* Contenido principal */}
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

            {/* Pregunta */}
            <div className="text-center mb-12">
              <h2 className="text-3xl  text-gray-800 mb-4">
                {currentQuestion.pregunta}
              </h2>
              {currentQuestion.pregunta_imagen && (
                <img 
                  src={currentQuestion.pregunta_imagen} 
                  alt="Imagen de la pregunta"
                  className="max-w-xs mx-auto rounded-lg"
                />
              )}
            </div>

            {/* Opciones de respuesta */}
            <div className="flex flex-col gap-10 flex-1">
              {[currentQuestion.opcion_a, currentQuestion.opcion_b, currentQuestion.opcion_c, currentQuestion.opcion_d]
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
                        p-10 rounded-2xl border-4 shadow-lg transition-all duration-300 text-left flex-1 w-full
                        ${getAnswerStyle(letter)}
                        ${gameState === 'question' ? 'cursor-pointer' : 'cursor-not-allowed'}
                        animate-slideUp
                      `}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: 'backwards'
                      }}
                    >
                      <div className="flex items-center gap-8 h-full">
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
                            flex items-center justify-center text-8xl flex-shrink-0 w-24
                            ${gameState === 'question' 
                              ? 'text-blue-500' 
                              : isCorrect 
                                ? 'text-green-500' 
                                : isSelected 
                                  ? 'text-red-500'
                                  : 'text-gray-800'
                            }
                          `}>
                            {letter}
                          </div>
                        )}
                        <div className="flex-1 flex items-center">
                          <p className="text-3xl font-medium">{option}</p>
                        </div>
                        {gameState === 'answered' && isCorrect && (
                          <div className="text-white text-4xl flex-shrink-0">✓</div>
                        )}
                        {gameState === 'answered' && isSelected && !isCorrect && (
                          <div className="text-white text-4xl flex-shrink-0">✗</div>
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
