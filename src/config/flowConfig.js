/**
 * ARQUIVO: flowConfig.js
 * DESCRIÇÃO: Este arquivo funciona como o "Mapa de Registro" do simulador.
 * Aqui definimos o inventário de peças disponíveis e o layout inicial da placa.
 * Centralizar essas configurações facilita a adição de novos componentes no futuro.
 */

// Importação dos modelos visuais e lógicos de cada componente de hardware
import { ButtonNode } from '../nodes/ButtonNode';
import { LEDNode } from '../nodes/LEDNode';
import { DigitNode } from '../nodes/DigitNode';
import { GNDNode } from '../nodes/GNDNode';
import { RGBLEDNode } from '../nodes/RGBLEDNode';

/**
 * 1. REGISTRO DOS TIPOS DE NÓS (nodeTypes)
 * Este objeto é o "dicionário" que o React Flow usa para traduzir strings de texto 
 * em componentes React reais. Se você criar um 'type: "and_gate"', deverá registrá-lo aqui.
 */
export const nodeTypes = { 
  button: ButtonNode, 
  led: LEDNode, 
  digit: DigitNode, 
  gnd: GNDNode, 
  rgb_led: RGBLEDNode 
};

/**
 * 2. ESTADO INICIAL DA PLACA (initialNodes)
 * Define os componentes que já nascem posicionados na tela ao carregar o simulador.
 * Útil para criar exemplos prontos ou tutoriais para os usuários.
 */
export const initialNodes = [
  { 
    id: 'sw-1', 
    type: 'button', 
    position: { x: 50, y: 50 }, 
    // Data: propriedades iniciais, como a tecla de atalho mapeada
    data: { pressed: false, hotkey: 'a' } 
  },
  { 
    id: 'led-1', 
    type: 'led', 
    position: { x: 400, y: 50 }, 
    // Data: cor do LED e estado inicial (apagado)
    data: { color: '#ff4444', active: false } 
  },
  { 
    id: 'gnd-1', 
    type: 'gnd', 
    position: { x: 400, y: 300 }, 
    data: {} 
  },
];