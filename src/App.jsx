/**
 * ARQUIVO: App.jsx
 * DESCRIÇÃO: Orquestrador do simulador. 
 * Agora com suporte a Menu de Contexto (botão direito) e Painel Lateral Fixo.
 */

import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, { Background, Controls, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

import { nodeTypes, initialNodes } from './config/flowConfig';
import { useCircuit } from './hooks/useCircuit';
import { useKeyboard } from './hooks/useKeyboard';
import { Toolbar } from './components/Toolbar';

// --- COMPONENTE: PAINEL DE CONFIGURAÇÃO (SIDEBAR) ---
const HotkeySidebar = ({ nodes, onHotkeyChange }) => {
  const controllers = nodes.filter(n => n.type === 'button' || n.type === 'switch');
  if (controllers.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', 
      right: '20px', 
      top: '20px', 
      zIndex: 9999, // Z-index alto para ficar na frente da tela
      width: '200px', 
      background: '#1a1a1a', 
      padding: '15px',
      borderRadius: '8px', 
      color: '#fff', 
      border: '2px solid #00ff00', 
      boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
      fontFamily: 'monospace'
    }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#00ff00', textAlign: 'center' }}>
        ⚙️ CONFIG. TECLAS
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {controllers.map((node) => (
          <div key={node.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10px' }}>{node.type.toUpperCase()}:</span>
            <input
              maxLength={1}
              value={node.data.hotkey || ''}
              onChange={(e) => onHotkeyChange(node.id, { hotkey: e.target.value.toLowerCase() })}
              style={{
                width: '30px', background: '#000', border: '1px solid #00ff00',
                color: '#00ff00', textAlign: 'center', borderRadius: '3px', fontWeight: 'bold'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);

  // Função para atualizar dados do nó (como a tecla)
  const updateNodeData = useCallback((id, newData) => {
    setNodes((nds) => nds.map((node) => node.id === id ? { ...node, data: { ...node.data, ...newData } } : node));
  }, []);

  const toggleButton = useCallback((id) => {
    setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, pressed: !n.data.pressed } } : n));
  }, []);

  const setButtonState = useCallback((id, isPressed) => {
    setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, pressed: isPressed } } : n));
  }, []);

  const onDeleteNode = useCallback((id) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  }, []);

  // Lógica de clique com botão direito (Context Menu)
  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault(); // Impede o menu padrão do Windows
    if (node.type === 'button' || node.type === 'switch') {
      const newKey = prompt(`Defina a tecla para este ${node.type}:`, node.data.hotkey || '');
      if (newKey !== null) {
        updateNodeData(node.id, { hotkey: newKey.toLowerCase().charAt(0) });
      }
    }
  }, [updateNodeData]);

  useCircuit(nodes, edges, setNodes);
  useKeyboard(nodes, setButtonState, toggleButton);

  const addNode = (type, color) => {
    const id = `${type}-${Date.now()}`;
    const newNode = { 
      id, type, 
      position: { x: 400, y: 200 }, 
      data: { color, pressed: false, hotkey: '' } // Inicializar a hotkey vazia
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const nodesWithLogic = useMemo(() => nodes.map((node) => ({
    ...node,
    data: { 
      ...node.data, 
      onDelete: () => onDeleteNode(node.id), 
      onStart: node.type === 'button' ? () => setButtonState(node.id, true) : undefined,
      onEnd: node.type === 'button' ? () => setButtonState(node.id, false) : undefined,
      onToggle: node.type === 'switch' ? () => toggleButton(node.id) : undefined,
      onHotkeyChange: (newKey) => updateNodeData(node.id, { hotkey: newKey })
    }
  })), [nodes, onDeleteNode, toggleButton, setButtonState, updateNodeData]);

  return (
    <div className="app" style={{ width: '100vw', height: '100vh', position: 'relative', background: '#0a0a0a' }}>
      <Toolbar
        addNode={addNode}
        deleteSelectedNodes={() => nodes.filter(n => n.selected).forEach(n => onDeleteNode(n.id))}
        clearBoard={() => window.confirm("Limpar placa?") && (setNodes([]) || setEdges([]))}
      />

      {/* Painel lateral agora com posição FIXA */}
      <HotkeySidebar nodes={nodes} onHotkeyChange={(id, data) => updateNodeData(id, data)} />

      <ReactFlow
        nodes={nodesWithLogic}
        edges={edges}
        onNodesChange={(c) => setNodes((nds) => applyNodeChanges(c, nds))}
        onEdgesChange={(c) => setEdges((eds) => applyEdgeChanges(c, eds))}
        onConnect={(p) => setEdges((eds) => addEdge(p, eds))}
        onEdgeClick={(_, edge) => setEdges((eds) => eds.filter((e) => e.id !== edge.id))}
        
        // --- NOVO HANDLER: BOTÃO DIREITO NO NÓ ---
        onNodeContextMenu={onNodeContextMenu}
        
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#1a1a1a" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}