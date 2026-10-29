+++
title = "fopply — my program for step-by-step algebraic calculations"
date = 2021-09-06
description = "This program lets you do algebraic calculations step by step and stay in control of them. It works by smartly applying formulas to the original expression. Here is the devlog of the program together with a description of the idea behind it."

[taxonomies]
tags = ["ideas", "math", "fopply", "programming", "rust"]

[extra]
image = "246.jpg"

[extra.translation]
from = "ru"
by = "Claude Opus 5.5"
+++

# Introduction

This article is a collection of all my posts about fopply from Telegram. I gathered them in one place so that they're easier to read, the information doesn't get lost, and search engines can index it.

Each individual post is marked by its publication date. After the heading there is a link to the Telegram posts it was taken from.

# 12.03.2020

> **Source (in Russian):**
[`tg/83`](https://t.me/optozorax_dev/83),
[`tg/84`](https://t.me/optozorax_dev/84).

This morning I got an irresistible urge to write a small piece of a calculator that works on formulas. Here's the gist of it: we have formulas and expressions. We can apply formulas to expressions to transform them into a different form.  
  
I threw together a program that parses formulas and expressions from strings and performs this "formula application".  
  
For example, we have the formula:  
```
a+b <-> b+a  
```

where the `<->` symbol means that we can transform the left side into the right side and vice versa.  
  
Then if we apply this formula to the expression:  
```
x*y*(c+d) + a*b*c
```

we get:  
```
a*b*c + x*y*(c+d)  
```

Which is exactly what my program does.  
  
[Here's the code](https://github.com/optozorax/fopply/tree/f95111d40a2c3a6a729c2a907f2d1ec750022106). It came out small: 168 lines of code.  
  
To represent an expression I used the following enum:  
  
```rust
enum Tree {
    Function {
        name: String,
        args: Vec<Tree>,
    },
    Variable {
        name: String,
    }
}
```

Where `Function::name` can be `"+"`, `"*"`, `"sin"`, or really any function at all.  

First, using [rust-peg](https://github.com/kevinmehall/rust-peg), I parse the formula string into this data structure.  
  
Then there's the `find_bindings` function, which takes a formula and an expression and returns which variables of the formula correspond to which subexpressions of the main expression. It's best shown with an example:  
  
```
find_bindings("a+b", "x*y*(c+d) + a*b*c") -> 
[
  ("a", "x*y*(c+d)"),
  ("b", "a*b*c")
]
```

Then there's the `apply` function, which takes these bindings and the other side of the formula, and replaces every occurrence of the variables in the formula with the expressions:  
  
```
apply("b+a", bindings) -> "a*b*c + x*y*(c+d)"  
```

Essentially, these two functions are the core of all the computation. They're written in a functional, recursive style, which turned out really cool, but also scary (for the uninitiated).  
  
Plans for further development:  
* I want to make it possible to derive some formulas from others,  
* writing all of this in a text file (see `formulas.txt`)  
* grow it to match the functionality of my old project for transforming expressions (which, God willing, I'll tell you about later)

{% <figure caption="This is what the program's output looks like"> %}
{{ <image path="84.jpg" /> }}
{% </figure> %}

# 15.03.2020

> **Source (in Russian):**
[`tg/93`](https://t.me/optozorax_dev/93),
[`tg/94`](https://t.me/optozorax_dev/94),
[`tg/95`](https://t.me/optozorax_dev/95),
[`tg/97`](https://t.me/optozorax_dev/97),
[`tg/98`](https://t.me/optozorax_dev/98).


So, in my calculator program I added grammar rules so that subtraction and division get parsed, and then I improved how formulas are printed.  
  
Previously a formula could only be applied to the expression itself, not to some inner part of it.  
  
So I wrote a function that applies a formula somewhere inside the expression, recursively walking through it.  
  
Then I took these formulas:  
1. `a/b*c <-> a*c/b `
2. `a/b/c <-> a/(b*c)`
  
The first one, obviously, lets you move a divisor to the right within the expression.  
  
And the second one lets you merge two divisors into one.  
  
Then I took the expression:  

`a*b/c/(1+2)/3*a*d/e/f`
 
So, first I made the program apply the first formula for as long as it could be applied, and got this:  
`a*b*a*d/c/(1+2)/3/e/f` 
  
Then I made the second formula apply in the same way, and in the end I got:  
`a*b*a*d/(c*(1+2)*3*e*f)`
  
In short, with two simple formulas I got a program that can reduce an arbitrary expression with division and multiplication to a form with a single numerator and denominator!!! \\0/

{{ <image path="94.jpg" /> }}

I added a whole bunch of formulas:

**Converting to a fraction:**
```
a/b*c <-> a*c/b
a/b/c <-> a/(b*c)
```

**Adding fractions:**
```
a/b + c/d <-> (a*d+c*b)/(b*d)
a + c/d <-> (a*d+c)/d
a/b + c <-> (a+c*b)/b
```

**Expanding brackets:**
```
c*(a+b) <-> (a+b)*c
(a+b)*c <-> a*c+b*c
```

**The simplest optimization:**
```
1*a <-> a
a*1 <-> a
```

And made all of them apply to the expression:
```
c*(a+b)+1/2
```

In the end, the program reduced it to:
```
(2ac + 2bc + 1)/2
```

!!! 🎉 !!!

(I deliberately converted it to a more readable form and removed the extra multiplication signs)

So basically, it learned to expand brackets and add fractions!

Here are some more examples of it at work:
```
1/(a+b)+1/(c+d) ---> (c+d+a+b)/(ca+da+cb+db)
(x+1)*(x+2) ---> x*x + 2x + x + 2
```

Of course, it still struggles with some examples, both because of the internal representation of expressions and because some extra logic has to be bolted on, but the results are already impressive!

{% <figure caption="I also colored the output a bit to make it easier to read. Sorry about the colors: the terminal has a limited palette, so it is what it is."> %}
{{ <image path="97.jpg" /> }}
{% </figure> %}

So here I am, struggling with an arithmetic grammar, and the library I'm using already has tools for parsing things with operator precedence!

{% <figure caption="A grammar for parsing arithmetic expressions"> %}
{{ <image path="98.jpg" /> }}
{% </figure> %}

Notice how the parentheses around `@` are placed: they differ only for `^`, because:
```
a-b-c = (a-b)-c
a^b^c = a^(b^c)
```

# 16.03.2020 {#99}

> **Source (in Russian):**
[`tg/99`](https://t.me/optozorax_dev/99),
[`tg/100`](https://t.me/optozorax_dev/100).

Meanwhile:
* I moved all the parsing I could to precedence!{}, described in the previous post.
* Added parsing of functions like f(a, b, c, ...)
* Added parsing of
	* a & b - logical functions
	* a = b - equalities, inequalities
But that's not all that interesting, and you'll be able to see it in the next screenshot.

And so that this post has something interesting in it, I'll describe some cool functions on which a lot of things will be built in the future!

First, let's agree to treat the operations `+`, `-`, `*` etc. as functions of two arguments:
```
a+b = sum(a, b)
a-b-c = sub(sub(a, b), c)
```

## The many function

This function takes as input two of anything, of the same type, and it means that the two values exist in parallel. Its property is that, when it's inside any function, it can get out of it. It's easier to show with an example:
```
1+many(1, 2) = many(1+1, 1+2)
sin(many(pi, 0)) = many(sin(pi), sin(0))
```

## The ifval function

The first argument of this function is some expression, and the second is a logical condition. This function lets you specify a value that exists only under some condition. Its properties also include being able to get out of almost any function (I don't know yet how it should get out of logical functions). Once again, examples are king:
```
1+ifval(a, a != 0) = ifval(1+a, a != 0)
```

By combining these two functions you can define lots of interesting things, for example, the absolute value!
```
abs(x) = many(ifval(x, x >= 0), ifval(-x, x < 0))
```

Or the roots of a quadratic equation:
```
x = (-b + many(D, -D))/(2a)
```

Or safely introducing new variables.
To explain this, let's remember how we sometimes solved problems in math class: we added some expression at the end and then subtracted it:
```
a = a+b-b
```

Then we used this, for example, to complete the square:
```
x^2+2x = x^2+2x + 1 - 1 = (x+1)^2 - 1
```

Introducing multiplication and division isn't that simple, because we might accidentally multiply and divide by zero! So the formula for introducing multiplication looks like this:
```
a <-> many(ifval(a, b == 0), ifval(b*a/b, b != 0))
```

Thanks to this formula we can safely do further calculations without losing or breaking anything. This formula also works in both directions.

The standard formula works in only one direction, and so it breaks the equivalence of the input and the output:
```
a -> b*a/b
```

{{ <image path="100.png" /> }}

In the screenshot above:
1. Pulling many out of all functions
2. What was there before (did you notice the dot as the multiplication sign? :) )
3. Parsing functions
4. Parsing logical expressions, inequalities and equalities.

# 17.03.2020 {#101}

> **Source (in Russian):**
[`tg/101`](https://t.me/optozorax_dev/101),
[`tg/102`](https://t.me/optozorax_dev/102).

Just now I was figuring out how to define my own syntax highlighting in Sublime Text. If anyone wants to do the same, I recommend these resources:  
  
* [http://ilkinulas.github.io/programming/2016/02/05/sublime-text-syntax-highlighting.html](http://ilkinulas.github.io/programming/2016/02/05/sublime-text-syntax-highlighting.html)  
* [https://www.sublimetext.com/docs/3/syntax.html](https://www.sublimetext.com/docs/3/syntax.html)  
* [https://www.sublimetext.com/docs/3/scope_naming.html](https://www.sublimetext.com/docs/3/scope_naming.html)

I made it highlight my formulas in a file, because from now on I plan to read formulas from a file, and do my thinking there too. In parallel I'm also thinking about new features, namely **built-in functions.** Take a look at the screenshot below.  
  
From here on I'll use the term "the pattern matched", which means the same thing as "the formula can be applied". It's just that I now call a formula a pattern.  
  
First, about those dollar signs in the screenshot. A dollar sign before a variable name means that when the formula is applied, the variable must have exactly that name. That is, `"a"` is a pattern in the formula `"a+b"`. But `"$true"` in the formula `"$true & a"` is a specific variable named `true`.  
  
With functions it's the other way around. For them, `"sin(x)"` by default means that the function has a specific name. If we want to write a formula for any function, we need hacks, namely the dollar sign. So `"$f(a, b)"` will match any function of two arguments, be it `"a+b"` or `"atan2(y, x)"`.  
  
There are also functions with two dollar signs, and these are the ones that will denote something built-in. For example, the function `"$$anypos(x)"` will match any function with any number of arguments, but only if at least one argument matches the pattern `x`. Then this pattern is taken, and the transformation is applied to this function only inside that argument. It's better if I show an example. Suppose we have this formula:  
```
$$anypos(many(a, b)) = many($$anypos(a), $$anypos(b));  
```

Then by this formula:  
```
myfunc(many(a, b), y, z) = many(myfunc(a, y, z), myfunc(b, y, z))  
```

In this case `myfunc` matched `$$anypos`, and its first argument matched `many(..)`, and when the formula was used, all the other arguments of `myfunc` stayed unchanged.  
  
I also think there should be a built-in function that evaluates arithmetic expressions, and there should be type matching via two dollar signs; for example, `$$n` should match any number.  
  
As you can see, I want to move all the logic of working with math into formulas and my own language, and keep the code as abstracted from math as possible. I think the good thing about this approach is that my language will let you describe, for example, abstract algebra. And it will be safer than encoding all that in code, though it will also be slow.  
  
I still need to think about how to write down derivations of some formulas from others.

{% <figure caption="On the left is the formula code, on the right is the code that defines the syntax for Sublime."> %}
{{ <image path="102.jpg" /> }}
{% </figure> %}

# 22.03.2020

> **Source (in Russian):**
[`tg/106`](https://t.me/optozorax_dev/106),
[`tg/107`](https://t.me/optozorax_dev/107),
[`tg/109`](https://t.me/optozorax_dev/109),
[`tg/110`](https://t.me/optozorax_dev/110),
[`tg/111`](https://t.me/optozorax_dev/111).

So, for my coursework I was given the task of redoing last year's coursework with different basis functions. I had linear ones, and now I have to use quadratic ones.

The problem is that the textbook that describes all the theory has the matrices for linear functions, but for quadratic ones it only describes in words how to obtain them. And to obtain them, you have to take a lot of integrals.

As you might have guessed from my automation of mouse clicking in a program, I really don't like doing things by hand, so I wrote a Python program that uses sympy to take these integrals.

In short, it computed the integrals for 81 matrix elements, which took a very long time; I'll show the result in the next picture.

While I was doing this, I realized that sympy is weak; you can't:
* Split a matrix with sums inside into a sum of matrices
* Factor a common multiplier out of a matrix

You have to do it with hacks: multiplying by an inverse value that I set myself and then simplifying, or saving elements from the guts of the computation into different matrices.

If you know any decent libraries for symbolic computation, or programs that let you work with it interactively, please share.

And since I don't know any such libraries or programs yet, I'm gradually moving towards creating my own, which I described in previous posts (fopply).

And honestly, I can't imagine doing calculations like these on paper, it's nuts! In general, I think that at university or even at school, in parallel with the math course, they should teach how to solve all the problems in something like sympy.

And if I have subscribers who still have a lot of calculus ahead of them in life: learn sympy! Make your life easier, write calculators for different operations. For example, for one course I had calculators for computing some special things: [@optozorax/math_modeling_controllable_systems](https://github.com/optozorax/math_modeling_controllable_systems)

And here's the code that computes these matrices, for anyone interested: 

{% <details summary="integrate_fem_3.py <a class='right' href='https://github.com/optozorax/labs_emf/blob/3c1285218149ed732155c0e8b00082984015c7aa/coursework2/integrate_fem_3.py'>link</a>"> %}

```python
from sympy import *
import copy

a, b, c = symbols("a b c")

x, y = symbols("x y")

def get_function(list, var, xy, h):
	a1 = solve([
		a*xy*xy + b*xy + c - list[0], 
		a*(xy + h/2)*(xy + h/2) + b*(xy + h/2) + c - list[1], 
		a*(xy + h)*(xy + h) + b*(xy + h) + c - list[2]
	], (a, b, c))
	return a1[a]*var*var + a1[b]*var + a1[c]

x_p, h_x = symbols("x_p h_x")
x_p1 = x_p + h_x

y_p, h_y = symbols("y_p h_y")
y_p1 = y_p + h_y

X1 = get_function([1, 0, 0], x, x_p, h_x)
X2 = get_function([0, 1, 0], x, x_p, h_x)
X3 = get_function([0, 0, 1], x, x_p, h_x)

Y1 = get_function([1, 0, 0], y, y_p, h_y)
Y2 = get_function([0, 1, 0], y, y_p, h_y)
Y3 = get_function([0, 0, 1], y, y_p, h_y)

f = []

for i in [Y1, Y2, Y3]:
	for j in [X1, X2, X3]:
		f.append(j*i)

G1 = zeros(len(f))
G2 = zeros(len(f))

for i, a in enumerate(f):
	for j, b in enumerate(f):
		temp = simplify(
			integrate(
				integrate(
					diff(a, x) * diff(b, x) + diff(a, y) * diff(b, y),
					(y, y_p, y_p + h_y)
				),
				(x, x_p, x_p + h_x)
			)
		)
		(first, second) = temp.args
		(coef, up, down) = first.args
		if up == h_x:
			G1[i, j], G2[i, j] = first, second
		else:
			G1[i, j], G2[i, j] = second, first

M = zeros(len(f))
for i, a in enumerate(f):
	for j, b in enumerate(f):
		M[i, j] = simplify(
			integrate(
				integrate(
					a * b,
					(y, y_p, y_p + h_y)
				),
				(x, x_p, x_p + h_x)
			)
		)

first = h_x/(h_y*6*15)
second = h_y/(h_x*6*15)
G1 = simplify(G1 / first)
G2 = simplify(G2 / second)
l = Symbol("lambda")

print("G = {}\\cdot{} + {}\\cdot{}".format(latex(l * first), latex(G1), latex(l * second), latex(G2)))

multiplier = h_x*h_y/36/25
M = simplify(M / multiplier)
g = Symbol("gamma")

print("M = {}\\cdot{}".format(latex(g * multiplier), latex(M)))
```

{% </details> %}

{% <figure caption="Each element of these matrices is the solution of some double integral."> %}
{{ <image path="107.jpg" scale="1/2" /> }}
{% </figure> %}

Well, I've finished this work, [the branch is merged](https://github.com/optozorax/labs_emf/commit/72e893134ee23ff39607e02c94b3a30d05cd4a53). There isn't much more to say about it, because there's too much context here. And I basically just redid last year's work for a slightly different basis.  
  
So just admire the god-tier auto-generated LaTeX reports with royal-grade research that I used to make: [link to pdf](https://github.com/optozorax/labs_emf/raw/master/coursework2/report/report.pdf) (in Russian).

{% <figure caption="😊"> %}
{{ <image path="111.jpg" /> }}
{% </figure> %}

# 1.07.2020

> **Source (in Russian):**
[`tg/230`](https://t.me/optozorax_dev/230),
[`tg/231`](https://t.me/optozorax_dev/231),
[`tg/232`](https://t.me/optozorax_dev/232).

I've just realized that the functions I came up with back then, `ifval` and `many`, which have the property of "getting out of any other function", actually contradict themselves.

Let me remind you that in these terms the absolute value function can be described as follows:
```
abs(x) = many(ifval(x, x >= 0), ifval(-x, x < 0))
```

And with the properties I gave these functions, you can arrive at `abs(x)` always being the empty set.

{% <figure caption="The proof of this fact"> %}
{{ <image path="231.jpg" /> }}
{% </figure> %}

That's how you can turn the absolute value into the empty set. So the notation I came up with for defining piecewise functions, like the absolute value, division by zero, etc., doesn't work. I need to look for other ways to formalize piecewise functions, and to figure out by what right we can turn such piecewise functions into systems of equations without piecewise functions.

At school we don't think about this, we just follow a gazillion rules that resemble business logic rules, so when it comes to formalizing it or trying to write a program, we run into difficulties like these. Maybe school algebra was formalized long ago and all these difficulties have been solved there, and I just need to google it.

{% <figure caption="Here's what I mean by “turning a piecewise function into a system of equations”."> %}
{{ <image path="232.jpg" /> }}
{% </figure> %}

I wonder by which exact rules of math we can just take the conditions of the absolute value and pull them out of the absolute value itself, up to the level of the equation, and where the limits of this pulling out are.

# 26.08.2020

> **Source (in Russian):**
[`tg/246`](https://t.me/optozorax_dev/246),
[`tg/247`](https://t.me/optozorax_dev/247),
[`tg/248`](https://t.me/optozorax_dev/248).

{% <figure caption="Me when I need to solve the fundamental problems of mathematics before writing a single line of code."> %}
{{ <image path="246.jpg" /> }}
{% </figure> %}

Also, I've finally solved the "fundamental problems of mathematics" that I described earlier.  
  
**To recap:** I want to write a program for symbolic (analytical) computation. I want it to be able to derive formulas from axioms and other formulas. For that I need to write down axioms for the standard operations and functions. All the commutativity/associativity stuff for addition, division and multiplication I wrote down easily. The problems started when I had to come up with a representation for piecewise-defined functions, for example: the absolute value, the sign function. How do you define such functions so that you can perform operations on them, and how do you axiomatize their structure?  
  
I came up with operators like `ifval` and `many`, which are described in detail in [/99](#99). I hoped to write a piecewise-defined function as a combination of these operators. In the end it turned out that these operators are so broad that they lead to contradictions, and in practice they're impossible to use.  
  
After that I got stuck: I couldn't move on with development because of this problem, since it lies at the very foundation. I tried to come up with one-way formulas, thought about a type system, nothing helped.  
  
But recently, after releasing the evolution repository, I sat down with `fopply`, thought a bit, and found a solution!  
  
You need to introduce a single function for this: `part(cond, then, else)`. That is, this function returns `then` if `cond` is `$true`, and `else` otherwise.

{% <figure caption="The properties of this function are shown here."> %}
{{ <image path="247.jpg" /> }}
{% </figure> %}

Let me remind you that formulas can be used both in the forward and in the reverse direction. Here I wrote down the basic properties of this function and how it can be turned into logical operators.

The last formula, though, already requires me to implement a type system that distinguishes between numbers and booleans, otherwise it won't make sense if you turn an absolute value into a logical structure in the middle of an ordinary formula.

With this function I was able to write the absolute value and `sign`, and I was even able to derive this formula from the basic ones: `a <-> part(b == 0, a, a*b/b)` (you can add multiplication and division by something to a formula, if that something isn't zero). And since I was able to formally derive something this exotic, I'm on the right track.  
  
I also got rid of a concept like `anypos`, whose principle is described in [/101](#101). I tried to encode right into the structure of a formula that it can match inside any argument of a function. That is, if you write `$$anypos(x+1)`, it can match the function `f(y-2, z+3, 2+1)` in the third argument. Then I invented lots of ways to write it when there are two such arguments, how to write permutations, etc. But then I realized that preparing an expression into a form where it can match a formula is the user's job. That is, if the user has the function `f(y-2, z+3, 2+1)`, they make the substitution `g(x) := f(y-2, z+3, x)` and then write `g(2+1)`, which easily matches a formula that works on one-argument functions. In the same way you can make formulas work deep inside an expression, not just in some argument. Thanks to this, the core of the program will become much simpler.  
  
Anyway, I feel like I can finally start writing code and getting my dopamine.

# 6.09.2020

> **Source (in Russian):**
[`tg/249`](https://t.me/optozorax_dev/249),
[`tg/250`](https://t.me/optozorax_dev/250).

Meanwhile, I have a big update on `fopply`!!!  

_First, the design stuff._
  
## Binding. 
  
Suppose we have the formula `part(x, a, a) <-> a` and the expression `x+1`, and I want to apply this formula right-to-left. Then what should `x` from the formula be? In theory it could be anything, since when I apply the formula left-to-right, the information about `x` is simply erased.  
  
I came up with the idea of manually specifying what the unknown variables of the formula are equal to, like this: `x := x = 0` (this is what I call a binding), and then the result is `part(x = 0, x+1, x+1)`. The formula and the expression each have their own namespace, so the x on one side doesn't collide with the x on the other.  
  
## Specifying the position
  
For example, we have the formula `a+b <-> b+a` and the expression `2*(3+4)`. How do I apply this formula inside the expression? You can manually write the position as an array, `[1]`, and apply the formula to the inner part. But that's inconvenient for the user, so I came up with the following notation:  
```
2*(3+4)  
. ^^^  
```

When parsing, all the information about where the parts of the formula are located will be saved, and we'll be able to reconstruct the position as an array from such notation. The dot at the beginning is needed because I'm too lazy to parse indentation for now; it's there to mark the start.  
  
Although yesterday a friend suggested that you could specify the position right inside the formula, for example like this: `2+({3+4})`.  
  
_Note:_ you can't write:  
```
1+2+3+4  
. ^^^  
```

because the formula is represented by a tree of the following form: `+(1, +(2, +(3, 4)))`. So this tree has no subtree that would be equal to `+(2, 3)`. Here the only option is to transform the original expression.  
  
## Matching an arbitrary function
 
So, we have the formula `a = b & $f(a) <-> a = b & $f(b)`. This formula means that if somewhere we have `a = b`, then in the places joined to this equality by the logical AND operator, we can replace the variable `a` with the variable `b`. `$f(a)` here means "any function with one argument, where the argument matches the pattern `a`".  
  
That is, this formula can be applied to:  
```
1. a = 1 & a  
2. a = 1 & c+a = 0  
3. a = 1 & (x*a + b*a + a*a = 0 | x = 5)  
```

The first case is trivial. But what do we do with the second and the third? How do we find the exact place that matches `a`? The first thing that comes to mind is to take what we know about what it should match, walk through the expression recursively and do the replacement.  
  
This approach will work for the first two, but the problems begin with the third. Should we match the first occurrence? The second? The third? And what if I want to replace only the second, third and fourth occurrences of `a` with 1, and leave the first one in `x*a` alone?  
  
So for such cases I came up with the idea that you write by hand the pattern that will be treated as `$f`, for example: `$f(x) := a + b*x + x*x | c` for the third case.  
  
In this case it matches as follows:  
```
a := x*a  
b := b  
c := x = 5  
```

Notice that this pattern only needs to describe the structure; you don't have to describe the whole expression one to one.  
  
For the formula `$f(sin(a))` and the expression `sin(1+2) * sin(1+2)` you can write the pattern `$f(x) := x * x`; as a result it matches with `x := sin(a)`, and then `a` matches `1+2`.  
  
Of course, in the future there will be an interface for this, so that you can do such things by clicking with the mouse.

## Axioms and proofs
  
The next thing I came up with is that there should be formulas that are written as axioms, and formulas that are derived from others, which can be proven.  
  
For such a system, all formulas have to be written in some file, with names and numbers, so that you can refer to them and use them in a derivation, or "proof".  
  
That's exactly what I did in this file: [math.fpl](https://github.com/optozorax/fopply/blob/753dae7368d4108c0a6aff03458ba7f08c492311/fpl/math.fpl). I've already described all the complex syntax earlier, and the rest of the syntax in this file is self-explanatory.  
  
By the way, I planted a formula `unsafe` there for the future, which looks like this: `a <-> b`, so with it you can replace anything with anything 😄
  
In this file I wrote down basic formulas and even proofs, using everything I described earlier. So now the main task is to code the reading of this file into an internal structure, and the checking of proofs.  
  
## Programming progress
  
And I did that checking, and everything described above, and it all works! 🎉🎉🎉 
  
You can go to the [repository](https://github.com/optozorax/fopply/tree/753dae7368d4108c0a6aff03458ba7f08c492311), modify `fpl/math.fpl`, write your own axioms and your own proofs, and run the proof checking with `cargo run`.  
  
Code-wise it's suboptimal shitcode for now, because I'm trying to save time: everything is made just to work. A proof gets checked, and if you deliberately make a mistake in some step, the program will tell you, but without the location where the error occurred. So please, if you know any articles on how to architect error reporting for your own language, drop them in this channel's newly created chat.  
  
And the next problem to deal with is how to work with numbers inside formulas, so that you can write down that like terms can be combined, that numbers can be cancelled and multiplied, and also do all of that in the reverse direction.  
  
Oh, and since I got into a master's program, I should find a supervisor who will agree to take this topic for a master's thesis. I hope I find one, because I don't want to spend my time on some nonsense.

# 31.01.2021

> **Source (in Russian):**
[`tg/295`](https://t.me/optozorax_dev/295),
[`tg/296`](https://t.me/optozorax_dev/296) (6 💬).

And I remembered that #fopply exists! I [spent a little time](https://github.com/optozorax/fopply/commit/95853742ca3cdc8ecbb28aee440c536795f3c3cd) on it and added proper error messages. For that I had to tweak the parser a bit and write a ton of error handling code. In the future I plan to use the [codespan](https://github.com/brendanzab/codespan) library for this.  
  
It prints several error messages at once, all the ones that can be found at the current stage of checking. Some homemade programming languages can't boast of that!  
  
To get error messages that point to the location of the error, I had to make this little struct:  
 
```rust
struct Spanned<T> {
    span: Range<usize>,
    inner: T,
}
```
  
And wrap lots of fields of other structs that make up a formula and a proof in this little struct.  
Also, with the new version, thanks to error messages that point to the problem, I was able to prove `(a+b)*(a-b) = a*a-b*b`.  
  
Next, I plan to write an interactive application in which you can apply formulas interactively and find all the possible formulas that fit the current expression. After that, I'm going to use it to start entering as many of the formulas I know as possible, to find the problem spots and better understand how to resolve them in the future.

And here's what error messages in fopply look like now:

{{ <image path="296.jpg" /> }}

{{ <image path="297.jpg" /> }}

# 27.03.2021

> **Source (in Russian):**
[`tg/391`](https://t.me/optozorax_dev/391) (9 💬).

Recently on Twitter I saw this gorgeous animation about an idea for an interesting interface for algebra. This animation shows the level of step-by-step granularity I want for fopply. Although in his animation the interface is heavily optimized for basic algebra: for example, when you grab an exponent and drag it to the other side of the equation, it turns into a square root. That's probably overkill already, but it looks cool.

He also says it would be really cool to see what happens if babies play with a program like this: what if they develop intuition and a sense of beauty in math at such an early age? Would we get another Ramanujan? I'm also very interested in this application of formal step-by-step algebraic systems. I had an idea of representing something like trigonometry not as formulas but as geometric structures in 3D, so that operations on the structures would simply be trigonometric formulas. Would a game built on this be interesting to people, and to children in particular? Could we teach them to love math through games like this? 🤔

{% <figure caption="The video from the tweet below, for your convenience"> %}
{{ <video path="1374291155869966336_1_web.mp4" /> }}
{% </figure> %}

{% <figure caption="[Link to the tweet](https://twitter.com/elzr/status/1374291155869966336)"> %}
{{ <image path="twitter_1374291155869966336.png" scale="2/3" /> }}
{% </figure> %}
