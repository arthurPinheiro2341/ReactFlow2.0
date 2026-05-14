/**
 * ARQUIVO: DigitNode.jsx
 * CAMADA: Component Layer / Output Actuator
 * DESCRIÇÃO: Display de 7 segmentos ultra-compacto (30px width).
 * Topologia: 4 pinos superiores e 4 inferiores para economia de espaço no canvas.
 */

import React, { useEffect } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';

export const DigitNode = ({ id, data }) => {
  const { scale = 1, values = [0,0,0,0,0,0,0,0] } = data;
  const updateNodeInternals = useUpdateNodeInternals();

  /**
   * MOTOR DE ATUALIZAÇÃO:
   * Recalcula os 8 pontos de ancoragem sempre que a escala muda.
   */
  useEffect(() => {
    const timer = setTimeout(() => updateNodeInternals(id), 10);
    return () => clearTimeout(timer);
  }, [id, scale, updateNodeInternals]);

  const segStyle = (isOn) => ({
    background: isOn ? '#ff0000' : '#1a0000',
    boxShadow: isOn ? '0 0 8px #ff0000' : 'none',
    position: 'absolute', 
    borderRadius: '1px', 
    transition: 'all 0.1s ease'
  });

  return (
    <div style={{ 
      background: '#0a0a0a', 
      padding: '12px 5px', 
      borderRadius: '2px', 
      border: '1px solid #333', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      transform: `scale(${scale})`, 
      transformOrigin: 'top left',
      position: 'relative',
      minWidth: '30px', // LARGURA MÍNIMA: Apenas o necessário para o display
      boxShadow: 'inset 0 0 5px rgba(255,255,255,0.05)'
    }}>
      
      {/* PINOS SUPERIORES (0-3) */}
      {[...Array(4)].map((_, i) => (
        <Handle 
          key={`top-${i}`}
          type="target" 
          position={Position.Top} 
          id={`in-${i}`} 
          style={{ 
            background: '#555', 
            left: `${15 + (i * 23.3)}%`, // Distribuição calculada para 30px
            width: '5px', 
            height: '5px',
            border: 'none'
          }} 
        />
      ))}

      {/* ÁREA DE EXIBIÇÃO (7-Segments + DP) */}
      <div style={{ position: 'relative', width: '20px', height: '40px', margin: '2px 0' }}>
        <div style={{ ...segStyle(values[0]), top: 0, left: '2px', width: '16px', height: '3px' }} />
        <div style={{ ...segStyle(values[1]), top: '2px', right: 0, width: '3px', height: '16px' }} />
        <div style={{ ...segStyle(values[2]), bottom: '2px', right: 0, width: '3px', height: '16px' }} />
        <div style={{ ...segStyle(values[3]), bottom: 0, left: '2px', width: '16px', height: '3px' }} />
        <div style={{ ...segStyle(values[4]), bottom: '2px', left: 0, width: '3px', height: '16px' }} />
        <div style={{ ...segStyle(values[5]), top: '2px', left: 0, width: '3px', height: '16px' }} />
        <div style={{ ...segStyle(values[6]), top: '18px', left: '2px', width: '16px', height: '3px' }} />
        <div style={{ ...segStyle(values[7]), bottom: 0, right: '-5px', width: '3px', height: '3px', borderRadius: '50%' }} /> 
      </div>

      {/* PINOS INFERIORES (4-7) */}
      {[...Array(4)].map((_, i) => (
        <Handle 
          key={`bottom-${i}`}
          type="target" 
          position={Position.Bottom} 
          id={`in-${i + 4}`} 
          style={{ 
            background: '#555', 
            left: `${15 + (i * 23.3)}%`,
            width: '5px', 
            height: '5px',
            border: 'none'
          }} 
        />
      ))}

    </div>
  );
};