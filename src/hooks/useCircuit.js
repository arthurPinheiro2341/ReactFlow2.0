/**
 * ARQUIVO: useCircuit.js
 * CAMADA: Logic Engine / Signal Propagation
 * DESCRIÇÃO: Implementa um algoritmo de busca em grafo para atualizar o estado 
 * dos atuadores com base nas fontes. Funciona como um "Clock" reativo.
 */

import { useEffect } from 'react';

export const useCircuit = (nodes, edges, setNodes) => {
  useEffect(() => {
    // setNodes utiliza um padrão de atualização funcional (nds) => ...
    // para garantir atomicidade e evitar race conditions no estado do React.
    setNodes((nds) =>
      nds.map((node) => {
        
        // 1. RESOLUÇÃO DE TOPOLOGIA:
        // Localiza a aresta (fio) que tem este nó como alvo (target).
        // Em hardware, isso seria o mapeamento físico de um pino de entrada.
        const incomingEdge = edges.find((e) => e.target === node.id);
        
        // 2. RESOLUÇÃO DE ORIGEM:
        // Identifica o componente que está enviando o sinal.
        const sourceNode = incomingEdge 
          ? nds.find((n) => n.id === incomingEdge.source) 
          : null;

        /**
         * 3. ABSTRAÇÃO DE NÍVEL LÓGICO (isSourceActive):
         * Coage diferentes estados de hardware para um booleano (High/Low).
         * - .pressed: Botões momentâneos.
         * - .active: Switches ou estados lógicos persistentes.
         * - .type === 'constant': Barramentos de dados (VCC virtual).
         */
        const isSourceActive = !!(
          sourceNode?.data?.pressed || 
          sourceNode?.data?.active || 
          sourceNode?.type === 'constant'
        );

        // --- LÓGICA POR CATEGORIA DE COMPONENTE ---

        // ATUADOR BINÁRIO: LED
        // O estado visual (active) é uma função direta da atividade da fonte.
        if (node.type === 'led') {
          return { ...node, data: { ...node.data, active: isSourceActive } };
        }

        // DECODIFICADOR DE BARRAMENTO: DISPLAY 7 SEGMENTOS
        // Implementa um multiplexador lógico: 
        // Se ativo -> propaga o valor do barramento (Bus Value).
        // Se inativo -> força saída em 0 (GND).
        if (node.type === 'digit') {
          const val = isSourceActive ? (sourceNode?.data?.value ?? 1) : 0;
          return { ...node, data: { ...node.data, value: val } };
        }

        // ATUADOR MULTICANAL: LED RGB
        // Diferente dos outros, este possui handles específicos (r, g, b).
        // Utiliza uma função de alta ordem interna para validar cada canal de forma independente.
        if (node.type === 'rgb_led') {
          const getSignal = (channelId) => {
            const edge = edges.find(e => e.target === node.id && e.targetHandle === channelId);
            const src = edge ? nds.find(n => n.id === edge.source) : null;
            return !!(src?.data?.pressed || src?.data?.active || src?.type === 'constant');
          };

          return { 
            ...node, 
            data: { 
              ...node.data, 
              r_active: getSignal('r'), 
              g_active: getSignal('g'), 
              b_active: getSignal('b') 
            } 
          };
        }

        return node;
      })
    );
  
  /**
   * 4. OTIMIZAÇÃO DE PERFORMANCE (Dependency Array):
   * O truque 'nodes.map(n => JSON.stringify(n.data)).join(',')' permite que o React
   * detecte mudanças profundas nos dados dos nós (como um clique de botão) sem
   * entrar em loop infinito, já que o objeto 'nodes' muda a cada renderização.
   */
  }, [edges, nodes.map(n => JSON.stringify(n.data)).join(','), setNodes]);
};