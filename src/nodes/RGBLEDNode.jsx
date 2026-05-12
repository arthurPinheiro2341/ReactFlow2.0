/**
 * ARQUIVO: RGBLEDNode.jsx
 * CAMADA: Component Layer / Multi-Channel Actuator
 * DESCRIÇÃO: Implementa a lógica de mistura de cores RGB.
 * Utiliza álgebra booleana simples para determinar a intensidade dos canais 
 * e operações de bitwise para conversão de cores.
 */

import React from 'react';
import { Handle, Position } from 'reactflow';

export const RGBLEDNode = ({ data }) => {
  // HIDRATAÇÃO DE DADOS MULTICANAL:
  // Recebe sinais discretos (High/Low) para cada componente cromática.
  const { r_active = false, g_active = false, b_active = false } = data;

  /**
   * LÓGICA DE MISTURA ADITIVA:
   * Simula a sobreposição de comprimentos de onda.
   * R + G + B = Branco (White)
   * R + G = Amarelo (Yellow)
   * R + B = Magenta
   */
  const getMixedColor = () => {
    let r = 0, g = 0, b = 0;
    
    // Mapeamento de sinais lógicos para intensidades de 8 bits (0-255)
    if (r_active) r = 255;
    if (g_active) g = 255;
    if (b_active) b = 255;

    // ESTADO DE CORTE (Cut-off): Se não há DDP (Diferença de Potencial), o LED é opaco.
    if (r === 0 && g === 0 && b === 0) return '#222222';
    
    /**
     * CONVERSÃO DE FORMATO (Bitwise Color Processing):
     * A expressão ((1 << 24) + (r << 16) + (g << 8) + b) cria um inteiro de 32 bits.
     * O shift '1 << 24' garante o preenchimento de zeros à esquerda (Padding).
     * O .slice(1) remove o bit de controle, resultando em um Hexadecimal de 6 dígitos.
     */
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const activeColor = getMixedColor();
  const isActive = activeColor !== '#222222';

  // HELPER DE LAYOUT: Define a geometria das trilhas metálicas (Terminais)
  const legStyle = (left) => ({
    width: '4px',
    height: '35px',
    background: '#a0a0a0',
    position: 'absolute',
    top: '36px',
    left: left,
    zIndex: 0,
    boxShadow: '2px 2px 4px rgba(0,0,0,0.3)'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', height: '75px' }}>
      
      {/* 1. CABEÇA DO LED (Domo Skeuomórfico):
          O gradiente radial com ponto focal em 30% simula a reflexão em uma lente de epóxi esférica. */}
      <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50% 50% 15% 15%',
          background: isActive 
            ? `radial-gradient(circle at 30% 30%, #fff, ${activeColor} 40%, #000)` 
            : `radial-gradient(circle at 30% 30%, #666, #222)`,
          // EFEITO DE BLOOM: Intensidade de brilho dependente da cor resultante da mistura.
          boxShadow: isActive ? `0 0 30px 5px ${activeColor}` : 'none',
          border: '1px solid rgba(255,255,255,0.2)',
          zIndex: 2,
          position: 'relative'
      }} />

      {/* 2. BASE DO COMPONENTE: Representação da flange de orientação. */}
      <div style={{ width: '44px', height: '4px', background: '#333', borderRadius: '1px', marginTop: '-2px', zIndex: 1 }} />

      {/* 3. TRIPLO TERMINAL DE ENTRADA (I/O Handles):
          Utiliza IDs específicos ('r', 'g', 'b') que são mapeados diretamente 
          pela lógica de resolução de handles no 'useCircuit.js'. */}
      
      {/* Perna R (Red Channel) */}
      <div style={legStyle('5px')}>
        <Handle type="target" position={Position.Bottom} id="r" style={{ background: '#ff4444', bottom: '-5px' }} />
      </div>

      {/* Perna G (Green Channel) */}
      <div style={legStyle('18px')}>
        <Handle type="target" position={Position.Bottom} id="g" style={{ background: '#44ff44', bottom: '-5px' }} />
      </div>

      {/* Perna B (Blue Channel) */}
      <div style={legStyle('31px')}>
        <Handle type="target" position={Position.Bottom} id="b" style={{ background: '#4444ff', bottom: '-5px' }} />
      </div>

    </div>
  );
};