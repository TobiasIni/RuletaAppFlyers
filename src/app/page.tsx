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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
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
          background: "#000"
        }}
      >
        {companyData?.logo && (
          <div className="mb-4">
           {/*  <img 
              src={companyData.logo} 
              alt={`Logo de ${companyData.nombre}`}
              className="h-16 w-auto mx-auto"
            /> */}
          </div>
        )}
        <h1 className="text-4xl font-bold mb-2">SELECCIONA UN JUEGO</h1>
      </header>

      {/* Games Grid */}
      <main className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
        {games.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No hay juegos disponibles</h2>
              <p className="text-gray-600">No se encontraron juegos para esta empresa.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 w-full max-w-4xl h-full justify-center">
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => handleGameSelect(game)}
                disabled={clickedGameId !== null}
                className={`bg-white rounded-xl transition-all duration-300 ease-out transform p-4 border-4 border-gray-800 backdrop-blur-sm flex-1 flex flex-col
                  ${clickedGameId === game.id 
                    ? 'scale-105 shadow-[0_10px_0_0_rgba(0,0,0,0.25)] -translate-y-1' 
                    : clickedGameId !== null
                    ? 'opacity-60 scale-98'
                    : 'shadow-[0_8px_0_0_rgba(0,0,0,0.2)] hover:shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] hover:-translate-y-1 active:translate-y-1'
                  }`}
              >
                <div className="w-full h-full rounded-lg flex items-center justify-center overflow-hidden">
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
              </button>
            ))}
          </div>
        )}
      </main>

     
    </div>
  );
}
