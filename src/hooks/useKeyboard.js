/**
 * ARQUIVO: useKeyboard.js
 * DESCRIÇÃO: Este Custom Hook gerencia a entrada de dados via teclado.
 * Ele mapeia teclas físicas para ações dentro do simulador, permitindo que 
 * componentes como botões sejam acionados remotamente sem a necessidade de clique.
 */

import { useEffect } from 'react';

export const useKeyboard = (nodes, toggleButton) => {
  useEffect(() => {
    /**
     * Função interna para processar o evento de tecla pressionada.
     */
    const handleKeyDown = (event) => {
      // MECANISMO DE DEBOUNCE: Impede que o sinal "trema" ou dispare múltiplas vezes
      // caso o usuário mantenha a tecla pressionada.
      if (event.repeat) return; 

      // Converte a tecla para minúsculo para garantir consistência (ex: 'A' e 'a')
      const key = event.key.toLowerCase();

      // Busca na lista de nós se existe algum componente do tipo 'button'
      // que possua a tecla disparada configurada em seu 'hotkey'.
      const button = nodes.find(n => n.type === 'button' && n.data.hotkey === key);
      
      // Se encontrar um botão correspondente, executa a função de alternar estado
      if (button) {
        toggleButton(button.id);
      }
    };

    // ADICIONA O OUVINTE: Registra o evento no objeto 'window' do navegador
    window.addEventListener('keydown', handleKeyDown);

    // LIMPEZA (Cleanup): Remove o ouvinte quando o componente é desmontado.
    // Isso evita "memory leaks" e comportamentos estranhos em outras telas do app.
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };

    /**
     * DEPENDÊNCIAS: O hook reinicia se a lista de nós mudar ou se a função 
     * toggleButton for redefinida, garantindo que o mapeamento esteja sempre atualizado.
     */
  }, [nodes, toggleButton]);
};