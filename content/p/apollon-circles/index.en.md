+++
title = "The 'Apollonian circles' fractal. First experiments."
date = 2018-07-20
description = "I draw a fractal based on endlessly constructing tangent circles."

[taxonomies]
tags = ["programming", "fractals", "graphics", "apollonian-circles"]

[extra]
image = "thumbnail.png"
vk = "https://vk.com/optoblog?w=wall-169103586_2"

[extra.translation]
from = "ru"
by = "Claude Opus 5.5"
+++

{{ <image path="apollon_1.png" scale="2/3" format="jpg" /> }}

This fractal is based on endlessly constructing tangent circles.

The idea of this fractal is as follows: initially we have a minimal set of circles (three) whose center positions and radii we know. Then we need to construct a circle tangent to each of them, and to each of the newly formed ones, and so on forever, so that the space gets completely filled with circles without any of them intersecting.

{{ <image path="apollon_2.png" scale="2/3" /> }}

So, to draw such a fractal with a program, you first need to solve a simple problem:

```
Given the center coordinates and radii of three circles, how do you find all the circles tangent to them?
```

But first, *a property of two tangent circles:* if they touch externally, the distance between their centers equals the sum of their radii; if they touch internally, the distance between their centers equals the absolute value of the difference of their radii.

{{ <image path="apollon_3.png" scale="2/3" /> }}

Since there are three circles, and each of them can touch the fourth one in two ways, we get 2³=8 ways in total for the three circles to touch the fourth circle we need to find.

Thanks to this property, we can set up a system of three equations with three unknowns. I used m<sub>1</sub>, m<sub>2</sub>, m<sub>3</sub> to denote parameters that say whether the tangency with a particular circle is external or internal: +1 means external tangency, -1 internal.

{{ <image path="formulas.png" scale="2/3" /> }}

This system of equations has to be solved somehow. At first it may look scary, and in fact it is :) And it's easier to solve it analytically than with various numerical methods. But no computer algebra system is able to produce this analytical solution, and if one can, it runs out of memory, or the formula comes out a mile long and can't be used in a program (if you find a program that can solve this system without a mile-long formula, I'll chip in for your shawarma). So the only available way is to solve it on paper, making a huge number of substitutions.

{{ <image path="apollon_4.png" scale="2/3" /> }}

_Examples of solutions of the system of equations for different m_

<!-- TODO attach the caption above to the image -->

I won't give the solution here, because it's too complicated: I tried to solve this system back in school but never managed to; only after two years of university was my brain prepared enough to solve it all the way through. If you want to repeat my feat, here's a hint: make more substitutions, replacing some parts with new variables.

One very important detail I found out about the solution: it is numerically unstable even with double-precision floating-point numbers (and that's even though all it does is evaluate formulas!), so I used the arbitrary-precision arithmetic library `boost::multiprecision::cpp_bin_float`, where I set the size of a floating-point number to 40 bytes (320 bits).

Next, once you have a function that finds the circles tangent to three given ones, you can easily write a function that builds the whole fractal from the initial set. This function will use recursion, and it also has to make sure it doesn't create circles that have already been drawn.

That's how the first picture is made.

And the next picture shows the first experiments: the initial circle was inscribed inside every circle.

{{ <image path="apollon_5.png" scale="2/3" format="jpg" /> }}

And in the next picture this process was repeated infinitely (and, to make it look nice, deeper iterations were given a paler color).

{{ <image path="apollon_6.png" scale="2/3" format="jpg" /> }}

Next, I plan to rewrite the code so that it works reliably in all cases where a division by zero can happen; more generally, to create a whole library for computing tangent circles in different cases; to make various animations; and to create Apollonian circles with random characteristics at all levels.

If you come up with ideas for what else can be cooked up with Apollonian circles, suggest them in the comments.
