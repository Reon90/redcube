import type { ParseContext, ReadonlyParseContext } from './parseContext';
export declare function getJson(input: ReadonlyParseContext, output: Partial<ParseContext>): Promise<void> | Promise<boolean>;
export declare function getBuffer(input: ReadonlyParseContext, output: Partial<ParseContext>): Promise<void>;
export declare function getEnv(input: ReadonlyParseContext, isBuffer: boolean): Promise<any>;
