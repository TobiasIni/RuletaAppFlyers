'use client';

import React, { useState, useRef, useEffect } from 'react';
import { spinRuleta } from '@/lib/api';

interface Prize {
  id: string;
  text: string;
  color: string;
  probability?: number;
  positive?: boolean;
}

interface SpinWheelProps {
  prizes: Prize[];
  onWin: (prize: Prize, isPositive?: boolean) => void;
  colors?: string[];
  logo?: string;
  ruletaId: number;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ prizes, onWin, colors: propColors, logo, ruletaId }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [lastMesa, setLastMesa] = useState<string | null>(null);
  const wheelRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number | null>(null);

  // Use provided colors or fallback to default colors
  const colors = propColors || [
    '#F17586','#68DEBF', '#63D0DF', '#E9EAEA',
  ];

  // Calculate segment angle
  const segmentAngle = 360 / prizes.length;

  // Simulate initial loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Function to verify which segment is at the pointer after rotation
  const verifyLandingSegment = (finalRotation: number): number => {
    const normalizedRotation = ((finalRotation % 360) + 360) % 360;
    
    // CRITICAL: The pointer is at the TOP of the wheel container
    // In standard math coordinates: 270° = top, 0° = right, 90° = bottom, 180° = left
    // The wheel uses standard math coordinates for segment positioning (Math.cos/sin)
    const pointerAngle = 270; // Top position in math coordinates
    
    let closestIndex = 0;
    let closestDistance = Infinity;
    
    // Log all segments for debugging
    const segmentDetails = [];
    
    for (let i = 0; i < prizes.length; i++) {
      // Segment center in math coordinates (0° = right, 90° = bottom, etc.)
      const segmentCenterAngle = (i * segmentAngle) + (segmentAngle / 2);
      
      // After rotating the wheel clockwise by normalizedRotation, 
      // the segment center moves to a new position
      const rotatedCenterAngle = (segmentCenterAngle + normalizedRotation) % 360;
      
      // Distance from pointer at 270° (top of the wheel)
      let distance = Math.abs(rotatedCenterAngle - pointerAngle);
      if (distance > 180) distance = 360 - distance;
      
      segmentDetails.push({
        index: i,
        prizeId: prizes[i].id,
        prizeName: prizes[i].text,
        segmentCenterAngle,
        rotatedCenterAngle,
        distance
      });
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    }
    
    console.log('🔍 Landing verification:', {
      finalRotation,
      normalizedRotation,
      pointerAngle,
      closestIndex,
      closestDistance,
      landingPrize: prizes[closestIndex]?.text,
      allSegments: segmentDetails
    });
    
    return closestIndex;
  };

  // Function to find prize index by API ID
  const findPrizeIndexById = (apiPrizeId: number): number => {
    console.log('🎯 Finding prize index for API ID:', apiPrizeId);
    
    for (let i = 0; i < prizes.length; i++) {
      const prizeIdNum = parseInt(prizes[i].id.split('-')[0]);
      if (prizeIdNum === apiPrizeId) {
        console.log('✅ Found matching prize at index:', i);
        return i;
      }
    }
    
    console.error('❌ No matching prize found for ID:', apiPrizeId);
    return 0; // Default to first prize if not found
  };

  // Create wheel segments
  const createSegment = (prize: Prize, index: number) => {
    const angle = segmentAngle;
    const startAngle = index * angle;
    const endAngle = startAngle + angle;
    
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const centerX = 260;
    const centerY = 260;
    const radius = 240;
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const pathData = [
      'M', centerX, centerY,
      'L', x1, y1,
      'A', radius, radius, 0, largeArcFlag, 1, x2, y2,
      'Z'
    ].join(' ');

    // Calculate text position
    const textAngle = startAngle + angle / 2;
    const textAngleRad = (textAngle * Math.PI) / 180;
    const textRadius = 160;
    const textX = centerX + textRadius * Math.cos(textAngleRad);
    const textY = centerY + textRadius * Math.sin(textAngleRad);

    const segmentColor = colors[index % colors.length];
    
    return (
      <g key={prize.id}>
        {/* Background segment with gradient */}
        <path
          d={pathData}
          fill={`url(#segmentGradient${index})`}
          stroke="#FFFFFF"
          strokeWidth="3"
          filter="url(#segmentShadow)"
        />
        
        {/* Inner border for depth */}
        <path
          d={pathData}
          fill="none"
          stroke="rgba(255, 255, 255, 0.8)"
          strokeWidth="1"
          strokeDasharray="0"
        />
        
        {/* Highlight edge */}
        <path
          d={pathData}
          fill="none"
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth="0.5"
          strokeDasharray="3,2"
          opacity="0.7"
        />

        {/* Clean text in black */}
        <text
          x={textX}
          y={textY}
          fill="black"
          fontSize="45"
          fontWeight="bold"
          fontFamily="var(--font-space-grotesk), sans-serif"
          textAnchor="middle"
          dominantBaseline="central"
          transform={`rotate(${textAngle}, ${textX}, ${textY})`}
        >
          {prize.text}
        </text>
        
        {/* Segment-specific gradient definition */}
        <defs>
          <radialGradient id={`segmentGradient${index}`} cx="50%" cy="30%" r="80%">
            <stop offset="0%" stopColor={segmentColor} stopOpacity="1"/>
            <stop offset="60%" stopColor={segmentColor} stopOpacity="0.9"/>
            <stop offset="100%" stopColor={segmentColor} stopOpacity="0.7"/>
          </radialGradient>
        </defs>
      </g>
    );
  };

  const spinWheel = async () => {
    if (isSpinning || prizes.length === 0) return;

    setIsSpinning(true);

    try {
      // 🎯 PASO 1: Llamar a la API para determinar qué mesa ganó
      console.log('🎲 Llamando a la API para determinar el premio...');
      const spinResponse = await spinRuleta(ruletaId);
      
      console.log('✅ Respuesta de la API:', spinResponse);
      
      if (!spinResponse.exito || !spinResponse.premio_ganado) {
        console.error('❌ Error de la API:', spinResponse.mensaje);
        setIsSpinning(false);
        
        // Mostrar mensaje de error más elegante
        const errorMessage = spinResponse.mensaje || 'Error al girar la ruleta';
        
        // Crear un modal temporal de error
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem 3rem;
          border-radius: 1rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          z-index: 9999;
          text-align: center;
          font-family: var(--font-space-grotesk), sans-serif;
          max-width: 90%;
          animation: fadeIn 0.3s ease-out;
        `;
        errorDiv.innerHTML = `
          <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
          <div style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">¡Atención!</div>
          <div style="font-size: 1.2rem; margin-bottom: 1.5rem;">${errorMessage}</div>
          <button onclick="this.parentElement.remove()" style="
            background: white;
            color: #667eea;
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 0.5rem;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            font-family: var(--font-space-grotesk), sans-serif;
          ">Entendido</button>
        `;
        document.body.appendChild(errorDiv);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
          if (errorDiv.parentElement) {
            errorDiv.remove();
          }
        }, 5000);
        
        return;
      }

      // Guardar referencia al premio ganado (ya verificado que no es null)
      const premioGanado = spinResponse.premio_ganado;
      
      // 🎯 PASO 2: Extraer el número de mesa del premio ganado
      // La API devuelve un premio con 'nombre' como "Mesa 1", "Mesa 2", etc.
      const mesaMatch = premioGanado.nombre.match(/Mesa (\d+)/i);
      const mesaGanadora = mesaMatch ? parseInt(mesaMatch[1], 10) : premioGanado.id;

      console.log('🎯 Mesa ganadora de la API:', mesaGanadora);
      
      // 🎯 PASO 3: Buscar todos los segmentos que corresponden a esa mesa
      const matchingIndices: number[] = [];
      prizes.forEach((prize, index) => {
        const prizeMatch = prize.id.match(/mesa-(\d+)/);
        if (prizeMatch) {
          const mesaNum = parseInt(prizeMatch[1], 10);
          if (mesaNum === mesaGanadora) {
            matchingIndices.push(index);
          }
        }
      });

      if (matchingIndices.length === 0) {
        console.error('❌ No se encontró segmento para la mesa:', mesaGanadora);
        setIsSpinning(false);
        alert(`No se encontró el segmento para Mesa ${mesaGanadora}`);
        return;
      }

      // Si hay múltiples segmentos de la misma mesa, elegir uno al azar
      const targetIndex = matchingIndices[Math.floor(Math.random() * matchingIndices.length)];
      const winningPrize = prizes[targetIndex];

      console.log('🎯 Segmento objetivo determinado:', {
        mesaGanadora,
        matchingIndices,
        targetIndex,
        prizeId: winningPrize.id,
        prizeName: winningPrize.text,
        totalSegments: prizes.length
      });

    // 🎯 Calcular la rotación necesaria para caer en ese segmento
    // El pointer está en el tope (270° en coordenadas matemáticas)
    const pointerAngle = 270;
    
    // Calcular el ángulo central del segmento objetivo (en coordenadas matemáticas)
    // Segmento 0 empieza en 0°, su centro está en segmentAngle/2
    const segmentCenterAngle = (targetIndex * segmentAngle) + (segmentAngle / 2);
    
    // La rotación actual normalizada
    const currentNormalizedRotation = ((rotation % 360) + 360) % 360;
    
    // Después de rotar, queremos que: (segmentCenterAngle + finalRotation) % 360 = pointerAngle
    // Por lo tanto: finalRotation = (pointerAngle - segmentCenterAngle) % 360
    // Pero como partimos de currentNormalizedRotation, necesitamos:
    let targetRotation = (pointerAngle - segmentCenterAngle + 360) % 360;
    
    // Ajustar para que sea relativo a la rotación actual
    if (targetRotation < currentNormalizedRotation) {
      targetRotation += 360;
    }
    targetRotation = targetRotation - currentNormalizedRotation;
    
    // Agregar varias vueltas completas para el efecto visual
    const minRotation = 3600; // 10 vueltas completas
    const randomExtraRotations = Math.floor(Math.random() * 5) * 360; // 0-5 vueltas extra
    const finalRotation = rotation + minRotation + randomExtraRotations + targetRotation;

    console.log('🎲 Calculated rotation:', {
      currentRotation: rotation,
      pointerAngle,
      segmentCenterAngle,
      targetRotation,
      minRotation,
      randomExtraRotations,
      finalRotation,
      finalAngle: finalRotation % 360
    });

    // 🎯 Animar la ruleta hasta la posición calculada
    const startTime = Date.now();
    const startRotation = rotation;
    const duration = 4500; // 4.5 segundos
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easeOutQuart for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentRotation = startRotation + (finalRotation - startRotation) * easeOutQuart;
      
      setRotation(currentRotation);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        setRotation(finalRotation);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);

    // 🎯 Después de la animación, verificar y mostrar el resultado
    setTimeout(() => {
      // Verificar que efectivamente cayó en el lugar correcto
      const landingIndex = verifyLandingSegment(finalRotation);
      
      console.log('🎯 Wheel stopped at:', {
        landingIndex,
        expectedIndex: targetIndex,
        match: landingIndex === targetIndex,
        segmentId: prizes[landingIndex].id,
        prizeName: prizes[landingIndex].text,
        finalRotation: finalRotation % 360
      });

      // Usar el premio del segmento donde cayó con los datos de la API
      const prizeToShow: Prize = {
        id: winningPrize.id,
        text: winningPrize.text,
        color: winningPrize.color,
        probability: winningPrize.probability,
        positive: premioGanado.positive !== undefined 
          ? premioGanado.positive 
          : true
      };
      
      // Actualizar la última mesa
      setLastMesa(winningPrize.text);
      
      setIsSpinning(false);
      onWin(prizeToShow, premioGanado.positive);
    }, duration);

    } catch (error) {
      console.error('❌ Error al girar la ruleta:', error);
      setIsSpinning(false);
      alert('Error de conexión. Por favor, intenta de nuevo.');
    }
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-4xl">
      {/* Ambient glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 rounded-full bg-gradient-radial from-white-500/20 via-white-600/10 to-transparent blur-3xl opacity-60 animate-pulse"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Main loading spinner */}
        <div className="relative w-64 h-64 mb-8">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-[16px] border-white-500/30 border-t-white-500 animate-spin"></div>
          
          {/* Inner rotating ring */}
          <div className="absolute inset-4 rounded-full border-6 border-white-400/40 border-t-white-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {/* Casino dice icon */}
              <div className="text-6xl mb-4 animate-bounce">🎰</div>
              
              {/* Loading text */}
              <div className="text-2xl font-bold text-app-primary tracking-wider" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                CARGANDO RULETA
              </div>
              
              {/* Loading dots */}
              <div className="flex justify-center space-x-1 mt-4">
                <div className="w-2 h-2 bg-white-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-white-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-white-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Loading progress bar */}
        <div className="w-80 h-2 bg-white-500/20 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-white-500 to-white-400 rounded-full animate-pulse"></div>
        </div>
        
        {/* Loading text */}
        <p className="text-app-primary text-lg mt-6 animate-pulse" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          Preparando la experiencia de casino...
        </p>
      </div>
    </div>
  );

  // Show loading spinner while loading
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col items-center justify-between h-full w-full max-w-full">
      {/* Ambient glow effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full bg-gradient-radial from-black-500/20 via-black-600/10 to-transparent blur-3xl opacity-60 animate-pulse"></div>
      </div>
      {/* Contenedor superior para logo y ruleta */}
      <div className="flex flex-col items-center justify-center flex-1 w-full">
    {/* Logo y título */}
      <div className="text-center mb-2 z-10 flex-shrink-0 flex flex-col items-center">
        {/* Logo EOY */}
        <div className="mb-4">  
          <img src="/logo_EOY.png" alt="Logo EOY" className="w-120 h-auto object-contain" />
        </div>
        
        {/* Texto curvo */}
        <svg width="100%" height="250" viewBox="0 0 1200 250" className="mx-auto" preserveAspectRatio="xMidYMid meet">
          <defs>
            <path 
              id="curvedText" 
              d="M 100 200 Q 600 40 1100 200" 
              fill="transparent"
            />
          </defs>
          <text 
            className="text-7xl font-bold tracking-wider"
            style={{ fontFamily: 'var(--font-space-grotesk)', fill: '#000000' }}
          >
            <textPath href="#curvedText" startOffset="50%" textAnchor="middle">
              Girá para elegir tu mesa
            </textPath>
          </text>
        </svg>
      </div>
      
      <div className={`relative wheel-container flex-1 flex items-center justify-center z-10 w-full min-h-0 ${isSpinning ? 'wheel-spinning' : ''}`}>
        {/* Enhanced wheel container with floating effect */}
        <div className="relative transform transition-all duration-300">
          <svg
            ref={wheelRef}
            width="min(90vw, 70vh, 1400px)"
            height="min(90vw, 70vh, 1400px)"
            viewBox="-10 -10 540 540"
            className="max-w-full max-h-full"
            style={{
              minWidth: 0,
              minHeight: 0,
              transform: `rotate(${rotation}deg)`,
              transition: 'none', // We handle animation with requestAnimationFrame
              willChange: 'transform',
            }}
          >
          
          {/* Advanced gradient definitions */}
          <defs>
            {/* Outer ring gradient with metallic effect */}
            <radialGradient id="outerRingGradient" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="var(--wheel-border)" />
              <stop offset="300%" stopColor="var(--wheel-border)" />
              <stop offset="700%" stopColor="var(--wheel-border)" />
              <stop offset="1000%" stopColor="var(--wheel-border)" />
            </radialGradient>
            
            {/* Inner ring gradient */}
            <radialGradient id="innerRingGradient" cx="50%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#2F4F4F" />
              <stop offset="50%" stopColor="#1C1C1C" />
              <stop offset="100%" stopColor="#000000" />
            </radialGradient>
            
            {/* Segment shadow filter */}
            <filter id="segmentShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.3)"/>
            </filter>
            
            {/* Light bulb gradient for casino lights */}
            <radialGradient id="lightBulbGradient" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF"/>
              <stop offset="40%" stopColor="#F8F8FF"/>
              <stop offset="80%" stopColor="#E6E6FA"/>
              <stop offset="100%" stopColor="#D3D3D3"/>
            </radialGradient>
          </defs>
          
          {/* Outer decorative ring with golden metallic effect */}
          <circle
            cx="260"
            cy="260"
            r="255"
            fill="url(#outerRingGradient)"
            stroke="var(--wheel-border)"
            strokeWidth="25"
            opacity="0.9"
          />
          
          {/* Decorative casino lights around the wheel */}
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (i * 360) / 24;
            const angleRad = (angle * Math.PI) / 180;
            const lightX = 260 + 250 * Math.cos(angleRad);
            const lightY = 260 + 250 * Math.sin(angleRad);
            
            return (
              <g key={`light-${i}`} className="casino-light">
                {/* Light bulb glow effect */}
                <circle
                  cx={lightX}
                  cy={lightY}
                  r="6"
                  fill="rgba(255, 255, 255, 0.3)"
                  opacity="0.8"
                />
                
                {/* Main light bulb */}
                <circle
                  cx={lightX}
                  cy={lightY}
                  r="4"
                  fill="url(#lightBulbGradient)"
                  stroke="var(--wheel-border)"
                  strokeWidth="0.5"
                />
                
                {/* Light highlight */}
                <circle
                  cx={lightX - 1}
                  cy={lightY - 1}
                  r="1.5"
                  fill="rgba(255, 255, 255, 0.9)"
                />
              </g>
            );
          })}
          
          {/* Inner base ring */}
          <circle
            cx="260"
            cy="260"
            r="245"
            fill="url(#innerRingGradient)"
            stroke="#333333"
            strokeWidth="1"
          />
          
          {/* Segments */}
          {prizes.map(createSegment)}
          
          {/* Enhanced center circle with metallic effect */}
          <circle
            cx="260"
            cy="260"
            r="40"
            fill="url(#centerGradient)"
            stroke="var(--wheel-border)"
            strokeWidth="3"
            filter="url(#centerShadow)"
          />
          
          {/* Inner center ring */}
          <circle
            cx="260"
            cy="260"
            r="30"
            fill="none"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="1"
          />
          
          {/* Center highlight */}
          <circle
            cx="256"
            cy="256"
            r="10"
            fill="rgba(255, 255, 255, 0.3)"
            opacity="0.6"
          />
          
          {/* Additional gradient definitions */}
          <defs>
            <radialGradient id="centerGradient" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="var(--wheel-border)"/>
              <stop offset="40%" stopColor="var(--wheel-border)"/>
              <stop offset="80%" stopColor="#2F4F4F"/>
              <stop offset="100%" stopColor="#1C1C1C"/>
            </radialGradient>
            
            <filter id="centerShadow" x="-100%" y="-100%" width="300%" height="300%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.5)"/>
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="rgba(255,215,0,0.3)"/>
            </filter>
          </defs>
          </svg>

          {/* Ultra elegant casino pointer - static, positioned at top center of wheel, pointing down */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 z-30 pointer-events-none"
            style={{
              top: '8%',
              width: '64px',
              height: '66px',
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))',
            }}
          >
            <div className="relative">
              {/* Black border for 3D effect */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[40px] border-r-[40px] border-t-[80px] border-l-transparent border-r-transparent border-t-black"></div>
              
              {/* Shadow layer */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[32px] border-r-[32px] border-t-[66px] border-l-transparent border-r-transparent border-t-black/40 blur-sm"></div>
              
              {/* Main pointer */}
              <div className="relative">
                <div className="w-0 h-0 border-l-[32px] border-r-[32px] border-t-[66px] border-l-transparent border-r-transparent drop-shadow-2xl"
                  style={{
                    borderTopColor: 'var(--wheel-pointer)',
                    filter: 'drop-shadow(0 0 10px rgba(255, 217, 0, 0)) drop-shadow(0 4px 20px rgba(0, 0, 0, 0.6))'
                  }}></div>
                
                {/* Inner golden gradient */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[26px] border-r-[26px] border-t-[56px] border-l-transparent border-r-transparent"
                  style={{ borderTopColor: 'var(--wheel-center-border)' }}></div>
                
                {/* Highlight effect */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[22px] border-r-[22px] border-t-[46px] border-l-transparent border-r-transparent opacity-60"
                  style={{ borderTopColor: 'var(--wheel-center-border)' }}></div>
              </div>
            </div>
          </div>

          {/* Ultra elegant center logo with advanced effects */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full z-10 flex items-center justify-center">
            {/* Main logo container */}
            <div className="relative w-full h-full rounded-full overflow-hidden border-4"
              style={{
                background: `linear-gradient(to bottom right, var(--wheel-center-primary), var(--wheel-center-secondary), var(--wheel-center-tertiary))`,
                borderColor: 'var(--wheel-center-border)',
                boxShadow: `
                  0 0 20px rgba(212, 212, 212, 0.6),
                  0 0 40px rgba(212, 212, 212, 0.6),
                  inset 0 2px 4px rgba(255, 255, 255, 0.3),
                  inset 0 -2px 4px rgba(0, 0, 0, 0.2),
                  0 8px 32px rgba(0, 0, 0, 0.3)
                `
              }}>
              
              {/* Inner gradient overlay */}
              <div className="absolute inset-0 bg-white rounded-full border-8 border-black"></div>
              
              {/* Logo image */}
              <img 
                src={"/images/logoruleta.png"} 
                alt="Logo" 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full object-contain z-10" 
              />
              
              {/* Shine effect */}
              <div className="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 transform rotate-45 translate-x-[-20%] translate-y-[-20%]"></div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Botón estilo imagen con ícono y texto */}
      <div className="w-full px-6 pb-8 flex-shrink-0 flex flex-col items-center gap-4">
        <div className="relative">
          {/* Ícono de ruleta sobresaliente - clickeable */}
          <button
            onClick={spinWheel}
            disabled={isSpinning || prizes.length === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 flex-shrink-0 w-60 h-60 rounded-full bg-transparent flex items-center justify-center
              transform transition-all duration-300 ease-out
              ${isSpinning || prizes.length === 0 
                ? 'cursor-not-allowed' 
                : 'hover:scale-110 active:scale-100 cursor-pointer active:brightness-95'
              }
            `}
            style={{
              border: 'none',
            }}
          >
            {isSpinning ? (
              <svg className="animate-spin" width="200" height="200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="transparent" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="transparent" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <img src="/iconoruleta.png" alt="Ruleta" width="280" height="280" className="object-contain" />
            )}
          </button>
          
          <button
            onClick={spinWheel}
            disabled={isSpinning || prizes.length === 0}
            className={`
              flex items-center gap-6 pl-90 pr-50 py-18 font-bold
              transform transition-all duration-300 ease-out rounded-full
              ${isSpinning || prizes.length === 0 
                ? 'bg-gray-400 text-black font-bold cursor-not-allowed opacity-60' 
                : 'shadow-lg hover:shadow-xl'
              }
            `}
            style={{
              borderTop: '6px solid #000000',
              borderLeft: '6px solid #000000',
              borderRight: '6px solid #000000',
              borderBottom: '12px solid #000000',
              backgroundColor: isSpinning || prizes.length === 0 ? undefined : '#A4C9DF',
            }}
          >
            {/* Texto */}
            <span className="text-7xl font-bold text-black tracking-wide" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              {isSpinning ? 'Girando...' : 'Girar Ruleta'}
            </span>
          </button>
        </div>

        {/* Última mesa registro */}
        {lastMesa && (
          <div className="bg-black/80 backdrop-blur-sm px-8 py-4 rounded-full border-4 border-white shadow-lg">
            <p className="text-white text-3xl font-bold tracking-wide" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              Última mesa: <span className="text-[#68DEBF]">{lastMesa}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpinWheel;

