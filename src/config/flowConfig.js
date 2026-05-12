/**
 * ARQUIVO: flowConfig.js
 * CAMADA: Configuration / Registry Layer
 * DESCRIÇÃO: Define o mapeamento de tipos de nós e o estado inicial do grafo.
 * Este arquivo é essencial para a extensibilidade do sistema (Open/Closed Principle).
 */

import { ButtonNode } from '../nodes/ButtonNode';
import { LEDNode } from '../nodes/LEDNode';
import { DigitNode } from '../nodes/DigitNode';
import { RGBLEDNode } from '../nodes/RGBLEDNode';
import { SwitchNode } from '../nodes/SwitchNode';
import { ConstantNode } from '../nodes/ConstantNode';
import { FPGANode } from '../nodes/FPGANode';

/**
 * REGISTRO DE TIPOS (nodeTypes):
 * Este objeto mapeia strings identificadoras aos componentes React correspondentes.
 * Quando o React Flow encontra um nó com type: 'fpga', ele consulta este registro
 * para saber qual lógica de renderização e quais Handles (pinos) deve carregar.
 */
export const nodeTypes = {
    button: ButtonNode,
    led: LEDNode,
    digit: DigitNode,
    switch: SwitchNode,
    rgb_led: RGBLEDNode,
    constant: ConstantNode,
    fpga: FPGANode // Integração do Core de Lógica Programável
};

/**
 * ESTADO INICIAL (initialNodes):
 * Define a topografia inicial do circuito ao carregar a aplicação.
 * Útil para testes de integração e validação de fluxo de dados (Smoke Testing).
 */
export const initialNodes = [
    // Instancia um Data Bus na coordenada (50, 50) com valor default 5
    { 
      id: 'const-1', 
      type: 'constant', 
      position: { x: 50, y: 50 }, 
      data: { value: 5 } 
    },
    // Instancia um Display Decodificador na coordenada (250, 50)
    { 
      id: 'digit-1', 
      type: 'digit', 
      position: { x: 250, y: 50 }, 
      data: { value: 0 } 
    }
];