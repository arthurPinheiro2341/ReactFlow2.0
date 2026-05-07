/**
 * ARQUIVO: ButtonNode.jsx
 * DESCRIÇÃO: Representação visual de um botão de pressão (push-button).
 * Agora funciona de forma momentânea: envia sinal apenas enquanto estiver 
 * sendo pressionado (onPointerDown/Up). O input de hotkey foi removido para a sidebar.
 */

import React from 'react';
import { Handle, Position } from 'reactflow';

export const ButtonNode = ({ data }) => {
  // Recebemos onStart (pressionar) e onEnd (soltar) para o comportamento de pulso
  const { color = '#5a5858', pressed, onStart, onEnd } = data;

  return (
    <div
      onPointerDown={onStart} // Ativa o sinal ao apertar
      onPointerUp={onEnd}     // Desativa ao soltar
      onPointerLeave={onEnd}  // Desativa se o mouse sair de cima enquanto apertado
      style={{
        width: '60px', 
        height: '60px', 
        background: '#2c2c2c',
        borderRadius: '8px', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center', 
        border: '2px solid #1a1a1a',
        cursor: 'pointer', 
        position: 'relative',
        boxShadow: '0 4px 8px rgba(0,0,0,0.6)',
        userSelect: 'none' // Impede seleção de texto indesejada ao clicar rápido
      }}
    >
      {/* 4 PERNAS DE CONEXÃO (HANDLES) */}
      <Handle type="source" position={Position.Left} id="l1" style={{ top: '20%', background: '#a0a0a0', width: '8px', height: '4px', borderRadius: '0' }} />
      <Handle type="source" position={Position.Left} id="l2" style={{ top: '80%', background: '#a0a0a0', width: '8px', height: '4px', borderRadius: '0' }} />
      <Handle type="source" position={Position.Right} id="r1" style={{ top: '20%', background: '#a0a0a0', width: '8px', height: '4px', borderRadius: '0' }} />
      <Handle type="source" position={Position.Right} id="r2" style={{ top: '80%', background: '#a0a0a0', width: '8px', height: '4px', borderRadius: '0' }} />

      {/* PARTE INTERNA DO BOTÃO */}
      <div style={{
          width: '42px', 
          height: '42px', 
          borderRadius: '50%',
          background: pressed ? color : `radial-gradient(circle at 30% 30%, ${color}, #000)`,
          boxShadow: pressed ? 'inset 0 4px 6px rgba(0,0,0,0.8)' : '0 5px 0 #1a1a1a, 0 8px 15px rgba(0,0,0,0.4)',
          transform: pressed ? 'translateY(3px)' : 'translateY(0px)',
          transition: 'all 0.05s ease',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      />
    </div>
  );
};