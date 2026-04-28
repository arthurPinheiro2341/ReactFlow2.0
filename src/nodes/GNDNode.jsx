import React from 'react';
import { Handle, Position } from 'reactflow';

export const GNDNode = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ width: '30px', height: '2px', background: '#fff', marginBottom: '3px' }} />
    <div style={{ width: '20px', height: '2px', background: '#fff', marginBottom: '3px' }} />
    <div style={{ width: '10px', height: '2px', background: '#fff' }} />
    <Handle type="source" position={Position.Top} id="gnd-out" style={{ background: '#555' }} />
  </div>
);