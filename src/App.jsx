/**
 * ARQUIVO: App.jsx
 * ATUALIZAÇÃO: Aba de propriedades agora é retrátil e possui botão de apagar componente.
 */

import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, { Background, Controls, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';

import { nodeTypes, initialNodes } from './config/flowConfig';
import { useCircuit } from './hooks/useCircuit';
import { useKeyboard } from './hooks/useKeyboard';
import { Toolbar } from './components/Toolbar';

// --- NOVA ABA DE PROPRIEDADES (INSPECTOR) ---
const PropertiesSidebar = ({ selectedNode, updateNodeData, onDeleteNode }) => {
  // Estado para controlar a expansão da aba
  const [isExpanded, setIsExpanded] = useState(true);

  const sidebarStyle = {
    width: isExpanded ? '250px' : '40px',
    background: '#0f0f0f',
    borderLeft: '1px solid #333',
    padding: isExpanded ? '20px' : '15px 5px',
    color: '#fff',
    fontFamily: 'sans-serif',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    flexShrink: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    transition: 'width 0.2s ease-in-out, padding 0.2s ease-in-out' // Animação suave
  };

  const labelStyle = { display: 'flex', flexDirection: 'column', fontSize: '12px', color: '#aaa', gap: '5px', whiteSpace: 'nowrap' };
  const inputStyle = { background: '#1a1a1a', border: '1px solid #444', color: '#00ff00', padding: '8px', borderRadius: '4px', fontFamily: 'monospace', outline: 'none' };

  // 1. Visão Minimizada
  if (!isExpanded) {
    return (
      <div style={sidebarStyle}>
        <button 
          onClick={() => setIsExpanded(true)} 
          style={{ background: 'transparent', border: 'none', color: '#00ff00', cursor: 'pointer', fontSize: '18px', textAlign: 'center', width: '100%' }}
          title="Expandir Propriedades"
        >
          ◀
        </button>
      </div>
    );
  }

  // 2. Visão Expandida, mas nenhum nó selecionado
  if (!selectedNode) {
    return (
      <div style={sidebarStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#fff', whiteSpace: 'nowrap' }}>⚙️ Propriedades</h3>
          <button onClick={() => setIsExpanded(false)} style={{ background: 'none', border: 'none', color: '#777', cursor: 'pointer', fontSize: '16px' }}>▶</button>
        </div>
        <p style={{ fontSize: '12px', color: '#555', textAlign: 'center', marginTop: '40px' }}>
          Selecione um componente no circuito para editar suas configurações.
        </p>
      </div>
    );
  }

  const { id, type, data } = selectedNode;

  // Função auxiliar para atualizar dados facilmente
  const handleChange = (key, value) => {
    updateNodeData(id, { [key]: value });
  };

  // 3. Visão Expandida com nó selecionado
  return (
    <div style={sidebarStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', color: '#00ff00', whiteSpace: 'nowrap' }}>⚙️ Propriedades do Nó</h3>
        <button onClick={() => setIsExpanded(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px' }} title="Minimizar">
          ▶
        </button>
      </div>
      
      {/* INFO COMUM A TODOS OS NÓS */}
      <div style={{ fontSize: '11px', color: '#666', marginBottom: '10px' }}>
        <div><strong>TIPO:</strong> {type.toUpperCase()}</div>
        <div><strong>ID:</strong> {id.split('-')[1]}</div>
      </div>

      {/* CAMPO DE ESCALA (Para todos os nós) */}
      <label style={labelStyle}>
        Tamanho (Escala):
        <input 
          type="number" step="0.1" min="0.5" max="3"
          value={data.scale || 1} 
          onChange={(e) => handleChange('scale', parseFloat(e.target.value) || 1)} 
          style={inputStyle}
        />
      </label>

      {/* PROPRIEDADES ESPECÍFICAS DA FPGA */}
      {type === 'fpga' && (
        <>
          <label style={labelStyle}>
            Label do Chip:
            <input type="text" value={data.label || ''} onChange={(e) => handleChange('label', e.target.value)} style={inputStyle} />
          </label>
          <label style={labelStyle}>Entradas (Esquerda): <input type="number" min="0" value={data.inputs_left || 0} onChange={(e) => handleChange('inputs_left', parseInt(e.target.value) || 0)} style={inputStyle} /></label>
          <label style={labelStyle}>Entradas (Topo): <input type="number" min="0" value={data.inputs_top || 0} onChange={(e) => handleChange('inputs_top', parseInt(e.target.value) || 0)} style={inputStyle} /></label>
          <label style={labelStyle}>Saídas (Direita): <input type="number" min="0" value={data.outputs_right || 0} onChange={(e) => handleChange('outputs_right', parseInt(e.target.value) || 0)} style={inputStyle} /></label>
          <label style={labelStyle}>Saídas (Base): <input type="number" min="0" value={data.outputs_bottom || 0} onChange={(e) => handleChange('outputs_bottom', parseInt(e.target.value) || 0)} style={inputStyle} /></label>
        </>
      )}

      {/* PROPRIEDADES ESPECÍFICAS DE CONTROLES (Button/Switch) */}
      {['button', 'switch'].includes(type) && (
        <label style={labelStyle}>
          Tecla de Atalho:
          <input 
            type="text" maxLength={1} 
            value={data.hotkey || ''} 
            onChange={(e) => handleChange('hotkey', e.target.value.toLowerCase())} 
            style={{ ...inputStyle, textAlign: 'center', fontSize: '18px' }} 
          />
        </label>
      )}

      {/* PROPRIEDADES DE SINAL CONSTANTE (Data Bus) */}
      {type === 'constant' && (
        <label style={labelStyle}>
          Valor de Saída:
          <input 
            type="number" 
            value={data.value || 0} 
            onChange={(e) => handleChange('value', parseInt(e.target.value) || 0)} 
            style={inputStyle} 
          />
        </label>
      )}

      {/* BOTÃO DE APAGAR NÓ (Empurrado para baixo) */}
      <button 
        onClick={() => onDeleteNode(id)}
        style={{
          marginTop: 'auto', 
          background: 'rgba(255, 0, 0, 0.1)',
          color: '#ff4444',
          border: '1px solid #ff4444',
          padding: '10px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'background 0.2s',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 0, 0, 0.3)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 0, 0, 0.1)'}
      >
        🗑️ Apagar Componente
      </button>

    </div>
  );
};


export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);

  // Retirando o HotkeySidebar por enquanto, já que essas configs agora estão na barra da direita
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

  useCircuit(nodes, edges, setNodes);
  useKeyboard(nodes, setButtonState, toggleButton);

  const addNode = (type, color) => {
    const id = `${type}-${Date.now()}`;
    const newNode = {
      id, type, position: { x: 300, y: 200 },
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

  // Identifica dinamicamente o nó que o usuário clicou (selected: true)
  const selectedNode = useMemo(() => nodes.find(n => n.selected), [nodes]);

  return (
    <div className="app" style={{ display: 'flex', width: '100vw', height: '100vh', background: '#0a0a0a', overflow: 'hidden' }}>
      
      {/* BARRA LATERAL FIXA DE PERIFÉRICOS (ESQUERDA) */}
      <Toolbar
        addNode={addNode}
        clearBoard={() => { if (window.confirm("Limpar placa?")) { setNodes([]); setEdges([]); } }}
      />

      {/* ÁREA CENTRAL DO CIRCUITO */}
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodesWithLogic}
          edges={edges}
          onNodesChange={(c) => setNodes((nds) => applyNodeChanges(c, nds))}
          onEdgesChange={(c) => setEdges((eds) => applyEdgeChanges(c, eds))}
          onConnect={(p) => setEdges((eds) => addEdge({ ...p, type: 'step' }, eds))}
          nodeTypes={nodeTypes}
          minZoom={0.1}
          maxZoom={2.0}
          fitView
        >
          <Background color="#1a1a1a" gap={20} />
          <Controls />
        </ReactFlow>
      </div>

      {/* NOVA ABA DE PROPRIEDADES (DIREITA) */}
      <PropertiesSidebar 
        selectedNode={selectedNode} 
        updateNodeData={updateNodeData} 
        onDeleteNode={onDeleteNode} 
      />

    </div>
  );
}