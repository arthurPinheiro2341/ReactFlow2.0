/**
 * ARQUIVO: GNDNode.jsx
 * CAMADA: Component Layer / Reference Node
 * STATUS: Inativo (Placeholder para futura implementação de malha fechada).
 * DESCRIÇÃO: Define o ponto de potencial zero (0V). Essencial para a transição
 * de uma simulação de fluxo lógico para uma simulação de regime elétrico real.
 */

import React from 'react';
import { Handle, Position } from 'reactflow';

export const GNDNode = () => (
  // Layout minimalista focado na semântica visual de esquemáticos elétricos.
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    
    {/**
     * SÍMBOLO UNIVERSAL DE TERRA (Ground):
     * A geometria decrescente [30px -> 20px -> 10px] é um padrão internacional
     * de simbologia para facilitar a leitura rápida de diagramas técnicos.
     */}
    <div style={{ width: '30px', height: '2px', background: '#fff', marginBottom: '3px' }} />
    <div style={{ width: '20px', height: '2px', background: '#fff', marginBottom: '3px' }} />
    <div style={{ width: '10px', height: '2px', background: '#fff' }} />

    /** 
     * TERMINAL DE REFERÊNCIA (Handle):
     * Configurado como 'source' (origem de sinal). No contexto de hardware,
     * ele não "emite" energia, mas sim "consome" (sink), porém na lógica de grafos,
     * ele atua como a fonte do nível lógico '0'.
     * * NOTA: Posicionado no Topo para favorecer o layout clássico onde o terra
     * fica na parte inferior do circuito e os componentes se conectam para baixo.
     */
    <Handle 
      type="source" 
      position={Position.Top} 
      id="gnd-out" 
      style={{ background: '#555' }} 
    />
  </div>
);