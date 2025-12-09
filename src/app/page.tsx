'use client';

import { useState, useEffect } from 'react';
import { JuegoHabilitado, Company } from '@/types/api';
import Trivia from './components/Trivia';
import Memotest from './components/Memotest';
import Ruleta from './components/Ruleta';

export default function Home() {
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [games, setGames] = useState<JuegoHabilitado[]>([]);
  const [selectedGame, setSelectedGame] = useState<JuegoHabilitado | null>(null);
  const [clickedGameId, setClickedGameId] = useState<number | null>(null);

  useEffect(() => {
    // Crear juegos mock sin depender de la API
    const mockCompany: Company = {
      id: 1,
      nombre: 'Casino D3',
      background: '/background.png',
      logo: '/images/d3.jpg',
      color_primario: '#CD0303',
      color_secundario: '#FFD700',
      color_terciario: '#2F4F4F',
      ruleta_logo: '/ruleta.png',
      juegos_logo: '/juegos.png',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      imagenes: [],
      juegos_habilitados: [],
    };

    const mockGames: JuegoHabilitado[] = [
      {
        id: 1,
        nombre: 'Cena',
        descripcion: 'Activo a partir de las 20 hs',
        tipo: 'ruleta',
        activo: true,
        juego_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        nombre: 'Juegos',
        descripcion: '',
        tipo: 'juegos',
        activo: true,
        juego_id: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    setCompanyData(mockCompany);
    setGames(mockGames);
  }, []);

  const handleGameSelect = async (game: JuegoHabilitado) => {
    console.log('Juego seleccionado:', game);
    setClickedGameId(game.id);
    
    // Si el tipo es 'juegos', ejecutar el launcher en lugar de mostrar un componente
    if (game.tipo.toLowerCase() === 'juegos') {
      try {
        const response = await fetch('/api/launch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gameId: game.id,
          }),
        });
        const data = await response.json();
        if (data.success) {
          console.log('Launcher ejecutado correctamente:', data.message);
        } else {
          console.error('Error al ejecutar el launcher:', data.message);
        }
      } catch (error) {
        console.error('Error al llamar a la API del launcher:', error);
      } finally {
        // Resetear el estado después de un breve delay
        setTimeout(() => {
          setClickedGameId(null);
        }, 400);
      }
      return;
    }
    
    // Para otros tipos de juegos, comportamiento normal
    setTimeout(() => {
      setSelectedGame(game);
      setClickedGameId(null);
    }, 400);
  };

  const handleBackToMenu = () => {
    setSelectedGame(null);
  };

  const getGameImage = (gameType: string) => {
    if (!companyData) return '/trivia.png'; // fallback si no hay datos
    
    const type = gameType.toLowerCase();
    switch (type) {
      case 'trivia':
        return companyData.trivia_logo || '/trivia.png';
      case 'memotest':
        return companyData.memotest_logo || '/memotest.png';
      case 'ruleta':
        return companyData.ruleta_logo || '/ruleta.png';
      case 'juegos':
        return companyData.juegos_logo || '/juegos.png';
      default:
        return '/trivia.png'; // fallback
    }
  };

  // Si hay un juego seleccionado, mostrar el juego correspondiente
  if (selectedGame?.tipo === 'trivia') {
    return <Trivia juegoId={selectedGame.juego_id} onBack={handleBackToMenu} />;
  }

  if (selectedGame?.tipo === 'memotest') {
    return <Memotest juegoId={selectedGame.juego_id} onBack={handleBackToMenu} />;
  }

  if (selectedGame?.tipo === 'ruleta') {
    return (
      <>
        {/* Back button - top left corner, outside all containers */}
        <button
          onClick={handleBackToMenu}
          className="
            fixed top-4 left-4 z-[100]
            flex items-center justify-center
            w-16 h-16 rounded-full
            transform transition-all duration-300 ease-out
            bg-white/10 hover:bg-white/20 active:scale-95 hover:scale-105
            backdrop-filter backdrop-blur-md
            border-2 border-white/30
            shadow-lg
          "
          style={{
            boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.1)'
          }}
          title="Volver al menú"
        >
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-app-primary"
          >
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <Ruleta juegoId={selectedGame.juego_id} onBack={handleBackToMenu} />
      </>
    );
  }

  // Si no hay juego seleccionado, mostrar el menú principal
  return (
    <div className="h-full flex flex-col overflow-visible">
      {/* Main Content */}
      <main className="flex-1 p-0 overflow-visible flex items-center justify-center">
        <div className="flex flex-col items-center justify-center w-full">
          {/* Logo separado */}
          <div className="-mt-20 pb-8 flex justify-center items-center flex-shrink-0">
            <img 
              src="/logo_EOY.png" 
              alt="Logo End of Year" 
              className="h-64 w-auto object-contain"
            />
          </div>

          {/* Games Grid */}
          <div className="w-full flex items-center justify-center mt-8">
          {games.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">🎮</div>
                <h2 className="text-2xl text-app-primary mb-2">No hay juegos disponibles</h2>
                <p className="text-app-primary">No se encontraron juegos para esta empresa.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-20 w-full max-w-5xl items-center justify-center">
              {games.map((game) => {
              // Determinar el color e icono según el tipo de juego
              const buttonColor = game.tipo === 'ruleta' ? '#F072A2' : '#61BDC0';
              const iconSrc = game.tipo === 'ruleta' ? '/images/cena.png' : '/juegos.png';
              const iconAlt = game.tipo === 'ruleta' ? 'Icono de Cena' : 'Icono de Juegos';
              
              return (
                <button
                  key={game.id}
                  onClick={() => handleGameSelect(game)}
                  disabled={clickedGameId !== null}
                  style={{ 
                    height: 'auto',
                    minHeight: '350px',
                    background: buttonColor,
                    borderTop: '10px solid #000000',
                    borderLeft: '10px solid #000000',
                    borderRight: '10px solid #000000',
                    borderBottom: '20px solid #000000',
                    borderRadius: '24px',
                    boxShadow: clickedGameId === game.id 
                      ? '0 12px 40px 0 rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(255, 255, 255, 0.2)'
                      : '0 10px 35px 0 rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.15)'
                  }}
                  className={`relative transition-all duration-500 ease-out transform p-8 flex items-center justify-start w-full overflow-hidden group
                    ${clickedGameId === game.id 
                      ? 'scale-105 -translate-y-1' 
                      : clickedGameId !== null
                      ? 'opacity-60 scale-98'
                      : 'hover:-translate-y-1 active:translate-y-1 hover:scale-[1.02]'
                    }`}
                >
                  {/* Efecto de brillo */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)`,
                      animation: 'liquidMove 3s ease-in-out infinite',
                      borderRadius: '24px'
                    }}
                  />
                  
                  {/* Icono a la izquierda */}
                  <div className="relative z-10 flex-shrink-0 mr-8">
                    <img 
                      src={iconSrc} 
                      alt={iconAlt}
                      className="w-64 h-64 object-contain"
                    />
                  </div>
                  
                  {/* Texto a la derecha */}
                  <div className="relative z-10 flex flex-col items-start text-left">
                    <h3 className="text-6xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                      {game.nombre}
                    </h3>
                    <p className="text-3xl text-white/90" style={{ fontFamily: 'var(--font-montserrat)' }}>
                      {game.descripcion}
                    </p>
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
          )}
          </div>
        </div>
      </main>

      {/* Footer con estrellas y texto */}
      {games.length > 0 && (
        <footer className="flex-shrink-0 pb-12 pt-0 flex justify-center">
          <div className="flex flex-col items-center gap-0">
            <img src="/images/estrellas.png" alt="Logo" className="w-120 h-120 object-contain" />
            <p className="text-7xl font-bold text-app-primary leading-none -mt-15" >Make it work,</p>
            <p className="text-7xl font-bold text-app-primary leading-none" >Make it better</p>
          </div>
        </footer>
      )}
    </div>
  );
}
