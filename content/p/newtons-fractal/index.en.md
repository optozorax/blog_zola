+++
title = "Fractals in Newton's method"
date = 2019-05-27
description = "Newton basins can be drawn not only for complex numbers but for real numbers too. I show what that looks like."

[taxonomies]
tags = ["math", "fractals", "graphics"]

[extra]
image = "3.1.png"

[extra.translation]
from = "ru"
by = "Claude Opus 5.5"
+++

There's an algorithm called "Newton's method". It's meant for solving equations of the form f(x)=0 numerically. There's also a fractal called ["Newton basins"](https://en.wikipedia.org/wiki/Newton_fractal); I read about it and decided to draw them too, only not on the complex plane but for real numbers.

Which raises the question: how do you draw that if for real numbers the picture is 1D? Answer: use systems of equations and the multidimensional Newton's method! I even [wrote an article about it](https://github.com/optozorax/newtons_method_article/raw/master/main.pdf) once (in Russian; [link to the repository](https://github.com/optozorax/newtons_method_article)).

Both the ordinary and the multidimensional Newton's method can find only one root, and which root it converges to depends mostly on the initial guess. Newton basins use color to show which root the method arrives at if you start from a given point.

Here's what Newton basins look like for a system of equations that finds the intersection points of two circles:

{{ <image path="1.png" /> }}

Pretty boring :D, no fractals at all. Okay, let's try cranking up the complexity:

{{ <image path="2.png" /> }}

Here it's a system of three equations for finding a circle tangent to three given circles. The picture shows the dependence only on the position of the initial guess, but actually there's a dependence on the radius too, and for that you'd have to draw a 3D picture. Overall, there's nothing special to see there.

This is all interesting, but I want to see fractals! And I got them, with cubic functions. Near the intersection point, i.e. the root, everything is fine, but fractals appear in the boundary regions, and without any complex numbers!

{{ <gallery images={[
	"3.2.png", 
	"3.1.png", 
	"3.0.png", 
]} nth={1} /> }}

So now you know one more place in real life where fractals show up.

---

**UPD:** In 2021, 3Blue1Brown released a great video about fractals in Newton's method, I recommend checking it out:

{{ <myyoutube id="-RdOwhmqP5s" /> }}

---

This post was originally published as a [Twitter thread](https://twitter.com/optozorax/status/1133045414888738816) (in Russian).
