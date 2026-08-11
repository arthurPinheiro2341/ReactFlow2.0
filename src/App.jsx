/**
 * ARQUIVO: App.jsx
 * ATUALIZAÇÃO: Integrada a lógica de Salvar e Carregar presets do circuito em JSON.
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, { Background, Controls, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';

import { nodeTypes } from './config/flowConfig';
import { useCircuit } from './hooks/useCircuit';
import { useKeyboard } from './hooks/useKeyboard';
import { Toolbar } from './components/Toolbar';
import { PropertiesSidebar } from './components/PropertiesSidebar'; 
import { createNetlist, printNetlist } from './utils/netlist';

const FPGA_PORT_CONFIG = {
  inputs_left: { side: 'left', handleType: 'in', nodeKey: 'target', handleKey: 'targetHandle' },
  inputs_top: { side: 'top', handleType: 'in', nodeKey: 'target', handleKey: 'targetHandle' },
  outputs_right: { side: 'right', handleType: 'out', nodeKey: 'source', handleKey: 'sourceHandle' },
  outputs_bottom: { side: 'bottom', handleType: 'out', nodeKey: 'source', handleKey: 'sourceHandle' },
};

const getPresetValidationError = (preset) => {
  if (!preset || typeof preset !== 'object' || Array.isArray(preset)) {
    return 'o conteúdo principal deve ser um objeto.';
  }

  if (!Array.isArray(preset.nodes) || !Array.isArray(preset.edges)) {
    return 'nodes e edges devem ser listas.';
  }

  const nodeIds = new Set();

  for (const [index, node] of preset.nodes.entries()) {
    if (!node || typeof node !== 'object' || typeof node.id !== 'string' || node.id.trim() === '') {
      return `o node na posição ${index} não possui um ID válido.`;
    }

    if (nodeIds.has(node.id)) {
      return `o ID de node "${node.id}" está duplicado.`;
    }

    nodeIds.add(node.id);
  }

  for (const [index, edge] of preset.edges.entries()) {
    if (!edge || typeof edge !== 'object') {
      return `a edge na posição ${index} é inválida.`;
    }

    if (!nodeIds.has(edge.source)) {
      return `a origem da edge na posição ${index} não existe.`;
    }

    if (!nodeIds.has(edge.target)) {
      return `o destino da edge na posição ${index} não existe.`;
    }
  }

  return null;
};

export default function App() {
  const [nodes, setNodes] = useState([]); 
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    printNetlist(createNetlist(edges));
  }, [edges]);

  // ================= SISTEMA DE SAVE / LOAD =================
  const handleSave = useCallback(() => {
    // Captura o estado atual
    const circuitPreset = { nodes, edges };
    // Converte para JSON formatado (bonito de ler)
    const jsonString = JSON.stringify(circuitPreset, null, 2);
    
    // Cria um arquivo virtual e força o download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = 'meu_circuito.json'; // Nome padrão do arquivo
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [nodes, edges]);

  const handleLoad = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loadedPreset = JSON.parse(e.target.result);
        const validationError = getPresetValidationError(loadedPreset);

        if (validationError) {
          alert(`Preset inválido: ${validationError}`);
          return;
        }

        setNodes(loadedPreset.nodes);
        setEdges(loadedPreset.edges);
      } catch {
        alert('Erro ao ler o arquivo. Certifique-se de que é um JSON válido.');
      }
    };
    reader.readAsText(file);
    
    // Reseta o input para permitir carregar o mesmo arquivo duas vezes seguidas, se necessário
    event.target.value = null; 
  }, []);
  // ==========================================================

  const updateNodeData = useCallback((id, newData) => {
    const updatedPortLimits = Object.entries(newData).flatMap(([key, value]) => {
      const config = FPGA_PORT_CONFIG[key];
      const count = Number(value);

      return config && Number.isInteger(count) && count >= 0
        ? [{ ...config, count }]
        : [];
    });

    if (updatedPortLimits.length > 0) {
      setEdges((eds) => eds.filter((edge) => !updatedPortLimits.some(({ side, handleType, nodeKey, handleKey, count }) => {
        const handleId = edge[handleKey];
        const handlePrefix = `${id}-${side}-${handleType}-`;

        if (edge[nodeKey] !== id || typeof handleId !== 'string' || !handleId.startsWith(handlePrefix)) {
          return false;
        }

        const portIndex = Number(handleId.slice(handlePrefix.length));
        return Number.isInteger(portIndex) && portIndex >= count;
      })));
    }

    setNodes((nds) => nds.map((node) => node.id === id ? { ...node, data: { ...node.data, ...newData } } : node));
  }, []);
  const setButtonState = useCallback((id, isPressed) => setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, pressed: isPressed } } : n)), []);
  const toggleButton = useCallback((id) => setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, pressed: !n.data.pressed } } : n)), []);
  
  const onDeleteNode = useCallback((id) => {
    const removedNodeIds = new Set([id]);

    nodes.forEach((node) => {
      if (node.parentId === id) removedNodeIds.add(node.id);
    });

    setNodes((nds) => nds.filter((node) => !removedNodeIds.has(node.id)));
    setEdges((eds) => eds.filter((edge) => !removedNodeIds.has(edge.source) && !removedNodeIds.has(edge.target)));
  }, [nodes]);

  const onEdgeClick = useCallback((event, edge) => setEdges((eds) => eds.filter((e) => e.id !== edge.id)), []);

  const handleGroupNodes = useCallback(() => {
    const selected = nodes.filter(n => n.selected && n.type !== 'board' && !n.parentId); 
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
    let defaultStyle = { width: 80, height: 80 }; 
    
    if (type === 'board') defaultStyle = { width: 800, height: 600 };
    else if (type === 'fpga') defaultStyle = { width: 350, height: 350 };
    else if (type === 'clock') defaultStyle = { width: 150, height: 60 };
    else if (type === 'constant') defaultStyle = { width: 120, height: 95 }; 
    else if (type === 'display') defaultStyle = { width: 800, height: 500 };
    else if (type === 'digit') defaultStyle = { width: 60, height: 90 };
    else if (type === 'led') defaultStyle = { width: 50, height: 75 };
    else if (type === 'rgb_led') defaultStyle = { width: 50, height: 75 };
    else if (type === 'switch') defaultStyle = { width: 60, height: 80 }; 

    const newNode = {
      id, type, position: { x: 100, y: 100 }, style: defaultStyle, 
      zIndex: type === 'board' ? -1 : 0, 
      data: {
        color, pressed: false, hotkey: '', scale: 1, value: type === 'constant' ? 0 : 1,
        frequency: type === 'clock' ? '25M' : undefined,
        inputs_left: type === 'fpga' ? 1 : undefined, inputs_top: type === 'fpga' ? 0 : undefined,
        outputs_right: type === 'fpga' ? 1 : undefined, outputs_bottom: type === 'fpga' ? 0 : undefined,
        label: type === 'fpga' ? "FPGA" : undefined,
        imageData: type === 'board' ? '' : undefined,
        imageUrl: type === 'board' ? '' : undefined 
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
      onValueChange: (val) => updateNodeData(node.id, node.type === 'clock' ? { frequency: val } : { value: val })
    }
  })), [nodes, onDeleteNode, toggleButton, setButtonState, updateNodeData]);

  const selectedNodesArray = useMemo(() => nodes.filter(n => n.selected), [nodes]);

  return (
    <div className="app" style={{ display: 'flex', width: '100vw', height: '100vh', background: '#0a0a0a', overflow: 'hidden' }}>
      
      {/* TOOLBAR COM AS NOVAS FUNÇÕES DE SAVE/LOAD INJETADAS */}
      <Toolbar 
        addNode={addNode} 
        clearBoard={() => { if (window.confirm("Limpar placa?")) { setNodes([]); setEdges([]); } }} 
        onSave={handleSave}
        onLoad={handleLoad}
      />

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
        onAddToSpecificGroup={handleAddToSpecificGroup} 
        onRemoveFromGroup={handleRemoveFromGroup}
      />
    </div>
  );
}
