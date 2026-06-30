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
import { ClockNode } from '../nodes/ClockNode';
import { DisplayNode } from '../nodes/DisplayNode';
import { GroupNode } from '../components/GroupNode';
import { BoardNode } from '../components/BoardNode'; 

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
    display: DisplayNode,
    clock: ClockNode,
    groupNode: GroupNode,
    fpga: FPGANode,
    board: BoardNode 
};

/**
 * ESTADO INICIAL (initialNodes):
 * Define a topografia inicial do circuito ao carregar a aplicação.
 * Útil para testes de integração e validação de fluxo de dados (Smoke Testing).
 */
export const initialNodes = [
    
];