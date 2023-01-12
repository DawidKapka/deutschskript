import {Program, Token, Node, NodeParser, NumericLiteralToken, CallExpressionNode, OperatorToken} from "../types/types";

export const parse = (tokens: Token[]): Program => {
    const program: Program = { body: [] };

    let currentToken = 0;

    while (currentToken < tokens.length) {
        const [node, tokenIncreasement] = parseTokens(tokens, currentToken);
        program.body.push(node)
        currentToken += tokenIncreasement;
    }
    return program;
}

const parseTokens = (tokens: Token[], current: number): [Node, number] => {
    const nodeParser = nodeParsers.filter((parser) => parser.type === tokens[current].type)[0];
    if (nodeParser) {
        return nodeParser.callback(tokens, current);
    } else {
        throw new Error(`Unexpected token: ${tokens[current].type}`);
    }
}

const nodeParsers: NodeParser[] = [
    { type: 'NumericLiteral', callback: (tokens: Token[], current) => {
            if (tokens[current + 1].type === "PlusToken" || tokens[current + 1].type === "MinusToken") {
                return parseBinaryExpression(tokens, current);
            } else {
                return [tokens[current] as NumericLiteralToken, 1];
            }
        }
    },
    { type: 'Identifier', callback: (tokens: Token[], current: number) => {
            const identifier = tokens[current];
            if (tokens[current + 1].type !== 'OpenParenToken') {
                throw new SyntaxError("Expected '(' after identifier");
            }
            const [argumentList, argumentIncreasement] = parseTokens(tokens, current + 2)

            if (tokens[current + 2 + argumentIncreasement].type !== 'CloseParenToken') {
                throw new SyntaxError("Expected ')' after identifier");
            }

            return [{ type: 'CallExpression', identifier, arguments: argumentList } as CallExpressionNode, 3 + argumentIncreasement];
        }
    }
]

const parseBinaryExpression = (tokens: Token[], current: number): [Node, number] => {
    const left = tokens[current] as NumericLiteralToken;
    const operator = tokens[current + 1];
    const [right, rightIncreasement] = parseTokens(tokens, current + 2);
    return [{ type: 'BinaryExpression', operator: operator as OperatorToken, left, right }, 2 + rightIncreasement];
}
