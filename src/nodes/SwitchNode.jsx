/**
 * ARQUIVO: SwitchNode.jsx
 * CAMADA: Component Layer / Input Node (Latching)
 * ATUALIZAÇÃO: NodeResizer implementado. Dimensões relativas em porcentagem 
 * preservam a física da alavanca (flip) independente do tamanho.
 */

import React, { useEffect } from 'react';
import { Handle, Position, NodeResizer, useUpdateNodeInternals } from 'reactflow';

export const SwitchNode = ({ id, data, selected }) => {
  const { pressed, onToggle } = data;
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    // Sincroniza a posição do fio ao redimensionar
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
          boxSizing: 'border-box' // Garante que o padding não estoure a caixa do resizer
        }}
      >
        <Handle type="source" position={Position.Right} id="out" style={switchHandleStyle} />
        
        {/* ALAVANCA DO SWITCH */}
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