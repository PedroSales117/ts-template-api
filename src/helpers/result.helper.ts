import { Result as R, ok, err } from "neverthrow";

export type Result<T, E> = R<T, E>;

export const Ok = ok;
export const Err = err;
