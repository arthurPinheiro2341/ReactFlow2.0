/**
 * ARQUIVO: Toolbar.jsx
 * DESCRIÇÃO: Componente de Interface do Usuário (UI) que renderiza a barra de ferramentas superior.
 * Permite ao usuário instanciar novos componentes eletrônicos na placa e realizar 
 * ações de limpeza ou exclusão em massa.
 */

import React from 'react';

// O componente recebe funções via props do App.jsx para manipular o estado global
export const Toolbar = ({ addNode, deleteSelectedNodes, clearBoard }) => {
  return (
    <div style={{ 
      position: 'absolute', 
      zIndex: 10, 
      padding: '10px', 
      display: 'flex', 
      gap: '8px', 
      flexWrap: 'wrap',
      background: 'rgba(0, 0, 0, 0.7)', 
      borderRadius: '8px', 
      margin: '10px', 
      maxWidth: '650px', // Aumentado levemente para caber o novo botão
      boxShadow: '0 4px 15px rgba(0,0,0,0.5)', 
      border: '1px solid #444'
    }}>
      
      {/* SEÇÃO: ADIÇÃO DE COMPONENTES */}
      {/* Botões de entrada (Sinal) */}
      <button style={{ cursor: 'pointer' }} onClick={() => addNode('button')}>+ Botão (Pulso)</button>
      <button style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => addNode('switch')}>+ Switch (Trava)</button>
      
      {/* Indicadores Visuais (Saída) */}
      <button style={{ cursor: 'pointer', color: '#ff4444' }} onClick={() => addNode('led', '#ff4444')}>+ LED Vermelho</button>
      <button style={{ cursor: 'pointer', color: '#44ff44' }} onClick={() => addNode('led', '#44ff44')}>+ LED Verde</button>
      <button style={{ cursor: 'pointer', color: '#4444ff' }} onClick={() => addNode('led', '#4444ff')}>+ LED Azul</button>
      
      {/* Componentes especiais */}
      <button style={{ cursor: 'pointer', fontWeight: 'bold', color: '#fff' }} onClick={() => addNode('rgb_led')}>+ LED RGB</button>
      <button style={{ cursor: 'pointer' }} onClick={() => addNode('digit')}>+ Display</button>
      <button style={{ cursor: 'pointer' }} onClick={() => addNode('gnd')}>+ GND</button>

      {/* DIVISOR VISUAL */}
      <div style={{ width: '1px', background: '#555', margin: '0 5px' }} />

      {/* SEÇÃO: GESTÃO DA PLACA */}
      <button 
        style={{ 
          cursor: 'pointer', background: '#ff9800', color: 'white', 
          border: 'none', borderRadius: '4px', padding: '4px 8px', fontWeight: 'bold' 
        }} 
        onClick={deleteSelectedNodes}
      >
        Excluir Selecionado
      </button>
      
      <button 
        style={{ 
          cursor: 'pointer', background: '#d32f2f', color: 'white', 
          border: 'none', borderRadius: '4px', padding: '4px 8px' 
        }} 
        onClick={clearBoard}
      >
        🗑️ Limpar Placa
      </button>
    </div>
  );
};