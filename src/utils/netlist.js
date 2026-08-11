/**
 * Deriva uma NetList das conexões mantidas pelo React Flow.
 * Os IDs das portas são exatamente os IDs dos Handles usados em cada edge.
 */
export const createNetlist = (edges = []) => edges.map((edge) => ({
  fromNode: edge.source,
  fromPort: edge.sourceHandle ?? null,
  toNode: edge.target,
  toPort: edge.targetHandle ?? null,
}));

/**
 * Imprime uma linha por conexão para facilitar a inspeção do circuito.
 */
export const printNetlist = (netlist, logger = console.log) => {
  if (netlist.length === 0) {
    logger('[NETLIST] (vazia)');
    return;
  }

  netlist.forEach(({ fromNode, fromPort, toNode, toPort }) => {
    logger(`[NETLIST] ${fromNode}.${fromPort ?? '(porta padrão)'} -> ${toNode}.${toPort ?? '(porta padrão)'}`);
  });
};
