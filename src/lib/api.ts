import { Company, TriviaConfig, MemotestConfig } from '@/types/api';
import { getConfig } from '@/config/constants';

export async function getCompanyData(): Promise<Company> {
  const { companyId, apiBaseUrl } = getConfig();
  
  console.log('🔧 Variables de entorno:');
  console.log('COMPANY_ID:', process.env.COMPANY_ID || 'No configurado (usando valor por defecto: 5)');
  console.log('API_BASE_URL:', process.env.API_BASE_URL || 'No configurado (usando valor por defecto)');
  console.log('📋 Configuración final:', { companyId, apiBaseUrl });
  
  const url = `${apiBaseUrl}/companies/${companyId}`;
  console.log('🌐 URL de la API:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    console.log('📡 Respuesta de la API:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`Error al obtener los datos de la empresa: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Datos recibidos:', data);
    return data;
  } catch (error) {
    console.error('❌ Error al conectar con la API:', error);
    throw error;
  }
}

export async function getTriviaConfig(triviaId: number): Promise<TriviaConfig> {
  const { apiBaseUrl } = getConfig();
  
  console.log('🔧 Obteniendo configuración de trivia:', triviaId);
  
  const url = `${apiBaseUrl}/trivias/${triviaId}/config`;
  console.log('🌐 URL de la API:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    console.log('📡 Respuesta de la API:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`Error al obtener la configuración de la trivia: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Configuración de trivia recibida:', data);
    return data;
  } catch (error) {
    console.error('❌ Error al conectar con la API de trivia:', error);
    throw error;
  }
}

export async function getMemotestConfig(memotestId: number): Promise<MemotestConfig> {
  const { apiBaseUrl } = getConfig();
  
  console.log('🔧 Obteniendo configuración de memotest:', memotestId);
  
  const url = `${apiBaseUrl}/memotests/${memotestId}/config`;
  console.log('🌐 URL de la API:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    console.log('📡 Respuesta de la API:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`Error al obtener la configuración del memotest: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Configuración de memotest recibida:', data);
    return data;
  } catch (error) {
    console.error('❌ Error al conectar con la API de memotest:', error);
    throw error;
  }
}
