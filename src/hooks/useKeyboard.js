/**
 * ARQUIVO: useKeyboard.js
 * DESCRIÇÃO: Gerencia o mapeamento do teclado físico para os componentes virtuais.
 * Diferencia entre Botões (pulso ao pressionar/soltar) e Switches (toggle no pressionar).
 */

import { useEffect } from 'react';

export const useKeyboard = (nodes, setButtonState, toggleButton) => {
  useEffect(() => {
    
    // Função disparada ao pressionar uma tecla
    const handleKeyDown = (event) => {
      if (event.target.tagName === 'INPUT' || event.repeat) return;

      const key = event.key.toLowerCase();
      const component = nodes.find(n => n.data.hotkey === key);
      
      if (component) {
        if (component.type === 'button') {
          setButtonState(component.id, true); // Ativa o pulso
        } else if (component.type === 'switch') {
          toggleButton(component.id); // Inverte o estado da alavanca
        }
      }
    };

    // Função disparada ao soltar uma tecla
    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();
      const component = nodes.find(n => n.data.hotkey === key);
      
      // Apenas botões precisam "limpar" o sinal ao soltar a tecla
      if (component && component.type === 'button') {
        setButtonState(component.id, false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };

  }, [nodes, setButtonState, toggleButton]);
};