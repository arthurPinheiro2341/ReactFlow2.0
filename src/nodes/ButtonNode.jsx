/**
 * ARQUIVO: ButtonNode.jsx
 * DESCRIÇÃO: Representação visual de um botão de pressão (push-button) industrial.
 * Este componente atua como uma "Fonte de Sinal" (Source). Quando pressionado, 
 * ele envia um sinal lógico alto para os outros componentes conectados.
 */

import React from 'react';
import { Handle, Position } from 'reactflow';

export const ButtonNode = ({ data }) => {
  // Extração das propriedades enviadas pelo App.jsx
  const { color = '#5a5858', pressed, onToggle } = data;

  return (
    <div
      onClick={onToggle} // Dispara a alternância de estado no clique
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
      }}
    >
      {/* 4 PERNAS DE CONEXÃO (HANDLES)
          Definidas como 'source' porque o botão é a origem do sinal.
          O design simula as pernas metálicas de um componente real.
      */}
      <Handle type="source" position={Position.Left} id="l1" style={{ top: '20%', background: '#a0a0a0', width: '8px', height: '4px', borderRadius: '0' }} />
      <Handle type="source" position={Position.Left} id="l2" style={{ top: '80%', background: '#a0a0a0', width: '8px', height: '4px', borderRadius: '0' }} />
      <Handle type="source" position={Position.Right} id="r1" style={{ top: '20%', background: '#a0a0a0', width: '8px', height: '4px', borderRadius: '0' }} />
      <Handle type="source" position={Position.Right} id="r2" style={{ top: '80%', background: '#a0a0a0', width: '8px', height: '4px', borderRadius: '0' }} />

      {/* PARTE INTERNA DO BOTÃO (O CÍRCULO) */}
      <div style={{
          width: '42px', 
          height: '42px', 
          borderRadius: '50%',
          
          // Efeito de iluminação: Gradiente radial quando solto, cor sólida quando pressionado
          background: pressed ? color : `radial-gradient(circle at 30% 30%, ${color}, #000)`,
          
          // Efeito de profundidade: Sombra interna (inset) quando pressionado para parecer que afundou
          boxShadow: pressed ? 'inset 0 4px 6px rgba(0,0,0,0.8)' : '0 5px 0 #1a1a1a, 0 8px 15px rgba(0,0,0,0.4)',
          
          // Movimento: Desloca 3px para baixo ao pressionar (simulação mecânica)
          transform: pressed ? 'translateY(3px)' : 'translateY(0px)',
          
          transition: 'all 0.05s ease',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      />
    </div>
  );
};