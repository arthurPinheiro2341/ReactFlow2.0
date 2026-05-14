/**
 * ARQUIVO: ClockNode.jsx
 * DESCRIÇÃO: Display digital de Clock puramente estético.
 * Estética de hardware: Fundo preto, texto verde neon e saída única.
 * O Handle de conexão agora possui visual metálico neutro.
 */

import React, { useEffect } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';

export const ClockNode = ({ id, data }) => {
  const { scale = 1, frequency = "25M" } = data;
  const updateNodeInternals = useUpdateNodeInternals();

  /**
   * SINCRONIZAÇÃO DE ESCALA:
   * Mantém o fio "grudado" na bolinha metálica após o redimensionamento.
   */
  useEffect(() => {
    const timer = setTimeout(() => updateNodeInternals(id), 10);
    return () => clearTimeout(timer);
  }, [id, scale, updateNodeInternals]);

  return (
    <div style={{
      // Dimensões aumentadas para preencher o slot da placa
      width: '150px', 
      height: '60px', 
      background: '#0a0a0a', // Fundo preto profundo
      border: '2px solid #333',
      borderRadius: '4px', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      transform: `scale(${scale})`, 
      transformOrigin: 'top left',
      boxShadow: '0 4px 10px rgba(0,0,0,0.8), inset 0 0 10px rgba(0,255,0,0.05)'
    }}>
      
      {/* IDENTIFICAÇÃO TÉCNICA */}
      <div style={{ 
        position: 'absolute', 
        top: '4px', 
        left: '8px', 
        fontSize: '8px', 
        color: '#444', 
        fontFamily: 'monospace' 
      }}>
        {/* Espaço reservado para ID do componente (ex: OSC_XTAL) */}
        
      </div>

      {/* ÁREA DO DISPLAY DIGITAL */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'baseline', 
        gap: '4px',
        padding: '5px 10px',
        background: '#001a00', // Fundo verde bem escuro (estilo LCD)
        border: '1px solid #004400',
        borderRadius: '2px',
        boxShadow: 'inset 0 0 5px #000'
      }}>
        <input 
          type="text"
          value={frequency}
          // Envia o valor digitado para o App.jsx
          onChange={(e) => data.onValueChange(e.target.value)}
          onPointerDown={(e) => e.stopPropagation()} 
          style={{
            width: '70px', 
            background: 'transparent', 
            border: 'none',
            color: '#00ff00', // Texto Verde Neon
            fontFamily: 'monospace', 
            textAlign: 'right',
            outline: 'none', 
            fontSize: '18px',
            fontWeight: 'bold',
            textShadow: '0 0 8px rgba(0,255,0,0.5)'
          }}
        />
        {/* UNIDADE FIXA (Hz) SOLICITADA */}
        <span style={{ 
          color: '#00ff00', 
          fontSize: '12px', 
          fontWeight: 'bold', 
          fontFamily: 'monospace',
          textShadow: '0 0 5px rgba(0,255,0,0.5)' 
        }}>
          Hz
        </span>
      </div>

      {/* ÚNICA SAÍDA (BOTTOM SOURCE) */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="out" 
        style={{ 
          background: '#111', // Fundo escuro do pino
          width: '10px', 
          height: '10px', 
          bottom: '-6px',
          
          border: '2px solid #a0a0a0' 
        }} 
      />

    </div>
  );
};