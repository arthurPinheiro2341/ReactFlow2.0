/**
 * ARQUIVO: DisplayNode.jsx
 * CAMADA: Advanced Output Actuator / Visual Interface
 */

import React, { useEffect } from 'react'; // Adicionado useEffect
import { Handle, Position, useUpdateNodeInternals } from 'reactflow'; // Adicionado useUpdateNodeInternals

export const DisplayNode = ({ id, data }) => { // Recebe 'id' como prop agora
  const { scale = 1 } = data;

  /**
   * 1. MOTOR DE ATUALIZAÇÃO INTERNA:
   * Força o React Flow a medir novamente a posição dos handles.
   */
  const updateNodeInternals = useUpdateNodeInternals();

  /**
   * 2. SINCRONIZAÇÃO DE ESCALA:
   * O delay de 10ms garante que o CSS seja aplicado antes da medição.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      updateNodeInternals(id);
    }, 10);
    return () => clearTimeout(timer);
  }, [id, scale, updateNodeInternals]);

  // Parâmetros Técnicos de Layout
  const componentHeight = 420;
  const componentWidth = 600;
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
  };

  const renderColorBus = (prefix, color, textLabel, startY) => {
    const textElement = (
      <div key={`${prefix}-label`} style={{ ...baseTextStyle, color: color, top: `${startY}px`, }}>
        {textLabel}
      </div>
    );

    const handlesStartTop = startY + 15;
    const handleVerticalPitch = 12;

    const handles = [...Array(8)].map((_, i) => {
      const currentTop = handlesStartTop + (i * handleVerticalPitch);
      return (
        <Handle
          key={`${prefix}${i}`}
          type="target"
          position={Position.Left}
          id={`${prefix}${i}`}
          style={{
            ...handleStyleBase,
            background: color,
            top: `${currentTop}px`
          }}
        />
      );
    });

    return [textElement, ...handles];
  };

  const vSyncY = 15;
  const hSyncY = 40;
  const redBusStartY = 75;
  const greenBusStartY = 190;
  const blueBusStartY = 305;

  return (
    <div style={{
      width: `${componentWidth}px`,
      height: `${componentHeight}px`,
      background: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '8px',
      position: 'relative',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden' 
    }}>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', position: 'relative'}}>
        <div style={{ width: `${sidebarWidth}px`, height: '100%', background: 'rgba(255,255,255,0.015)', borderRight: '1px solid #222' }}/>

        <div style={{ flex: 1, background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <div style={{ color: '#333', fontFamily: 'monospace', fontSize: '12px', textAlign: 'center', padding: '20px' }}>
                NO SIGNAL (24-BIT RGB)
                <br/>
                [PROPORÇÃO VGA PAISAGEM]
            </div>
        </div>

        <Handle type="target" position={Position.Left} id="vsync" style={{ ...handleStyleBase, top: `${vSyncY}px`, background: '#fff' }} />
        <div style={{ ...baseTextStyle, color: '#fff', top: `${vSyncY - 2}px` }}>VSYNC</div>

        <Handle type="target" position={Position.Left} id="hsync" style={{ ...handleStyleBase, top: `${hSyncY}px`, background: '#fff' }} />
        <div style={{ ...baseTextStyle, color: '#fff', top: `${hSyncY - 2}px` }}>HSYNC</div>

        {renderColorBus('r', '#ff4444', 'R[0..7]', redBusStartY)}
        {renderColorBus('g', '#44ff44', 'G [0..7]', greenBusStartY)}
        {renderColorBus('b', '#4444ff', 'B[0..7]', blueBusStartY)}
      </div>

      <div style={{ padding: '5px 15px', fontSize: '9px', color: '#666', fontFamily: 'monospace', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333' }}>
        <span>VGA_INTERFACE_V1_WIDE</span>
        <span style={{ color: '#00ff00' }}>ONLINE</span>
      </div>
    </div>
  );
};