import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { Background, Controls, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

// Importação dos componentes
import { ButtonNode } from './nodes/ButtonNode';
import { LEDNode } from './nodes/LEDNode';
import { DigitNode } from './nodes/DigitNode';
import { GNDNode } from './nodes/GNDNode';
import { RGBLEDNode } from './nodes/RGBLEDNode'; // Importe o RGB que criamos

// Registra os tipos de nós
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

  // Função para adicionar novos componentes com cores específicas
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

  // --- LÓGICA DO CIRCUITO COMPLETO ---
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        
        // 1. Lógica para o LED NORMAL (Cores fixas)
        if (node.type === 'led') {
          const hasSignal = edges.some(e => 
            e.target === node.id && e.targetHandle === 'vcc' && nds.find(n => n.id === e.source)?.data?.pressed
          );
          const hasGround = edges.some(e => 
            e.target === node.id && e.targetHandle === 'gnd' && nds.find(n => n.id === e.source)?.type === 'gnd'
          );
          return { ...node, data: { ...node.data, active: hasSignal && hasGround } };
        }

        // 2. Lógica para o LED RGB (Mistura de cores)
        if (node.type === 'rgb_led') {
          const hasGnd = edges.some(e => e.target === node.id && e.targetHandle === 'gnd' && nds.find(n => n.id === e.source)?.type === 'gnd');
          
          const checkChannel = (channelId) => edges.some(e => 
            e.target === node.id && e.targetHandle === channelId && nds.find(n => n.id === e.source)?.data?.pressed
          );

          return { 
            ...node, 
            data: { 
              ...node.data, 
              r: checkChannel('r'), g: checkChannel('g'), b: checkChannel('b'), gnd: hasGnd 
            } 
          };
        }

        // 3. Lógica para o Display de 7 Segmentos
        if (node.type === 'digit') {
          const hasGround = edges.some(e => e.target === node.id && e.targetHandle === 'gnd-common' && nds.find(n => n.id === e.source)?.type === 'gnd');
          const activeSegments = { a: false, b: false, c: false, d: false, e: false, f: false, g: false };

          if (hasGround) {
            edges.forEach(edge => {
              if (edge.target === node.id && edge.targetHandle !== 'gnd-common') {
                if (nds.find(n => n.id === edge.source)?.data?.pressed) {
                  activeSegments[edge.targetHandle] = true;
                }
              }
            });
          }
          return { ...node, data: { ...node.data, activeSegments } };
        }

        return node;
      })
    );
  }, [edges, nodes.map(n => n.data?.pressed).join(',')]);

  // Handlers
  const onEdgeClick = useCallback((_, edge) => setEdges((eds) => eds.filter((e) => e.id !== edge.id)), []);
  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const toggleButton = (id) => {
    setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, pressed: !n.data.pressed } } : n));
  };

  const nodesWithLogic = nodes.map((node) => {
    if (node.type === 'button') {
      return { ...node, data: { ...node.data, onToggle: () => toggleButton(node.id) } };
    }
    return node;
  });

  return (
    <div className="app" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      
      {/* Painel de Ferramentas Atualizado */}
      <div style={{ 
        position: 'absolute', zIndex: 10, padding: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap',
        background: 'rgba(0, 0, 0, 0.6)', borderRadius: '8px', margin: '10px', maxWidth: '400px'
      }}>
        <button style={{ cursor: 'pointer' }} onClick={() => addNode('button')}>+ Botão</button>
        <button style={{ cursor: 'pointer', color: '#ff4444' }} onClick={() => addNode('led', '#ff4444')}>+ LED Vermelho</button>
        <button style={{ cursor: 'pointer', color: '#44ff44' }} onClick={() => addNode('led', '#44ff44')}>+ LED Verde</button>
        <button style={{ cursor: 'pointer', color: '#4444ff' }} onClick={() => addNode('led', '#4444ff')}>+ LED Azul</button>
        <button style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => addNode('rgb_led')}>+ LED RGB</button>
        <button style={{ cursor: 'pointer' }} onClick={() => addNode('digit')}>+ Display</button>
        <button style={{ cursor: 'pointer' }} onClick={() => addNode('gnd')}>+ Terra (GND)</button>
      </div>

      <ReactFlow
        nodes={nodesWithLogic}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#333" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}