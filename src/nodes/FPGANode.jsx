/**
 * ARQUIVO: FPGANode.jsx
 * CAMADA: Advanced Component Layer / Reconfigurable Hardware
 * ATUALIZAÇÃO: Integrado NodeResizer nativo. Alças de redimensionamento 
 * personalizadas (maiores e com zIndex alto) para facilitar o arraste.
 */

import React, { useEffect } from 'react';
// Importação do NodeResizer
import { Handle, Position, useUpdateNodeInternals, NodeResizer } from 'reactflow';

// Recebendo a propriedade "selected" nativa do React Flow
export const FPGANode = ({ id, data, selected }) => {
  const updateNodeInternals = useUpdateNodeInternals();

  const { 
    inputs_left = 1,   
    inputs_top = 0,    
    outputs_right = 1, 
    outputs_bottom = 0,
    // O controle é por largura/altura física injetada pelo React Flow
    width = 350,   // Tamanho inicial padrão
    height = 350   // Tamanho inicial padrão
  } = data;

  useEffect(() => {
    // Sincroniza as conexões (fios) se o número de pinos ou as dimensões mudarem
    const timer = setTimeout(() => {
      updateNodeInternals(id);
    }, 10);
    return () => clearTimeout(timer);
  }, [id, inputs_left, inputs_top, outputs_right, outputs_bottom, width, height, updateNodeInternals]);

  // Estilo das alças de conexão (handles) dos pinos
  const handleStyle = {
    background: '#1a1a1a', 
    width: '3px',
    height: '3px',
    border: '1px solid #a0a0a0', 
    zIndex: 10, // Z-index dos handles de conexão
    position: 'absolute'
  };

  // --- NOVO ESTILO DAS ALÇAS DE REDIMENSIONAMENTO ---
  const resizerHandleStyle = {
    width: '10px', // Maior que o padrão (que é 10px) para facilitar o clique
    height: '10px',
    background: '#00ff00', // Mesma cor do seu tema
    border: '2px solid #ffffff', // Borda branca para visibilidade
    borderRadius: '50%', // Alças redondas
    zIndex: 100, // Z-index MUITO ALTO para ficar acima dos pinos (zIndex: 1) e handles (zIndex: 10)
  };

  const renderPins = (count, side, handlePosition, type) => {
    return [...Array(count)].map((_, i) => {
      const positionPercent = `${((i + 1) / (count + 1)) * 100}%`;
      const uniquePinId = `${id}-${side}-${type}-${i}`;

      const commonStyle = { position: 'absolute', zIndex: 1 };
      let pinStyle, handleOffset;

      if (side === 'left') {
        pinStyle = { ...commonStyle, top: positionPercent, left: '-20px', width: '20px', height: '2px', background: 'linear-gradient(to right, #777, #b0b0b0)', transform: 'translateY(-50%)' };
        handleOffset = { left: '-23px', top: positionPercent, transform: 'translateY(-50%)' };
      } else if (side === 'right') {
        pinStyle = { ...commonStyle, top: positionPercent, right: '-20px', width: '20px', height: '2px', background: 'linear-gradient(to left, #777, #b0b0b0)', transform: 'translateY(-50%)' };
        handleOffset = { right: '-23px', top: positionPercent, transform: 'translateY(-50%)' };
      } else if (side === 'top') {
        pinStyle = { ...commonStyle, left: positionPercent, top: '-20px', width: '2px', height: '20px', background: 'linear-gradient(to bottom, #777, #b0b0b0)', transform: 'translateX(-50%)' };
        handleOffset = { top: '-23px', left: positionPercent, transform: 'translateX(-50%)' };
      } else if (side === 'bottom') {
        pinStyle = { ...commonStyle, left: positionPercent, bottom: '-20px', width: '2px', height: '20px', background: 'linear-gradient(to top, #777, #b0b0b0)', transform: 'translateX(-50%)' };
        handleOffset = { bottom: '-23px', left: positionPercent, transform: 'translateX(-50%)' };
      }

      return (
        <React.Fragment key={uniquePinId}>
          <div style={pinStyle} />
          <Handle
            type={type === 'in' ? 'target' : 'source'}
            position={handlePosition}
            id={uniquePinId}
            style={{ ...handleStyle, ...handleOffset }}
          />
        </React.Fragment>
      );
    });
  };

  return (
    <>
      {/* O COMPONENTE DE REDIMENSIONAMENTO ATUALIZADO */}
      <NodeResizer 
        color="#00ff00" // Cor da linha de redimensionamento
        isVisible={selected} 
        minWidth={100}
        minHeight={100}
        handleStyle={resizerHandleStyle} // Aplica o estilo customizado para todas as alças (cantos e bordas)
      />

      {/* A DIV PRINCIPAL AGORA USA AS DIMENSÕES INJETADAS PELO NODE */}
      <div style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
        border: '2px solid #111', 
        borderRadius: '4px', 
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.1)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
      }}>
        <div style={{ position: 'absolute', top: '15px', left: '15px', width: '12px', height: '12px', background: '#000', borderRadius: '50%', border: '1px solid #333' }} />
        
        <div style={{ textAlign: 'center', userSelect: 'none', fontFamily: 'monospace', padding: '0 40px' }}>
          <div style={{ 
            color: '#fff', 
            fontSize: '32px', 
            fontWeight: 'bold', 
            letterSpacing: '4px',
            wordBreak: 'break-word',
            wordWrap: 'break-word',
            textTransform: 'uppercase' 
          }}>
            {data.label || 'FPGA'}
          </div>
        </div>

        {renderPins(inputs_left, 'left', Position.Left, 'in')}
        {renderPins(inputs_top, 'top', Position.Top, 'in')}
        {renderPins(outputs_right, 'right', Position.Right, 'out')}
        {renderPins(outputs_bottom, 'bottom', Position.Bottom, 'out')}
      </div>
    </>
  );
};