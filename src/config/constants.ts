// Configuración por defecto para desarrollo
export const DEFAULT_CONFIG = {
  COMPANY_ID: '13',
  API_BASE_URL: 'https://api-cmsd3.emanzano.com'
} as const;

// Función para obtener la configuración
// Nota: En Next.js, las variables de entorno del cliente deben tener el prefijo NEXT_PUBLIC_
// pero como esta función también se usa en el servidor, verificamos ambos casos
export function getConfig() {
  // En el servidor, usar process.env directamente
  // En el cliente, Next.js expone las variables con NEXT_PUBLIC_
  const companyId = 
    process.env.NEXT_PUBLIC_COMPANY_ID || 
    process.env.COMPANY_ID || 
    DEFAULT_CONFIG.COMPANY_ID;
    
  const apiBaseUrl = 
    process.env.NEXT_PUBLIC_API_BASE_URL || 
    process.env.API_BASE_URL || 
    DEFAULT_CONFIG.API_BASE_URL;

  console.log('🔧 Configuración cargada:', { companyId, apiBaseUrl });

  return {
    companyId,
    apiBaseUrl
  };
}
