/**
 * Node visual de saída VGA com Handles de sincronismo e canais RGB.
 * O componente representa a interface no frontend, sem processar vídeo.
 */

import React, { useEffect } from 'react'; 
import { Handle, Position, useUpdateNodeInternals, NodeResizer } from 'reactflow'; 

export const DisplayNode = ({ id, data, selected }) => {
  // Mantém a prop no contrato do node, embora o render atual ainda não leia seus valores.
  void data;
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    const timer = setTimeout(() => {
      updateNodeInternals(id);
    }, 10);
    return () => clearTimeout(timer);
  }, [id, updateNodeInternals]);

  const resizerHandleStyle = {
    width: '12px', height: '12px', background: '#00ff00',
    border: '2px solid #ffffff', borderRadius: '50%', zIndex: 100
  };

  const sidebarWidth = 65;
  const handleSize = 8;
  const handleOffset = -4;

  const handleStyleBase = {
    width: `${handleSize}px`,
    height: `${handleSize}px`,
    border: '1px solid #111',
    left: `${handleOffset}px`, 
    zIndex: 10,
    transform: 'translateY(-50%)', 
  };

  const baseTextStyle = {
    position: 'absolute',
    fontSize: '9px',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    userSelect: 'none',
    left: '12px',
    transform: 'translateY(-50%)'
  };

  // Cria o rótulo e os oito Handles de um canal, preservando IDs no formato prefixo + índice.
  const renderColorBus = (prefix, color, textLabel, startYPercent) => {
    const textElement = (
      <div key={`${prefix}-label`} style={{ ...baseTextStyle, color: color, top: `${startYPercent}%` }}>
        {textLabel}
      </div>
    );

    const pitchPercent = 2.85;
    const handlesStartTop = startYPercent + 3.5;

    const handles = [...Array(8)].map((_, i) => {
      const currentTop = handlesStartTop + (i * pitchPercent);
      return (
        <Handle
          key={`${prefix}${i}`}
          type="target"
          position={Position.Left}
          id={`${prefix}${i}`}
          style={{
            ...handleStyleBase,
            background: color,
            top: `${currentTop}%`
          }}
        />
      );
    });

    return [textElement, ...handles];
  };

  return (
    <>
      <NodeResizer 
        color="#00ff00" 
        isVisible={selected} 
        minWidth={300} 
        minHeight={300}
        handleStyle={resizerHandleStyle} 
      />

      <div style={{
        width: '100%',
        height: '100%',
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '8px',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden' 
      }}>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row', position: 'relative'}}>
          <div style={{ width: `${sidebarWidth}px`, height: '100%', background: 'rgba(255,255,255,0.015)', borderRight: '1px solid #222' }}/>

          <div style={{ flex: 1, background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <div style={{ color: '#333', fontFamily: 'monospace', fontSize: 'clamp(10px, 2vw, 24px)', textAlign: 'center', padding: '20px' }}>
                  NO SIGNAL (24-BIT RGB)
                  <br/>
                  [PROPORÇÃO VGA PAISAGEM]
              </div>
          </div>

          <Handle type="target" position={Position.Left} id="vsync" style={{ ...handleStyleBase, top: `4%`, background: '#fff' }} />
          <div style={{ ...baseTextStyle, color: '#fff', top: `4%` }}>VSYNC</div>

          <Handle type="target" position={Position.Left} id="hsync" style={{ ...handleStyleBase, top: `10%`, background: '#fff' }} />
          <div style={{ ...baseTextStyle, color: '#fff', top: `10%` }}>HSYNC</div>

          {renderColorBus('r', '#ff4444', 'R[0..7]', 16)}
          {renderColorBus('g', '#44ff44', 'G[0..7]', 44)}
          {renderColorBus('b', '#4444ff', 'B[0..7]', 72)}
        </div>

        <div style={{ padding: '5px 15px', fontSize: '9px', color: '#666', fontFamily: 'monospace', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333' }}>
          <span>VGA_INTERFACE_V1_WIDE</span>
          <span style={{ color: '#00ff00' }}>ONLINE</span>
        </div>
      </div>
    </>
  );
};
