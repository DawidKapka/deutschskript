export type IdentifierToken = { type: 'Identifier', value: string }
export type OpenParenToken = { type: 'OpenParenToken' }
export type CloseParenToken = { type: 'CloseParenToken' }
export type NumericLiteralToken = { type: 'NumericLiteral', value: string }
export type PlusToken = { type: 'PlusToken' }
export type MinusToken = { type: 'MinusToken' }
export type AttributeCallToken = { type: 'AttributeCallToken' }

export type Token =
    | IdentifierToken
    | OpenParenToken
    | CloseParenToken
    | NumericLiteralToken
    | PlusToken
    | MinusToken
    | AttributeCallToken;


export type TokenFunction = (tokens: Token[], input: string, cursorPos: number) => number;
export type TokenHandler = { token: RegExp, callback: TokenFunction };

export type OperatorToken = PlusToken | MinusToken;

export type NumericLiteralNode = { type: 'NumericLiteral', value: string }
export type CallExpressionNode = { type: 'CallExpression', identifier: IdentifierToken, arguments: Node }
export type BinaryExpressionNode = { type: 'BinaryExpression', operator: OperatorToken, left: Node, right: Node }

export type Node =
    | NumericLiteralNode
    | CallExpressionNode
    | BinaryExpressionNode;

export type Program = { body: Node[] };

export type NodeParserFunction = (tokens: Token[], currentToken: number) => [Node, number]
export type NodeParser = { type: string, callback: NodeParserFunction };

export type NodeEmitterCallback = (node: Node) => string;
export type NodeEmitter = { type: string, callback: NodeEmitterCallback };

export type Translation = {js: string, ds: string[]}



    

