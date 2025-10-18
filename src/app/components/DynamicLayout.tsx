'use client';

import { useState, useEffect } from 'react';
import { Company } from '@/types/api';
import { getCompanyData } from '@/lib/api';

interface DynamicLayoutProps {
  children: React.ReactNode;
}

export default function DynamicLayout({ children }: DynamicLayoutProps) {
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const data = await getCompanyData();
        setCompanyData(data);
      } catch (error) {
        console.error('Error al cargar los datos de la empresa:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  // Estilo dinámico para el background
  const containerStyle = {
    background: companyData?.background 
      ? `#000 url('${companyData.background}') center center / 100% 100% no-repeat`
      : '#000 url(\'/background.png\') center center / 100% 100% no-repeat'
  };

  return (
    <div className="totem-container" style={containerStyle}>
      <div className="totem-frame">
        {children}
      </div>
    </div>
  );
}
