/**
 * ARQUIVO: SwitchNode.jsx
 * CAMADA: Component Layer / Input Node (Latching)
 * DESCRIÇÃO: Implementa uma chave com retenção de estado.
 * Atua como uma fonte de sinal persistente no grafo, simulando o 
 * fechamento de malha em disjuntores ou chaves seletoras.
 */

import React from 'react';
import { Handle, Position } from 'reactflow';

export const SwitchNode = ({ data }) => {
  /* DESESTRUTURAÇÃO DE DADOS:
     - pressed: Estado booleano persistente.
     - onToggle: Função disparada pelo App.jsx que inverte o bit de estado no grafo.
  */
  const { pressed, onToggle } = data;
  
  return (
    <div 
      onClick={onToggle} 
      style={{ 
        width: '35px', 
        height: '60px', 
        background: '#333', 
        border: '2px solid #1a1a1a', 
        cursor: 'pointer', 
        position: 'relative', 
        display: 'flex', 
        justifyContent: 'center', 
        /* LÓGICA DE ATUADOR MECÂNICO:
           Utiliza a propriedade 'align-items' para transladar o "manípulo" da chave.
           - 'flex-start' (Topo) representa o estado FECHADO/ATIVO (ON).
           - 'flex-end' (Base) representa o estado ABERTO/INATIVO (OFF).
        */
        alignItems: pressed ? 'flex-start' : 'flex-end',
        padding: '4px',
        borderRadius: '3px',
        transition: 'all 0.2s ease-in-out' // Simula a inércia mecânica da chave
      }}
    >
      {/* SAÍDA DE SINAL (Source):
          Interface de saída única posicionada no eixo X positivo (Right).
          O id "out" é mapeado pelo motor 'useCircuit' para propagar o nível lógico.
      */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="out" 
        style={{ 
          background: '#777', 
          width: '8px', 
          height: '4px', 
          borderRadius: '0',
          right: '-5px' 
        }} 
      />
      
      {/* MANÍPULO DA CHAVE (Switch Lever):
          Representação visual da parte móvel do disjuntor.
          O gradiente interno (boxShadow inset) fornece a percepção de volume 3D.
      */}
      <div style={{ 
        width: '100%', 
        height: '25px', 
        background: pressed ? '#555' : '#555', // Feedback de cor: Verde para ON, Cinza para OFF
        border: '1px solid #111',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
        transition: 'background 0.3s ease'
      }} />
    </div>
  );
};