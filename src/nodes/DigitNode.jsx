/**
 * ARQUIVO: DigitNode.jsx
 * CAMADA: Component Layer / Output Actuator
 * ATUALIZAÇÃO: NodeResizer implementado. Segmentos redesenhados em porcentagem 
 * para escalonamento fluido durante o redimensionamento.
 */

import React, { useEffect } from 'react';
import { Handle, Position, NodeResizer, useUpdateNodeInternals } from 'reactflow';

export const DigitNode = ({ id, data, selected }) => {
  const { values = [0,0,0,0,0,0,0,0] } = data;
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    const timer = setTimeout(() => updateNodeInternals(id), 10);
    return () => clearTimeout(timer);
  }, [id, updateNodeInternals]);

  const resizerHandleStyle = {
    width: '12px', height: '12px', background: '#00ff00',
    border: '2px solid #ffffff', borderRadius: '50%', zIndex: 100
  };

  const segStyle = (isOn) => ({
    background: isOn ? '#ff0000' : '#1a0000',
    boxShadow: isOn ? '0 0 8px #ff0000' : 'none',
    position: 'absolute', 
    borderRadius: '2px', 
    transition: 'all 0.1s ease'
  });

  return (
    <>
      <NodeResizer 
        color="#00ff00" 
        isVisible={selected} 
        minWidth={40} 
        minHeight={60}
        handleStyle={resizerHandleStyle} 
      />

      <div style={{ 
        width: '100%', 
        height: '100%',
        background: '#0a0a0a', 
        borderRadius: '4px', 
        border: '2px solid #333', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: 'inset 0 0 10px rgba(255,255,255,0.05)'
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
              left: `${15 + (i * 23.3)}%`, 
              width: '6px', 
              height: '6px',
              border: '1px solid #222',
              top: '-4px'
            }} 
          />
        ))}

        {/* ÁREA DE EXIBIÇÃO: Agora com width/height em porcentagem */}
        <div style={{ position: 'relative', width: '50%', height: '70%' }}>
          {/* A (Top) */}
          <div style={{ ...segStyle(values[0]), top: 0, left: '10%', width: '80%', height: '10%' }} />
          {/* B (Top-Right) */}
          <div style={{ ...segStyle(values[1]), top: '10%', right: 0, width: '15%', height: '35%' }} />
          {/* C (Bottom-Right) */}
          <div style={{ ...segStyle(values[2]), bottom: '10%', right: 0, width: '15%', height: '35%' }} />
          {/* D (Bottom) */}
          <div style={{ ...segStyle(values[3]), bottom: 0, left: '10%', width: '80%', height: '10%' }} />
          {/* E (Bottom-Left) */}
          <div style={{ ...segStyle(values[4]), bottom: '10%', left: 0, width: '15%', height: '35%' }} />
          {/* F (Top-Left) */}
          <div style={{ ...segStyle(values[5]), top: '10%', left: 0, width: '15%', height: '35%' }} />
          {/* G (Middle) */}
          <div style={{ ...segStyle(values[6]), top: '45%', left: '10%', width: '80%', height: '10%' }} />
          {/* DP (Ponto) */}
          <div style={{ ...segStyle(values[7]), bottom: 0, right: '-20%', width: '15%', height: '12%', borderRadius: '50%' }} /> 
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
              width: '6px', 
              height: '6px',
              border: '1px solid #222',
              bottom: '-4px'
            }} 
          />
        ))}

      </div>
    </>
  );
};