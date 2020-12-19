/**
 * @since 3.0.0
 */
import { Alt4 } from './Alt'
import { Applicative4 } from './Applicative'
import { apFirst_, apSecond_, apS_, apT_ } from './Apply'
import { Bifunctor4 } from './Bifunctor'
import * as E from './Either'
import { flow, identity, Lazy, pipe, Predicate, Refinement, tuple } from './function'
import { bindTo_, Functor4 } from './Functor'
import { IO } from './IO'
import { IOEither } from './IOEither'
import { bind_, chainFirst_, Monad4 } from './Monad'
import { MonadIO4 } from './MonadIO'
import { MonadTask4 } from './MonadTask'
import { MonadThrow4 } from './MonadThrow'
import { Option } from './Option'
import { Reader } from './Reader'
import { ReaderEither } from './ReaderEither'
import * as RTE from './ReaderTaskEither'
import { State } from './State'
import { ap_, chain_, evaluate_, execute_, fromF_, fromState_, gets_, get_, map_, modify_, of_, put_ } from './StateT'
import { Task } from './Task'
import { TaskEither } from './TaskEither'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

import ReaderTaskEither = RTE.ReaderTaskEither
import Either = E.Either

/**
 * @category model
 * @since 3.0.0
 */
export interface StateReaderTaskEither<S, R, E, A> {
  (s: S): ReaderTaskEither<R, E, readonly [A, S]>
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 3.0.0
 */
export const left: <S, R, E = never, A = never>(e: E) => StateReaderTaskEither<S, R, E, A> = (e) => () => RTE.left(e)

/**
 * @category constructors
 * @since 3.0.0
 */
export const right: <S, R, E = never, A = never>(a: A) => StateReaderTaskEither<S, R, E, A> =
  /*#__PURE__*/
  of_(RTE.Monad)

/**
 * @category constructors
 * @since 3.0.0
 */
export function rightTask<S, R, E = never, A = never>(ma: Task<A>): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.rightTask(ma))
}

/**
 * @category constructors
 * @since 3.0.0
 */
export function leftTask<S, R, E = never, A = never>(me: Task<E>): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.leftTask(me))
}

/**
 * @category constructors
 * @since 3.0.0
 */
export function fromTaskEither<S, R, E, A>(ma: TaskEither<E, A>): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.fromTaskEither(ma))
}

/**
 * @category constructors
 * @since 3.0.0
 */
export function rightReader<S, R, E = never, A = never>(ma: Reader<R, A>): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.rightReader(ma))
}

/**
 * @category constructors
 * @since 3.0.0
 */
export function leftReader<S, R, E = never, A = never>(me: Reader<R, E>): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.leftReader(me))
}

/**
 * @category constructors
 * @since 3.0.0
 */
export function fromIOEither<S, R, E, A>(ma: IOEither<E, A>): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.fromIOEither(ma))
}

/**
 * @category constructors
 * @since 3.0.0
 */
export function fromReaderEither<S, R, E, A>(ma: ReaderEither<R, E, A>): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.fromReaderEither(ma))
}

/**
 * @category constructors
 * @since 3.0.0
 */
export function rightIO<S, R, E = never, A = never>(ma: IO<A>): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.rightIO(ma))
}

/**
 * @category constructors
 * @since 3.0.0
 */
export function leftIO<S, R, E = never, A = never>(me: IO<E>): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.leftIO(me))
}

/**
 * @category constructors
 * @since 3.0.0
 */
export const rightState: <S, R, E = never, A = never>(ma: State<S, A>) => StateReaderTaskEither<S, R, E, A> = (sa) =>
  flow(sa, RTE.right)

/**
 * @category constructors
 * @since 3.0.0
 */
export const leftState: <S, R, E = never, A = never>(me: State<S, E>) => StateReaderTaskEither<S, R, E, A> = (me) => (
  s
) => RTE.left(me(s)[0])

/**
 * @category constructors
 * @since 3.0.0
 */
export const fromReaderTaskEither: <S, R, E, A>(ma: ReaderTaskEither<R, E, A>) => StateReaderTaskEither<S, R, E, A> =
  /*#__PURE__*/
  fromF_(RTE.Functor)

/**
 * Get the current state
 *
 * @category constructors
 * @since 3.0.0
 */
export const get: <S, R, E = never>() => StateReaderTaskEither<S, R, E, S> =
  /*#__PURE__*/
  get_(RTE.Monad)

/**
 * Set the state
 *
 * @category constructors
 * @since 3.0.0
 */
export const put: <S, R, E = never>(s: S) => StateReaderTaskEither<S, R, E, void> =
  /*#__PURE__*/
  put_(RTE.Monad)

/**
 * Modify the state by applying a function to the current state
 *
 * @category constructors
 * @since 3.0.0
 */
export const modify: <S, R, E = never>(f: (s: S) => S) => StateReaderTaskEither<S, R, E, void> =
  /*#__PURE__*/
  modify_(RTE.Monad)

/**
 * Get a value which depends on the current state
 *
 * @category constructors
 * @since 3.0.0
 */
export const gets: <S, R, E = never, A = never>(f: (s: S) => A) => StateReaderTaskEither<S, R, E, A> =
  /*#__PURE__*/
  gets_(RTE.Monad)

/**
 * @category constructors
 * @since 3.0.0
 */
export const fromState: <S, A, R, E>(sa: State<S, A>) => StateReaderTaskEither<S, R, E, A> =
  /*#__PURE__*/
  fromState_(RTE.Monad)

/**
 * Derivable from `MonadThrow`.
 *
 * @category constructors
 * @since 3.0.0
 */
export const fromEither: <S, R, E, A>(ma: Either<E, A>) => StateReaderTaskEither<S, R, E, A> =
  /*#__PURE__*/
  E.fold((e) => left(e), right)

/**
 * Derivable from `MonadThrow`.
 *
 * @category constructors
 * @since 3.0.0
 */
export const fromOption: <E>(onNone: Lazy<E>) => <S, R, A>(ma: Option<A>) => StateReaderTaskEither<S, R, E, A> = (
  onNone
) => (ma) => (ma._tag === 'None' ? left(onNone()) : right(ma.value))

/**
 * Derivable from `MonadThrow`.
 *
 * @category constructors
 * @since 3.0.0
 */
export const fromPredicate: {
  <A, B extends A, E>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <S, R>(
    a: A
  ) => StateReaderTaskEither<S, R, E, B>
  <A, E>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R>(a: A) => StateReaderTaskEither<S, R, E, A>
} = <A, E>(predicate: Predicate<A>, onFalse: (a: A) => E) => <S, R>(a: A): StateReaderTaskEither<S, R, E, A> =>
  predicate(a) ? right(a) : left(onFalse(a))

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 3.0.0
 */
export function fromEitherK<E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => Either<E, B>
): <S, R>(...a: A) => StateReaderTaskEither<S, R, E, B> {
  return (...a) => fromEither(f(...a))
}

/**
 * Less strict version of [`chainEitherK`](#chainEitherK).
 *
 * @category combinators
 * @since 3.0.0
 */
export const chainEitherKW = <A, E2, B>(f: (a: A) => Either<E2, B>) => <S, R, E1>(
  ma: StateReaderTaskEither<S, R, E1, A>
): StateReaderTaskEither<S, R, E1 | E2, B> => pipe(ma, chainW<A, S, R, E2, B>(fromEitherK(f)))

/**
 * @category combinators
 * @since 3.0.0
 */
export const chainEitherK: <E, A, B>(
  f: (a: A) => Either<E, B>
) => <S, R>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B> = chainEitherKW

/**
 * @category combinators
 * @since 3.0.0
 */
export function fromIOEitherK<E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => IOEither<E, B>
): <S, R>(...a: A) => StateReaderTaskEither<S, R, E, B> {
  return (...a) => fromIOEither(f(...a))
}

/**
 * Less strict version of [`chainIOEitherK`](#chainIOEitherK).
 *
 * @category combinators
 * @since 3.0.0
 */
export const chainIOEitherKW = <A, E2, B>(f: (a: A) => IOEither<E2, B>) => <S, R, E1>(
  ma: StateReaderTaskEither<S, R, E1, A>
): StateReaderTaskEither<S, R, E1 | E2, B> => pipe(ma, chainW<A, S, R, E2, B>(fromIOEitherK(f)))

/**
 * @category combinators
 * @since 3.0.0
 */
export const chainIOEitherK: <E, A, B>(
  f: (a: A) => IOEither<E, B>
) => <S, R>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B> = chainIOEitherKW

/**
 * @category combinators
 * @since 3.0.0
 */
export function fromTaskEitherK<E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => TaskEither<E, B>
): <S, R>(...a: A) => StateReaderTaskEither<S, R, E, B> {
  return (...a) => fromTaskEither(f(...a))
}

/**
 * Less strict version of [`chainTaskEitherK`](#chainTaskEitherK).
 *
 * @category combinators
 * @since 3.0.0
 */
export const chainTaskEitherKW = <A, E2, B>(f: (a: A) => TaskEither<E2, B>) => <S, R, E1>(
  ma: StateReaderTaskEither<S, R, E1, A>
): StateReaderTaskEither<S, R, E1 | E2, B> => pipe(ma, chainW<A, S, R, E2, B>(fromTaskEitherK(f)))

/**
 * @category combinators
 * @since 3.0.0
 */
export const chainTaskEitherK: <E, A, B>(
  f: (a: A) => TaskEither<E, B>
) => <S, R>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B> = chainTaskEitherKW

/**
 * @category combinators
 * @since 3.0.0
 */
export function fromReaderTaskEitherK<R, E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => ReaderTaskEither<R, E, B>
): <S>(...a: A) => StateReaderTaskEither<S, R, E, B> {
  return (...a) => fromReaderTaskEither(f(...a))
}

/**
 * Less strict version of [`chainReaderTaskEitherK`](#chainReaderTaskEitherK).
 *
 * @category combinators
 * @since 3.0.0
 */
export const chainReaderTaskEitherKW = <A, R, E2, B>(f: (a: A) => ReaderTaskEither<R, E2, B>) => <S, E1>(
  ma: StateReaderTaskEither<S, R, E1, A>
): StateReaderTaskEither<S, R, E1 | E2, B> => pipe(ma, chainW<A, S, R, E2, B>(fromReaderTaskEitherK(f)))

/**
 * @category combinators
 * @since 3.0.0
 */
export const chainReaderTaskEitherK: <R, E, A, B>(
  f: (a: A) => ReaderTaskEither<R, E, B>
) => <S>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B> = chainReaderTaskEitherKW

/**
 * Less strict version of [`filterOrElse`](#filterOrElse).
 *
 * @since 3.0.0
 */
export const filterOrElseW: {
  <A, B extends A, E2>(refinement: Refinement<A, B>, onFalse: (a: A) => E2): <S, R, E1>(
    ma: StateReaderTaskEither<S, R, E1, A>
  ) => StateReaderTaskEither<S, R, E1 | E2, B>
  <A, E2>(predicate: Predicate<A>, onFalse: (a: A) => E2): <S, R, E1>(
    ma: StateReaderTaskEither<S, R, E1, A>
  ) => StateReaderTaskEither<S, R, E1 | E2, A>
} = <A, E2>(
  predicate: Predicate<A>,
  onFalse: (a: A) => E2
): (<S, R, E1>(ma: StateReaderTaskEither<S, R, E1, A>) => StateReaderTaskEither<S, R, E1 | E2, A>) =>
  chainW((a) => (predicate(a) ? right(a) : left(onFalse(a))))

/**
 * Derivable from `MonadThrow`.
 *
 * @category combinators
 * @since 3.0.0
 */
export const filterOrElse: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <S, R>(
    ma: StateReaderTaskEither<S, R, E, A>
  ) => StateReaderTaskEither<S, R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R>(
    ma: StateReaderTaskEither<S, R, E, A>
  ) => StateReaderTaskEither<S, R, E, A>
} = filterOrElseW

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 3.0.0
 */
export const map: <A, B>(
  f: (a: A) => B
) => <S, R, E>(fa: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B> =
  /*#__PURE__*/
  map_(RTE.Functor)

/**
 * Map a pair of functions over the two last type arguments of the bifunctor.
 *
 * @category Bifunctor
 * @since 3.0.0
 */
export const bimap: Bifunctor4<URI>['bimap'] = (f, g) => (fea) => (s) =>
  pipe(
    fea(s),
    RTE.bimap(f, ([a, s]) => [g(a), s])
  )

/**
 * Map a function over the third type argument of a bifunctor.
 *
 * @category Bifunctor
 * @since 3.0.0
 */
export const mapLeft: Bifunctor4<URI>['mapLeft'] = (f) => (fea) => (s) => pipe(fea(s), RTE.mapLeft(f))

/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 3.0.0
 */
export const ap: Applicative4<URI>['ap'] =
  /*#__PURE__*/
  ap_(RTE.Monad)

/**
 * Less strict version of [`ap`](#ap).
 *
 * @category Apply
 * @since 3.0.0
 */
export const apW: <S, R2, E2, A>(
  fa: StateReaderTaskEither<S, R2, E2, A>
) => <R1, E1, B>(
  fab: StateReaderTaskEither<S, R1, E1, (a: A) => B>
) => StateReaderTaskEither<S, R1 & R2, E1 | E2, B> = ap as any

/**
 * Wrap a value into the type constructor.
 *
 * @category Applicative
 * @since 3.0.0
 */
export const of: Applicative4<URI>['of'] = right

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 3.0.0
 */
export const chain: Monad4<URI>['chain'] =
  /*#__PURE__*/
  chain_(RTE.Monad)

/**
 * Less strict version of [`chain`](#chain).
 *
 * @category Monad
 * @since 3.0.0
 */
export const chainW: <A, S, R2, E2, B>(
  f: (a: A) => StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(ma: StateReaderTaskEither<S, R1, E1, A>) => StateReaderTaskEither<S, R1 & R2, E1 | E2, B> = chain as any

/**
 * Derivable from `Monad`.
 *
 * @category derivable combinators
 * @since 3.0.0
 */
export const flatten: <S, R, E, A>(
  mma: StateReaderTaskEither<S, R, E, StateReaderTaskEither<S, R, E, A>>
) => StateReaderTaskEither<S, R, E, A> =
  /*#__PURE__*/
  chain(identity)

/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 3.0.0
 */
export const altW = <S, R2, E2, B>(second: () => StateReaderTaskEither<S, R2, E2, B>) => <R1, E1, A>(
  first: StateReaderTaskEither<S, R1, E1, A>
): StateReaderTaskEither<S, R1 & R2, E1 | E2, A | B> => (r) =>
  pipe(
    first(r),
    RTE.altW(() => second()(r))
  )

/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 3.0.0
 */
export const alt: Alt4<URI>['alt'] = altW

/**
 * @category MonadIO
 * @since 3.0.0
 */
export const fromIO: MonadIO4<URI>['fromIO'] = rightIO

/**
 * @category MonadTask
 * @since 3.0.0
 */
export const fromTask: MonadTask4<URI>['fromTask'] = rightTask

/**
 * @category MonadThrow
 * @since 3.0.0
 */
export const throwError: MonadThrow4<URI>['throwError'] = left

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @category instances
 * @since 3.0.0
 */
export const URI = 'StateReaderTaskEither'

/**
 * @category instances
 * @since 3.0.0
 */
export type URI = typeof URI

declare module './HKT' {
  interface URItoKind4<S, R, E, A> {
    readonly [URI]: StateReaderTaskEither<S, R, E, A>
  }
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Functor: Functor4<URI> = {
  URI,
  map
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Applicative: Applicative4<URI> = {
  URI,
  map,
  ap,
  of
}

/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category derivable combinators
 * @since 3.0.0
 */
export const apFirst: <S, R, E, B>(
  second: StateReaderTaskEither<S, R, E, B>
) => <A>(first: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A> =
  /*#__PURE__*/
  apFirst_(Applicative)

/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category derivable combinators
 * @since 3.0.0
 */
export const apSecond: <S, R, E, B>(
  second: StateReaderTaskEither<S, R, E, B>
) => <A>(first: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B> =
  /*#__PURE__*/
  apSecond_(Applicative)

/**
 * @category instances
 * @since 3.0.0
 */
export const Bifunctor: Bifunctor4<URI> = {
  URI,
  bimap,
  mapLeft
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Alt: Alt4<URI> = {
  URI,
  map,
  alt
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Monad: Monad4<URI> = {
  URI,
  map,
  of,
  chain
}

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Monad`.
 *
 * @category derivable combinators
 * @since 3.0.0
 */
export const chainFirst: <A, S, R, E, B>(
  f: (a: A) => StateReaderTaskEither<S, R, E, B>
) => (first: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A> =
  /*#__PURE__*/
  chainFirst_(Monad)

/**
 * Less strict version of [`chainFirst`](#chainFirst).
 *
 * @category combinators
 * @since 3.0.0
 */
export const chainFirstW: <A, S, R2, E2, B>(
  f: (a: A) => StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(
  first: StateReaderTaskEither<S, R1, E1, A>
) => StateReaderTaskEither<S, R1 & R2, E1 | E2, A> = chainFirst as any

/**
 * @category instances
 * @since 3.0.0
 */
export const MonadTask: MonadTask4<URI> = {
  URI,
  fromIO,
  fromTask
}

/**
 * @category instances
 * @since 3.0.0
 */
export const MonadThrow: MonadThrow4<URI> = {
  URI,
  throwError
}

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

/**
 * Run a computation in the `StateReaderTaskEither` monad, discarding the final state
 *
 * @since 3.0.0
 */
export const evaluate: <S>(s: S) => <R, E, A>(ma: StateReaderTaskEither<S, R, E, A>) => ReaderTaskEither<R, E, A> =
  /*#__PURE__*/
  evaluate_(RTE.Functor)

/**
 * Run a computation in the `StateReaderTaskEither` monad discarding the result
 *
 * @since 3.0.0
 */
export const execute: <S>(s: S) => <R, E, A>(ma: StateReaderTaskEither<S, R, E, A>) => ReaderTaskEither<R, E, S> =
  /*#__PURE__*/
  execute_(RTE.Functor)

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const bindTo: <N extends string>(
  name: N
) => <S, R, E, A>(fa: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, { [K in N]: A }> =
  /*#__PURE__*/
  bindTo_(Functor)

/**
 * @since 3.0.0
 */
export const bind: <N extends string, A, S, R, E, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => StateReaderTaskEither<S, R, E, B>
) => (
  fa: StateReaderTaskEither<S, R, E, A>
) => StateReaderTaskEither<S, R, E, { [K in keyof A | N]: K extends keyof A ? A[K] : B }> =
  /*#__PURE__*/
  bind_(Monad)

/**
 * Less strict version of [`bind`](#bind).
 *
 * @since 3.0.0
 */
export const bindW: <N extends string, A, S, R2, E2, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(
  fa: StateReaderTaskEither<S, R1, E1, A>
) => StateReaderTaskEither<S, R1 & R2, E1 | E2, { [K in keyof A | N]: K extends keyof A ? A[K] : B }> = bind as any

// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const apS: <A, N extends string, S, R, E, B>(
  name: Exclude<N, keyof A>,
  fb: StateReaderTaskEither<S, R, E, B>
) => (
  fa: StateReaderTaskEither<S, R, E, A>
) => StateReaderTaskEither<S, R, E, { [K in keyof A | N]: K extends keyof A ? A[K] : B }> =
  /*#__PURE__*/
  apS_(Applicative)

/**
 * Less strict version of [`apS`](#apS).
 *
 * @since 3.0.0
 */
export const apSW: <A, N extends string, S, R2, E2, B>(
  name: Exclude<N, keyof A>,
  fb: StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(
  fa: StateReaderTaskEither<S, R1, E1, A>
) => StateReaderTaskEither<S, R1 & R2, E1 | E2, { [K in keyof A | N]: K extends keyof A ? A[K] : B }> = apS as any

// -------------------------------------------------------------------------------------
// pipeable sequence T
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const tupled: <S, R, E, A>(
  a: StateReaderTaskEither<S, R, E, A>
) => StateReaderTaskEither<S, R, E, readonly [A]> = map(tuple)

/**
 * @since 3.0.0
 */
export const apT: <S, R, E, B>(
  fb: StateReaderTaskEither<S, R, E, B>
) => <A extends ReadonlyArray<unknown>>(
  fas: StateReaderTaskEither<S, R, E, A>
) => StateReaderTaskEither<S, R, E, readonly [...A, B]> =
  /*#__PURE__*/
  apT_(Applicative)

/**
 * Less strict version of [`apT`](#apT).
 *
 * @since 3.0.0
 */
export const apTW: <S, R2, E2, B>(
  fb: StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1, A extends ReadonlyArray<unknown>>(
  fas: StateReaderTaskEither<S, R1, E1, A>
) => StateReaderTaskEither<S, R1 & R2, E1 | E2, readonly [...A, B]> = apT as any

// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const traverseArrayWithIndex: <S, R, E, A, B>(
  f: (index: number, a: A) => StateReaderTaskEither<S, R, E, B>
) => (arr: ReadonlyArray<A>) => StateReaderTaskEither<S, R, E, ReadonlyArray<B>> = (f) => (arr) => (s) => (
  r
) => async () => {
  let lastState = s
  // tslint:disable-next-line: readonly-array
  const out = []
  for (let i = 0; i < arr.length; i++) {
    const b = await f(i, arr[i])(lastState)(r)()
    if (E.isLeft(b)) {
      return b
    }
    const [newValue, newState] = b.right
    out.push(newValue)
    lastState = newState
  }
  return E.right([out, lastState])
}

/**
 * @since 3.0.0
 */
export const traverseArray: <S, R, E, A, B>(
  f: (a: A) => StateReaderTaskEither<S, R, E, B>
) => (arr: ReadonlyArray<A>) => StateReaderTaskEither<S, R, E, ReadonlyArray<B>> = (f) =>
  traverseArrayWithIndex((_, a) => f(a))

/**
 * @since 3.0.0
 */
export const sequenceArray: <S, R, E, A>(
  arr: ReadonlyArray<StateReaderTaskEither<S, R, E, A>>
) => StateReaderTaskEither<S, R, E, ReadonlyArray<A>> = traverseArray(identity)
