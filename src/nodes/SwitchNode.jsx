/**
 * ARQUIVO: SwitchNode.jsx
 * CAMADA: Component Layer / Input Node (Latching)
 * DESCRIÇÃO: Simulação de chave seletora industrial (SPST) com retenção de estado.
 */

import React from 'react';
import { Handle, Position } from 'reactflow';

export const SwitchNode = ({ data }) => {
  const { scale = 1, pressed, onToggle } = data;
  
  return (
    <div 
      onClick={onToggle} 
      style={{ 
        width: '35px', height: '60px', background: '#333', border: '2px solid #1a1a1a', 
        cursor: 'pointer', position: 'relative', display: 'flex', justifyContent: 'center', 
        alignItems: pressed ? 'flex-start' : 'flex-end', padding: '4px', borderRadius: '3px',
        transition: 'all 0.2s ease-in-out',
        // ESCALA TÉCNICA: Crucial para o alinhamento sobre os switches da placa real
        transform: `scale(${scale})`,
        transformOrigin: 'top left'
      }}
    >
      <Handle type="source" position={Position.Right} id="out" style={switchHandleStyle} />
      
      <div style={{ 
        width: '100%', height: '25px', background: '#555', border: '1px solid #111',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)', transition: 'background 0.3s ease'
      }} />
    </div>
  );
};

const switchHandleStyle = { background: '#777', width: '8px', height: '4px', borderRadius: '0', right: '-5px' };