/**
 * ARQUIVO: Toolbar.jsx
 * CAMADA: Interface do Usuário (UI) / Control Layer
 */

import React from 'react';

export const Toolbar = ({ addNode, deleteSelectedNodes, clearBoard, toggleSidebar, isSidebarVisible }) => {
  return (
    <div style={{ 
      position: 'absolute', zIndex: 10, padding: '10px', display: 'flex', 
      gap: '8px', background: 'rgba(0,0,0,0.85)', borderRadius: '8px', 
      margin: '10px', border: '1px solid #444', alignItems: 'center',
      boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
    }}>
      
      {/* SEÇÃO 1: FONTES DE SINAL E TEMPORIZAÇÃO */}
      <button onClick={() => addNode('button')}>+ Botão</button>
      <button onClick={() => addNode('switch')}>+ Switch</button>
      <button style={{ color: '#00ff00' }} onClick={() => addNode('constant')}>+ Data Bus</button>
      
      {/* NOVO: Gerador de Clock (Destaque em Verde para indicar sinal oscilante) */}
      <button 
        style={{ border: '1px solid #00ff00', color: '#00ff00', fontWeight: 'bold' }} 
        onClick={() => addNode('clock')}
      >
        + Clock (Hz)
      </button>

      <div style={{ width: '1px', background: '#555', margin: '0 5px', height: '20px' }} />

      {/* SEÇÃO 2: NÚCLEOS DE PROCESSAMENTO E EXIBIÇÃO */}
      <button style={{ background: '#333', color: '#fff' }} onClick={() => addNode('fpga')}>+ Chip FPGA</button>
      <button onClick={() => addNode('display', '#333')}>+ Tela VGA</button>

      <div style={{ width: '1px', background: '#555', margin: '0 5px', height: '20px' }} />

      {/* SEÇÃO 3: SAÍDAS E INDICADORES VISUAIS */}
      <button style={{ color: '#ff4444' }} onClick={() => addNode('led', '#ff4444')}>+ LED R</button>
      <button style={{ color: '#44ff44' }} onClick={() => addNode('led', '#44ff44')}>+ LED G</button>
      <button style={{ color: '#4444ff' }} onClick={() => addNode('led', '#4444ff')}>+ LED B</button>
      <button onClick={() => addNode('digit')}>+ Display 7Seg</button>
      <button onClick={() => addNode('rgb_led')}>+ LED RGB</button>

      <div style={{ width: '1px', background: '#555', margin: '0 5px', height: '20px' }} />

      {/* SEÇÃO 4: GESTÃO DO WORKSPACE */}
      <button 
        style={{ background: '#444', color: '#ff4444', border: '1px solid #ff4444' }} 
        onClick={deleteSelectedNodes}
      >
        🗑️ Excluir
      </button>

      <button 
        style={{ 
          background: isSidebarVisible ? '#333' : '#00ff00', 
          color: isSidebarVisible ? '#fff' : '#000',
          fontWeight: 'bold'
        }} 
        onClick={toggleSidebar}
      >
        {isSidebarVisible ? '➖ Config' : '➕ Config'}
      </button>

      <button style={{ background: '#d32f2f', color: '#fff' }} onClick={clearBoard}>Limpar</button>

    </div>
  );
};