/**
 * ARQUIVO: ConstantNode.jsx
 * CAMADA: Component Layer / Data Source
 * DESCRIÇÃO: Gerador de sinais escalares com NodeResizer integrado.
 */

import React, { useEffect } from 'react';
import { Handle, Position, NodeResizer, useUpdateNodeInternals } from 'reactflow';

export const ConstantNode = ({ id, data, selected }) => {
  const { value = 0, onValueChange } = data;
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    const timer = setTimeout(() => updateNodeInternals(id), 10);
    return () => clearTimeout(timer);
  }, [id, updateNodeInternals]);

  const increment = (e) => {
    e.stopPropagation();
    if (value < 9) onValueChange(value + 1);
  };

  const decrement = (e) => {
    e.stopPropagation();
    if (value > 0) onValueChange(value - 1);
  };

  const resizerHandleStyle = {
    width: '12px', height: '12px', background: '#00ff00',
    border: '2px solid #ffffff', borderRadius: '50%', zIndex: 100
  };

  return (
    <>
      <NodeResizer 
        color="#00ff00" 
        isVisible={selected} 
        minWidth={80} 
        minHeight={60}
        handleStyle={resizerHandleStyle} 
      />
      
      <div style={{
        width: '100%', height: '100%', background: '#1a1a1a', border: '2px solid #444',
        borderRadius: '4px', padding: '8px', color: '#fff',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.5)', userSelect: 'none', position: 'relative'
      }}>
        <label style={{ fontSize: 'clamp(8px, 1vw, 12px)', color: '#00ff00', marginBottom: '8px', fontWeight: 'bold' }}>
          DATA BUS
        </label>
        
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '8px', background: '#000', 
          padding: '4px', borderRadius: '3px', border: '1px solid #333', width: '90%', justifyContent: 'space-between'
        }}>
          <button onClick={decrement} onPointerDown={(e) => e.stopPropagation()} style={btnStyle}> - </button>
          <span style={{ fontSize: 'clamp(14px, 2vw, 22px)', fontWeight: 'bold', color: '#00ff00', textAlign: 'center', fontFamily: 'monospace' }}>
            {value}
          </span>
          <button onClick={increment} onPointerDown={(e) => e.stopPropagation()} style={btnStyle}> + </button>
        </div>

        <Handle type="source" position={Position.Right} id="out" style={handleStyle} />
      </div>
    </>
  );
};

const btnStyle = { width: '25px', height: '25px', background: '#222', color: '#00ff00', border: '1px solid #444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const handleStyle = { background: '#a0a0a0', width: '8px', height: '8px', border: '1px solid #111', right: '-4px' };