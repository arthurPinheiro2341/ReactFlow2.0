/**
 * ARQUIVO: LEDNode.jsx
 * CAMADA: Component Layer / Output Actuator
 * DESCRIÇÃO: Implementa um indicador visual skeuomórfico.
 */

import React from 'react';
import { Handle, Position } from 'reactflow';

export const LEDNode = ({ data }) => {
  const { color = '#ffeb3b', active } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* 1. CABEÇA DO LED (DOMO DETALHADO) */}
      <div
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '50% 50% 10% 10%', 
          background: active 
            ? `radial-gradient(circle at 30% 30%, #fff, ${color} 40%, #000)` 
            : `radial-gradient(circle at 30% 30%, #555, #111)`,
          border: '1px solid rgba(255,255,255,0.2)',
          /* EFEITO DE GLOW (BLOOM): 
             Removido o par de chaves extras que causava erro de sintaxe.
             Dentro de objetos de estilo, usamos comentários JS padrão. */
          boxShadow: active 
            ? `0 0 25px 5px ${color}, inset 0 -5px 10px rgba(0,0,0,0.5)` 
            : 'inset 0 -5px 10px rgba(0,0,0,0.7)',
          zIndex: 2
        }}
      />

      {/* 2. BASE DO LED */}
      <div style={{ width: '38px', height: '4px', background: '#333', borderRadius: '1px', marginTop: '-2px', zIndex: 1 }} />

      {/* 3. PERNINHA METÁLICA (Terminal) */}
      <div style={{
          width: '4px', 
          height: '30px', 
          background: '#a0a0a0', 
          position: 'relative',
          marginTop: '-2px',
          zIndex: 0,
          display: 'flex',
          justifyContent: 'center',
          boxShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        <Handle 
          type="target" 
          position={Position.Bottom} 
          id="in" 
          style={{ 
            bottom: '-4px', 
            background: '#777', 
            width: '10px', 
            height: '10px',
            border: '2px solid #1a1a1a'
          }} 
        />
      </div>
    </div>
  );
};