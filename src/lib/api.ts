import { Company, TriviaConfig, MemotestConfig, RuletaConfig, RuletaPremio } from '@/types/api';

// Función mock que devuelve datos estáticos de la empresa
export async function getCompanyData(): Promise<Company> {
  console.log('🔧 Modo sin API - Devolviendo datos mock de empresa');
  
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const mockData: Company = {
    id: 1,
    nombre: 'Casino D3',
    background: '/background.png',
    logo: '/images/d3.jpg',
    color_primario: '#CD0303',
    color_secundario: '#FFD700',
    color_terciario: '#2F4F4F',
    color_cuarteario: '#F08097',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagenes: [],
    juegos_habilitados: [],
  };
  
  console.log('✅ Datos mock devueltos:', mockData);
  return mockData;
}

export async function getTriviaConfig(triviaId: number): Promise<TriviaConfig> {
  console.log('🔧 Modo sin API - Devolviendo configuración mock de trivia:', triviaId);
  
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const mockConfig: TriviaConfig = {
    trivia: {
      id: triviaId,
      nombre: 'Trivia Mock',
      descripcion: 'Trivia de prueba',
      company_id: 1,
      activa: true,
      cantidad_preguntas: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    company: {
      id: 1,
      nombre: 'Casino D3',
      background: '/background.png',
      logo: '/images/d3.jpg',
      color_primario: '#CD0303',
      color_secundario: '#FFD700',
      color_terciario: '#2F4F4F',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      imagenes: [],
      juegos_habilitados: [],
    },
    questions: [],
  };
  
  console.log('✅ Configuración mock de trivia devuelta:', mockConfig);
  return mockConfig;
}

export async function getMemotestConfig(memotestId: number): Promise<MemotestConfig> {
  console.log('🔧 Modo sin API - Devolviendo configuración mock de memotest:', memotestId);
  
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const mockConfig: MemotestConfig = {
    memotest: {
      id: memotestId,
      nombre: 'Memotest Mock',
      descripcion: 'Memotest de prueba',
      company_id: 1,
      activo: true,
      cantidad_de_parejas: 0,
      tiempo: 60,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    company: {
      id: 1,
      nombre: 'Casino D3',
      background: '/background.png',
      logo: '/images/d3.jpg',
      color_primario: '#CD0303',
      color_secundario: '#FFD700',
      color_terciario: '#2F4F4F',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      imagenes: [],
      juegos_habilitados: [],
    },
    parejas: [],
  };
  
  console.log('✅ Configuración mock de memotest devuelta:', mockConfig);
  return mockConfig;
}

export async function getRuletaConfig(ruletaId: number): Promise<RuletaConfig> {
  console.log('🔧 Modo sin API - Devolviendo configuración mock de ruleta:', ruletaId);
  
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const mockConfig: RuletaConfig = {
    ruleta: {
      id: ruletaId,
      nombre: 'Ruleta Mock',
      descripcion: 'Ruleta de prueba',
      company_id: 1,
      activa: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    company: {
      id: 1,
      nombre: 'Casino D3',
      background: '/background.png',
      logo: '/images/d3.jpg',
      color_primario: '#CD0303',
      color_secundario: '#FFD700',
      color_terciario: '#2F4F4F',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      imagenes: [],
      juegos_habilitados: [],
    },
    premios: [
      
    ],
  };
  
  console.log('✅ Configuración mock de ruleta devuelta:', mockConfig);
  return mockConfig;
}

export async function spinRuleta(ruletaId: number): Promise<{premio_ganado: RuletaPremio | null, mensaje: string, exito: boolean}> {
  console.log('🎰 Llamando API real para girar ruleta:', ruletaId);
  
  try {
    const response = await fetch(`https://api-cmsd3.manzini.com.ar/ruletas/${ruletaId}/spin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    console.log('✅ Respuesta completa de la API:', {
      status: response.status,
      ok: response.ok,
      data: data
    });

    // Si la respuesta HTTP no es OK (200-299)
    if (!response.ok) {
      return {
        premio_ganado: null,
        mensaje: data.mensaje || data.message || data.error || `Error HTTP: ${response.status}`,
        exito: false,
      };
    }
    
    // La API devuelve algo como:
    // Éxito: { premio_ganado: {...}, mensaje: "...", exito: true }
    // Error: { mensaje: "No hay premios disponibles", exito: false }
    return {
      premio_ganado: data.premio_ganado || data.premio || null,
      mensaje: data.mensaje || data.message || 'Giro exitoso',
      exito: data.exito !== undefined ? data.exito : data.success !== undefined ? data.success : (data.premio_ganado ? true : false),
    };
  } catch (error) {
    console.error('❌ Error al girar la ruleta:', error);
    throw error;
  }
}
