interface ParenToken {
  type: "paren";
  value: "(" | ")";
}

interface NumberToken {
  type: "number";
  value: string;
}

interface StringToken {
  type: "string";
  value: string;
}

interface NameToken {
  type: "name";
  value: string;
}

/** Lex Token */
export type Token = ParenToken | NumberToken | StringToken | NameToken;

interface NumberLiteralNode {
  type: "NumberLiteral";

  /** String representation of a number */
  value: string;
}

interface StringLiteralNode {
  type: "StringLiteral";

  value: string;
}

export interface CallExpressionNode {
  type: "CallExpression";

  /** Name of the calling function */
  name: string;

  params: ParserNode[];
}

/** Abstract Syntax Tree, the node tree after being parsed by the Parser */
export interface SimpleAST {
  type: "Program";

  body: ParserNode[];
}

/** Single Node, after being processed by the Parser */
export type ParserNode =
  | NumberLiteralNode
  | StringLiteralNode
  | CallExpressionNode
  | SimpleAST;

export type Visitor = {
  [key in ParserNode["type"]]: {
    enter?: (node: ParserNode, parent: ParserNode) => void;
    exit?: (node: ParserNode, parent: ParserNode) => void;
  };
}

// TransformedAST Nodes. Name convention will be Transformed<type>Node iif they need to be updated.

interface ExpressionStatementNode {
  type: 'ExpressionStatement',
  expression: TransformedCallExpressionNode
}

interface TransformedCallExpressionNode {
  type: 'CallExpression',
  callee: IdentifierNode,
  arguments: Array<any>
}

interface IdentifierNode {
  type: 'Identifier',
  name: string
}

export interface TransformedAST {
  type: 'Program',
  body: Array<ExpressionStatementNode>
}

/** Single node from the Transformed AST, the AST that is outputted from the transformer */
export type TransformedASTNode = 
  | NumberLiteralNode 
  | StringLiteralNode 
  | ExpressionStatementNode 
  | TransformedCallExpressionNode 
  | TransformedAST 
  | IdentifierNode;