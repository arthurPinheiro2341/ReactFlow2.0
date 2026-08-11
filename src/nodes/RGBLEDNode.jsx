/**
 * Node de saída que combina três canais independentes em um LED RGB.
 * Cada canal possui um Handle target próprio e contribui para a cor exibida.
 */

import React, { useEffect } from 'react';
import { Handle, Position, NodeResizer, useUpdateNodeInternals } from 'reactflow';

export const RGBLEDNode = ({ id, data, selected }) => {
  const { r_active = false, g_active = false, b_active = false } = data;
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    // Recalcula a posição dos três Handles após mudanças de dimensão.
    const timer = setTimeout(() => updateNodeInternals(id), 10);
    return () => clearTimeout(timer);
  }, [id, updateNodeInternals]);

  const getMixedColor = () => {
    let r = 0, g = 0, b = 0;
    
    if (r_active) r = 255;
    if (g_active) g = 255;
    if (b_active) b = 255;

    if (r === 0 && g === 0 && b === 0) return '#222222';
    
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const activeColor = getMixedColor();
  const isActive = activeColor !== '#222222';

  const resizerHandleStyle = {
    width: '12px', height: '12px', background: '#00ff00',
    border: '2px solid #ffffff', borderRadius: '50%', zIndex: 100
  };

  // Posiciona os terminais proporcionalmente para acompanhar o redimensionamento.
  const legStyle = (leftPercent) => ({
    width: '10%',
    height: '45%',
    background: '#a0a0a0',
    position: 'absolute',
    top: '55%',
    left: leftPercent,
    zIndex: 0,
    boxShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    display: 'flex',
    justifyContent: 'center'
  });

  return (
    <>
      <NodeResizer 
        color="#00ff00" 
        isVisible={selected} 
        minWidth={30} 
        minHeight={50}
        handleStyle={resizerHandleStyle} 
      />

      <div style={{ 
        width: '100%', height: '100%', 
        display: 'flex', flexDirection: 'column', 
        alignItems: 'center', position: 'relative' 
      }}>
        
        <div style={{
            width: '85%',
            height: '55%',
            borderRadius: '50% 50% 15% 15%',
            background: isActive 
              ? `radial-gradient(circle at 30% 30%, #fff, ${activeColor} 40%, #000)` 
              : `radial-gradient(circle at 30% 30%, #666, #222)`,
            boxShadow: isActive ? `0 0 30px 5px ${activeColor}` : 'none',
            border: '1px solid rgba(255,255,255,0.2)',
            zIndex: 2,
            position: 'relative'
        }} />

        <div style={{ width: '100%', height: '6%', background: '#333', borderRadius: '2px', marginTop: '-2%', zIndex: 1 }} />

        <div style={legStyle('15%')}>
          <Handle type="target" position={Position.Bottom} id="r" style={{ background: '#ff4444', bottom: '-4px', width: '8px', height: '8px', border: '1px solid #111' }} />
        </div>

        <div style={legStyle('45%')}>
          <Handle type="target" position={Position.Bottom} id="g" style={{ background: '#44ff44', bottom: '-4px', width: '8px', height: '8px', border: '1px solid #111' }} />
        </div>

        <div style={legStyle('75%')}>
          <Handle type="target" position={Position.Bottom} id="b" style={{ background: '#4444ff', bottom: '-4px', width: '8px', height: '8px', border: '1px solid #111' }} />
        </div>

      </div>
    </>
  );
};