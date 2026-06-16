/**
 * ARQUIVO: src/components/PropertiesSidebar.jsx
 * CAMADA: Interface Layer / Inspector
 * DESCRIÇÃO: Aba lateral direita atualizada com suporte a seleção múltipla,
 * gerenciamento de grupos (subflows) e link de imagem para a placa base.
 */

import React, { useState } from 'react';

export const PropertiesSidebar = ({ 
  nodes, 
  selectedNodes, 
  updateNodeData, 
  onDeleteNode, 
  onGroupNodes, 
  onUngroupNode, 
  onAddToSpecificGroup, 
  onRemoveFromGroup 
}) => {
  // Estado para controlar se a aba está aberta ou minimizada
  const [isExpanded, setIsExpanded] = useState(true);

  // Estilos da aba animada
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
    transition: 'width 0.2s ease-in-out, padding 0.2s',
  };

  const labelStyle = { display: 'flex', flexDirection: 'column', fontSize: '12px', color: '#aaa', gap: '5px', whiteSpace: 'nowrap' };
  const inputStyle = { background: '#1a1a1a', border: '1px solid #444', color: '#00ff00', padding: '8px', borderRadius: '4px', fontFamily: 'monospace', outline: 'none' };
  const actionBtnStyle = { background: '#1a1a1a', border: '1px solid #00ff00', color: '#00ff00', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
  const smallRemoveBtnStyle = { background: 'rgba(255,0,0,0.1)', color: '#ff4444', border: '1px solid #ff4444', padding: '2px 6px', borderRadius: '3px', cursor: 'pointer', fontSize: '10px' };

  // --- SE ESTIVER MINIMIZADO ---
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

  // --- CENA 1: NENHUM NÓ SELECIONADO ---
  if (!selectedNodes || selectedNodes.length === 0) {
    return (
      <div style={sidebarStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#fff' }}>⚙️ Propriedades</h3>
          <button onClick={() => setIsExpanded(false)} style={{ background: 'none', border: 'none', color: '#777', cursor: 'pointer', fontSize: '16px' }}>▶</button>
        </div>
        <p style={{ fontSize: '12px', color: '#555', textAlign: 'center', marginTop: '40px' }}>
          Selecione um componente no circuito para editar.
        </p>
      </div>
    );
  }

  // --- CENA 2: MÚLTIPLOS NÓS SELECIONADOS (Shift + Arrastar) ---
  if (selectedNodes.length > 1) {
    const selectedFreeNodes = selectedNodes.filter(n => n.type !== 'groupNode' && !n.parentId);
    const selectedGroups = selectedNodes.filter(n => n.type === 'groupNode');

    return (
      <div style={sidebarStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#00ff00', whiteSpace: 'nowrap' }}>⚙️ Seleção Múltipla</h3>
          <button onClick={() => setIsExpanded(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>▶</button>
        </div>
        <p style={{ fontSize: '12px', color: '#aaa', textAlign: 'center', marginTop: '10px' }}>
          {selectedNodes.length} componentes selecionados.
        </p>
        
        {selectedFreeNodes.length > 1 && selectedGroups.length === 0 ? (
          <button onClick={onGroupNodes} style={actionBtnStyle}>📦 Criar Novo Grupo</button>
        ) : (
          <p style={{ fontSize: '10px', color: '#666', textAlign: 'center' }}>Não é possível agrupar uma seleção mista.</p>
        )}
      </div>
    );
  }

  // --- CENA 3: EXATAMENTE UM NÓ SELECIONADO ---
  const selectedNode = selectedNodes[0];
  const { id, type, data, parentId } = selectedNode;
  
  const handleChange = (key, value) => {
    updateNodeData(id, { [key]: value });
  };

  const groupChildren = type === 'groupNode' ? nodes.filter(n => n.parentId === id) : [];
  const availableGroups = nodes.filter(n => n.type === 'groupNode');

  return (
    <div style={sidebarStyle}>
      {/* CABEÇALHO COM BOTÃO DE MINIMIZAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', color: '#00ff00', whiteSpace: 'nowrap' }}>⚙️ Propriedades</h3>
        <button onClick={() => setIsExpanded(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px' }} title="Minimizar">
          ▶
        </button>
      </div>
      
      {/* INFO COMUM */}
      <div style={{ fontSize: '11px', color: '#666', marginBottom: '10px' }}>
        <div><strong>TIPO:</strong> {type.toUpperCase()}</div>
        <div><strong>ID:</strong> {id.split('-')[1] || id}</div>
      </div>

      {/* PROPRIEDADES DE GRUPO CONTEINER */}
      {type === 'groupNode' && (
        <>
          <label style={labelStyle}>Nome do Grupo: <input type="text" value={data.label || ''} onChange={(e) => handleChange('label', e.target.value)} style={inputStyle} /></label>
          <button onClick={() => onUngroupNode(id)} style={{ ...actionBtnStyle, color: '#ffaa00', borderColor: '#ffaa00' }}>🔓 Desagrupar Tudo</button>
          
          {groupChildren.length > 0 && (
            <div style={{ marginTop: '15px', borderTop: '1px solid #333', paddingTop: '10px' }}>
              <h4 style={{ color: '#aaa', fontSize: '11px', margin: '0 0 8px 0' }}>Componentes Internos:</h4>
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

      {/* PROPRIEDADE DA PLACA BASE (BOARD) */}
      {type === 'board' && (
        <label style={labelStyle}>
          URL da Imagem de Fundo: 
          <input 
            type="text" 
            placeholder="src/assets/image-removebg-preview.png"
            value={data.imageUrl || ''} 
            onChange={(e) => handleChange('imageUrl', e.target.value)} 
            style={inputStyle} 
          />
        </label>
      )}

      {/* DROPDOWN PARA MOVER ITEM PARA DENTRO DE UM GRUPO */}
      {!parentId && !['groupNode', 'board'].includes(type) && availableGroups.length > 0 && (
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

      {/* REMOVER COMPONENTE DO GRUPO ATUAL */}
      {parentId && type !== 'groupNode' && (
         <button onClick={() => onRemoveFromGroup(id)} style={{ ...actionBtnStyle, color: '#ffaa00', borderColor: '#ffaa00', marginTop: '10px' }}>📤 Remover deste Grupo</button>
      )}

      {/* ESCALA ANTIGA (Ocultada em containers para evitar bugs) */}
      {!['groupNode', 'board'].includes(type) && (
        <label style={labelStyle}>
          Tamanho (Escala):
          <input 
            type="number" step="0.1" min="0.5" max="3"
            value={data.scale || 1} 
            onChange={(e) => handleChange('scale', parseFloat(e.target.value) || 1)} 
            style={inputStyle}
          />
        </label>
      )}

      {/* FPGA */}
      {type === 'fpga' && (
        <>
          <label style={labelStyle}>Label do Chip: <input type="text" value={data.label || ''} onChange={(e) => handleChange('label', e.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Entradas (Esquerda): <input type="number" min="0" value={data.inputs_left || 0} onChange={(e) => handleChange('inputs_left', parseInt(e.target.value) || 0)} style={inputStyle} /></label>
          <label style={labelStyle}>Entradas (Topo): <input type="number" min="0" value={data.inputs_top || 0} onChange={(e) => handleChange('inputs_top', parseInt(e.target.value) || 0)} style={inputStyle} /></label>
          <label style={labelStyle}>Saídas (Direita): <input type="number" min="0" value={data.outputs_right || 0} onChange={(e) => handleChange('outputs_right', parseInt(e.target.value) || 0)} style={inputStyle} /></label>
          <label style={labelStyle}>Saídas (Base): <input type="number" min="0" value={data.outputs_bottom || 0} onChange={(e) => handleChange('outputs_bottom', parseInt(e.target.value) || 0)} style={inputStyle} /></label>
        </>
      )}

      {/* BOTÃO/SWITCH */}
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

      {/* DATA BUS CONSTANTE */}
      {type === 'constant' && (
        <label style={labelStyle}>
          Valor de Saída:
          <input type="number" value={data.value || 0} onChange={(e) => handleChange('value', parseInt(e.target.value) || 0)} style={inputStyle} />
        </label>
      )}

      {/* BOTÃO DE APAGAR NÓ */}
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