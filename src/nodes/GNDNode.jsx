/**
 * Node visual de referência lógica baixa com um Handle source.
 * O componente existe no código, mas não está registrado entre os tipos ativos do React Flow.
 */

import React from 'react';
import { Handle, Position } from 'reactflow';

export const GNDNode = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    
    {/* Barras decrescentes formam o símbolo convencional de terra. */}
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