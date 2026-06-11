/**
 * ARQUIVO: src/components/PropertiesSidebar.jsx
 * DESCRIÇÃO: Aba lateral direita para inspecionar e editar propriedades do nó selecionado.
 * Possui função de expandir/minimizar e exclusão de componente.
 */

import React, { useState } from 'react';

export const PropertiesSidebar = ({ selectedNode, updateNodeData, onDeleteNode }) => {
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

  // --- SE ESTIVER EXPANDIDO, MAS NENHUM NÓ ESTIVER SELECIONADO ---
  if (!selectedNode) {
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

  const { id, type, data } = selectedNode;

  const handleChange = (key, value) => {
    updateNodeData(id, { [key]: value });
  };

  // --- SE ESTIVER EXPANDIDO E UM NÓ ESTIVER SELECIONADO ---
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
        <div><strong>ID:</strong> {id.split('-')[1]}</div>
      </div>

      <label style={labelStyle}>
        Tamanho (Escala):
        <input 
          type="number" step="0.1" min="0.5" max="3"
          value={data.scale || 1} 
          onChange={(e) => handleChange('scale', parseFloat(e.target.value) || 1)} 
          style={inputStyle}
        />
      </label>

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

      {/* BOTÃO DE APAGAR NÓ (Empurrado para o final da aba) */}
      <button 
        onClick={() => onDeleteNode(id)}
        style={{
          marginTop: 'auto', // Empurra para a base da sidebar
          background: 'rgba(255, 0, 0, 0.1)',
          color: '#ff4444',
          border: '1px solid #ff4444',
          padding: '10px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 0, 0, 0.3)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 0, 0, 0.1)'}
      >
        🗑️ Apagar Componente
      </button>

    </div>
  );
};