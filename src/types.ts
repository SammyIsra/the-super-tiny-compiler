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

/// Old Visitor that I had to comment out since it did not offer flexibility on the type on the 'node' argument
// export type OldVisitor = Record<
//   ParserNode["type"],
//   {
//     enter?: (node: ParserNode, parent: ParserNode | null) => void;
//     exit?: (node: ParserNode, parent: ParserNode | null) => void;
//   }
// >;

/**
 * Object that follows the Visitor pattern for our AST.
 * Each option from ParserNode is mapped to an {enter, send} object
 */
export type ASTVisitor = {
  [T in ParserNode["type"]]: {
    enter: (
      node: Extract<ParserNode, { type: T }>,
      parent: ParserNode | null
    ) => void;
    exit: (
      node: Extract<ParserNode, { type: T }>,
      parent: ParserNode | null
    ) => void;
  };
};

// Transformed AST Types

interface ExpressionStatementNode {
  type: "ExpressionStatement";
  expression: TransformedASTNode;
}

interface TransformedCallExpressionNode {
  type: CallExpressionNode["type"];
  callee: {
    type: "Identifier";
    name: string;
  };
  arguments: TransformedASTNode[];
}

export type TransformedASTNode =
  | NumberLiteralNode
  | StringLiteralNode
  | ExpressionStatementNode
  | TransformedCallExpressionNode
  | TransformedAST;

export interface TransformedAST {
  type: "Program";
  body: ExpressionStatementNode[];
}
