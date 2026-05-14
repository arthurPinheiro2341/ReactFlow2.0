/**
 * ARQUIVO: Toolbar.jsx
 * CAMADA: Interface do Usuário (UI) / Control Layer
 */

import React from 'react';

export const Toolbar = ({ addNode, deleteSelectedNodes, clearBoard, toggleSidebar, isSidebarVisible }) => {
  return (
    <div style={{ 
      position: 'absolute', zIndex: 10, padding: '10px', display: 'flex', 
      gap: '8px', background: 'rgba(0,0,0,0.7)', borderRadius: '8px', 
      margin: '10px', border: '1px solid #444', alignItems: 'center'
    }}>
      
      {/* FONTES DE SINAL */}
      <button onClick={() => addNode('button')}>+ Botão</button>
      <button onClick={() => addNode('switch')}>+ Switch</button>
      <button style={{ color: '#00ff00' }} onClick={() => addNode('constant')}>+ Data Bus</button>
      <button style={{ background: '#333', color: '#fff' }} onClick={() => addNode('fpga')}>+ Chip FPGA</button>
      <button onClick={() => addNode('display', '#333')}>+ Tela VGA</button>

      <div style={{ width: '1px', background: '#555', margin: '0 5px' }} />

      {/* SAÍDAS */}
      <button style={{ color: '#ff4444' }} onClick={() => addNode('led', '#ff4444')}>+ LED R</button>
      <button style={{ color: '#44ff44' }} onClick={() => addNode('led', '#44ff44')}>+ LED G</button>
      <button style={{ color: '#4444ff' }} onClick={() => addNode('led', '#4444ff')}>+ LED B</button>
      <button onClick={() => addNode('digit')}>+ Display</button>
      <button onClick={() => addNode('rgb_led')}>+ LED RGB</button>

      <div style={{ width: '1px', background: '#555', margin: '0 5px' }} />

      {/* GESTÃO DE ESTADO E VISIBILIDADE */}
      
      {/* BOTÃO EXCLUIR: Atua sobre a seleção atual do canvas */}
      <button 
        style={{ background: '#444', color: '#ff4444', border: '1px solid #ff4444' }} 
        onClick={deleteSelectedNodes}
      >
        🗑️ Excluir
      </button>

      {/* BOTÃO MINIMIZAR: Alterna a exibição da HotkeySidebar */}
      <button 
        style={{ 
          background: isSidebarVisible ? '#333' : '#00ff00', 
          color: isSidebarVisible ? '#fff' : '#000',
          fontWeight: 'bold'
        }} 
        onClick={toggleSidebar}
      >
        {isSidebarVisible ? '➖ Minimizar Teclas' : '➕ Mostrar Teclas'}
      </button>

      <button style={{ background: '#d32f2f', color: '#fff' }} onClick={clearBoard}>Limpar</button>

    </div>
  );
};