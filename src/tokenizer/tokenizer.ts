import {Token, TokenHandler} from "../types/types";

export const tokenize = (input: string): Token[] => {
    const tokens: Token[] = [];

    let cursorPos: number = 0
    while (cursorPos < input.length) {
        let token = input[cursorPos];

        const tokenHandler = tokenHandlers.filter((handler) => handler.token.test(token))[0];
        if (tokenHandler) {
            cursorPos += tokenHandler.callback(tokens, input, cursorPos);
        } else {
            throw new Error(`Unexpected token: ${token}`);
        }
    }
    return tokens;
}

const tokenHandlers: TokenHandler[] = [
    { token: /\s/, callback: (tokens, input, cursorPos) => 1 },
    { token: /[(]/, callback: (tokens, input, cursorPos) => {
        tokens.push({ type: 'OpenParenToken' });
        return 1;
        }
    },
    { token: /[)]/, callback: (tokens, input, cursorPos) => {
        tokens.push({ type: 'CloseParenToken' });
        return 1;
        }
    },
    { token: /[a-zA-Z]/, callback: (tokens, input, cursorPos) => {
            let cursorIncrease = 0;
            let word = '';
            while (/[a-zA-Z]/.test(input[cursorPos])) {
                word += input[cursorPos];
                cursorIncrease++;
                cursorPos++;
            }
            tokens.push({ type: 'Identifier', value: word });
            return cursorIncrease
        }
    },
    { token: /[0-9]/, callback: (tokens, input, cursorPos) => {
            let cursorIncrease = 0;
            let number = '';
            while (/[0-9]/.test(input[cursorPos])) {
                number += input[cursorPos];
                cursorIncrease++;
                cursorPos++;
            }
            tokens.push({type: 'NumericLiteral', value: number});
            return cursorIncrease
        }
    },
    { token: /[+]/, callback: (tokens, input, cursorPos) => {
        tokens.push({ type: 'PlusToken' })
        return 1;
        } },
    { token: /[-]/, callback: (tokens, input, cursorPos) => {
        tokens.push({ type: 'MinusToken' })
        return 1;
        }
    },
    { token: /[.]/, callback: (tokens, input, cursorPos) => {
        tokens.push({ type: 'AttributeCallToken' })
        return 1;
        }
    }
]
