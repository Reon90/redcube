import type { State, ReadonlyState } from './state';
export declare function getJson(input: ReadonlyState, output: Partial<State>): Promise<void> | Promise<boolean>;
export declare function getBuffer(input: ReadonlyState, output: Partial<State>): Promise<void>;
export declare function getEnv(input: ReadonlyState, isBuffer: boolean): Promise<any>;
