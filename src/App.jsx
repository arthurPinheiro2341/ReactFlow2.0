/**
 * ARQUIVO: App.jsx
 * CORREÇÃO: Restauração da lógica da FPGA + Overlay Móvel
 */

import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, { Background, Controls, Panel, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';

import { nodeTypes, initialNodes } from './config/flowConfig';
import { useCircuit } from './hooks/useCircuit';
import { useKeyboard } from './hooks/useKeyboard';
import { Toolbar } from './components/Toolbar';

import overlayImage from './assets/Capivara.jpeg';

// --- SIDEBAR DE TECLAS ---
const HotkeySidebar = ({ nodes, onHotkeyChange }) => {
  const controllers = nodes.filter(n => n.type === 'button' || n.type === 'switch');
  if (controllers.length === 0) return null;
  return (
    <div style={{ position: 'fixed', right: '20px', top: '20px', zIndex: 9999, width: '200px', background: '#1a1a1a', padding: '15px', borderRadius: '8px', color: '#fff', border: '2px solid #00ff00', boxShadow: '0 10px 30px rgba(0,0,0,0.8)', fontFamily: 'monospace' }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#00ff00', textAlign: 'center' }}>⚙️ CONFIG. TECLAS</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {controllers.map((node) => (
          <div key={node.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10px' }}>{node.type.toUpperCase()}:</span>
            <input maxLength={1} value={node.data.hotkey || ''} onChange={(e) => onHotkeyChange(node.id, { hotkey: e.target.value.toLowerCase() })} style={{ width: '30px', background: '#000', border: '1px solid #00ff00', color: '#00ff00', textAlign: 'center', borderRadius: '3px', fontWeight: 'bold' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Estados da Capivara (Overlay)
  const [overlayPos, setOverlayPos] = useState({ x: 500, y: 100 });
  const [overlaySize, setOverlaySize] = useState(300);

  const updateNodeData = useCallback((id, newData) => {
    setNodes((nds) => nds.map((node) => node.id === id ? { ...node, data: { ...node.data, ...newData } } : node));
  }, []);

  const setButtonState = useCallback((id, isPressed) => {
    setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, pressed: isPressed } } : n));
  }, []);

  const toggleButton = useCallback((id) => {
    setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, pressed: !n.data.pressed } } : n));
  }, []);

  const deleteSelectedNodes = useCallback(() => {
    const selectedIds = nodes.filter(n => n.selected).map(n => n.id);
    setNodes((nds) => nds.filter((node) => !selectedIds.includes(node.id)));
    setEdges((eds) => eds.filter((edge) => !selectedIds.includes(edge.source) && !selectedIds.includes(edge.target)));
  }, [nodes]);

  const onDeleteNode = useCallback((id) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  }, []);

  // RESTAURAÇÃO: Lógica completa do menu de contexto para FPGA e componentes
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

  const handleOverlayDrag = (e) => {
    e.stopPropagation();
    const startX = e.clientX - overlayPos.x;
    const startY = e.clientY - overlayPos.y;
    const onMove = (me) => setOverlayPos({ x: me.clientX - startX, y: me.clientY - startY });
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  return (
    <div className="app" style={{ width: '100vw', height: '100vh', background: '#0a0a0a' }}>
      <Toolbar
        addNode={addNode}
        deleteSelectedNodes={deleteSelectedNodes}
        isSidebarVisible={isSidebarVisible}
        toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)}
        clearBoard={() => { if (window.confirm("Limpar placa?")) { setNodes([]); setEdges([]); } }}
      />

      {isSidebarVisible && <HotkeySidebar nodes={nodes} onHotkeyChange={updateNodeData} />}

      <ReactFlow
        nodes={nodesWithLogic}
        edges={edges}
        onNodesChange={(c) => setNodes((nds) => applyNodeChanges(c, nds))}
        onEdgesChange={(c) => setEdges((eds) => applyEdgeChanges(c, eds))}
        onConnect={(p) => setEdges((eds) => addEdge({ ...p, type: 'step' }, eds))}
        nodeTypes={nodeTypes}
        onNodeContextMenu={onNodeContextMenu}
        minZoom={0.1}
        maxZoom={2.0}
        fitView
      >
        <Background color="#1a1a1a" gap={20} />
        <Controls />

        {/* --- OVERLAY DA CAPIVARA --- */}
        <Panel position="top-left" style={{ pointerEvents: 'none' }}>
          <div 
            onMouseDown={handleOverlayDrag}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const newSize = prompt("Largura da capivara (px):", overlaySize);
              if (newSize) setOverlaySize(parseInt(newSize));
            }}
            style={{
              position: 'absolute',
              transform: `translate(${overlayPos.x}px, ${overlayPos.y}px)`,
              cursor: 'grab',
              zIndex: 9999,
              pointerEvents: 'all'
            }}
          >
            <img 
              src={overlayImage} 
              alt="Capybara" 
              style={{ width: `${overlaySize}px`, opacity: 0.9, userSelect: 'none', pointerEvents: 'none' }} 
            />
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}