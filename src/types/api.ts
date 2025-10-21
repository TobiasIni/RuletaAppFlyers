// Tipos para la API de juegos según la estructura real
export interface JuegoHabilitado {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  activo: boolean;
  juego_id: number;
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
  background: string;
  color_primario: string;
  color_secundario: string;
  color_terciario: string;
  memotest_logo?: string;
  trivia_logo?: string;
  ruleta_logo?: string;
  created_at: string;
  updated_at: string;
  imagenes: Imagen[];
  juegos_habilitados: JuegoHabilitado[];
}

export interface TriviaQuestion {
  id: number;
  pregunta: string;
  pregunta_imagen: string | null;
  opcion_a: string;
  opcion_a_imagen: string | null;
  opcion_b: string;
  opcion_b_imagen: string | null;
  opcion_c: string;
  opcion_c_imagen: string | null;
  opcion_d: string | null;
  opcion_d_imagen: string | null;
  respuesta_correcta: string;
  trivia_id: number;
  activa: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface TriviaInfo {
  id: number;
  nombre: string;
  descripcion: string;
  company_id: number;
  activa: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface TriviaConfig {
  trivia: TriviaInfo;
  company: Company;
  questions: TriviaQuestion[];
}

export interface MemotestPareja {
  id: number;
  imagen: string;
  memotest_id: number;
  activa: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface MemotestInfo {
  id: number;
  nombre: string;
  descripcion: string;
  company_id: number;
  activo: boolean;
  cantidad_de_parejas: number | null;
  tiempo: number | null;
  created_at: string;
  updated_at: string | null;
}

export interface MemotestConfig {
  memotest: MemotestInfo;
  company: Company;
  parejas: MemotestPareja[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
