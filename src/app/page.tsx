'use client';

import { useState, useEffect } from 'react';
import { JuegoHabilitado, Company } from '@/types/api';
import { getCompanyData } from '@/lib/api';
import Trivia from './components/Trivia';
import Memotest from './components/Memotest';

export default function Home() {
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [games, setGames] = useState<JuegoHabilitado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<JuegoHabilitado | null>(null);
  const [clickedGameId, setClickedGameId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const data = await getCompanyData();
        setCompanyData(data);
        // Filtrar solo los juegos activos
        const activeGames = data.juegos_habilitados.filter(juego => juego.activo);
        setGames(activeGames);
        setError(null);
      } catch (err) {
        console.error('Error al cargar los datos:', err);
        setError('Error al cargar los datos. Por favor, verifica la configuración.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  const handleGameSelect = (game: JuegoHabilitado) => {
    console.log('Juego seleccionado:', game);
    setClickedGameId(game.id);
    // Esperar 400ms para la animación antes de cambiar de vista
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
      default:
        return '/trivia.png'; // fallback
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Cargando juegos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl  text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Si hay un juego seleccionado, mostrar el juego correspondiente
  if (selectedGame?.tipo === 'trivia') {
    return <Trivia juegoId={selectedGame.juego_id} onBack={handleBackToMenu} />;
  }

  if (selectedGame?.tipo === 'memotest') {
    return <Memotest juegoId={selectedGame.juego_id} onBack={handleBackToMenu} />;
  }

  // Si no hay juego seleccionado, mostrar el menú principal
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header 
        className="text-white p-6 text-center"
        style={{
          background: "transparent"
        }}
      >
      
        <h1 className="text-8xl font-extrabold mb-2">Seleccioná un juego para comenzar</h1>
      </header>

      {/* Games Grid */}
      <main className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
        {games.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-2xl  text-gray-800 mb-2">No hay juegos disponibles</h2>
              <p className="text-gray-600">No se encontraron juegos para esta empresa.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 w-full max-w-4xl h-full items-center justify-center">
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => handleGameSelect(game)}
                disabled={clickedGameId !== null}
                style={{ 
                  height: `calc((100% - ${(3 - 1) * 1.5}rem) / 3)`,
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '4px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: clickedGameId === game.id 
                    ? '0 10px 32px 0 rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.15)'
                    : '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)'
                }}
                className={`relative rounded-2xl transition-all duration-500 ease-out transform p-4 flex flex-col w-full overflow-hidden group
                  ${clickedGameId === game.id 
                    ? 'scale-105 -translate-y-1' 
                    : clickedGameId !== null
                    ? 'opacity-60 scale-98'
                    : 'hover:-translate-y-1 active:translate-y-1 hover:scale-[1.02]'
                  }`}
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
                <div className="w-full h-full rounded-lg flex items-center justify-center overflow-hidden relative z-10">
                  <img 
                    src={getGameImage(game.tipo)} 
                    alt={`Imagen de ${game.nombre}`}
                    className={`w-full h-full object-contain p-4 transition-transform duration-300 ease-out ${
                      clickedGameId === game.id ? 'scale-105' : ''
                    }`}
                    onError={(e) => {
                      // Fallback a emoji si la imagen no se carga
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) {
                        fallback.style.display = 'flex';
                      }
                    }}
                  />
                  <div className="text-white text-4xl hidden">🎮</div>
                </div>
                <style jsx>{`
                  @keyframes liquidMove {
                    0%, 100% { transform: translate(0%, 0%) scale(1); }
                    33% { transform: translate(30%, -30%) scale(1.2); }
                    66% { transform: translate(-30%, 30%) scale(1.1); }
                  }
                `}</style>
              </button>
            ))}
          <p className="text-white text-5xl mt-40" style={{ fontFamily: 'var(--font-montserrat)' }}>#LlegamosLejosParaEstarCerca</p>
          </div>

        )}
      </main>

     
    </div>
  );
}
