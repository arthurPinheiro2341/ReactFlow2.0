/**
 * ARQUIVO: FPGANode.jsx
 * CAMADA: Advanced Component Layer / Reconfigurable Hardware
 * DESCRIÇÃO: Implementa um chip lógico programável com topologia de pinos dinâmica.
 * Otimizado para alta densidade de I/O (ajuste de escala de handles e pinos).
 */

import React, { useEffect } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';

export const FPGANode = ({ id, data }) => {
  const updateNodeInternals = useUpdateNodeInternals();

  const { 
    inputs_left = 1,   
    inputs_top = 0,    
    outputs_right = 1, 
    outputs_bottom = 0,
    scale = 1 
  } = data;

  useEffect(() => {
    const timer = setTimeout(() => {
      updateNodeInternals(id);
    }, 10);

    return () => clearTimeout(timer);
  }, [id, inputs_left, inputs_top, outputs_right, outputs_bottom, scale, updateNodeInternals]);

  const chipSize = 350; 

  // AJUSTE: Reduzi para 6px para caber 64 pinos sem sobreposição
  const handleStyle = {
    background: '#1a1a1a', 
    width: '6px',
    height: '6px',
    border: '1px solid #a0a0a0', 
    zIndex: 10,
    position: 'absolute'
  };

  const renderPins = (count, side, handlePosition, type) => {
    return [...Array(count)].map((_, i) => {
      const positionPercent = `${((i + 1) / (count + 1)) * 100}%`;
      const uniquePinId = `${id}-${side}-${type}-${i}`;

      const commonStyle = { position: 'absolute', zIndex: 1 };
      let pinStyle, handleOffset;

      // AJUSTE: Altura/Largura dos pinos reduzida de 4px para 2px
      // AJUSTE: handleOffset recalculado para o novo tamanho (20px pino + 3px metade do handle = 23px)
      if (side === 'left') {
        pinStyle = { ...commonStyle, top: positionPercent, left: '-20px', width: '20px', height: '2px', background: 'linear-gradient(to right, #777, #b0b0b0)', transform: 'translateY(-50%)' };
        handleOffset = { left: '-23px', top: positionPercent, transform: 'translateY(-50%)' };
      } else if (side === 'right') {
        pinStyle = { ...commonStyle, top: positionPercent, right: '-20px', width: '20px', height: '2px', background: 'linear-gradient(to left, #777, #b0b0b0)', transform: 'translateY(-50%)' };
        handleOffset = { right: '-23px', top: positionPercent, transform: 'translateY(-50%)' };
      } else if (side === 'top') {
        pinStyle = { ...commonStyle, left: positionPercent, top: '-20px', width: '2px', height: '20px', background: 'linear-gradient(to bottom, #777, #b0b0b0)', transform: 'translateX(-50%)' };
        handleOffset = { top: '-23px', left: positionPercent, transform: 'translateX(-50%)' };
      } else if (side === 'bottom') {
        pinStyle = { ...commonStyle, left: positionPercent, bottom: '-20px', width: '2px', height: '20px', background: 'linear-gradient(to top, #777, #b0b0b0)', transform: 'translateX(-50%)' };
        handleOffset = { bottom: '-23px', left: positionPercent, transform: 'translateX(-50%)' };
      }

      return (
        <React.Fragment key={uniquePinId}>
          <div style={pinStyle} />
          <Handle
            type={type === 'in' ? 'target' : 'source'}
            position={handlePosition}
            id={uniquePinId}
            style={{ ...handleStyle, ...handleOffset }}
          />
        </React.Fragment>
      );
    });
  };

  return (
    <div style={{
      width: `${chipSize}px`, height: `${chipSize}px`,
      background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
      border: '2px solid #111', borderRadius: '4px', position: 'relative',
      boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transform: `scale(${scale})`,
      transformOrigin: 'top left'
    }}>
      <div style={{ position: 'absolute', top: '15px', left: '15px', width: '12px', height: '12px', background: '#000', borderRadius: '50%', border: '1px solid #333' }} />
      
      <div style={{ textAlign: 'center', userSelect: 'none', fontFamily: 'monospace', padding: '0 40px' }}>
        <div style={{ 
          color: '#fff', 
          fontSize: '32px', 
          fontWeight: 'bold', 
          letterSpacing: '4px',
          wordBreak: 'break-word',
          textTransform: 'uppercase' 
        }}>
          {data.label || 'FPGA'}
        </div>
      </div>

      {renderPins(inputs_left, 'left', Position.Left, 'in')}
      {renderPins(inputs_top, 'top', Position.Top, 'in')}
      {renderPins(outputs_right, 'right', Position.Right, 'out')}
      {renderPins(outputs_bottom, 'bottom', Position.Bottom, 'out')}
    </div>
  );
};