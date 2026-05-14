/**
 * ARQUIVO: ButtonNode.jsx
 * CAMADA: Component Layer / Input Node
 * DESCRIÇÃO: Implementa a representação física de um botão momentâneo.
 * O mapeamento de escala permite o ajuste fino sobre o layout da PCB real.
 */

import React from 'react';
import { Handle, Position } from 'reactflow';

export const ButtonNode = ({ data }) => {
  // Extração de estado e metadados de transformação
  const { scale = 1, color = '#1a1a1a', pressed, onToggle } = data;

  return (
    <div
      onClick={onToggle} 
      style={{
        width: '60px', height: '60px', background: '#2c2c2c', borderRadius: '8px', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        border: '2px solid #1a1a1a', cursor: 'pointer', position: 'relative',
        boxShadow: '0 4px 8px rgba(0,0,0,0.6)', userSelect: 'none',
        // MATRIZ DE TRANSFORMAÇÃO: Escala proporcional preservando o ponto de ancoragem
        transform: `scale(${scale})`,
        transformOrigin: 'top left'
      }}
    >
      <Handle 
        type="source" position={Position.Right} id="out" 
        style={{ right: '-5px', background: '#a0a0a0', width: '8px', height: '4px', borderRadius: '0' }} 
      />

      {/* ATUADOR MECÂNICO: Feedback visual de compressão (Z-axis displacement) */}
      <div style={{
          width: '42px', height: '42px', borderRadius: '50%',
          background: pressed 
            ? '#141414' 
            : `radial-gradient(circle at 30% 30%, #2e2e2e, #050505)`,
          boxShadow: pressed 
            ? 'inset 0 4px 6px rgba(39, 39, 39, 0.9)' 
            : '0 5px 0 #111, 0 8px 15px rgba(0,0,0,0.5)',
          transform: pressed ? 'translateY(3px)' : 'translateY(0px)',
          transition: 'all 0.05s ease', 
          border: '1px solid rgba(255,255,255,0.05)'
        }}
      />
    </div>
  );
};