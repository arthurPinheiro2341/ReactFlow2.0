/**
 * ARQUIVO: RGBLEDNode.jsx
 * DESCRIÇÃO: Representação visual de um LED RGB de 4 pinos (Cátodo Comum).
 * Este componente simula a mistura de cores primárias (Vermelho, Verde e Azul).
 * Ele utiliza lógica booleana para determinar a cor resultante baseada nas 
 * combinações de sinais recebidos em seus terminais.
 */

import React from 'react';
import { Handle, Position } from 'reactflow';

export const RGBLEDNode = ({ data }) => {
  // Recebe os estados de sinal (VCC) e terra (GND) processados pelo useCircuit.js
  const { r = false, g = false, b = false, gnd = false } = data;

  /**
   * LÓGICA DE MISTURA DE CORES (Simulação de Síntese Aditiva)
   * Determina a cor final do componente baseada nos sinais ativos.
   */
  const getRGBColor = () => {
    // PROTEÇÃO: Se não houver conexão com o terra, o LED permanece apagado
    if (!gnd) return '#222'; 
    
    // COMBINAÇÕES DE CORES (Sinais mistos)
    if (r && g && b) return '#ffffff'; // Branco (Todas as cores ativas)
    if (r && g) return '#ffff00';      // Amarelo (Vermelho + Verde)
    if (r && b) return '#ff00ff';      // Magenta (Vermelho + Azul)
    if (g && b) return '#00ffff';      // Ciano (Verde + Azul)
    
    // CORES PURAS (Apenas um canal ativo)
    if (r) return '#ff0000'; // Vermelho
    if (g) return '#00ff00'; // Verde
    if (b) return '#0000ff'; // Azul
    
    return '#222'; // Estado padrão: desligado (preto/cinza escuro)
  };

  const activeColor = getRGBColor();
  const isActive = activeColor !== '#222';

  /**
   * Estilo auxiliar para as 4 perninhas de metal.
   * Diferentes alturas ajudam na identificação visual dos pinos.
   */
  const legStyle = (height) => ({
    width: '2px',
    height: height,
    background: '#a0a0a0',
    position: 'relative',
    margin: '0 6px',
    display: 'flex',
    justifyContent: 'center'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* 1. CORPO DO LED (DOMO LEITOSO)
          O gradiente radial e o boxShadow mudam dinamicamente conforme a mistura 
          de cores calculada pela função getRGBColor().
      */}
      <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50% 50% 15% 15%',
          background: isActive 
            ? `radial-gradient(circle at 30% 30%, #fff, ${activeColor} 40%, #000)` 
            : `radial-gradient(circle at 30% 30%, #666, #222)`,
          boxShadow: isActive ? `0 0 30px 5px ${activeColor}` : 'none',
          border: '1px solid rgba(255,255,255,0.2)',
          zIndex: 2
      }} />

      {/* 2. BASE DE PLÁSTICO */}
      <div style={{ width: '44px', height: '4px', background: '#333', borderRadius: '1px', marginTop: '-2px', zIndex: 1 }} />

      {/* 3. AS 4 PERNINHAS (ENTRADAS DE SINAL E TERRA)
          Diferente do LED comum, aqui temos 4 alvos (targets) para controlar 
          cada canal de cor de forma independente.
      */}
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        
        {/* Canal Vermelho (R) */}
        <div style={legStyle('35px')}>
          <Handle type="target" position={Position.Bottom} id="r" style={{ background: '#ff4444' }} />
        </div>

        {/* Canal Verde (G) */}
        <div style={legStyle('40px')}>
          <Handle type="target" position={Position.Bottom} id="g" style={{ background: '#44ff44' }} />
        </div>

        {/* Terra (GND) - Representado pela perna mais curta no centro */}
        <div style={legStyle('25px')}>
          <Handle type="target" position={Position.Bottom} id="gnd" style={{ background: '#555' }} />
        </div>

        {/* Canal Azul (B) */}
        <div style={legStyle('35px')}>
          <Handle type="target" position={Position.Bottom} id="b" style={{ background: '#4444ff' }} />
        </div>

      </div>
    </div>
  );
};