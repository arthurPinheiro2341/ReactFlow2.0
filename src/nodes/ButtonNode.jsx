/**
 * ARQUIVO: ButtonNode.jsx
 * CAMADA: Component Layer / Input Node
 * ATUALIZAÇÃO: Implementado NodeResizer para redimensionamento visual livre.
 */

import React, { useEffect } from 'react';
import { Handle, Position, NodeResizer, useUpdateNodeInternals } from 'reactflow';

export const ButtonNode = ({ id, data, selected }) => {
  const { color = '#1a1a1a', pressed, onToggle } = data;
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
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
        minWidth={40} 
        minHeight={40}
        handleStyle={resizerHandleStyle} 
      />
      
      <div
        onClick={onToggle} 
        style={{
          width: '100%', height: '100%', background: '#2c2c2c', borderRadius: '8px', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          border: '2px solid #1a1a1a', cursor: 'pointer', position: 'relative',
          boxShadow: '0 4px 8px rgba(0,0,0,0.6)', userSelect: 'none',
        }}
      >
        <Handle 
          type="source" position={Position.Right} id="out" 
          style={{ right: '-5px', background: '#a0a0a0', width: '8px', height: '4px', borderRadius: '0' }} 
        />

        {/* ATUADOR MECÂNICO */}
        <div style={{
            width: '70%', height: '70%', borderRadius: '50%', // Usa % para crescer com a caixa
            background: pressed ? '#141414' : `radial-gradient(circle at 30% 30%, #2e2e2e, #050505)`,
            boxShadow: pressed ? 'inset 0 4px 6px rgba(39, 39, 39, 0.9)' : '0 5px 0 #111, 0 8px 15px rgba(0,0,0,0.5)',
            transform: pressed ? 'translateY(3px)' : 'translateY(0px)',
            transition: 'all 0.05s ease', 
            border: '1px solid rgba(255,255,255,0.05)'
          }}
        />
      </div>
    </>
  );
};