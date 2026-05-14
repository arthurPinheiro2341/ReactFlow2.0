/**
 * ARQUIVO: DigitNode.jsx
 * CAMADA: Component Layer / Output Actuator
 * DESCRIÇÃO: Decodificador BCD para 7 Segmentos com LUT (Lookup Table) interna.
 */

import React from 'react';
import { Handle, Position } from 'reactflow';

export const DigitNode = ({ data }) => {
  const { scale = 1 } = data;
  const value = data.value ?? null;

  // TABELA DE VERDADE: Mapeamento binário para Catodo Comum
  const segmentsMap = {
    0: [1,1,1,1,1,1,0], 1: [0,1,1,0,0,0,0], 2: [1,1,0,1,1,0,1],
    3: [1,1,1,1,0,0,1], 4: [0,1,1,0,0,1,1], 5: [1,0,1,1,0,1,1],
    6: [1,0,1,1,1,1,1], 7: [1,1,1,0,0,0,0], 8: [1,1,1,1,1,1,1], 9: [1,1,1,1,0,1,1]
  };

  const active = segmentsMap[value] || [0,0,0,0,0,0,0];

  const segStyle = (isOn) => ({
    background: isOn ? '#ff0000' : '#220000',
    boxShadow: isOn ? '0 0 8px #ff0000' : 'none',
    position: 'absolute', borderRadius: '2px', transition: 'all 0.1s ease'
  });

  return (
    <div style={{ 
      background: '#111', padding: '10px', borderRadius: '4px', border: '2px solid #444', 
      display: 'flex', transform: `scale(${scale})`, transformOrigin: 'top left'
    }}>
      <Handle type="target" position={Position.Left} id="in" style={{ background: '#777' }} />

      <div style={{ position: 'relative', width: '20px', height: '40px' }}>
        {/* Segmentos a-g mapeados via posicionamento absoluto */}
        <div style={{ ...segStyle(active[0]), top: 0, left: '2px', width: '16px', height: '3px' }} />
        <div style={{ ...segStyle(active[1]), top: '2px', right: 0, width: '3px', height: '16px' }} />
        <div style={{ ...segStyle(active[2]), bottom: '2px', right: 0, width: '3px', height: '16px' }} />
        <div style={{ ...segStyle(active[3]), bottom: 0, left: '2px', width: '16px', height: '3px' }} />
        <div style={{ ...segStyle(active[4]), bottom: '2px', left: 0, width: '3px', height: '16px' }} />
        <div style={{ ...segStyle(active[5]), top: '2px', left: 0, width: '3px', height: '16px' }} />
        <div style={{ ...segStyle(active[6]), top: '18px', left: '2px', width: '16px', height: '3px' }} />
      </div>
    </div>
  );
};