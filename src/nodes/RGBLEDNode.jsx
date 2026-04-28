import React from 'react';
import { Handle, Position } from 'reactflow';

export const RGBLEDNode = ({ data }) => {
  // Recebe os estados de sinal e terra do App.jsx
  const { r = false, g = false, b = false, gnd = false } = data;

  // Lógica de mistura de cores (Simulação Digital)
  const getRGBColor = () => {
    if (!gnd) return '#222'; // Sem terra = desligado
    
    // Cores combinadas
    if (r && g && b) return '#ffffff'; // Branco
    if (r && g) return '#ffff00';      // Amarelo
    if (r && b) return '#ff00ff';      // Magenta
    if (g && b) return '#00ffff';      // Ciano
    
    // Cores puras
    if (r) return '#ff0000';
    if (g) return '#00ff00';
    if (b) return '#0000ff';
    
    return '#222'; // Tudo desligado
  };

  const activeColor = getRGBColor();
  const isActive = activeColor !== '#222';

  // Estilo visual das perninhas de metal
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
      
      {/* Corpo do LED RGB (Leitoso) */}
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

      {/* Base de plástico */}
      <div style={{ width: '44px', height: '4px', background: '#333', borderRadius: '1px', marginTop: '-2px', zIndex: 1 }} />

      {/* As 4 Perninhas (R, G, GND, B) */}
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        
        {/* Vermelho (R) */}
        <div style={legStyle('35px')}>
          <Handle type="target" position={Position.Bottom} id="r" style={{ background: '#ff4444' }} />
        </div>

        {/* Verde (G) */}
        <div style={legStyle('40px')}>
          <Handle type="target" position={Position.Bottom} id="g" style={{ background: '#44ff44' }} />
        </div>

        {/* Terra (GND) - A mais curta no centro */}
        <div style={legStyle('25px')}>
          <Handle type="target" position={Position.Bottom} id="gnd" style={{ background: '#555' }} />
        </div>

        {/* Azul (B) */}
        <div style={legStyle('35px')}>
          <Handle type="target" position={Position.Bottom} id="b" style={{ background: '#4444ff' }} />
        </div>

      </div>
    </div>
  );
};