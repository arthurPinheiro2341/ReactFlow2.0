/**
 * ARQUIVO: SwitchNode.jsx
 * DESCRIÇÃO: Representação visual de um disjuntor (Circuit Breaker).
 * Possui um design industrial robusto com uma alavanca larga. 
 * O estado é indicado apenas pela posição física da chave.
 */

import React from 'react';
import { Handle, Position } from 'reactflow';

export const SwitchNode = ({ data }) => {
  const { pressed, onToggle } = data;

  return (
    <div
      onClick={onToggle}
      style={{
        width: '45px', 
        height: '75px', 
        background: '#333',
        borderRadius: '3px', 
        border: '2px solid #1a1a1a',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center', 
        cursor: 'pointer',
        boxShadow: '4px 4px 10px rgba(0,0,0,0.5), inset 0 0 5px rgba(255,255,255,0.1)',
        position: 'relative'
      }}
    >
      {/* Detalhes estéticos do trilho do disjuntor */}
      <div style={{ position: 'absolute', top: '5px', width: '80%', height: '2px', background: '#222' }} />
      <div style={{ position: 'absolute', bottom: '5px', width: '80%', height: '2px', background: '#222' }} />

      {/* Handles de conexão */}
      <Handle type="source" position={Position.Left} id="in" style={{ background: '#777', width: '8px', height: '4px', borderRadius: '0' }} />
      <Handle type="source" position={Position.Right} id="out" style={{ background: '#777', width: '8px', height: '4px', borderRadius: '0' }} />

      {/* CAVIDADE DA ALAVANCA */}
      <div style={{
        width: '28px',
        height: '50px',
        background: '#1a1a1a',
        borderRadius: '2px',
        display: 'flex',
        alignItems: pressed ? 'flex-start' : 'flex-end', // Altera a posição do bloco
        padding: '2px',
        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.8)'
      }}>
        {/* A ALAVANCA (ESTILO BLOCO) */}
        <div style={{
          width: '100%',
          height: '24px',
          background: pressed ? '#555' : '#444',
          borderRadius: '2px',
          border: '1px solid #222',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '4px 0',
          transition: 'all 0.1s ease-in-out',
          boxShadow: '0 2px 4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
        }}>
          {/* Frisos da alavanca para "grip" */}
          <div style={{ width: '12px', height: '2px', background: '#222' }} />
          <div style={{ width: '12px', height: '2px', background: '#222' }} />
          <div style={{ width: '12px', height: '2px', background: '#222' }} />
        </div>
      </div>
    </div>
  );
};