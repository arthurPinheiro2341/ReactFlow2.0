/**
 * ARQUIVO: ConstantNode.jsx
 * CAMADA: Component Layer / Data Source
 * DESCRIÇÃO: Gerador de sinais escalares para barramentos de dados (Data Bus).
 */

import React from 'react';
import { Handle, Position } from 'reactflow';

export const ConstantNode = ({ data }) => {
  const { scale = 1, value = 0, onValueChange } = data;

  const increment = (e) => {
    e.stopPropagation(); // Previne eventos de arrasto do canvas durante a interação
    if (value < 9) onValueChange(value + 1);
  };

  const decrement = (e) => {
    e.stopPropagation();
    if (value > 0) onValueChange(value - 1);
  };

  return (
    <div style={{
      width: '90px', background: '#1a1a1a', border: '2px solid #444',
      borderRadius: '4px', padding: '8px', color: '#fff',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      boxShadow: '0 4px 10px rgba(0,0,0,0.5)', userSelect: 'none',
      // ESCALONAMENTO LÓGICO: Ajusta o tamanho da interface de controle
      transform: `scale(${scale})`,
      transformOrigin: 'top left'
    }}>
      <label style={{ fontSize: '10px', color: '#00ff00', marginBottom: '8px', fontWeight: 'bold' }}>
        DATA BUS
      </label>
      
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '8px', background: '#000', 
        padding: '4px', borderRadius: '3px', border: '1px solid #333' 
      }}>
        <button onClick={decrement} onPointerDown={(e) => e.stopPropagation()} style={btnStyle}> - </button>
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#00ff00', minWidth: '15px', textAlign: 'center', fontFamily: 'monospace' }}>
          {value}
        </span>
        <button onClick={increment} onPointerDown={(e) => e.stopPropagation()} style={btnStyle}> + </button>
      </div>

      <Handle type="source" position={Position.Right} id="out" style={handleStyle} />
    </div>
  );
};

const btnStyle = { width: '20px', height: '20px', background: '#222', color: '#00ff00', border: '1px solid #444', cursor: 'pointer' };
const handleStyle = { background: '#a0a0a0', width: '8px', height: '8px', border: '1px solid #111' };