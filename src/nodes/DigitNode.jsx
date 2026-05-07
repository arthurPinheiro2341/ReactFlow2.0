/**
 * ARQUIVO: DigitNode.jsx
 * DESCRIÇÃO: Representação visual de um Display de 7 Segmentos (Catodo Comum).
 * Este componente recebe sinais individuais para cada segmento (A até G) e
 * um sinal de aterramento (GND). Ele renderiza graficamente os LEDs acesos 
 * formando números ou letras.
 */

import React from 'react';
import { Handle, Position } from 'reactflow';

export const DigitNode = ({ data }) => {
    // Recupera o estado de cada segmento (true = aceso, false = apagado)
    // data.activeSegments é provido pela lógica de circuito no useCircuit.js
    const segments = data.activeSegments || {};

    /**
     * Função auxiliar para gerar o estilo dinâmico de cada segmento.
     * Define a cor (vermelho brilhante ou bordô escuro) e o efeito de brilho (glow).
     */
    const segStyle = (isOn) => ({
        background: isOn ? '#ff0000' : '#220000', // Vermelho vivo se ativo, quase preto se inativo
        boxShadow: isOn ? '0 0 10px #ff0000' : 'none', // Efeito neon quando o segmento está ligado
        position: 'absolute',
        borderRadius: '2px',
        transition: 'all 0.1s' // Suaviza a transição entre aceso/apagado
    });

    return (
        <div style={{ 
            background: '#111', 
            padding: '20px 10px', 
            borderRadius: '4px', 
            border: '2px solid #444', 
            position: 'relative' 
        }}>
            {/* 7 ENTRADAS DE SINAL (A até G)
                Cada Handle representa um pino de entrada para um segmento específico.
                Posicionados à esquerda para facilitar a conexão com barramentos de dados.
            */}
            <Handle type="target" position={Position.Left} id="a" style={{ top: '15%', background: '#777' }} />
            <Handle type="target" position={Position.Left} id="b" style={{ top: '25%', background: '#777' }} />
            <Handle type="target" position={Position.Left} id="c" style={{ top: '35%', background: '#777' }} />
            <Handle type="target" position={Position.Left} id="d" style={{ top: '45%', background: '#777' }} />
            <Handle type="target" position={Position.Left} id="e" style={{ top: '55%', background: '#777' }} />
            <Handle type="target" position={Position.Left} id="f" style={{ top: '65%', background: '#777' }} />
            <Handle type="target" position={Position.Left} id="g" style={{ top: '75%', background: '#777' }} />
            
            {/* PINO DE TERRA COMUM (GND)
                Localizado na parte inferior do componente.
            */}
            <Handle
                type="target"
                position={Position.Bottom}
                id="gnd-common"
                style={{ background: '#555', left: '50%' }}
            />

            {/* REPRESENTAÇÃO GEOMÉTRICA DO DISPLAY
                Container relativo onde os 7 segmentos são posicionados de forma absoluta
                seguindo o padrão industrial de displays de 7 segmentos.
            */}
            <div style={{ position: 'relative', width: '30px', height: '55px', margin: '0 auto' }}>
                {/* Segmento Superior */}
                <div style={{ ...segStyle(segments.a), top: 0, left: '4px', width: '22px', height: '5px' }} />
                
                {/* Segmentos Laterais Superiores */}
                <div style={{ ...segStyle(segments.b), top: '4px', right: 0, width: '5px', height: '20px' }} />
                <div style={{ ...segStyle(segments.f), top: '4px', left: 0, width: '5px', height: '20px' }} />
                
                {/* Segmento Central (Meio) */}
                <div style={{ ...segStyle(segments.g), top: '25px', left: '4px', width: '22px', height: '5px' }} />
                
                {/* Segmentos Laterais Inferiores */}
                <div style={{ ...segStyle(segments.c), bottom: '4px', right: 0, width: '5px', height: '20px' }} />
                <div style={{ ...segStyle(segments.e), bottom: '4px', left: 0, width: '5px', height: '20px' }} />
                
                {/* Segmento Inferior (Base) */}
                <div style={{ ...segStyle(segments.d), bottom: 0, left: '4px', width: '22px', height: '5px' }} />
            </div>
        </div>
    );
};