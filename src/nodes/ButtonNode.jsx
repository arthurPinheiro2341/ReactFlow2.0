/**
 * ARQUIVO: ButtonNode.jsx
 * CAMADA: Component Layer / Input Node
 * DESCRIÇÃO: Implementa a representação física de um botão industrial.
 * O foco aqui é o feedback visual imediato (UX) sincronizado com a lógica de barramento.
 */

import React from 'react';
import { Handle, Position } from 'reactflow';

export const ButtonNode = ({ data }) => {
  const { color = '#1a1a1a', pressed, onToggle } = data;

  return (
    <div
      onClick={onToggle} 
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
        userSelect: 'none' 
      }}
    >
      {/* PONTO DE CONEXÃO (Handle):
        Representa o terminal físico de saída. No React Flow, o 'source' 
        é de onde o sinal "nasce" para percorrer as 'edges'.
      */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="out" 
        style={{ 
          right: '-5px', 
          background: '#a0a0a0', 
          width: '8px', 
          height: '4px', 
          borderRadius: '0' 
        }} 
      />

      {/* ATUADOR VISUAL (O Botão Físico):
        Utiliza lógica de estado ($S$) para alterar propriedades de CSS em tempo real.
      */}
      <div style={{
          width: '42px', 
          height: '42px', 
          borderRadius: '50%',
          
          // Lógica de Iluminação: Se pressionado, usa cor sólida escura.
          background: pressed 
            ? '#141414' 
            : `radial-gradient(circle at 30% 30%, #2e2e2e, #050505)`,
          
          // Lógica de Profundidade: 
          boxShadow: pressed 
            ? 'inset 0 4px 6px rgba(39, 39, 39, 0.9)' 
            : '0 5px 0 #111, 0 8px 15px rgba(0,0,0,0.5)',
          
          // Movimento mecânico ao pressionar
          transform: pressed ? 'translateY(3px)' : 'translateY(0px)',
          
          transition: 'all 0.05s ease', 
          border: '1px solid rgba(255,255,255,0.05)'
        }}
      />
    </div>
  );
};