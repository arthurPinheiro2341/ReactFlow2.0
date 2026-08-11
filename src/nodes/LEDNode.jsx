/**
 * Node de saída que representa um LED de canal único.
 * O estado visual é controlado pelo dado active recebido da propagação mock.
 */

import React, { useEffect } from 'react';
import { Handle, Position, NodeResizer, useUpdateNodeInternals } from 'reactflow';

export const LEDNode = ({ id, data, selected }) => {
  const { color = '#ffeb3b', active } = data;
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
        minWidth={20} 
        minHeight={40}
        handleStyle={resizerHandleStyle} 
      />
      
      <div style={{ 
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        position: 'relative'
      }}>
        
        <div style={{
            width: '85%', height: '55%', 
            borderRadius: '50% 50% 10% 10%', 
            background: active 
              ? `radial-gradient(circle at 30% 30%, #fff, ${color} 40%, #000)` 
              : `radial-gradient(circle at 30% 30%, #555, #111)`,
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: active 
              ? `0 0 25px 5px ${color}, inset 0 -5px 10px rgba(0,0,0,0.5)` 
              : 'inset 0 -5px 10px rgba(0,0,0,0.7)',
            zIndex: 2
          }}
        />
        
        <div style={{ 
            width: '100%', height: '8%', 
            background: '#333', borderRadius: '2px', 
            marginTop: '-2%', zIndex: 1 
          }} 
        />
        
        <div style={{ 
            width: '12%', height: '37%', 
            background: '#a0a0a0', position: 'relative', 
            marginTop: '-2%', zIndex: 0, 
            display: 'flex', justifyContent: 'center', 
            boxShadow: '2px 2px 4px rgba(0,0,0,0.3)' 
          }}
        >
          <Handle 
            type="target" 
            position={Position.Bottom} 
            id="in" 
            style={{ 
              bottom: '-4px', background: '#777', 
              width: '10px', height: '10px', border: '2px solid #1a1a1a' 
            }} 
          />
        </div>

      </div>
    </>
  );
};