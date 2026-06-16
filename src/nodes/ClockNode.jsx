/**
 * ARQUIVO: ClockNode.jsx
 * DESCRIÇÃO: Display digital de Clock com redimensionamento nativo.
 */

import React, { useEffect } from 'react';
import { Handle, Position, useUpdateNodeInternals, NodeResizer } from 'reactflow';

export const ClockNode = ({ id, data, selected }) => {
  const { frequency = "25M" } = data;
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
        minWidth={100} 
        minHeight={50}
        handleStyle={resizerHandleStyle} 
      />
      
      <div style={{
        width: '100%', height: '100%', 
        background: '#0a0a0a', border: '2px solid #333',
        borderRadius: '4px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        boxShadow: '0 4px 10px rgba(0,0,0,0.8), inset 0 0 10px rgba(0,255,0,0.05)'
      }}>
        
        {/* ÁREA DO DISPLAY DIGITAL */}
        <div style={{ 
          display: 'flex', alignItems: 'baseline', gap: '4px',
          padding: '5px 10px', background: '#001a00', 
          border: '1px solid #004400', borderRadius: '2px',
          boxShadow: 'inset 0 0 5px #000', width: '80%', justifyContent: 'center'
        }}>
          <input 
            type="text"
            value={frequency}
            onChange={(e) => data.onValueChange(e.target.value)}
            onPointerDown={(e) => e.stopPropagation()} 
            style={{
              width: '100%', background: 'transparent', border: 'none',
              color: '#00ff00', fontFamily: 'monospace', textAlign: 'right',
              outline: 'none', fontSize: 'clamp(14px, 2.5vw, 24px)', // Tipografia fluida
              fontWeight: 'bold', textShadow: '0 0 8px rgba(0,255,0,0.5)'
            }}
          />
          <span style={{ 
            color: '#00ff00', fontSize: '12px', fontWeight: 'bold', 
            fontFamily: 'monospace', textShadow: '0 0 5px rgba(0,255,0,0.5)' 
          }}>
            Hz
          </span>
        </div>

        <Handle 
          type="source" position={Position.Bottom} id="out" 
          style={{ background: '#111', width: '10px', height: '10px', bottom: '-6px', border: '2px solid #a0a0a0' }} 
        />
      </div>
    </>
  );
};