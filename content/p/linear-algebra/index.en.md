+++
title = "A notation for linear algebra"
date = 2019-11-09
description = "A notation system that makes linear algebra with vectors easier to understand."

[taxonomies]
tags = ["math", "notation", "linear-algebra"]

[extra]
image = "linear_algebra.png"
vk = "https://vk.com/wall-169103586_19"
use_katex = true

[extra.translation]
from = "ru"
by = "Claude Opus 5.5"
+++

# Introduction

You know that old story about how, once Arabic numerals replaced Roman ones, mathematics started advancing by leaps and bounds?

The takeaway from this story is that sometimes a good notation or encoding system for something can have a significant effect on how people perceive it and how easily they can work with it.

This post describes a notation for bases, vectors and linear operators that makes it much easier to understand what the hell is actually going on in linear algebra.

# Abstract vector

{% <katex> %}{% </katex> %}

Since school we've been used to thinking of a vector as a tuple of **numbers**, {% <katex> %}\mathbf{x} = (1, 2, 3)^T{% </katex> %}. But in linear algebra any vector is an _abstract object_ with certain properties.

For example, we could have two vectors: {% <katex> %}\mathbf{x} ={% </katex> %} orange juice, {% <katex> %}\mathbf{y}={% </katex> %} apple juice. Then the result of adding them could be: {% <katex> %}\mathbf{x}+2\mathbf{y}={% </katex> %} one-orange-two-apple juice.

The properties of a vector are given by the definition of a [vector space](https://en.wikipedia.org/wiki/Vector_space).

# Notation

The text in dollar signs shows how to write it in `TeX`.

**Number**: a lowercase letter in a regular font, `$x$`, `$y$`, `$z$`: {% <katex> %}x{% </katex> %}, {% <katex> %}y{% </katex> %}, {% <katex> %}z{% </katex> %}.

**Abstract vector**: a lowercase letter in a bold upright font, `$\mathbf{x}$`: {% <katex> %}\mathbf{x}{% </katex> %}.

**Basis**: a lowercase letter in blackboard bold, `$\mathbb{e}$`: 𝕖. It is a row vector of abstract vectors:

{% <katex block={true}> %}𝕖=(\mathbf{e}_1, \mathbf{e}_2, \dots, \mathbf{e}_n){% </katex> %}

**Linear operator**: an uppercase letter in bold, `$\mathbf{A}$`: {% <katex> %}\mathbf{A}(\mathbf{x}){% </katex> %}, always followed by parentheses.

**Numeric vector**: an abstract vector enclosed in square brackets, with the basis it is projected onto written as a subscript, `$[\mathbf{x}]_\mathbb{e}$`: {% <katex> %}[\mathbf{x}]_𝕖{% </katex> %}. This is the vector {% <katex> %}\mathbf{x}{% </katex> %} in the basis {% <katex> %}𝕖{% </katex> %}. It is a column vector of numbers.

{% <katex block={true}> %}[\mathbf{x}]_𝕖 = 
\begin{pmatrix}
	x_1\\
	x_2\\
	\ldots\\
	x_n
\end{pmatrix}{% </katex> %}

Any abstract vector can be written as:

{% <katex block={true}> %}\mathbf{x} = 𝕖\cdot [\mathbf{x}]_𝕖{% </katex> %}

{% <katex block={true}> %}\mathbf{x} = (\mathbf{e}_1, \mathbf{e}_2, \dots, \mathbf{e}_n)\cdot\begin{pmatrix}
	x_1\\
	x_2\\
	\ldots\\
	x_n
\end{pmatrix}{% </katex> %}

{% <katex block={true}> %}\mathbf{x} = x_1\mathbf{e}_1 + x_2\mathbf{e}_2 + \dots + x_n\mathbf{e}_n{% </katex> %}

These formulas define the correspondence between abstract and numeric vectors!

Note that we can introduce a basis {% <katex> %}𝕒=(\mathbf{a}_1, \mathbf{a}_2, \dots, \mathbf{a}_n){% </katex> %}. Then we can write the vector {% <katex> %}\mathbf{x}{% </katex> %} in terms of this basis:

{% <katex block={true}> %}\mathbf{x} = 𝕒\cdot [\mathbf{x}]_𝕒{% </katex> %}

In a different basis the numbers will be different, but the vector stays the same. Of course, in practice we'll never deal with abstract vectors and will always work with columns of numbers, but this is a convenient abstraction for denoting one and the same object.

Essentially, a numeric vector is the _projection_ of an abstract vector onto a basis.

By the way, linear operations on a vector are equivalent to linear operations on its coordinate column:

{% <katex block={true}> %}[c\cdot \mathbf{x}]_𝕖 = c\cdot [\mathbf{x}]_𝕖 {% </katex> %}

{% <katex block={true}> %}\displaystyle [\mathbf{x} + \mathbf{y}]_𝕖 = [\mathbf{x}]_𝕖 + [\mathbf{y}]_𝕖 {% </katex> %}

# Change of basis

This is where the notation really shines, because with the standard notation this is the topic that causes the most confusion when solving problems.

Say we've managed to express the vectors of basis {% <katex> %}𝕒{% </katex> %} in terms of the vectors of basis {% <katex> %}𝕖{% </katex> %}:

{% <katex block={true}> %}
\left\{
\begin{aligned}
	&\mathbf{a_1} = 𝕖 \cdot [a_1]_𝕖 = \alpha_{1,1}\mathbf{e_1} + \alpha_{1,2}\mathbf{e_2} + \ldots + \alpha_{1,n}\mathbf{e_n} \\
	&\mathbf{a_2} = 𝕖 \cdot [a_2]_𝕖 = \alpha_{2,1}\mathbf{e_1} + \alpha_{2,2}\mathbf{e_2} + \ldots + \alpha_{2,n}\mathbf{e_n} \\
	&\ldots \\
	&\mathbf{a_n} = 𝕖 \cdot [a_n]_𝕖 = \alpha_{n,1}\mathbf{e_1} + \alpha_{n,2}\mathbf{e_2} + \ldots + \alpha_{n,n}\mathbf{e_n}
\end{aligned}
\right.
{% </katex> %}

And let's introduce the following matrix:

{% <katex block={true}> %}
P_{𝕖𝕒} = 
\left([a_1]_𝕖, [a_2]_𝕖, \ldots, [a_n]_𝕖\right)
{% </katex> %}
{% <katex block={true}> %}
P_{𝕖𝕒} = 
\begin{pmatrix}
	\alpha_{1,1}& \alpha_{2, 1}& \ldots& \alpha_{n,1} \\
	\alpha_{1,2}& \alpha_{2, 2}& \ldots& \alpha_{n,2} \\
	\ldots& \ldots& \ldots& \ldots \\
	\alpha_{1,n}& \alpha_{2, n}& \ldots& \alpha_{n,n}
\end{pmatrix}
{% </katex> %}

Then the original system is equivalent to each of the following:

{% <katex block={true}> %}
\begin{matrix}
	&P_{𝕖𝕒}^T \cdot 𝕖^T &= &𝕒^T \\
	&𝕖 \cdot P_{𝕖𝕒} &= &𝕒 \\
	&𝕒 \cdot P_{𝕖𝕒}^{-1} &= &𝕖 \\
	&𝕒 \cdot P_{𝕒𝕖} &= &𝕖
\end{matrix}
{% </katex> %}

{% <katex> %}P_{𝕖𝕒}{% </katex> %} is called the change-of-basis matrix from basis 𝕖 to basis 𝕒.

From the formulas we have, we can derive a few more useful ones:

{% <katex block={true}> %} P_{𝕖𝕒} = P_{𝕒𝕖}^{-1} {% </katex> %}
{% <katex block={true}> %} 𝕒 = 𝕖 \cdot P_{𝕖𝕒} {% </katex> %}
{% <katex block={true}> %} P_{𝕒𝕕} = P_{𝕒𝕖}\cdot P_{𝕖𝕕} {% </katex> %}
{% <katex block={true}> %} [\mathbf{x}]_𝕒 = P_{𝕖𝕒} \cdot [\mathbf{x}]_𝕖 {% </katex> %}

With these formulas we now know how to convert numeric vectors from one basis to another.

# Linear operator

A **linear operator** is a function that takes a vector as input and returns a vector. The space of the first vector may differ from the space of the second one.

Mathematicians love to write {% <katex> %}\mathbf{A}\mathbf{x}{% </katex> %}, which means "the operator is applied to the vector". This notation drives me mad. It looks like multiplication, and you always have to know in advance that {% <katex> %}\mathbf{A}{% </katex> %} is a function.

This "operator" is called _linear_ because it has the linearity properties (like almost everything in linear algebra).

{% <katex block={true}> %}\mathbf{A}(\mathbf{x} + \mathbf{y}) = \mathbf{A}(\mathbf{x}) + \mathbf{A}(\mathbf{y}){% </katex> %}

{% <katex block={true}> %}\mathbf{A}(c\cdot\mathbf{x}) = c\cdot\mathbf{A}(\mathbf{x}){% </katex> %}

So what is a linear operator in our world of numbers? It turns out you can prove that, for given bases, any linear operator comes down to a unique matrix! And the operation of "applying the operator to a vector" becomes multiplying that matrix by the vector.

{% <katex block={true}> %}
[\mathbf{A}]_{𝕖𝕒}\cdot[\mathbf{x}]_𝕖 = [\mathbf{y}]_𝕒
{% </katex> %}

That's exactly why I try not to write operator application without parentheses: otherwise we get even more chances to confuse the abstract operator with its matrix.

Note that the matrix depends on two bases: the input basis and the output basis! After all, the result might be a 50-dimensional vector while the input is 2-dimensional. Of course, in practice the input and the output are more often in the same basis and therefore have the same dimension. So I'll show the notation for exactly this case:

{% <katex block={true}> %}
[\mathbf{A}]_𝕖\cdot[\mathbf{x}]_𝕖 = [\mathbf{y}]_𝕖
{% </katex> %}

Let me stress it once again: a linear operator ≠ the matrix of the linear operator.

A linear operator is an abstract function, while a matrix is its concrete implementation as a set of numbers.

# Deriving the change-of-basis formula for the matrix of a linear operator

Say we know how a linear operator is represented in the basis {% <katex> %}𝕖{% </katex> %}:

{% <katex block={true}> %}[\mathbf{A}]_𝕖\cdot[\mathbf{x}]_𝕖 = [\mathbf{y}]_𝕖{% </katex> %}

And we need to get its matrix in the basis {% <katex> %}𝕒{% </katex> %}, that is, a matrix for which the following equality holds:

{% <katex block={true}> %}[\mathbf{A}]_𝕒\cdot[\mathbf{x}]_𝕒 = [\mathbf{y}]_𝕒{% </katex> %}

For the derivation we'll need the following:

{% <katex block={true}> %} [\mathbf{x}]_𝕖 = P_{𝕒𝕖} \cdot [\mathbf{x}]_𝕒 {% </katex> %}

{% <katex block={true}> %}[\mathbf{y}]_𝕖 = P_{𝕒𝕖} \cdot [\mathbf{y}]_𝕒{% </katex> %}

{% <katex block={true}> %}[\mathbf{A}]_𝕖\cdot[\mathbf{x}]_𝕖 = [\mathbf{y}]_𝕖{% </katex> %}

We substitute the first two formulas into the third:

{% <katex block={true}> %}[\mathbf{A}]_𝕖\cdot P_{𝕒𝕖} \cdot [\mathbf{x}]_𝕒 = P_{𝕒𝕖} \cdot [\mathbf{y}]_𝕒{% </katex> %}

{% <katex block={true}> %}P_{𝕒𝕖}^{-1} \cdot [\mathbf{A}]_𝕖\cdot P_{𝕒𝕖} \cdot [\mathbf{x}]_𝕒 = [\mathbf{y}]_𝕒{% </katex> %}

And we get this answer:

{% <katex block={true}> %}[\mathbf{A}]_𝕒 = P_{𝕒𝕖}^{-1} \cdot [\mathbf{A}]_𝕖\cdot P_{𝕒𝕖}{% </katex> %}

# Why is this notation good?

You may have noticed that for the first time in your life you understood what's going on in this damn linear algebra, and that's no accident. The standard notation makes no distinction at all between a vector, its projection onto a basis, and the basis. Everything is **stupidly** and **lazily** denoted by ordinary letters, neither bold nor blackboard bold.

That's exactly why you constantly have to keep the context in mind. And you're lucky if someone even tells you the difference between an abstract vector and a column of numbers. Usually the teachers themselves don't really know the difference, or don't know that they should draw the students' attention to it.

The downside of stupidly denoting everything with ordinary letters is that **ordinary letters start to mean too much**. They become ambiguous. Depending on the context, {% <katex> %}a{% </katex> %} could be anything: a number, a vector, a basis, or even a junior operator.

I'll admit that this notation for coordinate columns takes too many symbols: you have to write `[`, `]`, `𝕖`, and it's not at all clear how to write the last one with a pen. Using it in practice to solve linear algebra problems is impossible. So I suggest using this notation:
* In books and study guides,
* On paper, when the problem involves going from one basis to another,
* At the early stages, to tell an abstract vector apart from a column of numbers,
* When you've forgotten how everything works.

Later on, _once you've learned to understand it all_, you can use ordinary letters to keep things short.

This system is a slightly refined version of the notation taught by [Elena Viktorovna Ovchinnikova](https://ciu.nstu.ru/kaf/persons/3080) (in Russian) at the Faculty of Automation and Computer Engineering (AVT) of Novosibirsk State Technical University (NSTU).

The main features of this notation system are:
* The vector is split into two concepts: abstract and numeric.
* Each of these classes gets its own special notation.
* The basis of a numeric vector isn't ignored: it is part of the vector's notation.
* The basis gets a special font so that it can't be confused with a vector or a number.

# Conclusion

<center><big>The right notation matters.</big></center>
