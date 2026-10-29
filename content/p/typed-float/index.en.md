+++
title = "Float is dynamic typing at the processor level"
date = 2020-06-20
description = "Why working with floating-point numbers brings so much suffering, and a crazy idea for improving it with new data types."

[taxonomies]
tags = ["rust", "math", "thoughts", "typing"]

[extra]
image = "typed-float.png"
tg = "https://t.me/optozorax_dev/226"

[extra.translation]
from = "ru"
by = "Claude Opus 5.5"
+++

# Introduction

This article assumes that you're familiar with Rust and know what algebraic data types (ADTs) are.

Compare these two code examples:

```js
function something(a) {
    if (typeof a === "number") {
        return a*3 + 2;
    } else if (typeof a === "string") {
        return 0;
    }
}
```

```rust
fn something(a: f64) -> f64 {
    if a.is_nan() {
        0.0
    } else if !a.is_finite() {
        1.0
    } else if a == 0.0 {
        1.0
    } else {
        1 / a.abs()
    }
}
```

You'd think these are two completely different languages, and yet the code looks so similar: everything gets __validated__ (for those not in the know: you should [parse, don't validate](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/)). Yes, the thing is that floating-point numbers are, in essence, dynamic typing at the processor level. A float variable can hold many states, and we have to check them if we want to know what's stored there. There is also implicit type coercion between "different" categories, for example `1.0 + NaN = NaN`.

What did people do about dynamic typing in JavaScript? They came up with TypeScript. And life got good. So can we do the same with floating-point numbers?

# NaN

The most basic problem of floating-point numbers is `NaN`. It has a really nasty property: it isn't equal to itself.

Because of this, in Rust we can't store floats in a tree or sort an array of them, that is, we can't implement the `Eq` and `Ord` traits.

If you take `NaN` out of a float, it immediately becomes well-behaved. Schematically, this can be written like this:

```rust
enum Float {
    NaN,
    NotNanFloat(NotNanFloat),
}

enum NotNanFloat { /* ... */ }

impl Eq for NotNanFloat { /* ... */ }
impl Ord for NotNanFloat { /* ... */ }
```

And we can state that an array stores only `NotNanFloat`.

When I was writing [github:confidence](https://github.com/optozorax/confidence), I really missed being able to match on a data structure like this, or to say that I accept only `NotNanFloat`.

The catch is that some operations on `NotNanFloat` can lead to `NaN`, for example: multiplying infinity by zero, dividing by zero. So after any arithmetic we have to convert the type from the wider `Float` back to `NotNanFloat`:

```rust
let a: NotNanFloat = ...;
let b: NotNanFloat = ...;
let c: Float = a * b / (a + b);
let d: NotNanFloat = c.try_into().unwrap();
```

On the one hand, this is actually good, because we won't keep junk in our arrays, and we won't find out at the very end that a huge matrix has been multiplied 100 times with `NaN`s in it: we'll get an error much earlier.

# The madness continues

We can go further and split floats up even more:

```rust
enum NotNanFloat {
    InfiniteFloat(InfiniteFloat),
    FiniteFloat(FiniteFloat),
}

enum InfiniteFloat {
    Negative,
    Positive,
}

enum FiniteFloat { /* ... */ }
```

But there's no longer as serious a reason for this as there was for separating out `NaN`. This kind of split can be used for stricter type checking at compile time.

For example, you can create a type `FloatFrom0ToInf` that contains all positive numbers, zero included. And then say that `fn div_one(down: FloatFrom0ToInf) -> FloatFrom0ToInf`. And in general, work out which types every operation produces from which, and write all of it down in the type system.

Or `NotNanFloat` can be broken down like this:

```rust
enum NotNanFloat {
    PositiveFloat(PositiveFloat),
    NegativeFloat(NegativeFloat),
}

enum PositiveFloat {
    Infinity,
    FinitePositiveFloat(FinitePositiveFloat),
}

enum FinitePositiveFloat { /* ... */ }
```

Here we can make a method:

```rust
fn mul(PositiveFiniteFloat, PositiveFiniteFloat) -> PositiveFloat;
```

Or separate zero from everything else, and you get a division that shouldn't produce `NaN`:

```rust
fn div(FiniteFloat, NonZeroFiniteFloat) -> NonZeroFiniteFloat;
```

And you could also have cool error messages when you try to convert a wider type into a narrower one:

```rust
let a: Float = -1.2;
let b: PositiveFiniteFloat = a.float_unwrap(); // "Can't convert negative float `-1.2` to positive number in line N"
```

Types like these could be very handy in all sorts of library functions. For example, a function that computes the area of a triangle from its three sides and accepts only finite positive numbers, so that it doesn't have to __validate__ them inside:

```rust
fn triangle_area(
    a: PositiveNonZeroFiniteFloat, 
    b: PositiveNonZeroFiniteFloat, 
    c: PositiveNonZeroFiniteFloat,
) -> Option<PositiveNonZeroFiniteFloat> { /* ... */ }
// This function returns `Option<_>` because infinity can come up during the calculations.
```

And there are very many ways to break down `NotNanFloat` like this. For that, Rust would probably need a whole new language construct, a `safe union`, that lets you switch between these representations of `Float`, because they are completely equivalent.

# The same thing, but at the type level

Or this split can be written down differently:

```rust
struct Yes;
struct No;

trait IsFloatParameter {}
impl IsFloatParameter for Yes;
impl IsFloatParameter for No;

struct Float<
    HasNan: IsFloatParameter,
    HasNegativeInfinity: IsFloatParameter,

    HasNegativeFrom1: IsFloatParameter,
    HasNegative1: IsFloatParameter,
    HasNegativeFrom0To1: IsFloatParameter,
    HasNegative0: IsFloatParameter,

    HasPositive0: IsFloatParameter,
    HasPositiveFrom0To1: IsFloatParameter,
    HasPositive1: IsFloatParameter,
    HasPositiveFrom1: IsFloatParameter,

    HasPositiveInfinity: IsFloatParameter,
>(f64);

type NotNanFloat = Float<
    No, 

    Yes, 
    Yes, Yes, Yes, Yes, 
    Yes, Yes, Yes, Yes, 
    Yes,
>;
```

But then you lose the ability to match on the data structure to get the range you need. I don't know which is better.

For a representation like this, the ability to program complex computations at the type level would come in very handy, so that all possible conversions for all possible combinations of floats are derived automatically.

Doing it by hand would take a huge amount of code. Perhaps it would make more sense to solve this problem with dependent types? Or do we need a new abstraction, more powerful than ADTs?

# Compiler support

Also, if such a system ever exists, say, in Rust, it has to be supported by the compiler, like `NonNull` is, so that pattern matching on a float compiles down to the most efficient assembly check instructions, and so that storing such a float in the `PositiveFloat` and `NotNanFloat` enums doesn't waste extra memory.

# Conclusion

Maybe that's why, even in statically typed languages, floating-point numbers with their infinities and `NaN`s cause so much suffering? Maybe these data types would make life a little easier? I don't know. It's just an idea that grew out of a bad case of static typing on the brain.

Dynamic typing in JS easily reduces to static typing, because logically no operation on an `int` should accidentally produce a `string`. With floating-point numbers it's more complicated: all the values are very tightly connected to each other, so simply adding two finite numbers can give infinity, and the ratio of two finite numbers can give `NaN`.

I hope this idea has inspired you.

And if you want to have `NotNanFloat` in your Rust code, you can search for a crate with the keywords `ordered float`.

