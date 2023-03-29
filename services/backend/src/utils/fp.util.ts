import * as E from 'fp-ts/Either';
import * as t from 'io-ts';
import { failure } from 'io-ts/lib/PathReporter';

const decodeOrThrow =
  <EE, A>(
    decode: (a: unknown) => E.Either<t.Errors, A>,
    toError: (e: string[]) => EE,
  ) =>
  (d: unknown): A => {
    const te = decode(d);
    if (te._tag === 'Left') {
      const failures = failure(te.left);
      console.log('failures', failures);
      throw toError(failures);
    }
    return te.right;
  };

export { E, decodeOrThrow };
