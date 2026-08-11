/**
 * Aplica a propagação mock usada pelo comportamento visual do frontend.
 * Consulta as edges do React Flow e atualiza os dados exibidos pelos periféricos de saída.
 */

import { useEffect } from 'react';

export const useCircuit = (nodes, edges, setNodes) => {
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        
        /**
         * Resolve o nível lógico recebido por um Handle do node atual.
         * Constant, Clock e FPGA são tratados como nível alto pelo mock visual existente.
         */
        const getSignalFromHandle = (handleId) => {
          const edge = edges.find(e => e.target === node.id && e.targetHandle === handleId);
          if (!edge) return false;
          
          const src = nds.find(n => n.id === edge.source);
          return !!(
            src?.data?.pressed || 
            src?.data?.active || 
            src?.type === 'constant' || 
            src?.type === 'clock' ||
            src?.type === 'fpga'
          );
        };

        // O LED simples usa a primeira edge de entrada disponível.
        if (node.type === 'led') {
          const edge = edges.find((e) => e.target === node.id);
          const active = edge ? getSignalFromHandle(edge.targetHandle) : false;
          return { ...node, data: { ...node.data, active } };
        }

        // Mapeia os oito Handles do display para os segmentos a-g e o ponto decimal.
        if (node.type === 'digit') {
          const newValues = [0, 0, 0, 0, 0, 0, 0, 0].map((_, i) => 
            getSignalFromHandle(`in-${i}`) ? 1 : 0
          );

          // Evita substituir o node quando os bits exibidos não mudaram.
          if (JSON.stringify(node.data.values) === JSON.stringify(newValues)) return node;
          return { ...node, data: { ...node.data, values: newValues } };
        }

        // O mock atual amostra os quatro primeiros Handles de cada canal e os sinais de sincronismo.
        if (node.type === 'display') {
          const syncUpdate = {
            vsync_active: getSignalFromHandle('vsync'),
            hsync_active: getSignalFromHandle('hsync'),
          };

          const r_bus = [0, 1, 2, 3].map(i => getSignalFromHandle(`r${i}`) ? 1 : 0);
          const g_bus = [0, 1, 2, 3].map(i => getSignalFromHandle(`g${i}`) ? 1 : 0);
          const b_bus = [0, 1, 2, 3].map(i => getSignalFromHandle(`b${i}`) ? 1 : 0);

          return { 
            ...node, 
            data: { 
              ...node.data, 
              ...syncUpdate,
              r_values: r_bus,
              g_values: g_bus,
              b_values: b_bus 
            } 
          };
        }

        // Cada Handle do LED RGB controla independentemente um canal de cor.
        if (node.type === 'rgb_led') {
          return { 
            ...node, 
            data: { 
              ...node.data, 
              r_active: getSignalFromHandle('r'), 
              g_active: getSignalFromHandle('g'), 
              b_active: getSignalFromHandle('b') 
            } 
          };
        }

        return node;
      })
    );

  // Recalcula a visualização quando a topologia ou os dados relevantes dos nodes mudam.
  }, [edges, nodes.map(n => JSON.stringify(n.data)).join(','), setNodes]);
};