/**
 * ARQUIVO: BoardNode.jsx
 * DESCRIÇÃO: Nó de fundo (Placa) redimensionável que aceita uma imagem URL.
 */

import React from 'react';
import { NodeResizer } from 'reactflow';

export const BoardNode = ({ id, data, selected }) => {
  const resizerHandleStyle = {
    width: '16px', height: '16px', background: '#00ff00',
    border: '2px solid #ffffff', borderRadius: '50%', zIndex: 100
  };

  // CORREÇÃO AQUI: Transforma barras invertidas (\) em barras normais (/)
  // Isso garante que o caminho "src\assets\imagem.png" vire "src/assets/imagem.png"
  const imageUrl = data.imageUrl ? data.imageUrl.replace(/\\/g, '/') : '';

  return (
    <>
      <NodeResizer 
        color="#00ff00" 
        isVisible={selected} 
        minWidth={300} 
        minHeight={300}
        handleStyle={resizerHandleStyle} 
      />
      
      <div style={{
        width: '100%', height: '100%',
        // Passamos a usar a variável tratada 'imageUrl' aqui em vez de 'data.imageUrl'
        backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
        backgroundColor: '#111',
        backgroundSize: '100% 100%', 
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        border: '4px solid #333',
        borderRadius: '12px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
        position: 'relative'
      }}>
        
        {/* TEXTO DE AVISO */}
        {!imageUrl && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            color: '#444', fontFamily: 'monospace', fontSize: '24px', fontWeight: 'bold', 
            textAlign: 'center', pointerEvents: 'none', userSelect: 'none'
          }}>
            PLACA BASE
            <div style={{ fontSize: '12px', marginTop: '10px' }}>
              (Cole o link da imagem na aba lateral)
            </div>
          </div>
        )}
        
      </div>
    </>
  );
};