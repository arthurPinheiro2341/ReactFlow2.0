/**
 * Registro central dos componentes visuais aceitos como tipos de node pelo React Flow.
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
 * Cada chave corresponde ao campo type persistido nos nodes e presets.
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
 * Lista opcional de nodes iniciais, mantida vazia na configuração atual.
 */
export const initialNodes = [
    
];