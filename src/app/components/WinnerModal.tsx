'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface Prize {
  id: string;
  text: string;
  color: string;
  probability?: number;
  positive?: boolean;
}

interface WinnerModalProps {
  winner: Prize | null;
  isOpen: boolean;
  onClose: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, isOpen, onClose }) => {
  useEffect(() => {
    console.log('🔥 WinnerModal useEffect triggered:', { 
      isOpen, 
      winner: winner?.text, 
      positive: winner?.positive 
    });
    
    if (isOpen && winner) {
      console.log('🎯 Modal is open and winner exists');
      
      // Only show confetti if the prize is positive (winning)
      const isWinning = winner.positive === true;
      console.log('🏆 Is this a winning prize?', isWinning);
      
      if (isWinning) {
        console.log('🎉 This is a WIN! Launching confetti...');
        
        // Set a small delay to ensure DOM is ready
        const timer = setTimeout(() => {
          console.log('🚀 Launching WINNER confetti NOW!');
          
          try {
            // First burst - colorful confetti
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
            });
            console.log('✅ First winner confetti launched successfully');
            
            // Second burst for winners
            setTimeout(() => {
              try {
                confetti({
                  particleCount: 100,
                  angle: 60,
                  spread: 55,
                  origin: { x: 0 }
                });
                confetti({
                  particleCount: 100,
                  angle: 120,
                  spread: 55,
                  origin: { x: 1 }
                });
                console.log('✅ Second winner confetti launched successfully');
              } catch (error) {
                console.error('❌ Error in second winner confetti:', error);
              }
            }, 500);
            
          } catch (error) {
            console.error('❌ Error in first winner confetti:', error);
          }
        }, 100);
        
        return () => {
          clearTimeout(timer);
        };
      } else {
        console.log('💔 This is a LOSS - no confetti for you!');
      }
    }
  }, [isOpen, winner]);

  if (!isOpen || !winner) return null;

  const isPositive = winner.positive !== false; // Default to positive if undefined

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
    }}>
      <div className="rounded-2xl p-10 max-w-2xl w-full text-center shadow-2xl transform border-4 border-white relative overflow-hidden" style={{
        background: 'rgba(20, 20, 20, 0.6)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.05)'
      }}>
        {/* Shine effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${
          isPositive ? 'via-yellow-500/20' : 'via-red-500/20'
        } to-transparent transform rotate-45 translate-x-[-100%] animate-pulse`}></div>
        
        <div className="relative z-10">
          <div className="mb-8">
            <p className="text-3xl text-app-secondary" style={{ fontFamily: 'var(--font-montserrat)' }}>
              {isPositive ? 'TU MESA ES' : '¡Mejor suerte la próxima vez!'}
            </p>
          </div>

          <div
            className="inline-block px-10 py-8 rounded-xl text-app-secondary font-bold text-5xl mb-10 shadow-2xl border-4 border-white bg-gradient-to-br from-gray-800 to-black"
            style={{ 
              backgroundColor: winner.color,
              boxShadow: `0 0 30px ${winner.color}50, inset 0 0 20px rgba(0,0,0,0.5)`,
              fontFamily: 'var(--font-montserrat)'
            }}
          >
            {winner.text}
          </div>

          <button
            onClick={() => {
              onClose();
            }}
            className="relative w-full py-6 px-8 rounded-2xl font-bold text-2xl transform transition-all duration-500 ease-out overflow-hidden group hover:-translate-y-1 active:translate-y-1 hover:scale-[1.02]"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)',
              fontFamily: 'var(--font-montserrat)'
            }}
          >
            {/* Efecto de brillo líquido */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
                animation: 'liquidMove 3s ease-in-out infinite'
              }}
            />
            
            {/* Reflejo superior */}
            <div 
              className="absolute top-0 left-0 right-0 h-1/3 opacity-30 pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, transparent 100%)',
                borderRadius: '1rem 1rem 0 0'
              }}
            />
            
            <span className="flex items-center justify-center space-x-4 relative z-10 text-app-secondary">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3L8 7L12 11" fill="currentColor"/>
                <path d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="tracking-wider">
                {isPositive ? 'GIRAR DE NUEVO' : 'INTENTAR DE NUEVO'}
              </span>
            </span>
            
            <style jsx>{`
              @keyframes liquidMove {
                0%, 100% { transform: translate(0%, 0%) scale(1); }
                33% { transform: translate(30%, -30%) scale(1.2); }
                66% { transform: translate(-30%, 30%) scale(1.1); }
              }
            `}</style>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;

