/**
 * ARQUIVO: GroupNode.jsx
 * DESCRIÇÃO: Contêiner visual para agrupar múltiplos nós. 
 * Aceita redimensionamento livre e exibe um rótulo no topo.
 */

import React from 'react';
import { NodeResizer } from 'reactflow';

export const GroupNode = ({ data, selected }) => {
  const resizerHandleStyle = {
    width: '12px', height: '12px', background: '#00ff00',
    border: '2px solid #ffffff', borderRadius: '50%', zIndex: 100
  };

  return (
    <>
      <NodeResizer 
        color="#00ff00" 
        isVisible={selected} 
        minWidth={150} 
        minHeight={150}
        handleStyle={resizerHandleStyle} 
      />
      
      <div style={{
        width: '100%', height: '100%',
        background: 'rgba(30, 30, 30, 0.4)', // Fundo translúcido para ver a placa
        border: '2px dashed #555', // Borda tracejada clássica de agrupamento
        borderRadius: '8px',
        position: 'relative'
      }}>
        {/* RÓTULO DO GRUPO (Label) */}
        <div style={{
          position: 'absolute', top: '-25px', left: '0',
          color: '#aaa', fontSize: '14px', fontFamily: 'monospace', 
          fontWeight: 'bold', textTransform: 'uppercase',
          background: '#0a0a0a', padding: '2px 8px', borderRadius: '4px',
          border: '1px solid #333'
        }}>
          📦 {data.label || 'Grupo Lógico'}
        </div>
      </div>
    </>
  );
};
