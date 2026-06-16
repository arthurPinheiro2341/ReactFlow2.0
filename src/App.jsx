/**
 * ARQUIVO: App.jsx
 * ATUALIZAÇÃO: Nova interface simplificada para mover componentes soltos 
 * para dentro de grupos usando um menu Dropdown na aba lateral.
 */

import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, { Background, Controls, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';

import { nodeTypes, initialNodes } from './config/flowConfig';
import { useCircuit } from './hooks/useCircuit';
import { useKeyboard } from './hooks/useKeyboard';
import { Toolbar } from './components/Toolbar';

// --- ABA DE PROPRIEDADES ATUALIZADA ---
const PropertiesSidebar = ({ nodes, selectedNodes, updateNodeData, onDeleteNode, onGroupNodes, onUngroupNode, onAddToSpecificGroup, onRemoveFromGroup }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const sidebarStyle = {
    width: isExpanded ? '250px' : '40px', background: '#0f0f0f', borderLeft: '1px solid #333',
    padding: isExpanded ? '20px' : '15px 5px', color: '#fff', fontFamily: 'sans-serif',
    display: 'flex', flexDirection: 'column', gap: '15px', flexShrink: 0,
    overflowY: 'auto', overflowX: 'hidden', transition: 'width 0.2s ease-in-out, padding 0.2s ease-in-out'
  };

  const labelStyle = { display: 'flex', flexDirection: 'column', fontSize: '12px', color: '#aaa', gap: '5px', whiteSpace: 'nowrap' };
  const inputStyle = { background: '#1a1a1a', border: '1px solid #444', color: '#00ff00', padding: '8px', borderRadius: '4px', fontFamily: 'monospace', outline: 'none' };
  const actionBtnStyle = { background: '#1a1a1a', border: '1px solid #00ff00', color: '#00ff00', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
  const smallRemoveBtnStyle = { background: 'rgba(255,0,0,0.1)', color: '#ff4444', border: '1px solid #ff4444', padding: '2px 6px', borderRadius: '3px', cursor: 'pointer', fontSize: '10px' };

  if (!isExpanded) {
    return (
      <div style={sidebarStyle}>
        <button onClick={() => setIsExpanded(true)} style={{ background: 'transparent', border: 'none', color: '#00ff00', cursor: 'pointer', fontSize: '18px', textAlign: 'center', width: '100%' }} title="Expandir Propriedades">◀</button>
      </div>
    );
  }

  if (!selectedNodes || selectedNodes.length === 0) {
    return (
      <div style={sidebarStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#fff', whiteSpace: 'nowrap' }}>⚙️ Propriedades</h3>
          <button onClick={() => setIsExpanded(false)} style={{ background: 'none', border: 'none', color: '#777', cursor: 'pointer', fontSize: '16px' }}>▶</button>
        </div>
        <p style={{ fontSize: '12px', color: '#555', textAlign: 'center', marginTop: '40px' }}>Selecione um componente no circuito para editar.</p>
      </div>
    );
  }

  if (selectedNodes.length > 1) {
    const selectedFreeNodes = selectedNodes.filter(n => n.type !== 'groupNode' && !n.parentId);
    const selectedGroups = selectedNodes.filter(n => n.type === 'groupNode');

    return (
      <div style={sidebarStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#00ff00', whiteSpace: 'nowrap' }}>⚙️ Seleção Múltipla</h3>
          <button onClick={() => setIsExpanded(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>▶</button>
        </div>
        <p style={{ fontSize: '12px', color: '#aaa', textAlign: 'center', marginTop: '10px' }}>{selectedNodes.length} componentes selecionados.</p>
        
        {selectedFreeNodes.length > 1 && selectedGroups.length === 0 ? (
          <button onClick={onGroupNodes} style={actionBtnStyle}>📦 Criar Novo Grupo</button>
        ) : (
          <p style={{ fontSize: '10px', color: '#666', textAlign: 'center' }}>Não é possível agrupar uma seleção mista.</p>
        )}
      </div>
    );
  }

  const selectedNode = selectedNodes[0];
  const { id, type, data, parentId } = selectedNode;
  const handleChange = (key, value) => updateNodeData(id, { [key]: value });

  const groupChildren = type === 'groupNode' ? nodes.filter(n => n.parentId === id) : [];
  const availableGroups = nodes.filter(n => n.type === 'groupNode');

  return (
    <div style={sidebarStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', color: '#00ff00', whiteSpace: 'nowrap' }}>⚙️ Propriedades do Nó</h3>
        <button onClick={() => setIsExpanded(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px' }} title="Minimizar">▶</button>
      </div>
      
      <div style={{ fontSize: '11px', color: '#666', marginBottom: '10px' }}>
        <div><strong>TIPO:</strong> {type.toUpperCase()}</div>
        <div><strong>ID:</strong> {id.split('-')[1] || id}</div>
      </div>

      {type === 'groupNode' && (
        <>
          <label style={labelStyle}>Nome do Grupo: <input type="text" value={data.label || ''} onChange={(e) => handleChange('label', e.target.value)} style={inputStyle} /></label>
          <button onClick={() => onUngroupNode(id)} style={{ ...actionBtnStyle, color: '#ffaa00', borderColor: '#ffaa00' }}>🔓 Desagrupar Tudo</button>
          
          {groupChildren.length > 0 && (
            <div style={{ marginTop: '15px', borderTop: '1px solid #333', paddingTop: '10px' }}>
              <h4 style={{ color: '#aaa', fontSize: '11px', marginBottom: '8px', margin: 0 }}>Componentes Internos:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '8px' }}>
                {groupChildren.map(child => (
                  <div key={child.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', padding: '5px', borderRadius: '4px' }}>
                    <span style={{ fontSize: '10px', color: '#888' }}>{child.type} ({child.id.split('-')[1].slice(-4)})</span>
                    <button onClick={() => onRemoveFromGroup(child.id)} style={smallRemoveBtnStyle}>Remover</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* NOVA INTERFACE: DROPDOWN PARA ADICIONAR COMPONENTE A UM GRUPO */}
      {!parentId && type !== 'groupNode' && availableGroups.length > 0 && (
        <div style={{ marginTop: '10px', borderTop: '1px solid #333', paddingTop: '15px', paddingBottom: '5px' }}>
          <h4 style={{ color: '#aaa', fontSize: '11px', margin: '0 0 8px 0' }}>Envelopar em:</h4>
          <div style={{ display: 'flex', gap: '5px' }}>
            <select id={`select-group-${id}`} style={{ ...inputStyle, flex: 1, padding: '5px', fontSize: '11px' }}>
              {availableGroups.map(g => (
                <option key={g.id} value={g.id}>{g.data.label || 'Grupo'}</option>
              ))}
            </select>
            <button
              onClick={() => {
                const selectEl = document.getElementById(`select-group-${id}`);
                if (selectEl) onAddToSpecificGroup(id, selectEl.value);
              }}
              style={{ ...actionBtnStyle, padding: '5px 10px', fontSize: '11px' }}
            >
              ➕ Mover
            </button>
          </div>
        </div>
      )}

      {/* REMOVER DO GRUPO (Caso já esteja dentro de um) */}
      {parentId && type !== 'groupNode' && (
         <button onClick={() => onRemoveFromGroup(id)} style={{ ...actionBtnStyle, color: '#ffaa00', borderColor: '#ffaa00', marginTop: '10px' }}>📤 Remover deste Grupo</button>
      )}

      {type !== 'groupNode' && (
        <label style={labelStyle}>Tamanho (Escala Antiga): <input type="number" step="0.1" min="0.5" max="3" value={data.scale || 1} onChange={(e) => handleChange('scale', parseFloat(e.target.value) || 1)} style={inputStyle} /></label>
      )}

      {type === 'fpga' && (
        <>
          <label style={labelStyle}>Label do Chip: <input type="text" value={data.label || ''} onChange={(e) => handleChange('label', e.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Entradas (Esquerda): <input type="number" min="0" value={data.inputs_left || 0} onChange={(e) => handleChange('inputs_left', parseInt(e.target.value) || 0)} style={inputStyle} /></label>
          <label style={labelStyle}>Entradas (Topo): <input type="number" min="0" value={data.inputs_top || 0} onChange={(e) => handleChange('inputs_top', parseInt(e.target.value) || 0)} style={inputStyle} /></label>
          <label style={labelStyle}>Saídas (Direita): <input type="number" min="0" value={data.outputs_right || 0} onChange={(e) => handleChange('outputs_right', parseInt(e.target.value) || 0)} style={inputStyle} /></label>
          <label style={labelStyle}>Saídas (Base): <input type="number" min="0" value={data.outputs_bottom || 0} onChange={(e) => handleChange('outputs_bottom', parseInt(e.target.value) || 0)} style={inputStyle} /></label>
        </>
      )}

      {['button', 'switch'].includes(type) && (
        <label style={labelStyle}>Tecla de Atalho: <input type="text" maxLength={1} value={data.hotkey || ''} onChange={(e) => handleChange('hotkey', e.target.value.toLowerCase())} style={{ ...inputStyle, textAlign: 'center', fontSize: '18px' }} /></label>
      )}

      {type === 'constant' && (
        <label style={labelStyle}>Valor de Saída: <input type="number" value={data.value || 0} onChange={(e) => handleChange('value', parseInt(e.target.value) || 0)} style={inputStyle} /></label>
      )}

      <button onClick={() => onDeleteNode(id)} style={{ marginTop: 'auto', background: 'rgba(255, 0, 0, 0.1)', color: '#ff4444', border: '1px solid #ff4444', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s', whiteSpace: 'nowrap' }}>🗑️ Apagar Componente</button>
    </div>
  );
};

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);

  const updateNodeData = useCallback((id, newData) => setNodes((nds) => nds.map((node) => node.id === id ? { ...node, data: { ...node.data, ...newData } } : node)), []);
  const setButtonState = useCallback((id, isPressed) => setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, pressed: isPressed } } : n)), []);
  const toggleButton = useCallback((id) => setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, pressed: !n.data.pressed } } : n)), []);
  
  const onDeleteNode = useCallback((id) => {
    setNodes((nds) => nds.filter((n) => n.id !== id && n.parentId !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  }, []);

  const onEdgeClick = useCallback((event, edge) => setEdges((eds) => eds.filter((e) => e.id !== edge.id)), []);

  const handleGroupNodes = useCallback(() => {
    const selected = nodes.filter(n => n.selected && !n.parentId); 
    if (selected.length < 2) return;

    const minX = Math.min(...selected.map(n => n.position.x));
    const minY = Math.min(...selected.map(n => n.position.y));
    const maxX = Math.max(...selected.map(n => n.position.x + (n.style?.width || 80)));
    const maxY = Math.max(...selected.map(n => n.position.y + (n.style?.height || 80)));

    const padding = 30; 
    const topPadding = 50; 
    const groupId = `group-${Date.now()}`;
    const groupX = minX - padding;
    const groupY = minY - topPadding;

    const groupNode = {
      id: groupId, type: 'groupNode', position: { x: groupX, y: groupY },
      style: { width: (maxX - minX) + padding * 2, height: (maxY - minY) + padding + topPadding },
      data: { label: 'Novo Grupo' },
    };

    setNodes(nds => {
      const newNodes = nds.map(n => {
        if (selected.find(s => s.id === n.id)) {
          return { ...n, parentId: groupId, position: { x: n.position.x - groupX, y: n.position.y - groupY }, extent: 'parent' };
        }
        return n;
      });
      return [groupNode, ...newNodes]; 
    });
  }, [nodes]);

  const handleUngroupNode = useCallback((groupId) => {
    setNodes(nds => {
      const groupNode = nds.find(n => n.id === groupId);
      if (!groupNode) return nds;

      return nds.map(n => {
        if (n.parentId === groupId) {
          return { ...n, parentId: undefined, position: { x: n.position.x + groupNode.position.x, y: n.position.y + groupNode.position.y }, extent: undefined };
        }
        return n;
      }).filter(n => n.id !== groupId); 
    });
  }, []);

  // ======== FUNÇÃO NOVA: Adicionar um componente específico a um grupo específico ========
  const handleAddToSpecificGroup = useCallback((nodeId, groupId) => {
    setNodes(nds => {
      const groupNode = nds.find(n => n.id === groupId);
      const nodeToAdd = nds.find(n => n.id === nodeId);
      if (!groupNode || !nodeToAdd) return nds;

      return nds.map(n => {
        if (n.id === nodeId) {
          return {
            ...n,
            parentId: groupId,
            // A matemática aqui muda a posição dele em relação a tela inteira, 
            // para ser uma posição em relação as bordas do grupo.
            position: { x: n.position.x - groupNode.position.x, y: n.position.y - groupNode.position.y },
            extent: 'parent',
            selected: false 
          };
        }
        return n;
      });
    });
  }, []);

  const handleRemoveFromGroup = useCallback((childId) => {
    setNodes(nds => {
      const nodeToRemove = nds.find(n => n.id === childId);
      if (!nodeToRemove || !nodeToRemove.parentId) return nds;

      const groupNode = nds.find(n => n.id === nodeToRemove.parentId);
      if (!groupNode) return nds;

      return nds.map(n => {
        if (n.id === childId) {
          return {
            ...n,
            parentId: undefined,
            extent: undefined,
            position: { x: n.position.x + groupNode.position.x, y: n.position.y + groupNode.position.y },
            selected: false 
          };
        }
        return n;
      });
    });
  }, []);

  useCircuit(nodes, edges, setNodes);
  useKeyboard(nodes, setButtonState, toggleButton);

  const addNode = (type, color) => {
    const id = `${type}-${Date.now()}`;
    let defaultStyle = { width: 60, height: 60 }; 
    if (type === 'fpga') defaultStyle = { width: 350, height: 350 };
    else if (type === 'clock') defaultStyle = { width: 150, height: 60 };
    else if (type === 'constant') defaultStyle = { width: 90, height: 80 };
    else if (type === 'display') defaultStyle = { width: 800, height: 500 };
    else if (type === 'digit') defaultStyle = { width: 60, height: 90 };
    else if (type === 'led') defaultStyle = { width: 50, height: 75 };
    else if (type === 'rgb_led') defaultStyle = { width: 50, height: 75 };
    else if (type === 'switch') defaultStyle = { width: 50, height: 65 };

    const newNode = {
      id, type, position: { x: 300, y: 200 }, style: defaultStyle, 
      data: {
        color, pressed: false, hotkey: '', scale: 1, value: type === 'constant' ? 0 : 1,
        inputs_left: type === 'fpga' ? 1 : undefined, inputs_top: type === 'fpga' ? 0 : undefined,
        outputs_right: type === 'fpga' ? 1 : undefined, outputs_bottom: type === 'fpga' ? 0 : undefined,
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

  const selectedNodesArray = useMemo(() => nodes.filter(n => n.selected), [nodes]);

  return (
    <div className="app" style={{ display: 'flex', width: '100vw', height: '100vh', background: '#0a0a0a', overflow: 'hidden' }}>
      <Toolbar addNode={addNode} clearBoard={() => { if (window.confirm("Limpar placa?")) { setNodes([]); setEdges([]); } }} />

      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodesWithLogic}
          edges={edges}
          onNodesChange={(c) => setNodes((nds) => applyNodeChanges(c, nds))}
          onEdgesChange={(c) => setEdges((eds) => applyEdgeChanges(c, eds))}
          onConnect={(p) => setEdges((eds) => addEdge({ ...p, type: 'step' }, eds))}
          onEdgeClick={onEdgeClick} 
          nodeTypes={nodeTypes}
          minZoom={0.1}
          maxZoom={2.0}
          fitView
        >
          <Background color="#1a1a1a" gap={20} />
          <Controls />
        </ReactFlow>
      </div>

      <PropertiesSidebar 
        nodes={nodes} 
        selectedNodes={selectedNodesArray} 
        updateNodeData={updateNodeData} 
        onDeleteNode={onDeleteNode} 
        onGroupNodes={handleGroupNodes}
        onUngroupNode={handleUngroupNode}
        onAddToSpecificGroup={handleAddToSpecificGroup} // Injetando o dropdown
        onRemoveFromGroup={handleRemoveFromGroup}
      />
    </div>
  );
}