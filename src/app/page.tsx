'use client';

import { useState, useEffect } from 'react';
import { JuegoHabilitado, Company } from '@/types/api';
import { getCompanyData } from '@/lib/api';

export default function Home() {
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [games, setGames] = useState<JuegoHabilitado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    // Aquí implementarás la lógica para navegar al juego seleccionado
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

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header 
        className="text-white p-6 text-center"
        style={{
          background: `linear-gradient(135deg, ${companyData?.color_primario || '#667eea'} 0%, ${companyData?.color_secundario || '#764ba2'} 100%)`
        }}
      >
        {companyData?.logo && (
          <div className="mb-4">
            <img 
              src={companyData.logo} 
              alt={`Logo de ${companyData.nombre}`}
              className="h-16 w-auto mx-auto"
            />
          </div>
        )}
        <h1 className="text-4xl font-bold mb-2">Selecciona un Juego</h1>
        <p className="text-xl opacity-90">Elige el juego que quieres jugar</p>
      </header>

      {/* Games Grid */}
      <main className="flex-1 p-8 overflow-y-auto">
        {games.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No hay juegos disponibles</h2>
              <p className="text-gray-600">No se encontraron juegos para esta empresa.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => handleGameSelect(game)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 p-6 text-left border-2 border-transparent hover:border-blue-300"
              >
                <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-white text-4xl">🎮</div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{game.nombre}</h3>
                {game.descripcion && (
                  <p className="text-gray-600 text-sm">{game.descripcion}</p>
                )}
                <div className="mt-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {game.tipo}
                  </span>
                </div>
                <div className="mt-4 flex items-center text-blue-600 font-semibold">
                  <span>Jugar</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer 
        className="p-4 text-center text-white"
        style={{ backgroundColor: companyData?.color_terciario || '#f3f4f6' }}
      >
        <p className="text-gray-600">
          {companyData?.nombre ? `${companyData.nombre} - ` : ''}Tótem de Juegos D3
        </p>
      </footer>
    </div>
  );
}
