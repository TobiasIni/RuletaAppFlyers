'use client';

interface DynamicLayoutProps {
  children: React.ReactNode;
}

export default function DynamicLayout({ children }: DynamicLayoutProps) {
  // Estilo estático con background bg_EOY.jpeg
  const containerStyle = {
    background: '#000 url(\'/images/bg_EOY.jpeg\') center center / 100% 100% no-repeat'
  };

  return (
    <div className="totem-container" style={containerStyle}>
      <div className="totem-frame">
        {children}
      </div>
    </div>
  );
}
