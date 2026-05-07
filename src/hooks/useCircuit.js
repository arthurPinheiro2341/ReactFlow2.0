/**
 * ARQUIVO: useCircuit.js
 * DESCRIÇÃO: Este Custom Hook atua como o "Processador Lógico" do simulador.
 * Ele analisa em tempo real as conexões (edges) e o estado dos componentes 
 * para calcular a propagação de sinais elétricos (VCC e GND), determinando 
 * quais LEDs ou Displays devem ser acionados.
 */

import { useEffect } from 'react';

export const useCircuit = (nodes, edges, setNodes) => {
  useEffect(() => {
    // Atualiza o estado dos componentes sempre que houver mudança nos fios ou botões
    setNodes((nds) =>
      nds.map((node) => {
        
        /** * LÓGICA PARA LED COMUM
         * Um LED só acende se houver um caminho para o sinal (VCC) e para o terra (GND).
         */
        if (node.type === 'led') {
          // Verifica se algum fio chega no handle 'vcc' vindo de um botão pressionado
          const hasSignal = edges.some(e => e.target === node.id && e.targetHandle === 'vcc' && nds.find(n => n.id === e.source)?.data?.pressed);
          // Verifica se algum fio chega no handle 'gnd' vindo de um componente do tipo GND
          const hasGround = edges.some(e => e.target === node.id && e.targetHandle === 'gnd' && nds.find(n => n.id === e.source)?.type === 'gnd');
          
          // O LED fica ativo apenas com a presença de ambos os potenciais (VCC e GND)
          return { ...node, data: { ...node.data, active: !!(hasSignal && hasGround) } };
        }

        /** * LÓGICA PARA LED RGB
         * Funciona de forma similar ao LED comum, mas avalia canais de cores independentes.
         */
        if (node.type === 'rgb_led') {
          // Verifica a conexão comum com o terra (GND)
          const hasGnd = edges.some(e => e.target === node.id && e.targetHandle === 'gnd' && nds.find(n => n.id === e.source)?.type === 'gnd');
          
          // Função auxiliar para checar se um canal específico (r, g ou b) está recebendo sinal de um botão
          const checkChannel = (ch) => edges.some(e => e.target === node.id && e.targetHandle === ch && nds.find(n => n.id === e.source)?.data?.pressed);
          
          // Atualiza o estado de cada canal de cor individualmente
          return { ...node, data: { ...node.data, r: checkChannel('r'), g: checkChannel('g'), b: checkChannel('b'), gnd: hasGnd } };
        }

        /** * LÓGICA PARA DISPLAY DE 7 SEGMENTOS
         * Gerencia o acionamento individual de cada segmento (a-g) baseado no GND comum.
         */
        if (node.type === 'digit') {
          // Verifica se o pino comum está aterrado
          const hasGround = edges.some(e => e.target === node.id && e.targetHandle === 'gnd-common' && nds.find(n => n.id === e.source)?.type === 'gnd');
          
          const activeSegments = { a: false, b: false, c: false, d: false, e: false, f: false, g: false };
          
          if (hasGround) {
            // Se houver terra, percorre os fios para ver quais segmentos recebem sinal positivo (VCC)
            edges.forEach(edge => {
              if (edge.target === node.id && edge.targetHandle !== 'gnd-common') {
                if (nds.find(n => n.id === edge.source)?.data?.pressed) {
                  activeSegments[edge.targetHandle] = true;
                }
              }
            });
          }
          return { ...node, data: { ...node.data, activeSegments } };
        }
        
        // Retorna o nó sem alterações caso não seja um componente de saída
        return node;
      })
    );
    
    /** * DEPENDÊNCIAS: O efeito é disparado quando:
     * 1. As conexões (edges) mudam.
     * 2. O estado 'pressed' de qualquer botão muda (monitorado via stringify para performance).
     */
  }, [edges, nodes.map(n => n.data?.pressed).join(','), setNodes]);
};