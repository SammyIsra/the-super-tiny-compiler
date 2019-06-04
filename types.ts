interface ParenToken {
  type: 'paren',
  value: '(' | ')',
}

interface NumberToken {
  type: 'number',
  value: string,
}

interface StringToken {
  type: 'string',
  value: string,
}

interface NameToken {
  type: 'name',
  value: string
}

/** Lex Token */
export type Token = ParenToken | NumberToken | StringToken | NameToken;

