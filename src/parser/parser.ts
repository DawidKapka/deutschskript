import {
    Program,
    Token,
    Node,
    NodeParser,
    NumericLiteralToken,
    CallExpressionNode,
    OperatorToken, IdentifierNode, IdentifierToken,
} from "../types/types";

export const parse = (tokens: Token[][]): Program => {
    const program: Program = { body: [] };

    tokens.forEach(tokenArray => {
        let currentToken = 0;
        while (currentToken < tokenArray.length) {
            const [node, tokenIncreasement] = parseTokens(tokenArray, currentToken);
            program.body.push(node)
            currentToken += tokenIncreasement;
        }
    })
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
        return parseIdentifierNode(tokens, current);
        }
    }
]

const parseBinaryExpression = (tokens: Token[], current: number): [Node, number] => {
    const left = tokens[current] as NumericLiteralToken;
    const operator = tokens[current + 1];
    const [right, rightIncreasement] = parseTokens(tokens, current + 2);
    return [{ type: 'BinaryExpression', operator: operator as OperatorToken, left, right }, 2 + rightIncreasement];
}

const parseIdentifierNode = (tokens, current) => {
    const identifier = tokens[current];

    if (tokens[current + 1].type === "ChainToken") {
        return parseChainExpression(tokens, current);
    } else if (tokens[current + 1].type === 'OpenParenToken') {
        return parseCallExperssion(identifier as IdentifierToken, tokens, current);
    } else {
        return parseIdentifier(tokens, current);
    }
}

const parseChainExpression = (tokens: Token[], current: number): [Node, number] => {
    const nodes: Node[] = []
    let tokenIncreasement = 2;
    nodes.push(tokens[current] as Node);
    const [nextNode, increasement] = parseIdentifierNode(tokens, current + 2);
    nodes.push(nextNode);
    return [{ type: 'Chain', nodes }, tokenIncreasement + increasement];
}

const parseIdentifier = (tokens: Token[], current: number): [Node, number] => {
    return [tokens[current] as IdentifierNode, 1];
}

const parseCallExperssion = (identifier: IdentifierToken, tokens: Token[], current: number): [Node, number] => {
    if (tokens[current + 2].type === 'CloseParenToken') {
        return [{ type: 'CallExpression', identifier }, 3];
    }
    const [argumentList, argumentIncreasement] = parseTokens(tokens, current + 2)
    return [{ type: 'CallExpression', identifier, arguments: argumentList } as CallExpressionNode, 3 + argumentIncreasement];
}
