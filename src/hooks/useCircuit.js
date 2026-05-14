/**
 * ARQUIVO: useCircuit.js
 * CAMADA: Logic Engine / Signal Propagation
 * DESCRIÇÃO: Motor de propagação de sinais. Implementa a lógica de "Physical Polling",
 * onde cada pino de entrada (Handle) dos atuadores consulta o estado das fontes.
 */

import { useEffect } from 'react';

export const useCircuit = (nodes, edges, setNodes) => {
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        
        /**
         * 1. RESOLVEDOR DE SINAL (Helper):
         * Busca o nível lógico de um Handle específico (handleId).
         * Retorna true (High) se a fonte for um Botão pressionado, 
         * Switch ativo, Clock ligado ou saída de FPGA.
         */
        const getSignalFromHandle = (handleId) => {
          const edge = edges.find(e => e.target === node.id && e.targetHandle === handleId);
          if (!edge) return false;
          
          const src = nds.find(n => n.id === edge.source);
          // O Clock e a FPGA agora são considerados fontes de sinal High (1)
          return !!(
            src?.data?.pressed || 
            src?.data?.active || 
            src?.type === 'constant' || 
            src?.type === 'clock' ||
            src?.type === 'fpga'
          );
        };

        // --- LÓGICA POR CATEGORIA DE HARDWARE ---

        // A. LED SIMPLES (Single Channel)
        if (node.type === 'led') {
          // Procura qualquer fio conectado (padrão do React Flow para input único)
          const edge = edges.find((e) => e.target === node.id);
          const active = edge ? getSignalFromHandle(edge.targetHandle) : false;
          return { ...node, data: { ...node.data, active } };
        }

        // B. DIGIT NODE (8-Bit Bus: a-g + DP)
        // Mapeia as 8 entradas superiores/inferiores para o array de visualização.
        if (node.type === 'digit') {
          const newValues = [0, 0, 0, 0, 0, 0, 0, 0].map((_, i) => 
            getSignalFromHandle(`in-${i}`) ? 1 : 0
          );

          // Otimização: Só atualiza o estado se houver mudança nos bits
          if (JSON.stringify(node.data.values) === JSON.stringify(newValues)) return node;
          return { ...node, data: { ...node.data, values: newValues } };
        }

        // C. TELA VGA (12-Bit RGB + Sync)
        // Amostragem de barramentos cromáticos e sinais de temporização.
        if (node.type === 'display') {
          const syncUpdate = {
            vsync_active: getSignalFromHandle('vsync'),
            hsync_active: getSignalFromHandle('hsync'),
          };

          // Varredura dos barramentos R, G, B (4 bits cada)
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

        // D. LED RGB (Tri-channel)
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

  /**
   * 2. TRIGGER REATIVO:
   * O motor dispara sempre que uma aresta (fio) é conectada/desconectada
   * ou quando os dados internos de qualquer nó mudam (ex: clicar num botão).
   */
  }, [edges, nodes.map(n => JSON.stringify(n.data)).join(','), setNodes]);
};