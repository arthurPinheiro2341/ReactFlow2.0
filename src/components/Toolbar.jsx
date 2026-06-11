/**
 * ARQUIVO: src/components/Toolbar.jsx
 * CAMADA: Interface do Usuário (UI)
 * DESCRIÇÃO: Barra lateral vertical de Periféricos com ícones skeuomórficos
 * que simulam a aparência real dos componentes do simulador.
 */

import React from 'react';

export const Toolbar = ({ addNode, clearBoard }) => {
  const sectionTitleStyle = {
    textAlign: 'center', 
    color: '#fff', 
    padding: '8px 0',
    borderTop: '1px solid #333', 
    borderBottom: '1px solid #333',
    margin: '0', 
    backgroundColor: '#1a1a1a',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  };

  const itemStyle = {
    display: 'flex', 
    alignItems: 'center', 
    gap: '15px',
    padding: '12px 20px', 
    cursor: 'pointer', 
    color: '#ddd',
    transition: 'background 0.2s',
    fontSize: '13px'
  };

  return (
    <div style={{
      width: '220px', // Largura fixa 
      height: '100vh',
      backgroundColor: '#0f0f0f', 
      borderRight: '1px solid #333', 
      display: 'flex', 
      flexDirection: 'column', 
      flexShrink: 0, // Impede a barra de esmagar quando a tela for pequena
      zIndex: 10, 
      fontFamily: 'sans-serif', 
      userSelect: 'none'
    }}>
      <h2 style={{ textAlign: 'center', padding: '15px 0', margin: 0, color: '#fff', fontSize: '18px' }}>
        Peripherals
      </h2>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        
        {/* ================= SESSÃO: INPUTS ================= */}
        <div style={sectionTitleStyle}>Inputs</div>
        
        <div style={itemStyle} onClick={() => addNode('button')} onMouseEnter={(e) => e.currentTarget.style.background='#222'} onMouseLeave={(e) => e.currentTarget.style.background='transparent'}>
          {/* Mini Botão */}
          <div style={{ width: 24, height: 24, background: '#111', borderRadius: '4px', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 14, height: 14, background: '#0a0a0a', borderRadius: '50%', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8), 0 1px 1px rgba(255,255,255,0.1)' }}></div>
          </div>
          Button
        </div>
        
        <div style={itemStyle} onClick={() => addNode('switch')} onMouseEnter={(e) => e.currentTarget.style.background='#222'} onMouseLeave={(e) => e.currentTarget.style.background='transparent'}>
           {/* Mini Switch */}
           <div style={{ width: 14, height: 24, background: '#111', border: '1px solid #333', borderRadius: '2px', position: 'relative' }}>
             <div style={{ position: 'absolute', bottom: 1, left: 1, right: 1, height: 10, background: '#555', borderRadius: '1px' }}></div>
           </div>
           Switch
        </div>

        <div style={itemStyle} onClick={() => addNode('clock')} onMouseEnter={(e) => e.currentTarget.style.background='#222'} onMouseLeave={(e) => e.currentTarget.style.background='transparent'}>
           {/* Mini Clock SMD */}
           <div style={{ width: 28, height: 16, background: '#b0b0b0', border: '1px solid #333', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
             <div style={{ position: 'absolute', top: -2, width: 4, height: 4, background: '#111', borderRadius: '50%' }}></div>
             <div style={{ position: 'absolute', bottom: -2, width: 4, height: 4, background: '#111', borderRadius: '50%' }}></div>
             <div style={{ fontSize: '7px', color: '#111', fontWeight: 'bold' }}>25M</div>
           </div>
           Clock
        </div>

        {/* ================= SESSÃO: OUTPUTS ================= */}
        <div style={sectionTitleStyle}>Outputs</div>
        
        <div style={itemStyle} onClick={() => addNode('digit')} onMouseEnter={(e) => e.currentTarget.style.background='#222'} onMouseLeave={(e) => e.currentTarget.style.background='transparent'}>
           {/* Mini 7-Seg Display */}
           <div style={{ width: 18, height: 26, background: '#0a0a0a', border: '1px solid #333', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#ff0000', fontFamily: 'monospace', fontSize: '18px', lineHeight: '1', textShadow: '0 0 5px red' }}>8</div>
           </div>
           <span style={{ lineHeight: '1.2' }}>7 Seg<br/>Display</span>
        </div>
        
        <div style={itemStyle} onClick={() => addNode('led')} onMouseEnter={(e) => e.currentTarget.style.background='#222'} onMouseLeave={(e) => e.currentTarget.style.background='transparent'}>
           {/* Mini LED */}
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <div style={{ width: 14, height: 16, background: '#ff0000', borderRadius: '7px 7px 2px 2px', boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.5)' }}></div>
             <div style={{ width: 2, height: 6, background: '#777', marginTop: '1px' }}></div>
           </div>
           Led
        </div>
        
        <div style={itemStyle} onClick={() => addNode('rgb_led')} onMouseEnter={(e) => e.currentTarget.style.background='#222'} onMouseLeave={(e) => e.currentTarget.style.background='transparent'}>
           {/* Mini RGB LED */}
           <div style={{ width: 20, height: 20, display: 'flex', gap: '3px', alignItems: 'flex-end', justifyContent: 'center', background: '#111', paddingBottom: '2px', borderRadius: '2px', border: '1px solid #222' }}>
             <div style={{ width: 3, height: 10, background: 'red', borderRadius: '2px' }}></div>
             <div style={{ width: 3, height: 14, background: 'green', borderRadius: '2px' }}></div>
             <div style={{ width: 3, height: 10, background: 'blue', borderRadius: '2px' }}></div>
           </div>
           RGB Led
        </div>
        
        <div style={itemStyle} onClick={() => addNode('display')} onMouseEnter={(e) => e.currentTarget.style.background='#222'} onMouseLeave={(e) => e.currentTarget.style.background='transparent'}>
           {/* Mini Tela VGA */}
           <div style={{ width: 28, height: 18, background: '#111', border: '1px solid #444', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <div style={{ width: 22, height: 12, background: '#050505', border: '1px solid #222' }}></div>
           </div>
           VGA Display
        </div>

        {/* ================= SESSÃO: PROCESSORS ================= */}
        <div style={sectionTitleStyle}>Processors</div>
        <div style={itemStyle} onClick={() => addNode('fpga')} onMouseEnter={(e) => e.currentTarget.style.background='#222'} onMouseLeave={(e) => e.currentTarget.style.background='transparent'}>
           {/* Mini FPGA */}
           <div style={{ width: 30, height: 30, background: '#111', border: '1px dashed #555', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
             <div style={{ fontSize: '6px', color: '#888', fontWeight: 'bold' }}>FPGA</div>
             <div style={{ position: 'absolute', top: 2, left: 2, width: 2, height: 2, background: '#444', borderRadius: '50%' }}></div>
           </div>
           FPGA Chip
        </div>
      </div>

      {/* ================= BOTÃO INFERIOR ================= */}
      <div style={{ padding: '15px' }}>
        <button
          onClick={clearBoard}
          style={{ 
            width: '100%', padding: '10px', background: 'transparent', 
            color: '#fff', border: '2px solid #777', cursor: 'pointer',
            fontSize: '14px', fontWeight: 'bold', transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background='#333'} 
          onMouseLeave={(e) => e.currentTarget.style.background='transparent'}
        >
          Start Simulation
        </button>
      </div>
    </div>
  );
};