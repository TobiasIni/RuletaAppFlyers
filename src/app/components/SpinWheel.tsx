'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RuletaPremio } from '@/types/api';
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
  const wheelRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number | null>(null);

  // Use provided colors or fallback to default colors
  const colors = propColors || [
    '#CD0303', '#CD0303', '#CD0303', '#CD0303', '#CD0303',
    '#CD0303', '#2F4F4F', '#8B0000', '#006400', '#CD0303',
    '#CD0303', '#8B008B', '#FF1493', '#32CD32', '#FF8C00'
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
    
    for (let i = 0; i < prizes.length; i++) {
      // Segment center in math coordinates (0° = right, 90° = bottom, etc.)
      const segmentCenterAngle = (i * segmentAngle) + (segmentAngle / 2);
      
      // After rotating the wheel clockwise by normalizedRotation, 
      // the segment center moves to a new position
      const rotatedCenterAngle = (segmentCenterAngle + normalizedRotation) % 360;
      
      // Distance from pointer at 270° (top of the wheel)
      let distance = Math.abs(rotatedCenterAngle - pointerAngle);
      if (distance > 180) distance = 360 - distance;
      
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
    
    const x1 = 200 + 180 * Math.cos(startAngleRad);
    const y1 = 200 + 180 * Math.sin(startAngleRad);
    const x2 = 200 + 180 * Math.cos(endAngleRad);
    const y2 = 200 + 180 * Math.sin(endAngleRad);
    
    const pathData = [
      'M', 200, 200,
      'L', x1, y1,
      'A', 180, 180, 0, largeArcFlag, 1, x2, y2,
      'Z'
    ].join(' ');

    // Calculate text position
    const textAngle = startAngle + angle / 2;
    const textAngleRad = (textAngle * Math.PI) / 180;
    const textRadius = 120;
    const textX = 200 + textRadius * Math.cos(textAngleRad);
    const textY = 200 + textRadius * Math.sin(textAngleRad);

    const segmentColor = prize.color || colors[index % colors.length];
    
    return (
      <g key={prize.id}>
        {/* Background segment with gradient */}
        <path
          d={pathData}
          fill={`url(#segmentGradient${index})`}
          stroke="#FFD700"
          strokeWidth="2"
          filter="url(#segmentShadow)"
        />
        
        {/* Inner border for depth */}
        <path
          d={pathData}
          fill="none"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="1"
          strokeDasharray="0"
        />
        
        {/* Highlight edge */}
        <path
          d={pathData}
          fill="none"
          stroke="rgba(0, 0, 0, 0.6)"
          strokeWidth="0.5"
          strokeDasharray="3,2"
          opacity="0.7"
        />

        {/* Clean text in white only */}
        <text
          x={textX}
          y={textY}
          fill="white"
          fontSize="22"
          fontWeight="bold"
          fontFamily="var(--font-oswald), sans-serif"
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
      // Call the API to get the winning prize
      const spinResponse = await spinRuleta(ruletaId);
      
      if (spinResponse.exito) {
        console.log('🎲 API Spin Response:', spinResponse);
        
        // Find the exact matching prize and its index
        const winningIndex = findPrizeIndexById(spinResponse.premio_ganado.id);
        const winningPrize = prizes[winningIndex];
        
        console.log('🧪 TEST: Winning index:', winningIndex, 'Prize:', winningPrize.text);
        console.log('🧪 TEST: API Prize ID:', spinResponse.premio_ganado.id, 'Name:', spinResponse.premio_ganado.nombre);
        
        // Calculate the center angle of the winning segment (in math coordinates)
        const segmentCenterAngle = (winningIndex * segmentAngle) + (segmentAngle / 2);
        
        // CRITICAL: Account for current wheel position
        const currentNormalizedRotation = ((rotation % 360) + 360) % 360;
        
        // Current position of the winning segment center after existing rotation
        const currentSegmentPosition = (segmentCenterAngle + currentNormalizedRotation) % 360;
        
        // Calculate how much more rotation is needed to align with pointer at 270°
        let additionalRotation = 270 - currentSegmentPosition;
        
        // Normalize to positive rotation for visual effect
        while (additionalRotation <= 0) {
          additionalRotation += 360;
        }
        
        // Add multiple full rotations for visual effect (minimum 10 full rotations)
        const minRotation = 3600; // 10 full rotations
        const randomExtraRotation = Math.floor(Math.random() * 10) * 360; // Only full rotations to maintain alignment
        const finalRotation = rotation + minRotation + additionalRotation + randomExtraRotation;

        console.log('🎯 Rotation calculation:', {
          winningIndex,
          segmentCenterAngle,
          currentNormalizedRotation,
          currentSegmentPosition,
          additionalRotation,
          finalRotation: finalRotation % 360,
          expectedPrize: winningPrize.text,
        });

        // Smooth animation using requestAnimationFrame
        const startTime = Date.now();
        const startRotation = rotation;
        const duration = 4500; // 4.5 seconds
        
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

        // Trigger callback after animation completes
        setTimeout(() => {
          // Verify the landing position
          const actualLandingIndex = verifyLandingSegment(finalRotation);
          const actualLandingPrize = prizes[actualLandingIndex];
          
          // Check if we landed where we intended
          if (actualLandingIndex !== winningIndex) {
            console.warn('⚠️ Landing mismatch!', {
              intended: winningIndex,
              actual: actualLandingIndex,
              intendedPrize: winningPrize.text,
              actualPrize: actualLandingPrize?.text
            });
          } else {
            console.log('✅ Perfect landing! Prize matches expectation.');
          }
          
          setIsSpinning(false);
          
          // Play appropriate sound and show effects based on positive field
          const isPositive = spinResponse.premio_ganado.positive;
          console.log('🎵 Prize is positive:', isPositive);
          
          // Always use the API prize data for absolute accuracy
          const prizeToShow: Prize = {
            id: spinResponse.premio_ganado.id.toString(),
            text: spinResponse.premio_ganado.nombre,
            color: winningPrize.color, // Keep the visual color
            probability: spinResponse.premio_ganado.probabilidad,
            positive: isPositive
          };
          
          console.log('🏆 Final prize to show (from API):', prizeToShow);
          onWin(prizeToShow, isPositive);
        }, 4500);
      } else {
        // Handle API error
        setIsSpinning(false);
        console.error('Spin API returned error:', spinResponse.mensaje);
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error spinning wheel:', error);
      setIsSpinning(false);
      
      // Fallback to random spin if API fails
      const minRotation = 3600;
      const randomRotation = Math.random() * 360;
      const finalRotation = rotation + minRotation + randomRotation;
      
      const normalizedRotation = (finalRotation % 360);
      const pointerPosition = (270 - normalizedRotation + 360) % 360;
      const winningIndex = Math.floor(pointerPosition / segmentAngle) % prizes.length;
      const winningPrize = prizes[winningIndex];

      // Smooth animation for fallback case too
      const startTime = Date.now();
      const startRotation = rotation;
      const duration = 4500;
      
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
      
      setTimeout(() => {
        setIsSpinning(false);
        // In fallback mode, assume it's positive
        onWin(winningPrize, true);
      }, 4500);
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
          <div className="absolute inset-0 rounded-full border-8 border-white-500/30 border-t-white-500 animate-spin"></div>
          
          {/* Inner rotating ring */}
          <div className="absolute inset-4 rounded-full border-6 border-white-400/40 border-t-white-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {/* Casino dice icon */}
              <div className="text-6xl mb-4 animate-bounce">🎰</div>
              
              {/* Loading text */}
              <div className="text-2xl font-bold text-white-500 font-oswald tracking-wider">
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
        <p className="text-white-600 text-lg font-oswald mt-6 animate-pulse">
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
    <div className="flex flex-col items-center justify-center h-full w-[80vw] max-w-[80vw]">
      {/* Ambient glow effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full bg-gradient-radial from-yellow-500/20 via-yellow-600/10 to-transparent blur-3xl opacity-60 animate-pulse"></div>
      </div>
      
      {/* Title above the wheel */}
      <div className="text-center mb-2 z-10">
        <h2 className="text-6xl font-bold text-white tracking-wider" style={{ fontFamily: 'var(--font-montserrat)' }}>
          GIRÁ PARA ELEGIR TU MESA
        </h2>
      </div>
      
      <div className={`relative wheel-container flex-1 flex items-center justify-center z-10 w-full ${isSpinning ? 'wheel-spinning' : ''}`}>
        {/* Enhanced wheel container with floating effect */}
        <div className="relative transform transition-all duration-300">
          {/* Ultra elegant casino pointer with advanced shadows */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-20">
            <div className="relative">
              {/* Shadow layer */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[24px] border-r-[24px] border-t-[50px] border-l-transparent border-r-transparent border-t-black/40 blur-sm"></div>
              
              {/* Main pointer with gradient and glow */}
              <div className="relative">
                <div className="w-0 h-0 border-l-[24px] border-r-[24px] border-t-[50px] border-l-transparent border-r-transparent border-t-yellow-500 drop-shadow-2xl"
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(255, 217, 0, 0)) drop-shadow(0 4px 20px rgba(0, 0, 0, 0.6))'
                  }}></div>
                
                {/* Inner golden gradient */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[20px] border-r-[20px] border-t-[42px] border-l-transparent border-r-transparent border-t-yellow-300"></div>
                
                {/* Highlight effect */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[16px] border-r-[16px] border-t-[35px] border-l-transparent border-r-transparent border-t-yellow-100 opacity-60"></div>
              </div>
            </div>
          </div>
          
          <svg
            ref={wheelRef}
            width="min(70vw, 80vh, 900px)"
            height="min(70vw, 80vh, 900px)"
            viewBox="0 0 400 400"
            className="max-w-full max-h-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: 'none', // We handle animation with requestAnimationFrame
              willChange: 'transform',
            }}
          >
          
          {/* Advanced gradient definitions */}
          <defs>
            {/* Outer ring gradient with metallic effect */}
            <radialGradient id="outerRingGradient" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="300%" stopColor="#B8860B" />
              <stop offset="700%" stopColor="#DAA520" />
              <stop offset="1000%" stopColor="#8B7355" />
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
            cx="200"
            cy="200"
            r="195"
            fill="url(#outerRingGradient)"
            stroke="#FFD700"
            strokeWidth="4"
            opacity="0.9"
          />
          
          {/* Decorative casino lights around the wheel */}
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (i * 360) / 24;
            const angleRad = (angle * Math.PI) / 180;
            const lightX = 200 + 190 * Math.cos(angleRad);
            const lightY = 200 + 190 * Math.sin(angleRad);
            
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
                  stroke="#FFD700"
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
            cx="200"
            cy="200"
            r="185"
            fill="url(#innerRingGradient)"
            stroke="#333333"
            strokeWidth="1"
          />
          
          {/* Segments */}
          {prizes.map(createSegment)}
          
          {/* Enhanced center circle with metallic effect */}
          <circle
            cx="200"
            cy="200"
            r="30"
            fill="url(#centerGradient)"
            stroke="#FFD700"
            strokeWidth="3"
            filter="url(#centerShadow)"
          />
          
          {/* Inner center ring */}
          <circle
            cx="200"
            cy="200"
            r="22"
            fill="none"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="1"
          />
          
          {/* Center highlight */}
          <circle
            cx="196"
            cy="196"
            r="8"
            fill="rgba(255, 255, 255, 0.3)"
            opacity="0.6"
          />
          
          {/* Additional gradient definitions */}
          <defs>
            <radialGradient id="centerGradient" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFD700"/>
              <stop offset="40%" stopColor="#B8860B"/>
              <stop offset="80%" stopColor="#2F4F4F"/>
              <stop offset="100%" stopColor="#1C1C1C"/>
            </radialGradient>
            
            <filter id="centerShadow" x="-100%" y="-100%" width="300%" height="300%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.5)"/>
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="rgba(255,215,0,0.3)"/>
            </filter>
          </defs>
          </svg>

          {/* Ultra elegant center logo with advanced effects */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full z-10 flex items-center justify-center">
            {/* Main logo container */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-600 border-4 border-yellow-300 overflow-hidden"
              style={{
                boxShadow: `
                  0 0 20px rgba(212, 212, 212, 0.6),
                  0 0 40px rgba(212, 212, 212, 0.6),
                  inset 0 2px 4px rgba(255, 255, 255, 0.3),
                  inset 0 -2px 4px rgba(0, 0, 0, 0.2),
                  0 8px 32px rgba(0, 0, 0, 0.3)
                `
              }}>
              
              {/* Inner gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-black/20 rounded-full"></div>
              
              {/* Logo image */}
              <img 
                src={logo || "/images/d3.jpg"} 
                alt="Logo" 
                className="w-full h-full rounded-full object-cover relative z-10" 
              />
              
              {/* Shine effect */}
              <div className="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 transform rotate-45 translate-x-[-20%] translate-y-[-20%]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant casino spin button with liquid glass effect */}
      <div className="w-full px-6 pb-6">
        <button
          onClick={spinWheel}
          disabled={isSpinning || prizes.length === 0}
          className={`
            relative w-full py-8 px-8 rounded-2xl font-bold
            transform transition-all duration-500 ease-out overflow-hidden group
            ${isSpinning || prizes.length === 0 
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed scale-95 opacity-60' 
              : 'hover:-translate-y-1 active:translate-y-1 hover:scale-[1.02]'
            }
          `}
          style={{
            background: isSpinning || prizes.length === 0 
              ? undefined 
              : 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: isSpinning || prizes.length === 0 ? '4px solid rgba(200, 200, 200, 0.3)' : '4px solid rgba(255, 255, 255, 0.3)',
            boxShadow: isSpinning || prizes.length === 0
              ? 'none'
              : '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Efecto de brillo líquido */}
          {!isSpinning && prizes.length > 0 && (
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
                animation: 'liquidMove 3s ease-in-out infinite'
              }}
            />
          )}
          
          {/* Reflejo superior */}
          {!isSpinning && prizes.length > 0 && (
            <div 
              className="absolute top-0 left-0 right-0 h-1/3 opacity-30 pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, transparent 100%)',
                borderRadius: '1rem 1rem 0 0'
              }}
            />
          )}
          
          <span className="flex items-center justify-center space-x-4 relative z-10 text-white">
            <span className={isSpinning ? 'animate-spin' : ''}>
              {isSpinning ? (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                <img src="/dice.png" alt="Dado" width="48" height="48" className="object-contain" />
              )}
            </span>
            <span className="text-4xl tracking-wider" style={{ fontFamily: 'var(--font-montserrat)' }}>
              {isSpinning ? 'GIRANDO...' : 'GIRAR RULETA'}
            </span>
          </span>
          
          <style jsx>{`
            @keyframes liquidMove {
              0%, 100% { transform: translate(0%, 0%) scale(1); }
              33% { transform: translate(30%, -30%) scale(1.2); }
              66% { transform: translate(-30%, 30%) scale(1.1); }
            }
          `}</style>
        </button>
      </div>
    </div>
  );
};

export default SpinWheel;

