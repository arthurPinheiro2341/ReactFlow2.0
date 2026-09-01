# WebPGA

Plataforma web para criação e configuração visual de circuitos e sistemas
baseados em FPGA, desenvolvida como parte de um projeto de Iniciação
Científica na Universidade Federal de Ouro Preto (UFOP).

O projeto utiliza uma interface baseada em nós para permitir a construção
visual de circuitos, conectando componentes digitais e dispositivos de
entrada e saída de maneira interativa.

> Projeto em desenvolvimento.

## Objetivo

O WebPGA busca fornecer uma interface acessível para construção e futura
simulação de sistemas baseados em FPGA diretamente pelo navegador,
reduzindo a dependência de hardware físico durante etapas de aprendizado,
prototipação e experimentação.

A versão atual concentra-se principalmente no editor visual e na
representação dos circuitos. A arquitetura foi estruturada considerando
uma futura integração com Verilator e WebAssembly para execução das
simulações no navegador.

## Funcionalidades

Atualmente, a aplicação permite:

- Criar circuitos por meio de uma interface visual baseada em nós;
- Adicionar e configurar diferentes componentes digitais;
- Criar conexões entre entradas e saídas dos componentes;
- Gerar uma netlist a partir das conexões do circuito;
- Agrupar e desagrupar componentes;
- Editar propriedades individuais dos elementos;
- Salvar circuitos em arquivos JSON;
- Carregar presets previamente salvos;
- Validar a estrutura dos presets antes do carregamento;
- Realizar propagação simplificada de sinais para testes da interface.

## Componentes

Entre os componentes disponíveis estão:

- FPGA;
- Botões;
- Switches;
- LEDs;
- LED RGB;
- Clock;
- Constantes;
- GND;
- Displays;
- Dígitos.

Novos componentes podem ser incorporados à arquitetura conforme a
evolução do projeto.

## Tecnologias

- React
- JavaScript
- React Flow
- Vite
- HTML
- CSS
- Git / GitHub

## Arquitetura

De forma simplificada, a aplicação é organizada em:

React Flow / Editor Visual
        ↓
Nodes e Edges
        ↓
Netlist
        ↓
Propagação de sinais / Mock
        ↓
Futura integração Verilator + WebAssembly

O React Flow é responsável pela representação e edição visual do circuito.

As conexões criadas pelo usuário são armazenadas como `edges` e utilizadas
para derivar a netlist do circuito. A propagação atualmente existente é
utilizada para validar a interação entre os componentes e está separada da
futura infraestrutura de simulação com Verilator.

## Executando o projeto

### Pré-requisitos

- Node.js
- npm

### Instalação

Clone o repositório:

```bash
git clone https://github.com/arthurPinheiro2341/ReactFlow_WEBPGA.git
