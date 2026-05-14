/**
 * ARQUIVO: LEDNode.jsx
 * CAMADA: Component Layer / Output Actuator
 * DESCRIÇÃO: Simulação de indicador LED com física óptica e gradiente de epóxi.
 */

import React from 'react';
import { Handle, Position } from 'reactflow';

export const LEDNode = ({ data }) => {
  const { scale = 1, color = '#ffeb3b', active } = data;

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      transform: `scale(${scale})`, transformOrigin: 'top left'
    }}>
      <div style={{
          width: '34px', height: '34px', borderRadius: '50% 50% 10% 10%', 
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
      <div style={{ width: '38px', height: '4px', background: '#333', borderRadius: '1px', marginTop: '-2px', zIndex: 1 }} />
      <div style={legStyle}>
        <Handle type="target" position={Position.Bottom} id="in" style={handleStyle} />
      </div>
    </div>
  );
};

const legStyle = { width: '4px', height: '30px', background: '#a0a0a0', position: 'relative', marginTop: '-2px', zIndex: 0, display: 'flex', justifyContent: 'center', boxShadow: '2px 2px 4px rgba(0,0,0,0.3)' };
const handleStyle = { bottom: '-4px', background: '#777', width: '10px', height: '10px', border: '2px solid #1a1a1a' };