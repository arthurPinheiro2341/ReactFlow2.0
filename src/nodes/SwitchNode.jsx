/**
 * Node de entrada com estado retido e uma saída source.
 * Alterna o estado ao clicar e representa visualmente a posição da chave.
 */

import React, { useEffect } from 'react';
import { Handle, Position, NodeResizer, useUpdateNodeInternals } from 'reactflow';

export const SwitchNode = ({ id, data, selected }) => {
  const { pressed, onToggle } = data;
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    // Recalcula a posição do Handle após mudanças de dimensão.
    const timer = setTimeout(() => updateNodeInternals(id), 10);
    return () => clearTimeout(timer);
  }, [id, updateNodeInternals]);

  const resizerHandleStyle = {
    width: '12px', height: '12px', background: '#00ff00',
    border: '2px solid #ffffff', borderRadius: '50%', zIndex: 100
  };

  return (
    <>
      <NodeResizer 
        color="#00ff00" 
        isVisible={selected} 
        minWidth={25} 
        minHeight={45}
        handleStyle={resizerHandleStyle} 
      />

      <div 
        onClick={onToggle} 
        style={{ 
          width: '100%', height: '100%', 
          background: '#333', border: '2px solid #1a1a1a', 
          cursor: 'pointer', position: 'relative', display: 'flex', justifyContent: 'center', 
          alignItems: pressed ? 'flex-start' : 'flex-end', 
          padding: '10%', borderRadius: '3px',
          transition: 'all 0.2s ease-in-out',
          boxSizing: 'border-box'
        }}
      >
        <Handle type="source" position={Position.Right} id="out" style={switchHandleStyle} />
        
        <div style={{ 
          width: '100%', height: '45%', 
          background: '#555', border: '1px solid #111', borderRadius: '2px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)', transition: 'background 0.3s ease'
        }} />
      </div>
    </>
  );
};

const switchHandleStyle = { background: '#777', width: '8px', height: '4px', borderRadius: '0', right: '-5px' };