import React from 'react';
import { Handle, Position } from 'reactflow';

export const LEDNode = ({ data }) => {
  const { color = '#ffeb3b', active } = data;

  // Estilo comum para as perninhas de metal
  const legStyle = (height) => ({
    width: '2px',
    height: height,
    background: '#a0a0a0',
    position: 'relative',
    margin: '0 5px',
    display: 'flex',
    justifyContent: 'center'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* 1. Cabeça do LED (Domo) */}
      <div
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '50% 50% 10% 10%',
          background: active 
            ? `radial-gradient(circle at 30% 30%, #fff, ${color} 40%, #000)` 
            : `radial-gradient(circle at 30% 30%, #555, #111)`,
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: active 
            ? `0 0 25px 5px ${color}, inset 0 -5px 10px rgba(0,0,0,0.5)` 
            : 'inset 0 -5px 10px rgba(0,0,0,0.7)',
          zIndex: 2
        }}
      />

      {/* 2. Base do LED */}
      <div style={{ width: '38px', height: '4px', background: '#333', borderRadius: '1px', marginTop: '-2px', zIndex: 1 }} />

      {/* 3. As Perninhas (Pau pra baixo) */}
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        
        {/* Perninha Longa (Ânodo / Sinal VCC) */}
        <div style={legStyle('40px')}>
          <Handle 
            type="target" 
            position={Position.Bottom} 
            id="vcc" 
            style={{ bottom: '-4px', background: '#d32f2f', width: '8px', height: '8px' }} 
          />
        </div>

        {/* Perninha Curta (Cátodo / Terra GND) */}
        <div style={legStyle('25px')}>
          <Handle 
            type="target" 
            position={Position.Bottom} 
            id="gnd" 
            style={{ bottom: '-4px', background: '#555', width: '8px', height: '8px' }} 
          />
        </div>

      </div>
    </div>
  );
};