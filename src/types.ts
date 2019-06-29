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

/** When something has a context property */
export interface WithContext {
  _context: TransformedASTNode[];
}

interface NumberLiteralNode {
  type: "NumberLiteral";

  /** String representation of a number */
  value: string;

  /** Link to parent context */
  _context?: TransformedASTNode[];
}

interface StringLiteralNode {
  type: "StringLiteral";

  value: string;

  /** Link to parent context */
  _context?: TransformedASTNode[];
}

export interface CallExpressionNode {
  type: "CallExpression";

  /** Name of the calling function */
  name: string;

  params: ParserNode[];

  /** Link to parent context */
  _context?: TransformedASTNode[];
}

/** Abstract Syntax Tree, the node tree after being parsed by the Parser */
export interface SimpleAST {
  type: "Program";

  body: ParserNode[];

  /** Link to parent context */
  _context?: TransformedASTNode[];
}

/** Single Node, after being processed by the Parser */
export type ParserNode =
  | NumberLiteralNode
  | StringLiteralNode
  | CallExpressionNode
  | SimpleAST;

/// Old Visitor that I had to comment out since it did not offer flexibility on the type on the 'node' argument
// export type OlderVisitor = Record<
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
      parent: (ParserNode & WithContext) | null
    ) => void;
    exit: (
      node: Extract<ParserNode, { type: T }>,
      parent: (ParserNode & WithContext) | null
    ) => void;
  };
};

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
  expression: TransformedASTNode;
}

export interface TransformedCallExpressionNode {
  type: CallExpressionNode["type"];
  callee: IdentifierNode;
  arguments: TransformedASTNode[];
}

interface IdentifierNode {
  type: "Identifier";
  name: string;
}

export type TransformedASTNode =
  | NumberLiteralNode
  | StringLiteralNode
  | ExpressionStatementNode
  | TransformedCallExpressionNode
  | IdentifierNode
  | TransformedAST;

export interface TransformedAST {
  type: "Program";
  body: ExpressionStatementNode[];
}
