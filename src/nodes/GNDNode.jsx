/**
 * ARQUIVO: GNDNode.jsx
 * DESCRIÇÃO: Representação visual do Terra (Ground/GND).
 * Este componente atua como o potencial de referência (0V) do circuito. 
 * No simulador, ele é essencial para fechar a malha e permitir que componentes 
 * como LEDs e Displays funcionem corretamente.
 */

import React from 'react';
import { Handle, Position } from 'reactflow';

export const GNDNode = () => (
  // Container principal centralizado para alinhar os elementos do símbolo de terra
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    
    {/* SÍMBOLO GRÁFICO DO TERRA: 
        Três linhas horizontais brancas de comprimentos decrescentes, 
        formando o ícone universal de aterramento. 
    */}
    <div style={{ width: '30px', height: '2px', background: '#fff', marginBottom: '3px' }} />
    <div style={{ width: '20px', height: '2px', background: '#fff', marginBottom: '3px' }} />
    <div style={{ width: '10px', height: '2px', background: '#fff' }} />

    {/* PONTO DE CONEXÃO (HANDLE):
        Definido como 'source' (fonte) pois ele fornece o "sinal de terra" para o circuito.
        Posicionado no topo para que os fios saiam para cima em direção aos componentes.
    */}
    <Handle 
      type="source" 
      position={Position.Top} 
      id="gnd-out" 
      style={{ background: '#555' }} 
    />
  </div>
);