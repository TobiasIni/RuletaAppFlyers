// Tipos para la API de juegos según la estructura real
export interface JuegoHabilitado {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  activo: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface Imagen {
  id: number;
  checksum: string;
  company_id: number;
  filename: string;
  original_filename: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  url: string | null;
}

export interface Company {
  id: number;
  nombre: string;
  logo: string;
  color_primario: string;
  color_secundario: string;
  color_terciario: string;
  created_at: string;
  updated_at: string;
  imagenes: Imagen[];
  juegos_habilitados: JuegoHabilitado[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
