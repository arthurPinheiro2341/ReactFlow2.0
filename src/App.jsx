/**
 * ARQUIVO: App.jsx
 * CAMADA: Orchestration & State Management
 * DESCRIÇÃO: Este é o "Kernel" do simulador. Ele gerencia o ciclo de vida dos componentes,
 * a persistência do grafo de hardware e a sincronização entre eventos de I/O e a lógica.
 */

import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, { Background, Controls, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

import { nodeTypes, initialNodes } from './config/flowConfig';
import { useCircuit } from './hooks/useCircuit';
import { useKeyboard } from './hooks/useKeyboard';
import { Toolbar } from './components/Toolbar';

// --- COMPONENTE: PAINEL DE CONFIGURAÇÃO (SIDEBAR) ---
// Atua como um mapeador de periféricos (Keyboard Mapping Table).
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
  // ESTADO GLOBAL DO HARDWARE: Mantém a topologia (edges) e o estado físico (nodes).
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);

  // Função genérica de Mutação de Estado: Garante a imutabilidade do nó ao atualizar dados.
  const updateNodeData = useCallback((id, newData) => {
    setNodes((nds) => nds.map((node) => node.id === id ? { ...node, data: { ...node.data, ...newData } } : node));
  }, []);

  // Lógica de Toggle: Implementa a retenção de estado (Latch) para Switches.
  const toggleButton = useCallback((id) => {
    setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, pressed: !n.data.pressed } } : n));
  }, []);

  // Lógica Momentânea: Implementa o comportamento de pulso para Botões.
  const setButtonState = useCallback((id, isPressed) => {
    setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, pressed: isPressed } } : n));
  }, []);

  // Garbage Collection: Remove referências órfãs de arestas ao deletar um nó.
  const onDeleteNode = useCallback((id) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  }, []);

  const onEdgeClick = useCallback((event, edge) => {
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  }, []);

  // CONFIGURAÇÃO DINÂMICA (Context Menu):
  // Permite a reconfiguração de parâmetros de hardware (I/O da FPGA e Hotkeys) via runtime.
  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
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

  // ENGINE DE PROPAGAÇÃO E I/O:
  // useCircuit: Processa o fluxo de dados em tempo real.
  // useKeyboard: Mapeia o hardware externo (teclado físico) para o virtual.
  useCircuit(nodes, edges, setNodes);
  useKeyboard(nodes, setButtonState, toggleButton);

  // FACTORY PATTERN: Instancia novos componentes de hardware com configurações default.
  const addNode = (type, color) => {
    const id = `${type}-${Date.now()}`;
    const newNode = { 
      id, type, position: { x: 400, y: 200 }, 
      data: { 
        color, pressed: false, hotkey: '', 
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

  /**
   * INJEÇÃO DE DEPENDÊNCIAS (Higher-Order Pattern):
   * Injeta funções de controle dentro do objeto 'data' de cada nó.
   * Isso permite que os componentes visuais disparem ações no kernel (App.jsx).
   */
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
    <div className="app" style={{ width: '100vw', height: '100vh', background: '#0a0a0a' }}>
      <Toolbar 
        addNode={addNode} 
        deleteSelectedNodes={() => nodes.filter(n => n.selected).forEach(n => onDeleteNode(n.id))} 
        clearBoard={() => { if(window.confirm("Limpar placa?")) { setNodes([]); setEdges([]); } }} 
      />
      
      <HotkeySidebar nodes={nodes} onHotkeyChange={(id, data) => updateNodeData(id, data)} />

      {/* MOTOR GRÁFICO (React Flow):
          Orquestra a renderização espacial e a manipulação de arestas (fios). */}
      <ReactFlow
        nodes={nodesWithLogic}
        edges={edges}
        onNodesChange={(c) => setNodes((nds) => applyNodeChanges(c, nds))}
        onEdgesChange={(c) => setEdges((eds) => applyEdgeChanges(c, eds))}
        onConnect={(p) => setEdges((eds) => addEdge(p, eds))}
        onEdgeClick={onEdgeClick} 
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