// Configuración por defecto para desarrollo
export const DEFAULT_CONFIG = {
  COMPANY_ID: '12',
  API_BASE_URL: 'https://api-cmsd3.emanzano.com'
} as const;

// Función para obtener la configuración
export function getConfig() {
  return {
    companyId: process.env.COMPANY_ID || DEFAULT_CONFIG.COMPANY_ID,
    apiBaseUrl: process.env.API_BASE_URL || DEFAULT_CONFIG.API_BASE_URL
  };
}
