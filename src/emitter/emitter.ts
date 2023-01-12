import {
    NodeEmitter,
    Program,
    Node,
    NumericLiteralNode,
    CallExpressionNode,
    BinaryExpressionNode,
    Translation, ChainNode, IdentifierNode
} from "../types/types";
import * as fs from "fs";
import * as path from "path";

export const emit = (program: Program): string => {
    const output: string[] = []
    for (const node of program.body) {
        output.push(emitNode(node))
    }
    console.log(output);
    return output.join('\n')
}

const emitNode = (node: Node): string => {
    if (!node) {
        return '\t';
    }
    const nodeEmitter = nodeEmitters.filter((emitter) => emitter.type === node.type)[0];
    if (nodeEmitter) {
        return nodeEmitter.callback(node);
    } else {
        throw new Error(`Unexpected node type: ${node.type}`);
    }
}

const nodeEmitters: NodeEmitter[] = [
    { type: 'NumericLiteral', callback: (node) => {
            return (node as NumericLiteralNode).value;
        }
    },
    { type: 'CallExpression', callback: (node) => {
            const callExpressionNode = node as CallExpressionNode;
            return translateExpression(callExpressionNode.identifier.value) + '(' + callExpressionNode.arguments ? emitNode(callExpressionNode.arguments) : '' + ')';
        }
    },
    { type: 'BinaryExpression', callback: (node) => {
            const binaryExpressionNode = node as BinaryExpressionNode;
            return emitNode(binaryExpressionNode.left) + (binaryExpressionNode.operator.type === 'PlusToken' ? '+' : '-') + emitNode(binaryExpressionNode.right);
        }
    },
    { type: 'Chain', callback: (node) => {
            const chainNode = node as ChainNode;
            return chainNode.nodes.map((node) => emitNode(node)).join('.');
        }
    },
    { type: 'Identifier', callback: (node) => {
            return translateExpression((node as IdentifierNode).value);
        }
    }
]

const translateExpression = (expression: string): string => {
    const translations: Translation[] = JSON.parse(fs.readFileSync(path.join(__dirname, '../translations/translations.json')).toString());
    const translation: Translation = translations.find((translation: Translation) => translation.ds.includes(expression));
    return translation ? translation.js : expression;
}
