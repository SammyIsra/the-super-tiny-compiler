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

  params: ASTBodyNode[];
}

/** Abstract Syntax Tree, the node tree after being parsed by the Parser */
export interface SimpleAST {
  type: "Program";

  body: CallExpressionNode[];
}

/** Single Node, after being processed by the Parser */

export type ASTBodyNode =
  | NumberLiteralNode
  | StringLiteralNode
  | CallExpressionNode;

export type ParserNode = ASTBodyNode | SimpleAST;

/// Old Visitor that I had to comment out since it did not offer flexibility on the type on the 'node' argument
// export type OlderVisitor = Record<
//   ParserNode["type"],
//   {
//     enter?: (node: ParserNode, parent: ParserNode | null) => void;
//     exit?: (node: ParserNode, parent: ParserNode | null) => void;
//   }
// >;

/**
 * Visitor used for the new transformer.
 * It does not use _context as the other Visitor, and is more based around returning the new nodes instead of adding them to _context
 */
export interface ASTVisitor2 {
  /** The Program visitor will only have one usecase: it returns the new AST  */
  Program: {
    enter: (node: SimpleAST) => TransformedAST;
  };

  /**
   * Call Expression visitor will have two use cases:
   *  1. Parent is the root node, therefore return an Expression
   *  2. Parent node is another CallExpression, therefore return a new call expression
   */
  CallExpression: {
    enter:
      | ((
          node: CallExpressionNode,
          parent: SimpleAST
        ) => ExpressionStatementNode)
      | ((
          node: CallExpressionNode,
          parent: CallExpressionNode
        ) => TransformedCallExpressionNode);
  };

  /** String Literal has a simple use case: return a new String Literal */
  StringLiteral: {
    enter: (
      node: NumberLiteralNode,
      parent: CallExpressionNode
    ) => StringLiteralNode;
  };

  /** Number Literal has a simple use case: return a new Number Literal */
  NumberLiteral: {
    enter: (
      node: NumberLiteralNode,
      parent: CallExpressionNode
    ) => NumberLiteralNode;
  };
}

// Transformed AST Types

export interface ExpressionStatementNode {
  type: "ExpressionStatement";
  expression: TransformedCallExpressionNode;
}

export interface TransformedCallExpressionNode {
  type: CallExpressionNode["type"];
  callee: IdentifierNode;
  arguments: TransformedArgumentNode[];
}
/** Type alias for Call, Number, and String nodes */
export type TransformedArgumentNode =
  | TransformedCallExpressionNode
  | NumberLiteralNode
  | StringLiteralNode;

interface IdentifierNode {
  type: "Identifier";
  name: string;
}

export type TransforedASTBodyNode =
  | NumberLiteralNode
  | StringLiteralNode
  | ExpressionStatementNode
  | TransformedCallExpressionNode
  | IdentifierNode;
export type TransformedASTNode = TransforedASTBodyNode | TransformedAST;

export interface TransformedAST {
  type: "Program";
  body: ExpressionStatementNode[];
}
