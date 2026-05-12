/**
 * ARQUIVO: useKeyboard.js
 * CAMADA: Input Handling / Event Mapping
 * DESCRIÇÃO: Implementa o mapeamento de periféricos externos (teclado) para 
 * o ambiente virtual. Essencial para simular a interação em tempo real 
 * com painéis de controle industriais.
 */

import { useEffect } from 'react';

export const useKeyboard = (nodes, setButtonState, toggleButton) => {
  useEffect(() => {
    
    /**
     * 1. PROCESSAMENTO DE INTERRUPÇÃO (KeyDown):
     * Atua como o trigger inicial para a mudança de estado.
     */
    const handleKeyDown = (event) => {
      // FILTRO DE CONTEXTO: Impede o acionamento de componentes 
      // quando o usuário está interagindo com a UI (ex: configurando hotkeys).
      if (event.target.tagName === 'INPUT' || event.repeat) return;

      const key = event.key.toLowerCase();
      // Busca no grafo pelo componente que possui a hotkey correspondente.
      const component = nodes.find(n => n.data.hotkey === key);
      
      if (component) {
        // DIFERENCIAÇÃO LÓGICA:
        // Botão (Momentâneo): Requer transição para HIGH (true).
        if (component.type === 'button') {
          setButtonState(component.id, true);
        } 
        // Switch (Retenção): Alterna o estado (Toggling logic).
        else if (component.type === 'switch') {
          toggleButton(component.id);
        }
      }
    };

    /**
     * 2. RESET DE ESTADO (KeyUp):
     * Garante o comportamento "Pull-Down" para botões momentâneos.
     */
    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();
      const component = nodes.find(n => n.data.hotkey === key);
      
      // Hardware Mapping: Apenas botões retornam para LOW ao soltar a tecla.
      // Switches mantêm o estado (Latch behavior), ignorando o KeyUp.
      if (component && component.type === 'button') {
        setButtonState(component.id, false);
      }
    };

    // Registro de Event Listeners globais no objeto Window.
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // CLEANUP PATTERN: Previne memory leaks e execução de eventos 
    // em componentes já destruídos (unmounted).
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };

  }, [nodes, setButtonState, toggleButton]);
};