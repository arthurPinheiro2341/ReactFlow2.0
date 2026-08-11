/**
 * Mapeia eventos globais do teclado para Button e Switch configurados com hotkeys.
 * Ignora a digitação em inputs e restaura botões momentâneos ao liberar a tecla.
 */

import { useEffect } from 'react';

export const useKeyboard = (nodes, setButtonState, toggleButton) => {
  useEffect(() => {
    
    const handleKeyDown = (event) => {
      // Evita acionar componentes enquanto o usuário edita propriedades.
      if (event.target.tagName === 'INPUT' || event.repeat) return;

      const key = event.key.toLowerCase();
      const component = nodes.find(n => n.data.hotkey === key);
      
      if (component) {
        // Button é momentâneo; Switch conserva o estado após a tecla ser liberada.
        if (component.type === 'button') {
          setButtonState(component.id, true);
        } 
        else if (component.type === 'switch') {
          toggleButton(component.id);
        }
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();
      const component = nodes.find(n => n.data.hotkey === key);
      
      if (component && component.type === 'button') {
        setButtonState(component.id, false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Remove os listeners sempre que o hook for reconfigurado ou desmontado.
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };

  }, [nodes, setButtonState, toggleButton]);
};