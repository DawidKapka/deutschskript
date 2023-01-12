import * as fs from 'fs'
import {tokenize} from "./tokenizer/tokenizer";
import * as path from "path";
import {Token} from "./types/types";
import {parse} from "./parser/parser";
import {emit} from "./emitter/emitter";

const tokens: Token[] = tokenize(fs.readFileSync(path.join(__dirname, './example.ds')).toString())

const program = parse(tokens);

fs.writeFileSync(path.join(__dirname, './example.js'), emit(program))
