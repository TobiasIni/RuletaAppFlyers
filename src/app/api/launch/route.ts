import { NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { gameId } = body;
    
    // Ruta al launcher de Electron
    const launcherPath = process.env.LAUNCHER_PATH || 
      'C:\\Users\\inito\\OneDrive\\Escritorio\\No borrar\\Desarrollo\\launcherTotem';
    
    console.log('🚀 Ejecutando launcher desde:', launcherPath);
    
    // Ejecutar el launcher usando npm start
    // En Windows usamos 'npm.cmd' o simplemente 'npm' dependiendo del sistema
    const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const command = `${npmCommand} start`;
    
    // Ejecutar en segundo plano (detached) para que no bloquee la respuesta
    const childProcess = exec(command, {
      cwd: launcherPath,
      detached: true,
      stdio: 'ignore',
      shell: true
    }, (error) => {
      if (error) {
        console.error('Error al ejecutar el launcher:', error);
      } else {
        console.log('✅ Launcher ejecutado correctamente');
      }
    });
    
    // Desconectar el proceso hijo para que se ejecute independientemente
    if (childProcess.unref) {
      childProcess.unref();
    }
    
    // No esperamos a que termine, respondemos inmediatamente
    return NextResponse.json({
      success: true,
      message: 'Launcher ejecutado correctamente'
    });
  } catch (error) {
    console.error('Error al ejecutar el launcher:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
