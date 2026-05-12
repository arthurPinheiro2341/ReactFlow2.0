/**
 * ARQUIVO: FPGANode.jsx
 * CAMADA: Advanced Component Layer / Reconfigurable Hardware
 * DESCRIÇÃO: Implementa um chip lógico programável com topologia de pinos dinâmica.
 * Utiliza hooks avançados do React Flow para garantir a integridade das conexões
 * durante mutações estruturais do componente.
 */

import React, { useEffect } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';

export const FPGANode = ({ id, data }) => {
  /**
   * 1. GESTÃO DE ESTADO INTERNO (React Flow Engine):
   * O hook useUpdateNodeInternals é crítico. Em grafos, a posição dos Handles
   * é cacheada para performance. Quando mudamos o número de pinos, o cache quebra.
   * Este hook força a "re-escaneamento" dos pontos de ancoragem do chip.
   */
  const updateNodeInternals = useUpdateNodeInternals();

  // Desestruturação de Parâmetros de I/O
  const { 
    inputs_left = 1,   
    inputs_top = 0,    
    outputs_right = 1, 
    outputs_bottom = 0,
  } = data;

  /**
   * 2. SINCRONIZAÇÃO DE CICLO DE VIDA:
   * Sempre que um parâmetro de contagem de pinos é alterado via UI (App.jsx),
   * o useEffect dispara a atualização das coordenadas internas do nó.
   */
  useEffect(() => {
    updateNodeInternals(id);
  }, [id, inputs_left, inputs_top, outputs_right, outputs_bottom, updateNodeInternals]);

  // Constantes de Layout Industrial
  const chipSize = 350; // Dimensão fixa para simular um encapsulamento BGA/QFP grande.

  const handleStyle = {
    background: '#1a1a1a', 
    width: '12px',
    height: '12px',
    border: '2px solid #a0a0a0', 
    zIndex: 10,
    position: 'absolute'
  };

  /**
   * 3. MOTOR DE RENDERIZAÇÃO DE PINOS (renderPins):
   * Implementa uma distribuição espacial uniforme baseada na contagem (n).
   * Utiliza cálculo percentual: ((i + 1) / (count + 1)) * 100
   * para garantir que os pinos nunca encostem nas quinas do chip.
   */
  const renderPins = (count, side, handlePosition, type) => {
    return [...Array(count)].map((_, i) => {
      const positionPercent = `${((i + 1) / (count + 1)) * 100}%`;
      
      /**
       * NAMESPACING DE IDs:
       * Para evitar conflitos no motor de busca do grafo, cada pino recebe um 
       * ID composto: [Nódulo]-[Lado]-[Tipo]-[Índice].
       */
      const uniquePinId = `${id}-${side}-${type}-${i}`;

      const commonStyle = { position: 'absolute', zIndex: 1 };
      let pinStyle, handleOffset;

      /**
       * 4. ENGENHARIA DE ALINHAMENTO (CSS Transforms):
       * O uso de -26px no handleOffset compensa o raio da bolinha de conexão.
       * 'translateY(-50%)' ou 'translateX(-50%)' garante que o centro exato
       * do objeto coincida com a coordenada percentual calculada.
       */
      if (side === 'left') {
        pinStyle = { ...commonStyle, top: positionPercent, left: '-20px', width: '20px', height: '4px', background: 'linear-gradient(to right, #777, #b0b0b0)', transform: 'translateY(-50%)' };
        handleOffset = { left: '-26px', top: positionPercent, transform: 'translateY(-50%)' };
      } else if (side === 'right') {
        pinStyle = { ...commonStyle, top: positionPercent, right: '-20px', width: '20px', height: '4px', background: 'linear-gradient(to left, #777, #b0b0b0)', transform: 'translateY(-50%)' };
        handleOffset = { right: '-26px', top: positionPercent, transform: 'translateY(-50%)' };
      } else if (side === 'top') {
        pinStyle = { ...commonStyle, left: positionPercent, top: '-20px', width: '4px', height: '20px', background: 'linear-gradient(to bottom, #777, #b0b0b0)', transform: 'translateX(-50%)' };
        handleOffset = { top: '-26px', left: positionPercent, transform: 'translateX(-50%)' };
      } else if (side === 'bottom') {
        pinStyle = { ...commonStyle, left: positionPercent, bottom: '-20px', width: '4px', height: '20px', background: 'linear-gradient(to top, #777, #b0b0b0)', transform: 'translateX(-50%)' };
        handleOffset = { bottom: '-26px', left: positionPercent, transform: 'translateX(-50%)' };
      }

      return (
        <React.Fragment key={uniquePinId}>
          {/* Geometria Metálica do Pino */}
          <div style={pinStyle} />
          {/* Interface Lógica de Conexão */}
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
    <div style={{
      width: `${chipSize}px`, height: `${chipSize}px`,
      background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
      border: '2px solid #111', borderRadius: '4px', position: 'relative',
      boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      {/* Marcação física do Pino 1 (Padrão Industrial) */}
      <div style={{ position: 'absolute', top: '15px', left: '15px', width: '12px', height: '12px', background: '#000', borderRadius: '50%', border: '1px solid #333' }} />
      
      <div style={{ textAlign: 'center', userSelect: 'none', fontFamily: 'monospace' }}>
        <div style={{ color: '#fff', fontSize: '32px', fontWeight: 'bold', letterSpacing: '6px' }}>FPGA</div>
      </div>

      {/* Barramentos Dinâmicos de I/O */}
      {renderPins(inputs_left, 'left', Position.Left, 'in')}
      {renderPins(inputs_top, 'top', Position.Top, 'in')}
      {renderPins(outputs_right, 'right', Position.Right, 'out')}
      {renderPins(outputs_bottom, 'bottom', Position.Bottom, 'out')}
    </div>
  );
};