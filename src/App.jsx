/**
 * ARQUIVO: App.jsx
 * DESCRIÇÃO: Este é o componente principal (Orquestrador) do simulador. 
 * Ele gerencia o estado global dos componentes (nodes) e conexões (edges),
 * além de centralizar as funções de criação, exclusão e interação com a placa.
 */

import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, { Background, Controls, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

// Importação das configurações de tipos de peças e componentes da interface
import { nodeTypes, initialNodes } from './config/flowConfig';
import { useCircuit } from './hooks/useCircuit';
import { useKeyboard } from './hooks/useKeyboard';
import { Toolbar } from './components/Toolbar';

export default function App() {
  // Estados que armazenam a lista de componentes e as conexões elétricas (fios)
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);

  // Função para remover um fio específico ao clicar diretamente nele
  const onEdgeClick = useCallback((event, edge) => {
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  }, []);

  // Alterna o estado de um botão entre pressionado (true) e solto (false)
  const toggleButton = useCallback((id) => {
    setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, pressed: !n.data.pressed } } : n));
  }, []);

  // Remove um componente da placa e limpa todos os fios conectados a ele
  const onDeleteNode = useCallback((id) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  }, []);

  // --- HOOKS CUSTOMIZADOS ---
  // Processa a lógica de propagação de sinal do circuito
  useCircuit(nodes, edges, setNodes);
  // Gerencia o acionamento dos botões via teclas do teclado
  useKeyboard(nodes, toggleButton);

  // Adiciona um novo componente à placa em uma posição padrão
  const addNode = (type, color) => {
    const id = `${type}-${Date.now()}`; // Gera ID único baseado no timestamp
    const newNode = { id, type, position: { x: 250, y: 150 }, data: { color, pressed: false } };
    setNodes((nds) => nds.concat(newNode));
  };

  // Injeta as funções de lógica (onDelete, onToggle) nos dados de cada nó
  // O useMemo evita que essa transformação seja refeita sem necessidade
  const nodesWithLogic = useMemo(() => nodes.map((node) => ({
    ...node,
    data: { 
      ...node.data, 
      onDelete: () => onDeleteNode(node.id), 
      onToggle: node.type === 'button' ? () => toggleButton(node.id) : undefined 
    }
  })), [nodes, onDeleteNode, toggleButton]);

  return (
    <div className="app" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Barra de ferramentas superior para controle e adição de peças */}
      <Toolbar 
        addNode={addNode} 
        deleteSelectedNodes={() => nodes.filter(n => n.selected).forEach(n => onDeleteNode(n.id))}
        clearBoard={() => window.confirm("Limpar toda a placa?") && (setNodes([]) || setEdges([]))}
      />

      {/* Área principal da simulação onde o React Flow renderiza os componentes */}
      <ReactFlow
        nodes={nodesWithLogic}
        edges={edges}
        onNodesChange={(c) => setNodes((nds) => applyNodeChanges(c, nds))} // Gerencia movimento dos nós
        onEdgesChange={(c) => setEdges((eds) => applyEdgeChanges(c, eds))} // Gerencia estado das conexões
        onConnect={(p) => setEdges((eds) => addEdge(p, eds))}             // Cria novo fio entre dois pontos
        onEdgeClick={onEdgeClick}                                         // Clique no fio para remover
        nodeTypes={nodeTypes}                                             // Mapeamento de tipos para componentes JSX
        fitView                                                           // Ajusta a câmera automaticamente
      >
        {/* Fundo pontilhado e controles de zoom/movimentação */}
        <Background color="#1a1a1a" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}