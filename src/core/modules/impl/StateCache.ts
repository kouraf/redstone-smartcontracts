import { EvalStateResult } from '@smartweave';

export type StateCache<State> = Map<string, EvalStateResult<State>>;
