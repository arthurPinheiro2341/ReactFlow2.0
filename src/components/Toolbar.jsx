/**
 * ARQUIVO: Toolbar.jsx
 * CAMADA: Interface do Usuário (UI) / Control Layer
 * DESCRIÇÃO: Este componente orquestra a inserção de novos objetos no estado global do simulador.
 * Ele funciona como uma ponte entre a interação do usuário e as funções de mutação de estado no App.jsx.
 */

import React from 'react';

// Desestruturação de Props: Recebe funções de alta ordem (High-Order Functions) 
// injetadas pelo componente pai (App.jsx) para manter o estado centralizado (Single Source of Truth).
export const Toolbar = ({ addNode, deleteSelectedNodes, clearBoard }) => {
  return (
    <div style={{ 
      position: 'absolute', // Garante que a Toolbar flutue sobre o canvas do React Flow
      zIndex: 10,           // Prioridade de renderização sobre os Nodes e Edges
      padding: '10px', 
      display: 'flex', 
      gap: '8px', 
      background: 'rgba(0,0,0,0.7)', // Overlay semi-transparente para estética Dark Mode
      borderRadius: '8px', 
      margin: '10px', 
      border: '1px solid #444' // Definição de borda para contraste com o Background do canvas
    }}>
      
      {/* SEÇÃO 1: INPUT SOURCES (FONTES DE SINAL)
          Componentes que iniciam a propagação de dados no grafo.
      */}
      <button onClick={() => addNode('button')}>+ Botão</button>
      <button onClick={() => addNode('switch')}>+ Switch</button>
      
      {/* DATA BUS: Envia valores inteiros (0-9). 
          O uso de cores (#00ff00) diferencia visualmente componentes de dados de componentes lógicos binários.
      */}
      <button style={{ color: '#00ff00' }} onClick={() => addNode('constant')}>+ Data Bus</button>

      {/* FPGA CORE: Instancia o chip de lógica programável. 
          Note que o 'addNode' é polimórfico, tratando o tipo 'fpga' como um objeto complexo no estado.
      */}
      <button style={{ background: '#333', color: '#fff' }} onClick={() => addNode('fpga')}>+ Chip FPGA</button>

      {/* Divisor Estético: Melhora a carga cognitiva do usuário ao separar tipos de componentes */}
      <div style={{ width: '1px', background: '#555', margin: '0 5px' }} />

      {/* SEÇÃO 2: OUTPUT ACTUATORS (ATUADORES DE SAÍDA)
          Diferenciação de cor injetada via parâmetro no addNode para LEDs monocromáticos.
      */}
      <button style={{ color: '#ff4444' }} onClick={() => addNode('led', '#ff4444')}>+ LED R</button>
      <button style={{ color: '#44ff44' }} onClick={() => addNode('led', '#44ff44')}>+ LED G</button>
      <button style={{ color: '#4444ff' }} onClick={() => addNode('led', '#4444ff')}>+ LED B</button>
      
      {/* Componentes Decodificadores: O 'digit' processa barramentos (Bus) 
          e o 'rgb_led' processa sinais múltiplos (R, G, B).
      */}
      <button onClick={() => addNode('digit')}>+ Display</button>
      <button onClick={() => addNode('rgb_led')}>+ LED RGB</button>

      <div style={{ width: '1px', background: '#555', margin: '0 5px' }} />

      {/* SEÇÃO 3: STATE MANAGEMENT (GESTÃO DE ESTADO)
          Função 'clearBoard' aciona o reset total dos arrays de nodes e edges no App.jsx.
      */}
      <button style={{ background: '#d32f2f', color: '#fff' }} onClick={clearBoard}>Limpar</button>
    </div>
  );
};