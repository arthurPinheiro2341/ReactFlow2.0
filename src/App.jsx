import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { Background, Controls, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

// Importação dos componentes
import { ButtonNode } from './nodes/ButtonNode';
import { LEDNode } from './nodes/LEDNode';
import { DigitNode } from './nodes/DigitNode';
import { GNDNode } from './nodes/GNDNode';
import { RGBLEDNode } from './nodes/RGBLEDNode';

const nodeTypes = { 
  button: ButtonNode, 
  led: LEDNode, 
  digit: DigitNode, 
  gnd: GNDNode, 
  rgb_led: RGBLEDNode 
};

const initialNodes = [
  { id: 'sw-1', type: 'button', position: { x: 50, y: 50 }, data: { pressed: false } },
  { id: 'led-1', type: 'led', position: { x: 400, y: 50 }, data: { color: '#ff4444', active: false } },
  { id: 'gnd-1', type: 'gnd', position: { x: 400, y: 300 }, data: {} },
];

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);

  // --- 1. FUNÇÃO PARA REMOVER O NÓ E SEUS FIOS ---
  const onDeleteNode = useCallback((id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  }, []);

  // --- 2. FUNÇÃO PARA DELETAR SELECIONADOS ---
  const deleteSelectedNodes = useCallback(() => {
    // Filtramos quem está com a propriedade 'selected' ativa
    const selectedNodes = nodes.filter((n) => n.selected);
    selectedNodes.forEach((node) => onDeleteNode(node.id));
  }, [nodes, onDeleteNode]);

  // Adicionar novos componentes
  const addNode = useCallback((type, color = '#ffeb3b') => {
    const id = `${type}-${Date.now()}`; 
    const newNode = {
      id: id,
      type: type,
      position: { x: 250, y: 150 },
      data: type === 'digit' 
        ? { activeSegments: {} } 
        : { color: color, pressed: false, active: false, r: false, g: false, b: false, gnd: false },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  // Lógica do Circuito (Simulação)
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'led') {
          const hasSignal = edges.some(e => e.target === node.id && e.targetHandle === 'vcc' && nds.find(n => n.id === e.source)?.data?.pressed);
          const hasGround = edges.some(e => e.target === node.id && e.targetHandle === 'gnd' && nds.find(n => n.id === e.source)?.type === 'gnd');
          return { ...node, data: { ...node.data, active: hasSignal && hasGround } };
        }

        if (node.type === 'rgb_led') {
          const hasGnd = edges.some(e => e.target === node.id && e.targetHandle === 'gnd' && nds.find(n => n.id === e.source)?.type === 'gnd');
          const checkChannel = (channelId) => edges.some(e => e.target === node.id && e.targetHandle === channelId && nds.find(n => n.id === e.source)?.data?.pressed);
          return { ...node, data: { ...node.data, r: checkChannel('r'), g: checkChannel('g'), b: checkChannel('b'), gnd: hasGnd } };
        }

        if (node.type === 'digit') {
          const hasGround = edges.some(e => e.target === node.id && e.targetHandle === 'gnd-common' && nds.find(n => n.id === e.source)?.type === 'gnd');
          const activeSegments = { a: false, b: false, c: false, d: false, e: false, f: false, g: false };
          if (hasGround) {
            edges.forEach(edge => {
              if (edge.target === node.id && edge.targetHandle !== 'gnd-common') {
                if (nds.find(n => n.id === edge.source)?.data?.pressed) activeSegments[edge.targetHandle] = true;
              }
            });
          }
          return { ...node, data: { ...node.data, activeSegments } };
        }
        return node;
      })
    );
  }, [edges, nodes.map(n => n.data?.pressed).join(',')]);

  // Handlers do React Flow
  const onEdgeClick = useCallback((_, edge) => setEdges((eds) => eds.filter((e) => e.id !== edge.id)), []);
  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const toggleButton = (id) => {
    setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, pressed: !n.data.pressed } } : n));
  };

  // Injetar funções nos nós
  const nodesWithLogic = nodes.map((node) => {
    return {
      ...node,
      data: {
        ...node.data,
        onDelete: () => onDeleteNode(node.id),
        onToggle: node.type === 'button' ? () => toggleButton(node.id) : undefined,
      },
    };
  });

  // --- ÚNICO RETURN DO COMPONENTE ---
  return (
    <div className="app" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      
      {/* Painel de Ferramentas Único */}
      <div style={{ 
        position: 'absolute', zIndex: 10, padding: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap',
        background: 'rgba(0, 0, 0, 0.7)', borderRadius: '8px', margin: '10px', maxWidth: '550px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.5)', border: '1px solid #444'
      }}>
        {/* Adição de nós */}
        <button style={{ cursor: 'pointer' }} onClick={() => addNode('button')}>+ Botão</button>
        <button style={{ cursor: 'pointer', color: '#ff4444' }} onClick={() => addNode('led', '#ff4444')}>+ LED Vermelho</button>
        <button style={{ cursor: 'pointer', color: '#44ff44' }} onClick={() => addNode('led', '#44ff44')}>+ LED Verde</button>
        <button style={{ cursor: 'pointer', color: '#4444ff' }} onClick={() => addNode('led', '#4444ff')}>+ LED Azul</button>
        <button style={{ cursor: 'pointer', fontWeight: 'bold', color: '#fff' }} onClick={() => addNode('rgb_led')}>+ LED RGB</button>
        <button style={{ cursor: 'pointer' }} onClick={() => addNode('digit')}>+ Display</button>
        <button style={{ cursor: 'pointer' }} onClick={() => addNode('gnd')}>+ GND</button>

        {/* Divisor Visual */}
        <div style={{ width: '1px', background: '#555', margin: '0 5px' }} />

        {/* Ações de exclusão */}
        <button 
          style={{ cursor: 'pointer', background: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', fontWeight: 'bold' }} 
          onClick={deleteSelectedNodes}
        >
          Excluir Selecionado
        </button>

        <button 
          style={{ cursor: 'pointer', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px' }} 
          onClick={() => { if(window.confirm("Limpar toda a placa?")) { setNodes([]); setEdges([]); } }}
        >
          🗑️ Limpar Placa
        </button>
      </div>

      <ReactFlow
        nodes={nodesWithLogic}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        onNodesDelete={(deleted) => deleted.forEach(n => onDeleteNode(n.id))}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#1a1a1a" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}