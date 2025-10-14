import { Company } from '@/types/api';
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
