import React from 'react';
import { Handle, Position } from 'reactflow';

export const DigitNode = ({ data }) => {
    // data.activeSegments é um objeto tipo: { a: true, b: false, ... }
    const segments = data.activeSegments || {};

    const segStyle = (isOn) => ({
        background: isOn ? '#ff0000' : '#220000',
        boxShadow: isOn ? '0 0 10px #ff0000' : 'none',
        position: 'absolute',
        borderRadius: '2px',
        transition: 'all 0.1s'
    });

    return (
        <div style={{ background: '#111', padding: '20px 10px', borderRadius: '4px', border: '2px solid #444', position: 'relative' }}>
            {/* 7 ENTRADAS (A até G) */}
            <Handle type="target" position={Position.Left} id="a" style={{ top: '15%', background: '#777' }} />
            <Handle type="target" position={Position.Left} id="b" style={{ top: '25%', background: '#777' }} />
            <Handle type="target" position={Position.Left} id="c" style={{ top: '35%', background: '#777' }} />
            <Handle type="target" position={Position.Left} id="d" style={{ top: '45%', background: '#777' }} />
            <Handle type="target" position={Position.Left} id="e" style={{ top: '55%', background: '#777' }} />
            <Handle type="target" position={Position.Left} id="f" style={{ top: '65%', background: '#777' }} />
            <Handle type="target" position={Position.Left} id="g" style={{ top: '75%', background: '#777' }} />
            <Handle
                type="target"
                position={Position.Bottom}
                id="gnd-common"
                style={{ background: '#555', left: '50%' }}
            />

            <div style={{ position: 'relative', width: '30px', height: '55px', margin: '0 auto' }}>
                <div style={{ ...segStyle(segments.a), top: 0, left: '4px', width: '22px', height: '5px' }} /> {/* A */}
                <div style={{ ...segStyle(segments.b), top: '4px', right: 0, width: '5px', height: '20px' }} /> {/* B */}
                <div style={{ ...segStyle(segments.c), bottom: '4px', right: 0, width: '5px', height: '20px' }} /> {/* C */}
                <div style={{ ...segStyle(segments.d), bottom: 0, left: '4px', width: '22px', height: '5px' }} /> {/* D */}
                <div style={{ ...segStyle(segments.e), bottom: '4px', left: 0, width: '5px', height: '20px' }} /> {/* E */}
                <div style={{ ...segStyle(segments.f), top: '4px', left: 0, width: '5px', height: '20px' }} /> {/* F */}
                <div style={{ ...segStyle(segments.g), top: '25px', left: '4px', width: '22px', height: '5px' }} /> {/* G */}
            </div>
        </div>
    );
};