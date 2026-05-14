/**
 * ARQUIVO: App.jsx
 * CAMADA: Orchestration & State Management
 */

import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, { Background, Controls, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';

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
      position: 'fixed', right: '20px', top: '20px', zIndex: 9999,
      width: '200px', background: '#1a1a1a', padding: '15px',
      borderRadius: '8px', color: '#fff', border: '2px solid #00ff00',
      boxShadow: '0 10px 30px rgba(0,0,0,0.8)', fontFamily: 'monospace'
    }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#00ff00', textAlign: 'center' }}>⚙️ CONFIG. TECLAS</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {controllers.map((node) => (
          <div key={node.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10px' }}>{node.type.toUpperCase()}:</span>
            <input
              maxLength={1}
              value={node.data.hotkey || ''}
              onChange={(e) => onHotkeyChange(node.id, { hotkey: e.target.value.toLowerCase() })}
              style={{ width: '30px', background: '#000', border: '1px solid #00ff00', color: '#00ff00', textAlign: 'center', borderRadius: '3px', fontWeight: 'bold' }}
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

  // ESTADO DE VISIBILIDADE: Controla o "Minimizar/Mostrar" da Sidebar
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const updateNodeData = useCallback((id, newData) => {
    setNodes((nds) => nds.map((node) => node.id === id ? { ...node, data: { ...node.data, ...newData } } : node));
  }, []);

  const toggleButton = useCallback((id) => {
    setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, pressed: !n.data.pressed } } : n));
  }, []);

  const setButtonState = useCallback((id, isPressed) => {
    setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, pressed: isPressed } } : n));
  }, []);

  // LÓGICA DE EXCLUSÃO EM LOTE: Deleta tudo que estiver selecionado (azul no canvas)
  const deleteSelectedNodes = useCallback(() => {
    const selectedIds = nodes.filter(n => n.selected).map(n => n.id);
    if (selectedIds.length === 0) return;

    setNodes((nds) => nds.filter((node) => !selectedIds.includes(node.id)));
    setEdges((eds) => eds.filter((edge) => !selectedIds.includes(edge.source) && !selectedIds.includes(edge.target)));
  }, [nodes]);

  const onDeleteNode = useCallback((id) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  }, []);

  const onEdgeClick = useCallback((event, edge) => {
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  }, []);

  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    const scale = prompt("Escala do componente (ex: 1.0):", node.data.scale || "1.0");
    if (scale !== null) updateNodeData(node.id, { scale: parseFloat(scale) || 1.0 });

    if (['button', 'switch', 'constant', 'fpga'].includes(node.type)) {
      if (node.type === 'fpga') {
        const label = prompt("Label do Chip:", node.data.label || "FPGA");
        if (label !== null) updateNodeData(node.id, { label });
        const left = prompt("Entradas (Lado Esquerdo):", node.data.inputs_left || "1");
        if (left !== null) updateNodeData(node.id, { inputs_left: parseInt(left) || 0 });
        const top = prompt("Entradas (Lado Superior):", node.data.inputs_top || "0");
        if (top !== null) updateNodeData(node.id, { inputs_top: parseInt(top) || 0 });
        const right = prompt("Saídas (Lado Direito):", node.data.outputs_right || "1");
        if (right !== null) updateNodeData(node.id, { outputs_right: parseInt(right) || 0 });
        const bottom = prompt("Saídas (Lado Inferior):", node.data.outputs_bottom || "0");
        if (bottom !== null) updateNodeData(node.id, { outputs_bottom: parseInt(bottom) || 0 });
      } else {
        const key = node.type !== 'constant' ? prompt("Tecla de atalho:", node.data.hotkey || "") : null;
        if (key !== null) updateNodeData(node.id, { hotkey: key.toLowerCase().charAt(0) });
        const val = prompt("Valor de Saída (0-9):", node.data.value || "0");
        if (val !== null) updateNodeData(node.id, { value: parseInt(val) || 0 });
      }
    }
  }, [updateNodeData]);

  useCircuit(nodes, edges, setNodes);
  useKeyboard(nodes, setButtonState, toggleButton);

  const addNode = (type, color) => {
    const id = `${type}-${Date.now()}`;
    const newNode = {
      id, type, position: { x: 400, y: 200 },
      data: {
        color, pressed: false, hotkey: '', scale: 1,
        value: type === 'constant' ? 0 : 1,
        inputs_left: type === 'fpga' ? 1 : undefined,
        inputs_top: type === 'fpga' ? 0 : undefined,
        outputs_right: type === 'fpga' ? 1 : undefined,
        outputs_bottom: type === 'fpga' ? 0 : undefined,
        label: type === 'fpga' ? "FPGA" : undefined
      }
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const nodesWithLogic = useMemo(() => nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onDelete: () => onDeleteNode(node.id),
      onStart: () => setButtonState(node.id, true),
      onEnd: () => setButtonState(node.id, false),
      onToggle: () => toggleButton(node.id),
      onValueChange: (val) => updateNodeData(node.id, { value: val })
    }
  })), [nodes, onDeleteNode, toggleButton, setButtonState, updateNodeData]);

  return (
    <div className="app" style={{ width: '100vw', height: '100vh', background: '#0a0a0a', '--bg-size': '1250px' }}>
      <Toolbar
        addNode={addNode}
        deleteSelectedNodes={deleteSelectedNodes}
        isSidebarVisible={isSidebarVisible}
        toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)}
        clearBoard={() => { if (window.confirm("Limpar placa?")) { setNodes([]); setEdges([]); } }}
      />

      {/* RENDERIZAÇÃO CONDICIONAL: A Sidebar só aparece se o estado for verdadeiro */}
      {isSidebarVisible && (
        <HotkeySidebar nodes={nodes} onHotkeyChange={(id, data) => updateNodeData(id, data)} />
      )}

      <ReactFlow
        nodes={nodesWithLogic}
        edges={edges}
        onNodesChange={(c) => setNodes((nds) => applyNodeChanges(c, nds))}
        onEdgesChange={(c) => setEdges((eds) => applyEdgeChanges(c, eds))}
        onConnect={(p) => setEdges((eds) => addEdge(p, eds))}
        onEdgeClick={onEdgeClick}
        onNodeContextMenu={onNodeContextMenu}
        onNodesDelete={deleteSelectedNodes} // Permite usar a tecla 'Delete' do teclado
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{ 
    type: 'step', // 'step' cria as quinas vivas de 90 graus
    style: { 
      strokeWidth: 2, 
      stroke: '#b0b0b0' // Cor de fio estanhado
    } 
  }}
  onConnect={(params) => setEdges((eds) => addEdge({ ...params, type: 'step' }, eds))}
        fitView
      >
        <Background color="#1a1a1a" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}