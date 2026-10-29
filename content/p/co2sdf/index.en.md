+++
title = "Complex distance fields: SDF worlds one dimension up"
date = 2026-10-29
description = "The curved-space videos build their worlds from SDFs: a 2D world is a surface in 3D, a 3D world is a hypersurface in 4D. This takes the same method one dimension further up, to 2D worlds inside 4D and 3D worlds inside 5D, and finds that the extra dimension buys flat wormhole throats, one wormhole for three worlds, mirrors, portals that are flat up to their frame, cones with more than 360° around the tip, and wormholes that lead back into themselves. With live demos and all the code."

[taxonomies]
tags = []

[extra]
image = "img/flat_gate3.webp"
use_katex = true
hide_from_home = true
+++

{% <admonition color="red" title="This article is AI generated!"> %}
This article, its pictures, its demos and all of its code were made by the model Claude Opus 5.5 in one long conversation, which started from my questions about how to do the SDF trick of the curved-space videos one dimension up. Four runs of codex with gpt-6-astra did independent math research and reviews along the way, and one of them built the ball-shaped wormhole into itself. At the end I asked it to move the result into this blog and to use the blog's features.

Decide for yourself whether it is worth reading. Everything here can be reproduced: the code is in the folders of this post, see [the code and how to use it](#code).
{% </admonition> %}

<link rel="stylesheet" href="demo/demo.css">
<style>
/* the article's diagrams and the live widgets, scoped to this post */
.co2-fig { --paper-2: #eef1f4; --ink: #14171c; --ink-2: #4b5260; --rule: #d3d9e0; --orange: #c95f12; --blue: #2a63c4; --green: #2f8a26; --gold: #9a7613; margin: 1.6em auto; max-width: 640px; }
.co2-fig svg { width: 100%; height: auto; display: block; margin: 0 auto; }
.co2-fig svg text { font-family: "Rubik", "Helvetica Neue", Arial, sans-serif; }
.co2-demo { --co2-bg: #f7f8fa; --co2-fg: #24292f; --co2-accent: #c95f12; --co2-line: rgba(100, 110, 125, 0.32); text-align: left; hyphens: manual; }
.co2-demo pre, .co2-demo code { text-align: left; }
/* names coloured by the kind of value they hold, as on the original page: one number, a pair (a complex number), a point or a direction, a struct */
.tf { color: #0c7869; } .tv2 { color: #ad2f96; } .tv { color: #2a5fc4; } .ts { color: #8a5a14; }
.main-content code.tf { color: #0c7869; } .main-content code.tv2 { color: #ad2f96; } .main-content code.tv { color: #2a5fc4; } .main-content code.ts { color: #8a5a14; }
.main-content code.tf, .main-content code.tv2, .main-content code.tv, .main-content code.ts { font-weight: 600; }
pre.co2-code .kw, pre.co2-code .ty { font-weight: 700; }
pre.co2-code .fn { font-weight: 600; }
pre.co2-code .c { color: #7F8989; font-style: italic; }
</style>

Three videos show what it looks like to live inside a curved space. In [What would a wormhole look like in the real life?](https://youtu.be/zA85gINcW1g) (optozorax), [How does a 2D creature see curved space?](https://www.youtube.com/watch?v=9JbYDDjhnx4) and [What if our world is just a surface of a 4D object?](https://www.youtube.com/watch?v=LyqkcvSir4w) (Artem Yashin), the space is a surface: a 2D world drawn as a surface in 3D, or a 3D world drawn as a hypersurface in 4D. The surface is an SDF, light walks along it by stepping and pushing back onto it, and worlds are glued together with smooth unions. This article takes that method one dimension further up, and finds that the extra dimension buys a surprising amount: flat wormhole throats, one wormhole for three worlds, mirrors, portals that are flat right up to the frame, and cones with more than 360° around their tip.

<div class="co2-demo" data-scene="flat_portal3"></div>

{% <details summary="👆 How to use this demo"> %}
Every 2D world of the article, traced live in your browser. It starts on a flat portal between three worlds in 4D; pick any other scene from the list.

* **Left, the view from inside:** what a creature living in the world sees. Drag or press W/S to walk, right-drag or Q/E to turn, the wheel to zoom.
* **Right, the view from outside:** the same world in 4D. Drag to orbit, shift-drag to turn the view through the fourth dimension, or switch to a slice.
* **The sliders** change the scene, and the code below shows the formula of the scene, coloured by the kind of each value.

The scenes are explained one by one in the text; [§14](#demo) says more about the playground, and the 3D version of this portal is in [§11](#portal).
{% </details> %}

{% <admonition color="blue" title="🧭 The questions this article answers"> %}
1. [What is the framework to work with 2D surfaces in 4D, instead of SDFs, that supports the same level of composition and smooth union?](#two) An SDF gives one number, and one normal is not enough to push a point back onto a surface that has two directions leaving it.
2. [Is projective geometric algebra the answer? Instead of storing two normals, can we store just a bivector?](#ga)
3. [Three 3D worlds do not fit side by side in 4D, so they have to be bent into U-shapes before a wormhole can join them. In 5D, can three flat worlds simply sit next to each other, joined by three cylinders and a smooth union?](#union)
4. [Can a wormhole's throat be flat, by extruding a Clifford torus and connecting it to two planes, so that inside you see yourself repeating without any distortion?](#throat)
5. [Does a higher dimension unlock something like a black hole, a mirror, or a rotation wormhole?](#mirror)
6. [A flat cone in 3D has less than 360° around its tip. Is more possible in 4D?](#cone)
7. [What does a true portal look like, flat at the entrance with only its edge special, if it is built as a smooth surface?](#portal)
8. [Can three worlds touch at a single point, and what happens there?](#neck)
9. [Can a wormhole lead back into itself, its throat glued to itself, so that inside you meet your own unmirrored image and come back out into the same world?](#mono)
10. [For a 3D world in 5D, are there two kinds, one that mirrors you and one that does not, or one wormhole that does either depending on where you go in?](#mono3)
{% </admonition> %}

# Part I. The tool

## 1. The method in the videos {#recap}

{{ <myyoutube id="zA85gINcW1g" /> }}

{{ <myyoutube id="9JbYDDjhnx4" /> }}

{{ <myyoutube id="LyqkcvSir4w" /> }}

In all three videos a curved space is a surface, given by an SDF in one more dimension: a function that returns the distance to the surface. A 2D creature lives on a surface in 3D. A 3D creature lives on a hypersurface in 4D. Light travels along the shortest paths of the surface, the geodesics, and the videos follow them with four lines of code. Step along the ray, push the point back onto the surface along the normal, and make the direction tangent again:

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="ty tf">float</span><span> </span><span class="fn">sdf</span><span>(</span><span class="ty tv">vec3</span><span> </span><span class="tv">p</span><span>);                          </span><span class="c">// the world is where sdf(p) == 0</span></span>
<span class="giallo-l"></span>
<span class="giallo-l"><span class="ty">void</span><span> </span><span class="fn">step</span><span>(</span><span class="kw">inout</span><span> </span><span class="ty tv">vec3</span><span> </span><span class="tv">p</span><span>, </span><span class="kw">inout</span><span> </span><span class="ty tv">vec3</span><span> </span><span class="tv">dir</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">dt</span><span>) {</span></span>
<span class="giallo-l"><span>    </span><span class="tv">p</span><span> += </span><span class="tv">dir</span><span> * </span><span class="tf">dt</span><span>;                          </span><span class="c">// step along the ray</span></span>
<span class="giallo-l"><span>    </span><span class="tv">p</span><span> -= </span><span class="fn">normal</span><span>(</span><span class="tv">p</span><span>) * </span><span class="fn">sdf</span><span>(</span><span class="tv">p</span><span>);                </span><span class="c">// push back onto the surface</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv">vec3</span><span> </span><span class="tv">n</span><span> = </span><span class="fn">normal</span><span>(</span><span class="tv">p</span><span>);                     </span><span class="c">// the normal (the gradient of sdf) at the new point</span></span>
<span class="giallo-l"><span>    </span><span class="tv">dir</span><span> = </span><span class="fn">normalize</span><span>(</span><span class="tv">dir</span><span> - </span><span class="fn">dot</span><span>(</span><span class="tv">dir</span><span>, </span><span class="tv">n</span><span>) * </span><span class="tv">n</span><span>); </span><span class="c">// keep the direction along the surface</span></span>
<span class="giallo-l"><span>}</span></span></code></pre>

The worlds themselves are built from a handful of small SDF functions. These are the ones used throughout this article:

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="ty tf">float</span><span> </span><span class="fn">ball</span><span>(</span><span class="ty tv">vec3</span><span> </span><span class="tf">p</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">r</span><span>) { </span><span class="kw">return</span><span> </span><span class="fn">length</span><span>(</span><span class="tf">p</span><span>) - </span><span class="tf">r</span><span>; }   </span><span class="c">// a ball; the same with vec2 or vec4 points</span></span>
<span class="giallo-l"></span>
<span class="giallo-l"><span class="c">// an SDF value d, extruded along the coordinate p from -h to h</span></span>
<span class="giallo-l"><span class="ty tf">float</span><span> </span><span class="fn">extrude</span><span>(</span><span class="ty tf">float</span><span> </span><span class="tf">p</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">d</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">h</span><span>) {</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">w</span><span> = </span><span class="ty tv2">vec2</span><span>(</span><span class="tf">d</span><span>, </span><span class="fn">abs</span><span>(</span><span class="tf">p</span><span>) - </span><span class="tf">h</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="fn">min</span><span>(</span><span class="fn">max</span><span>(</span><span class="tf">w.x</span><span>, </span><span class="tf">w.y</span><span>), </span><span class="tf num">0.0</span><span>) + </span><span class="fn">length</span><span>(</span><span class="fn">max</span><span>(</span><span class="tv2">w</span><span>, </span><span class="tf num">0.0</span><span>));</span></span>
<span class="giallo-l"><span>}</span></span>
<span class="giallo-l"></span>
<span class="giallo-l"><span class="c">// smooth union: the minimum, rounded off where a and b are within k of each other</span></span>
<span class="giallo-l"><span class="ty tf">float</span><span> </span><span class="fn">smin</span><span>(</span><span class="ty tf">float</span><span> </span><span class="tf">a</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">b</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">k</span><span>) {</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">h</span><span> = </span><span class="fn">clamp</span><span>(</span><span class="tf num">0.5</span><span> + </span><span class="tf num">0.5</span><span> * (</span><span class="tf">b</span><span> - </span><span class="tf">a</span><span>) / </span><span class="tf">k</span><span>, </span><span class="tf num">0.0</span><span>, </span><span class="tf num">1.0</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="fn">mix</span><span>(</span><span class="tf">b</span><span>, </span><span class="tf">a</span><span>, </span><span class="tf">h</span><span>) - </span><span class="tf">k</span><span> * </span><span class="tf">h</span><span> * (</span><span class="tf num">1.0</span><span> - </span><span class="tf">h</span><span>);</span></span>
<span class="giallo-l"><span>}</span></span>
<span class="giallo-l"></span>
<span class="giallo-l"><span class="c">// smooth union with a round fillet of radius r</span></span>
<span class="giallo-l"><span class="ty tf">float</span><span> </span><span class="fn">union_round</span><span>(</span><span class="ty tf">float</span><span> </span><span class="tf">a</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">b</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">r</span><span>) {</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">u</span><span> = </span><span class="fn">max</span><span>(</span><span class="ty tv2">vec2</span><span>(</span><span class="tf">r</span><span> - </span><span class="tf">a</span><span>, </span><span class="tf">r</span><span> - </span><span class="tf">b</span><span>), </span><span class="ty tv2">vec2</span><span>(</span><span class="tf num">0.0</span><span>));</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="fn">max</span><span>(</span><span class="tf">r</span><span>, </span><span class="fn">min</span><span>(</span><span class="tf">a</span><span>, </span><span class="tf">b</span><span>)) - </span><span class="fn">length</span><span>(</span><span class="tv2">u</span><span>);</span></span>
<span class="giallo-l"><span>}</span></span></code></pre>

With these, the wormhole of the first video is three ideas. Take everything below one 3D world and everything above a second, parallel one. Stretch a ball along the fourth axis into a tube between them. Smooth-union the three:

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="ty tf">float</span><span> </span><span class="fn">wormhole</span><span>(</span><span class="ty tv">vec4</span><span> </span><span class="tv">p</span><span>) {                          </span><span class="c">// two 3D worlds, w = 0 and w = height, joined by a tube</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">d1</span><span> = </span><span class="tf">p.w</span><span>;                               </span><span class="c">// everything below the first world</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">d2</span><span> = </span><span class="tf">p.w</span><span> - </span><span class="tf">height</span><span>;                      </span><span class="c">// flipped below: everything above the second</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">d3</span><span> = </span><span class="fn">ball</span><span>(</span><span class="tv">p.xyz</span><span>, radius);               </span><span class="c">// a ball ...</span></span>
<span class="giallo-l"><span>    </span><span class="tf">d3</span><span> = </span><span class="fn">extrude</span><span>(</span><span class="tf">p.w</span><span> - </span><span class="tf">height</span><span> / </span><span class="tf num">2.0</span><span>, </span><span class="tf">d3</span><span>, </span><span class="tf">height</span><span>); </span><span class="c">// ... stretched along w into a tube</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="fn">union_round</span><span>(</span><span class="tf">d1</span><span>, </span><span class="fn">union_round</span><span>(-</span><span class="tf">d2</span><span>, </span><span class="tf">d3</span><span>, </span><span class="tf">k</span><span>), </span><span class="tf">k</span><span>);</span></span>
<span class="giallo-l"><span>}</span></span></code></pre>

The surface is the boundary of that union: the two worlds with a hole each, and the tube wall between the holes. The videos show these worlds in three ways, and this article uses all three.

{% <admonition color="gray" title="🛠 Three ways to look at a world"> %}
The *scan*: each pixel of a disk around the camera shows where a ray ends after travelling the pixel's distance from the centre. The *curvature colours* of the second video: grey where the space is flat, orange where it is curved like a ball, blue where it is curved like a saddle. And the *slice*: fix one coordinate, such as {% <katex> %}y{% </katex> %}, and look at what the remaining three coordinates contain.
{% </admonition> %}

This article asks what happens if the whole picture moves up by one more dimension: a 2D world inside 4D, a 3D world inside 5D.

## 2. One dimension up: one number is not enough {#two}

{% <admonition color="violet" title="❓ Question"> %}
What is the framework to work with 2D surfaces in 4D, instead of SDFs, that supports the same level of composition and smooth union?
{% </admonition> %}

One equation removes one dimension. In 3D, {% <katex> %}f\(p\)\=0{% </katex> %} is a 2D surface, which is why one SDF is enough for a 2D world. In 4D, one equation is a 3D thing, which is right for a 3D world. A 2D world inside 4D needs two equations at once. One dimension down you can see why: a line in 3D is where two planes meet, here a floor and a wall.

<div class="co2-fig">
<svg class="diagram fig3d" viewBox="0 0 600 380" role="img" aria-label="A green floor and a see-through orange wall crossing it. Each is where one number is zero; the black line where the wall meets the floor is where both are zero: the world.">
<image href="figs/planes.png" x="0" y="0" width="600" height="380"/>
<text x="63.1" y="240.4" font-size="14" font-weight="600" fill="#2d7a2a" text-anchor="start" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">floor: the first number f = 0</text>
<text x="500.4" y="80.6" font-size="14" font-weight="600" fill="#a4561a" text-anchor="end" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">wall: the second number g = 0</text>
<line x1="530.0" y1="253.3" x2="459.3" y2="217.8" stroke="#1f2328" stroke-width="1.4"/>
<circle cx="459.3" cy="217.8" r="2.6" fill="#1f2328"/>
<text x="585.0" y="263.3" font-size="14" font-weight="600" fill="#1f2328" text-anchor="end" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">the world: both are 0</text>
</svg>
</div>

Each plane alone is where one number is zero. The world, the line, is where both are zero.

{% <admonition color="gray" title="🛠 Terms"> %}
* **The world** is the space the creatures live in: here the line, later a 2D surface or a 3D space.
* **The codimension** is the number of equations you need: the dimension of the space minus the dimension of the world. The videos work in codimension 1. Everything here is codimension 2: 2D worlds in 4D, and 3D worlds in 5D.
{% </admonition> %}

So the field returns two numbers, a <code class="tv2">vec2</code>, and the world is where both are zero. The simplest world, the flat {% <katex> %}xy{% </katex> %}-plane inside 4D, is "{% <katex> %}z\=0{% </katex> %} and {% <katex> %}w\=0{% </katex> %}":

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">co2sdf</span><span>(</span><span class="ty tv">vec4</span><span> </span><span class="tv">p</span><span>) { </span><span class="kw">return</span><span> </span><span class="ty tv2">vec2</span><span>(</span><span class="tf">p.z</span><span>, </span><span class="tf">p.w</span><span>); }    </span><span class="c">// the plane z = 0, w = 0</span></span></code></pre>

## 3. Pushing a point back onto the world {#project}

From here on, colours in the code tell you what kind of value each name holds:

{% <admonition color="gray" title="🛠 Types in the code"> %}
* <code class="tf">float</code> one number
* <code class="tv2">vec2</code> a pair of numbers (from [§9](#complex) on, one complex number)
* <code class="tv">vec4</code>, <code class="tv">vec5</code> a point or a direction in 4D or 5D
* <code class="ts">Field</code> a struct of these
{% </admonition> %}

With one SDF you push the point along the gradient. With two numbers there are two gradients, the 4D vectors {% <katex> %}\\textcolor\{2a5fc4\}\{a\}{% </katex> %} and {% <katex> %}\\textcolor\{2a5fc4\}\{b\}{% </katex> %}: {% <katex> %}\\textcolor\{2a5fc4\}\{a\}{% </katex> %} is the gradient of the first number {% <katex> %}\\textcolor\{0c7869\}\{f\}{% </katex> %}, and {% <katex> %}\\textcolor\{2a5fc4\}\{b\}{% </katex> %} the gradient of the second number {% <katex> %}\\textcolor\{0c7869\}\{g\}{% </katex> %}. Both are perpendicular to the world, and together they span the directions that leave it.

We look for a small move {% <katex> %}\\textcolor\{2a5fc4\}\{d\}{% </katex> %} that makes both numbers zero. Moving by {% <katex> %}\\textcolor\{2a5fc4\}\{d\}{% </katex> %} changes the first number by about {% <katex> %}\\textcolor\{2a5fc4\}\{a\}\\cdot \\textcolor\{2a5fc4\}\{d\}{% </katex> %} and the second by about {% <katex> %}\\textcolor\{2a5fc4\}\{b\}\\cdot \\textcolor\{2a5fc4\}\{d\}{% </katex> %}; that is what a gradient means. So we want

{% <katex block={true}> %}\textcolor{0c7869}{f} + \textcolor{2a5fc4}{a}\cdot \textcolor{2a5fc4}{d} = 0,\qquad \textcolor{0c7869}{g} + \textcolor{2a5fc4}{b}\cdot \textcolor{2a5fc4}{d} = 0 .{% </katex> %}

These are two equations for the four components of {% <katex> %}\\textcolor\{2a5fc4\}\{d\}{% </katex> %}, so there are many solutions. Every point of the world near {% <katex> %}p{% </katex> %} is one: each of them makes both numbers zero. Which one should the push go to? The point we are pushing was just produced by a step along the ray, and the step already decided how far along the world the ray travels and in which direction. The push should only undo the small error of having left the world. Any other solution would also slide the point along the world, moving the ray forward, back or sideways by an amount nobody asked for. So we take the *nearest* point of the world: the shortest move.

<div class="co2-fig">
<svg class="diagram fig3d" viewBox="0 0 600 350" role="img" aria-label="The world is a black line; a blue point p is just off it. A bold blue arrow goes straight across to the nearest point of the world, at a right angle, inside a purple disc of the directions that leave the world. Grey dashed arrows go to other points of the world: they are longer and slide along it.">
<image href="figs/push.png" x="0" y="0" width="600" height="350"/>
<text x="288.9" y="99.9" font-size="14" font-weight="600" fill="#2f6fd6" text-anchor="start" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">p, just off the world</text>
<line x1="341.9" y1="225.7" x2="322.4" y2="189.3" stroke="#2f6fd6" stroke-width="1.4"/>
<circle cx="322.4" cy="189.3" r="2.6" fill="#2f6fd6"/>
<text x="343.9" y="236.7" font-size="14" font-weight="600" fill="#2f6fd6" text-anchor="start" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">shortest move: straight across,</text>
<text x="343.9" y="250.7" font-size="14" font-weight="600" fill="#2f6fd6" text-anchor="start" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">at a right angle to the world</text>
<text x="142.3" y="197.6" font-size="14" font-weight="600" fill="#4e535b" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">longer moves also reach the world,</text>
<text x="142.3" y="211.6" font-size="14" font-weight="600" fill="#4e535b" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">but slide along it</text>
<text x="324.4" y="74.4" font-size="14" font-weight="600" fill="#6b3fa8" text-anchor="start" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">directions that leave the world</text>
<text x="88.8" y="147.5" font-size="14" font-weight="600" fill="#1f2328" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">the world</text>
</svg>
</div>

The shortest move goes straight across the world, so it uses only the directions that leave it: {% <katex> %}\\textcolor\{2a5fc4\}\{d\}\=\\textcolor\{0c7869\}\{\\alpha\}\\\,\\textcolor\{2a5fc4\}\{a\}\+\\textcolor\{0c7869\}\{\\beta\}\\\,\\textcolor\{2a5fc4\}\{b\}{% </katex> %} for two numbers {% <katex> %}\\textcolor\{0c7869\}\{\\alpha\}{% </katex> %} and {% <katex> %}\\textcolor\{0c7869\}\{\\beta\}{% </katex> %}. That turns four unknowns into two. Plugging it in gives an ordinary system of two linear equations for {% <katex> %}\\textcolor\{0c7869\}\{\\alpha\}{% </katex> %} and {% <katex> %}\\textcolor\{0c7869\}\{\\beta\}{% </katex> %}, solved with Cramer's rule. That small solve is the whole trick:

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="kw">struct</span><span> </span><span class="ty ts">Field</span><span> { </span><span class="ty tv2">vec2</span><span> </span><span class="tv">v</span><span>; </span><span class="ty tv">vec4</span><span> </span><span class="tv">a</span><span>; </span><span class="ty tv">vec4</span><span> </span><span class="tv">b</span><span>; };    </span><span class="c">// both numbers, and the gradient of each</span></span>
<span class="giallo-l"></span>
<span class="giallo-l"><span class="ty ts">Field</span><span> </span><span class="fn">field</span><span>(</span><span class="ty tv">vec4</span><span> </span><span class="tv">p</span><span>) {                        </span><span class="c">// numerical gradients: 8 extra samples</span></span>
<span class="giallo-l"><span>    </span><span class="kw">const</span><span> </span><span class="ty tf">float</span><span> </span><span class="tf">h</span><span> = </span><span class="tf num">1e-4</span><span>;</span></span>
<span class="giallo-l"><span>    </span><span class="ty ts">Field</span><span> </span><span class="ts">F</span><span>; </span><span class="tv2">F.v</span><span> = </span><span class="fn">co2sdf</span><span>(</span><span class="tv">p</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="kw">for</span><span> (</span><span class="ty tf">int</span><span> </span><span class="tf">i</span><span> = </span><span class="tf num">0</span><span>; </span><span class="tf">i</span><span> &lt; </span><span class="tf num">4</span><span>; </span><span class="tf">i</span><span>++) {</span></span>
<span class="giallo-l"><span>        </span><span class="ty tv">vec4</span><span> </span><span class="tv">e</span><span> = </span><span class="ty tv">vec4</span><span>(</span><span class="tf num">0.0</span><span>); </span><span class="tv">e</span><span>[</span><span class="tf">i</span><span>] = </span><span class="tf">h</span><span>;</span></span>
<span class="giallo-l"><span>        </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">d</span><span> = (</span><span class="fn">co2sdf</span><span>(</span><span class="tv">p</span><span> + </span><span class="tv">e</span><span>) - </span><span class="fn">co2sdf</span><span>(</span><span class="tv">p</span><span> - </span><span class="tv">e</span><span>)) / (</span><span class="tf num">2.0</span><span> * </span><span class="tf">h</span><span>);</span></span>
<span class="giallo-l"><span>        </span><span class="tv">F.a</span><span>[</span><span class="tf">i</span><span>] = </span><span class="tf">d.x</span><span>; </span><span class="tv">F.b</span><span>[</span><span class="tf">i</span><span>] = </span><span class="tf">d.y</span><span>;</span></span>
<span class="giallo-l"><span>    }</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="ts">F</span><span>;</span></span>
<span class="giallo-l"><span>}</span></span>
<span class="giallo-l"></span>
<span class="giallo-l"><span class="c">// the move m = alpha * a + beta * b with dot(a, m) = want.x and dot(b, m) = want.y</span></span>
<span class="giallo-l"><span class="ty tv">vec4</span><span> </span><span class="fn">fix</span><span>(</span><span class="ty ts">Field</span><span> </span><span class="ts">F</span><span>, </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">want</span><span>) {</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">aa</span><span> = </span><span class="fn">dot</span><span>(</span><span class="tv">F.a</span><span>, </span><span class="tv">F.a</span><span>), </span><span class="tf">ab</span><span> = </span><span class="fn">dot</span><span>(</span><span class="tv">F.a</span><span>, </span><span class="tv">F.b</span><span>), </span><span class="tf">bb</span><span> = </span><span class="fn">dot</span><span>(</span><span class="tv">F.b</span><span>, </span><span class="tv">F.b</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">det</span><span> = </span><span class="tf">aa</span><span> * </span><span class="tf">bb</span><span> - </span><span class="tf">ab</span><span> * </span><span class="tf">ab</span><span>;            </span><span class="c">// squared area of the parallelogram (a, b)</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">alpha</span><span> = (</span><span class="tf">want.x</span><span> * </span><span class="tf">bb</span><span> - </span><span class="tf">want.y</span><span> * </span><span class="tf">ab</span><span>) / </span><span class="tf">det</span><span>;</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">beta</span><span>  = (</span><span class="tf">want.y</span><span> * </span><span class="tf">aa</span><span> - </span><span class="tf">want.x</span><span> * </span><span class="tf">ab</span><span>) / </span><span class="tf">det</span><span>;</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="tf">alpha</span><span> * </span><span class="tv">F.a</span><span> + </span><span class="tf">beta</span><span> * </span><span class="tv">F.b</span><span>;</span></span>
<span class="giallo-l"><span>}</span></span>
<span class="giallo-l"></span>
<span class="giallo-l"><span class="ty tv">vec4</span><span> </span><span class="fn">push_back</span><span>(</span><span class="ty tv">vec4</span><span> </span><span class="tv">p</span><span>, </span><span class="ty ts">Field</span><span> </span><span class="ts">F</span><span>) { </span><span class="kw">return</span><span> </span><span class="tv">p</span><span> - </span><span class="fn">fix</span><span>(</span><span class="ts">F</span><span>, </span><span class="tv2">F.v</span><span>); }      </span><span class="c">// both numbers become 0</span></span>
<span class="giallo-l"><span class="ty tv">vec4</span><span> </span><span class="fn">tangent</span><span>(</span><span class="ty tv">vec4</span><span> </span><span class="tv">v</span><span>, </span><span class="ty ts">Field</span><span> </span><span class="ts">F</span><span>) {                                  </span><span class="c">// remove the parts along a and b</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="tv">v</span><span> - </span><span class="fn">fix</span><span>(</span><span class="ts">F</span><span>, </span><span class="ty tv2">vec2</span><span>(</span><span class="fn">dot</span><span>(</span><span class="tv">v</span><span>, </span><span class="tv">F.a</span><span>), </span><span class="fn">dot</span><span>(</span><span class="tv">v</span><span>, </span><span class="tv">F.b</span><span>)));</span></span>
<span class="giallo-l"><span>}</span></span></code></pre>

The same `fix` does both jobs. Pushing back asks for the move that cancels the two numbers. Making a direction tangent asks for the part of the direction that changes the two numbers, and removes it.

<code class="tf">det</code> is the squared area of the parallelogram spanned by the two gradients. If it is zero, the gradients point the same way, the two equations do not really describe a 2D world there, and the push fails. A well-made field keeps the gradients independent everywhere on the world, and the next sections build fields like that. Operators that switch between two formulas, such as `union` and `neck_union`, need one extra bit of care for their gradients ([§16](#pitfalls)).

## 4. Walking along the world {#walk}

A ray step is now: move, push back twice, and take the new direction from the step just made:

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="c">// F holds the field at p; on return it holds the field at the new p (reuse it next step)</span></span>
<span class="giallo-l"><span class="ty">void</span><span> </span><span class="fn">walk</span><span>(</span><span class="kw">inout</span><span> </span><span class="ty tv">vec4</span><span> </span><span class="tv">p</span><span>, </span><span class="kw">inout</span><span> </span><span class="ty tv">vec4</span><span> </span><span class="tv">dir</span><span>, </span><span class="kw">inout</span><span> </span><span class="ty ts">Field</span><span> </span><span class="ts">F</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">dt</span><span>) {</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv">vec4</span><span> </span><span class="tv">q</span><span> = </span><span class="tv">p</span><span> + </span><span class="tv">dir</span><span> * </span><span class="tf">dt</span><span>;</span></span>
<span class="giallo-l"><span>    </span><span class="tv">q</span><span> -= </span><span class="fn">fix</span><span>(</span><span class="ts">F</span><span>, </span><span class="fn">co2sdf</span><span>(</span><span class="tv">q</span><span>));               </span><span class="c">// first push uses the gradients from the start point</span></span>
<span class="giallo-l"><span>    </span><span class="tv">q</span><span> = </span><span class="fn">push_back</span><span>(</span><span class="tv">q</span><span>, </span><span class="fn">field</span><span>(</span><span class="tv">q</span><span>));           </span><span class="c">// second push with fresh gradients</span></span>
<span class="giallo-l"><span>    </span><span class="ts">F</span><span> = </span><span class="fn">field</span><span>(</span><span class="tv">q</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="tv">dir</span><span> = </span><span class="fn">normalize</span><span>(</span><span class="fn">tangent</span><span>(</span><span class="tv">q</span><span> - </span><span class="tv">p</span><span>, </span><span class="ts">F</span><span>));   </span><span class="c">// new direction: the step itself, made tangent</span></span>
<span class="giallo-l"><span>    </span><span class="tv">p</span><span> = </span><span class="tv">q</span><span>;</span></span>
<span class="giallo-l"><span>}</span></span></code></pre>

Everything else, the scan, the camera that walks with the mouse, the curvature colours, works exactly as in the videos, with 4D vectors instead of 3D ones. For a 3D world in 5D it is the same code with 5 components.

## 5. What the two numbers mean {#meaning}

Stand on the world and look only at the directions that leave it. For a line in 3D they form a disc across the line; for a 2D world in 4D they form a plane in the same way. The world crosses that plane at a single point. A nearby point {% <katex> %}p{% </katex> %} sits somewhere in it, and the two numbers are its coordinates there:

<div class="co2-fig">
<svg class="diagram fig3d" viewBox="0 0 600 400" role="img" aria-label="The world is a black line piercing a purple disc, the directions that leave it. In the disc, a green arrow a and an orange arrow b at a right angle show where the first and the second number grow. A point p in the disc has coordinates f and g along them; the blue arrow to p is the distance, its angle from b says which way around the world p lies, and a dashed circle through p shows all points at the same distance.">
<image href="figs/meaning.png" x="0" y="0" width="600" height="400"/>
<text x="383.5" y="138.6" font-size="16" font-weight="600" fill="#2f6fd6" text-anchor="start" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">p</text>
<text x="284.5" y="60.8" font-size="14" font-weight="600" fill="#2d7a2a" text-anchor="start" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">a: f grows</text>
<text x="434.3" y="212.3" font-size="14" font-weight="600" fill="#a4561a" text-anchor="start" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">b: g grows</text>
<text x="274.1" y="159.4" font-size="16" font-weight="600" fill="#2d7a2a" text-anchor="end" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">f</text>
<text x="373.7" y="232.7" font-size="16" font-weight="600" fill="#a4561a" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">g</text>
<text x="321.5" y="184.6" font-size="14" font-weight="600" fill="#2f6fd6" text-anchor="end" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">distance</text>
<text x="337.7" y="209.4" font-size="12" font-weight="600" fill="#2f6fd6" text-anchor="start" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">angle</text>
<line x1="100.0" y1="376.0" x2="231.4" y2="355.1" stroke="#6b3fa8" stroke-width="1.4"/>
<circle cx="231.4" cy="355.1" r="2.6" fill="#6b3fa8"/>
<text x="12.0" y="387.0" font-size="14" font-weight="600" fill="#6b3fa8" text-anchor="start" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">same distance, every angle around the world</text>
<text x="12.0" y="22.0" font-size="14" font-weight="600" fill="#6b3fa8" text-anchor="start" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">directions that leave the world</text>
<text x="419.6" y="358.2" font-size="14" font-weight="600" fill="#1f2328" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">the world</text>
</svg>
</div>

So the pair {% <katex> %}\(\\textcolor\{0c7869\}\{f\}\, \\textcolor\{0c7869\}\{g\}\){% </katex> %} is a 2D vector pointing from the world to {% <katex> %}p{% </katex> %}. Its length is the distance to the world, and its angle says in which direction around the world {% <katex> %}p{% </katex> %} lies. In 4D you can walk *around* a 2D world, the way you can walk around a line in 3D, and that angle is how far around you are.

A good field behaves like a good SDF. For an SDF you want the gradient to have length 1, so that the value really is a distance. This is called the eikonal condition. Here you want both gradients to have length 1 and to be perpendicular. Then the length of {% <katex> %}\(\\textcolor\{0c7869\}\{f\}\,\\textcolor\{0c7869\}\{g\}\){% </katex> %} is exactly the distance, and `fix` reduces to `F.v.x * F.a + F.v.y * F.b`. If a field is only roughly like that, nothing breaks; blends just get a bit uneven, as with rough SDFs.

One thing is genuinely new. Rotating the pair does not change the world: rotating {% <katex> %}\(\\textcolor\{0c7869\}\{f\}\,\\textcolor\{0c7869\}\{g\}\){% </katex> %} by any angle still gives zero exactly on the world. So the angle is a free choice, just as the sign of an SDF is a free choice (you can always flip it). The sign decides which side is inside. The angle decides something similar, which [§7](#union) needs for joining worlds. Mathematicians call this freedom a gauge; here it is just "the pair can be rotated".

# Part II. Building worlds

## 6. Worlds from SDFs {#first}

The easiest way to get two well-behaved numbers is to take two ordinary SDFs. One dimension down, this is how a circle sits in 3D:

{% <admonition color="gray" title="🛠 Terms"> %}
* **The carrier** is where the world lives: the zero set of the second SDF, a 3D space inside 4D (a plane, in the picture below).
* **The solid** is the region where the first SDF is negative, an ordinary solid like the ones in the videos.
* **The world** is the boundary of the solid inside the carrier.
{% </admonition> %}

<div class="co2-fig">
<svg class="diagram fig3d" viewBox="0 0 600 280" role="img" aria-label="One dimension down: a see-through green ball crosses a blue plane. The plane inside the ball is a shaded disc, and its orange edge, where the ball’s surface meets the plane, is the world.">
<image href="figs/circle.png" x="0" y="0" width="600" height="280"/>
<text x="6.5" y="161.7" font-size="14" font-weight="600" fill="#2a55a8" text-anchor="start" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">carrier: a plane</text>
<text x="292.4" y="26.6" font-size="14" font-weight="600" fill="#2d7a2a" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">solid: a ball</text>
<line x1="372.7" y1="259.1" x2="311.2" y2="189.6" stroke="#b55a12" stroke-width="1.4"/>
<circle cx="311.2" cy="189.6" r="2.6" fill="#b55a12"/>
<text x="372.7" y="270.1" font-size="14" font-weight="600" fill="#b55a12" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">world: where the ball’s surface meets the plane</text>
</svg>
</div>

In code, a world is just the pair, and each primitive below is one line built from ordinary SDFs:

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">world</span><span>(</span><span class="ty tf">float</span><span> </span><span class="tf">solid</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">carrier</span><span>) { </span><span class="kw">return</span><span> </span><span class="ty tv2">vec2</span><span>(</span><span class="tf">solid</span><span>, </span><span class="tf">carrier</span><span>); }</span></span>
<span class="giallo-l"></span>
<span class="giallo-l"><span class="c">// 2D worlds in 4D</span></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">plane</span><span>(</span><span class="ty tv">vec4</span><span> </span><span class="tv">p</span><span>)           { </span><span class="kw">return</span><span> </span><span class="fn">world</span><span>(</span><span class="tf">p.z</span><span>, </span><span class="tf">p.w</span><span>); }                  </span><span class="c">// the xy-plane</span></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">sphere</span><span>(</span><span class="ty tv">vec4</span><span> </span><span class="tv">p</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">r</span><span>) { </span><span class="kw">return</span><span> </span><span class="fn">world</span><span>(</span><span class="fn">ball</span><span>(</span><span class="tv">p.xyz</span><span>, </span><span class="tf">r</span><span>), </span><span class="tf">p.w</span><span>); }       </span><span class="c">// a round sphere</span></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">donut</span><span>(</span><span class="ty tv">vec4</span><span> </span><span class="tv">p</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">a</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">b</span><span>) {                                    </span><span class="c">// the torus of the videos</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="fn">world</span><span>(</span><span class="fn">ball</span><span>(</span><span class="ty tv2">vec2</span><span>(</span><span class="fn">ball</span><span>(</span><span class="tv2">p.xy</span><span>, </span><span class="tf">a</span><span>), </span><span class="tf">p.z</span><span>), </span><span class="tf">b</span><span>), </span><span class="tf">p.w</span><span>);</span></span>
<span class="giallo-l"><span>}</span></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">in_slice</span><span>(</span><span class="ty tv">vec4</span><span> </span><span class="tv">p</span><span>) { </span><span class="kw">return</span><span> </span><span class="fn">world</span><span>(</span><span class="fn">sdf</span><span>(</span><span class="tv">p.xyz</span><span>), </span><span class="tf">p.w</span><span>); }                  </span><span class="c">// any 3D-space SDF</span></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">flat_torus</span><span>(</span><span class="ty tv">vec4</span><span> </span><span class="tv">p</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">a</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">b</span><span>) {                               </span><span class="c">// a circle in xy</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="fn">world</span><span>(</span><span class="fn">ball</span><span>(</span><span class="tv2">p.xy</span><span>, </span><span class="tf">a</span><span>), </span><span class="fn">ball</span><span>(</span><span class="tv2">p.zw</span><span>, </span><span class="tf">b</span><span>));                           </span><span class="c">// and a circle in zw</span></span>
<span class="giallo-l"><span>}</span></span></code></pre>

The first four use the slice {% <katex> %}w\=0{% </katex> %} as their carrier, so they are ordinary 3D-space SDFs placed into 4D. The plane's solid is the half-space {% <katex> %}z\\lt 0{% </katex> %}, whose boundary inside the slice is the plane. Every 2D world of the videos is a 4D world this way, unchanged.

The flat torus is the first world that needs 4D. Its two numbers are two circles, one in the {% <katex> %}xy{% </katex> %} directions and one in the {% <katex> %}zw{% </katex> %} directions, and the world is where you are on both at once. This is the Clifford torus from the second video. Unlike the donut, it is completely flat inside: a 2D creature sees a perfect grid that repeats in both directions, like the Asteroids screen.

Here are the three from inside, as scans coloured by curvature:

{{ <gallery images={[
	"img/curv_sphere.webp",
	"img/curv_donut.webp",
	"img/curv_flat_torus.webp",
]} alts={[
	"**Sphere.** Curved like a ball everywhere (orange).",
	"**Donut.** Ball-like on the outside (orange), saddle-like on the inside (blue).",
	"**Flat torus.** Grey everywhere: flat. The faint dots are one marker, repeated on an exact lattice.",
]} nth={1} /> }}

<div class="co2-demo" data-scene="clifford" data-compact="1"></div>

For 3D worlds in 5D everything is the same with one more coordinate. The code writes <code class="tv">vec5</code> for a point of 5D, with `v` as its fifth coordinate:

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">space</span><span>(</span><span class="ty tv">vec5</span><span> </span><span class="tv">p</span><span>)    { </span><span class="kw">return</span><span> </span><span class="fn">world</span><span>(</span><span class="tf">p.w</span><span>, </span><span class="tf">p.v</span><span>); }           </span><span class="c">// the ordinary 3D space xyz, inside 5D</span></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">in_slice</span><span>(</span><span class="ty tv">vec5</span><span> </span><span class="tv">p</span><span>) { </span><span class="kw">return</span><span> </span><span class="fn">world</span><span>(</span><span class="fn">sdf</span><span>(</span><span class="tv">p.xyzw</span><span>), </span><span class="tf">p.v</span><span>); }   </span><span class="c">// any 4D-space SDF from the videos</span></span></code></pre>

As with `smin`, the numbers do not have to stay exact distances once you start combining things. What matters is that both are zero on the world and that their gradients point in different directions there. Which number is the solid and which is the carrier only matters when you join worlds. The flat torus would work just as well with the two circles swapped, and [§8](#turn) needs a third way to write it.

## 7. Joining worlds {#union}

Joining works on the solid. Inside one carrier, `min`, `smin` and `extrude` from [§1](#recap) do what they always did, and the carrier is carried along:

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">union</span><span>(</span><span class="ty tv2">vec2</span><span> </span><span class="tv2">A</span><span>, </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">B</span><span>)    { </span><span class="kw">return</span><span> </span><span class="tf">A.x</span><span> &lt; </span><span class="tf">B.x</span><span> ? </span><span class="tv2">A</span><span> : </span><span class="tv2">B</span><span>; }</span></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">subtract</span><span>(</span><span class="ty tv2">vec2</span><span> </span><span class="tv2">A</span><span>, </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">B</span><span>) { </span><span class="kw">return</span><span> </span><span class="tf">A.x</span><span> &gt; -</span><span class="tf">B.x</span><span> ? </span><span class="tv2">A</span><span> : </span><span class="fn">world</span><span>(-</span><span class="tf">B.x</span><span>, </span><span class="tf">B.y</span><span>); }</span></span>
<span class="giallo-l"></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">smooth_union</span><span>(</span><span class="ty tv2">vec2</span><span> </span><span class="tv2">A</span><span>, </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">B</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">k</span><span>) {</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">h</span><span> = </span><span class="fn">clamp</span><span>(</span><span class="tf num">0.5</span><span> + </span><span class="tf num">0.5</span><span> * (</span><span class="tf">B.x</span><span> - </span><span class="tf">A.x</span><span>) / </span><span class="tf">k</span><span>, </span><span class="tf num">0.0</span><span>, </span><span class="tf num">1.0</span><span>);   </span><span class="c">// the weight inside smin</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="fn">world</span><span>(</span><span class="fn">mix</span><span>(</span><span class="tf">B.x</span><span>, </span><span class="tf">A.x</span><span>, </span><span class="tf">h</span><span>) - </span><span class="tf">k</span><span> * </span><span class="tf">h</span><span> * (</span><span class="tf num">1.0</span><span> - </span><span class="tf">h</span><span>),         </span><span class="c">// smin, on the solids</span></span>
<span class="giallo-l"><span>                 </span><span class="fn">mix</span><span>(</span><span class="tf">B.y</span><span>, </span><span class="tf">A.y</span><span>, </span><span class="fn">smoothstep</span><span>(</span><span class="tf num">0.0</span><span>, </span><span class="tf num">1.0</span><span>, </span><span class="tf">h</span><span>)));      </span><span class="c">// carriers: the same weight, smoothed</span></span>
<span class="giallo-l"><span>}</span></span>
<span class="giallo-l"></span>
<span class="giallo-l"><span class="c">// extrude, on the solid</span></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">extrude</span><span>(</span><span class="ty tv2">vec2</span><span> </span><span class="tv2">A</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">p</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">h</span><span>) { </span><span class="kw">return</span><span> </span><span class="fn">world</span><span>(</span><span class="fn">extrude</span><span>(</span><span class="tf">p</span><span>, </span><span class="tf">A.x</span><span>, </span><span class="tf">h</span><span>), </span><span class="tf">A.y</span><span>); }</span></span></code></pre>

There is one rule: **pieces you join must have the same carrier where they meet.** Inside a shared carrier this is literally ordinary SDF code. Here is a 2D wormhole between two planes, the kind the second video walks through, as a 2D world in 4D. It is the same lines as the 4D wormhole of [§1](#recap), one dimension down, with a carrier added:

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">two_planes_wormhole</span><span>(</span><span class="ty tv">vec4</span><span> </span><span class="tv">p</span><span>) {</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">d1</span><span> = </span><span class="tf">p.y</span><span>;</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">d2</span><span> = </span><span class="tf">p.y</span><span> - </span><span class="tf">height</span><span>;</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">d3</span><span> = </span><span class="fn">ball</span><span>(</span><span class="tv2">p.xz</span><span>, </span><span class="tf">wormhole_size</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="tf">d3</span><span> = </span><span class="fn">extrude</span><span>(</span><span class="tf">p.y</span><span> - </span><span class="tf">height</span><span> / </span><span class="tf num">2.0</span><span>, </span><span class="tf">d3</span><span>, </span><span class="tf">height</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">d4</span><span> = </span><span class="fn">smin</span><span>(-</span><span class="tf">d2</span><span>, </span><span class="tf">d3</span><span>, </span><span class="tf">smoothing</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="fn">world</span><span>(</span><span class="fn">smin</span><span>(</span><span class="tf">d1</span><span>, </span><span class="tf">d4</span><span>, </span><span class="tf">smoothing</span><span>), </span><span class="tf">p.w</span><span>);       </span><span class="c">// the only new part: the carrier</span></span>
<span class="giallo-l"><span>}</span></span></code></pre>

<div class="co2-demo" data-scene="two_planes" data-compact="1"></div>

The usual tricks on the point work as well, because they change `p` before either number is computed. Move or rotate a world by evaluating it at the moved point, and scale it with `s * world(p / s)`. Replacing two coordinates by `length(p.xy)` spins a world around an axis, which is how the donut is built. `mod` on a coordinate repeats it. On the solid, `abs(A.x) - t` turns one world into two parallel copies inside its carrier, the onion trick of SDF libraries.

Comparing lengths instead of solids would not work. A tube that ends on a world should cut a hole in it, but the world under the mouth is still at distance zero from itself, so the hole would never open. With the solid, the tube's solid simply covers that disc of the world, exactly as in the wormholes of the videos.

This is also where the free rotation of the pair matters. The first number is "the solid", so rotating the pair rotates which side around the world counts as solid. Two pieces that you join must agree near their junction: same carrier, same solid side. For an ordinary SDF the same thing happens with signs, where you flip signs to choose between union and intersection. Here the choice is an angle instead of a sign.

### Three parallel worlds, joined pairwise

{% <admonition color="violet" title="❓ Question"> %}
Three 3D worlds do not fit side by side in 4D, so they had to be bent into U-shapes. In 5D, can three flat worlds simply sit next to each other, joined by cylinders and a smooth union?
{% </admonition> %}

Yes. Put three 3D worlds side by side in the two extra directions, at the corners of a triangle. Any two of them lie in one common 4D slice, where they are two parallel planes. In that slice the wormhole between them is the two-planes wormhole, and the carrier is the slice. Do this for the three pairs and join the results with `union`:

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="c">// 3D worlds in 5D at the points c0, c1, c2 of the extra plane p.wv</span></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">wormhole_between</span><span>(</span><span class="ty tv">vec5</span><span> </span><span class="tv">p</span><span>, </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">ci</span><span>, </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">cj</span><span>, </span><span class="ty tv">vec3</span><span> </span><span class="tv">mouth</span><span>) {</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv2">vec2</span><span>  </span><span class="tv2">e</span><span> = </span><span class="fn">normalize</span><span>(</span><span class="tv2">cj</span><span> - </span><span class="tv2">ci</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">L</span><span> = </span><span class="fn">distance</span><span>(</span><span class="tv2">ci</span><span>, </span><span class="tv2">cj</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">t</span><span> = </span><span class="fn">dot</span><span>(</span><span class="tv2">p.wv</span><span> - </span><span class="tv2">ci</span><span>, </span><span class="tv2">e</span><span>);                    </span><span class="c">// 0 on world i, L on world j</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">s</span><span> = </span><span class="fn">dot</span><span>(</span><span class="tv2">p.wv</span><span> - </span><span class="tv2">ci</span><span>, </span><span class="ty tv2">vec2</span><span>(-</span><span class="tf">e.y</span><span>, </span><span class="tf">e.x</span><span>));      </span><span class="c">// the carrier: 0 on the slice with both worlds</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">worlds</span><span> = </span><span class="fn">min</span><span>(</span><span class="tf">t</span><span>, </span><span class="tf">L</span><span> - </span><span class="tf">t</span><span>);                   </span><span class="c">// d1 and -d2: beyond the two worlds</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">tube</span><span> = </span><span class="fn">ball</span><span>(</span><span class="ty tv">vec4</span><span>(</span><span class="tv">p.xyz</span><span> - </span><span class="tv">mouth</span><span>, </span><span class="tf">s</span><span>), </span><span class="tf">r</span><span>);   </span><span class="c">// d3; its ends hide in the worlds' solid</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="fn">world</span><span>(</span><span class="fn">smin</span><span>(</span><span class="tf">worlds</span><span>, </span><span class="tf">tube</span><span>, </span><span class="tf">k</span><span>), </span><span class="tf">s</span><span>);</span></span>
<span class="giallo-l"><span>}</span></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">three_worlds</span><span>(</span><span class="ty tv">vec5</span><span> </span><span class="tv">p</span><span>) {</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="fn">union</span><span>(</span><span class="fn">wormhole_between</span><span>(</span><span class="tv">p</span><span>, c0, c1, mouth01),</span></span>
<span class="giallo-l"><span>           </span><span class="fn">union</span><span>(</span><span class="fn">wormhole_between</span><span>(</span><span class="tv">p</span><span>, c1, c2, mouth12),</span></span>
<span class="giallo-l"><span>                 </span><span class="fn">wormhole_between</span><span>(</span><span class="tv">p</span><span>, c2, c0, mouth20)));</span></span>
<span class="giallo-l"><span>}</span></span></code></pre>

The `s` inside the tube's `ball` keeps each tube's solid near its own slice. Without it, the tube between worlds 0 and 1 would also punch a hole into world 2.

{% <figure caption="*Left:* **3D worlds in 5D.** From the green world you see two mouths, one to the orange world and one to the blue world. No U-shapes. *Right:* **The same construction for 2D worlds in 4D**, seen from inside the green world."> %}
{% <container> %}
{{ <image path="img/tubes3.webp" scale="1/2" /> }}
{{ <image path="img/scan_three_parallel.webp" scale="1/2" /> }}
{% </container> %}
{% </figure> %}

This joins worlds pairwise. A wormhole for three worlds can also be *one* wormhole whose three arms meet in the middle. That needs one more operation.

## 8. Turning the carrier {#turn}

Here it is:

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="c">// carrier a, turned by angle towards carrier b</span></span>
<span class="giallo-l"><span class="ty tf">float</span><span> </span><span class="fn">turn</span><span>(</span><span class="ty tf">float</span><span> </span><span class="tf">a</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">b</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">angle</span><span>) { </span><span class="kw">return</span><span> </span><span class="fn">cos</span><span>(</span><span class="tf">angle</span><span>) * </span><span class="tf">a</span><span> + </span><span class="fn">sin</span><span>(</span><span class="tf">angle</span><span>) * </span><span class="tf">b</span><span>; }</span></span></code></pre>

Read <code class="tf">a</code> and <code class="tf">b</code> as two carriers. Where both are zero, the result is zero for every angle, so that set stays where it is, like the hinge of a door. At angle 0 you get carrier <code class="tf">a</code>, at 90° carrier <code class="tf">b</code>, and in between a carrier tilted between the two. For two flat carriers at right angles, such as `p.w` and `p.y`, this is an actual rotation of the carrier around the hinge; for other carriers it is a blend that keeps the hinge fixed. A world whose solid sits around the hinge is cut by this swinging carrier, and its shape changes with the angle. Angles are in radians, as in GLSL.

The angle can change from place to place, which is what makes `turn` useful: a tube can start in one carrier and end in another. For that the code on this page writes `smoothstep`. Most pictures use its smoother sibling `smootherstep`, whose second derivative has no jumps, so the curvature view shows no seams; for the rays the difference is tiny.

### The donut and the flat torus are one torus

The donut is `ball(vec2(ball(p.xy, a), p.z), b)`: everything within `b` of the circle {% <katex> %}\|xy\|\=a{% </katex> %}. Give the inner `ball` one more coordinate, `p.w`, and you have the same thing in 4D: everything within `b` of that circle, in all four directions. Cut it with the slice {% <katex> %}w\=0{% </katex> %} and you get the donut. Cut it with the cylinder {% <katex> %}\|xy\|\=a{% </katex> %}, which contains the same circle, and you get the flat torus. `turn` swings between the two:

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">torus</span><span>(</span><span class="ty tv">vec4</span><span> </span><span class="tv">p</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">a</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">b</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">angle</span><span>) {</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">solid</span><span> = </span><span class="fn">ball</span><span>(</span><span class="ty tv">vec3</span><span>(</span><span class="fn">ball</span><span>(</span><span class="tv2">p.xy</span><span>, </span><span class="tf">a</span><span>), </span><span class="tf">p.z</span><span>, </span><span class="tf">p.w</span><span>), </span><span class="tf">b</span><span>);   </span><span class="c">// the donut, with w inside the ball</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="fn">world</span><span>(</span><span class="tf">solid</span><span>, </span><span class="fn">turn</span><span>(</span><span class="tf">p.w</span><span>, </span><span class="fn">ball</span><span>(</span><span class="tv2">p.xy</span><span>, </span><span class="tf">a</span><span>), </span><span class="tf">angle</span><span>));   </span><span class="c">// 0: a donut; 90 deg: the flat torus</span></span>
<span class="giallo-l"><span>}</span></span></code></pre>

<div class="co2-demo" data-scene="torus" data-compact="1" data-curvature="1"></div>

Move the angle from 0 to 90 and the orange and blue fade to grey. The reason is visible in the donut. Go once around its tube, and the circles around the hole get longer and shorter again: long on the outside, short on the inside. On a flat sheet that cannot happen: circles placed one after another at equal spacing change length at a steady rate, like the rings of a dartboard, or not at all, like rings around a cylinder. Growing and then shrinking again is what curved surfaces do, like the circles of latitude on a ball. As the carrier turns, the tube's little circle stops moving towards and away from the axis and moves into {% <katex> %}w{% </katex> %} instead. At 90° every circle around the hole has the same length, both directions close up as on the Asteroids screen, and the torus unrolls into a flat rectangle. (For the whole family to be a proper torus, keep `a > b`, as for any donut.)

At 90° this is the flat torus of [§6](#first): the same points with another pair of numbers. When you only need a flat torus, either pair works. To attach it to something, use this one. Its solid is the donut's, and the donut is the shape that fits into an ordinary world.

### A flat throat: the torus, extruded {#throat}

{% <admonition color="violet" title="❓ Question"> %}
Can a wormhole's throat be flat, by extruding a Clifford torus and connecting it to two planes, so that inside you see yourself repeating without any distortion?
{% </admonition> %}

Yes, and the recipe is exactly that: a torus, extruded along the fifth axis, smooth-unioned with two worlds. The only additions are that the torus is flat only in the middle of the throat, and in the collars on either side it turns back into a donut and grows into the mouth:

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">flat_throat</span><span>(</span><span class="ty tv">vec5</span><span> </span><span class="tv">p</span><span>) {</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">t</span><span> = </span><span class="fn">clamp</span><span>((</span><span class="fn">abs</span><span>(</span><span class="tf">p.v</span><span>) - </span><span class="tf num">2.5</span><span>) / </span><span class="tf num">3.0</span><span>, </span><span class="tf num">0.0</span><span>, </span><span class="tf num">1.0</span><span>);    </span><span class="c">// 0 in the flat middle, 1 at the worlds</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">s</span><span> = </span><span class="tf">t</span><span> * </span><span class="tf">t</span><span>;                                      </span><span class="c">// the collar: slow at first, fastest at the mouth</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">a</span><span> = </span><span class="fn">mix</span><span>(</span><span class="tf num">0.5</span><span>, </span><span class="tf num">3.0</span><span>, </span><span class="tf">s</span><span>), </span><span class="tf">b</span><span> = </span><span class="fn">mix</span><span>(</span><span class="tf num">0.5</span><span>, </span><span class="tf num">1.5</span><span>, </span><span class="tf">s</span><span>);     </span><span class="c">// the torus grows into the mouth</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">throat</span><span> = </span><span class="fn">extrude</span><span>(</span><span class="fn">torus</span><span>(</span><span class="tv">p.xyzw</span><span>, </span><span class="tf">a</span><span>, </span><span class="tf">b</span><span>, </span><span class="fn">radians</span><span>(</span><span class="tf num">90.0</span><span>) * (</span><span class="tf num">1.0</span><span> - </span><span class="tf">s</span><span>)), </span><span class="tf">p.v</span><span>, </span><span class="tf num">5.5</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">worlds</span><span> = </span><span class="fn">world</span><span>(</span><span class="tf num">5.5</span><span> - </span><span class="fn">abs</span><span>(</span><span class="tf">p.v</span><span>), </span><span class="tf">p.w</span><span>);             </span><span class="c">// beyond the worlds v = -5.5 and v = 5.5, in w = 0</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="fn">smooth_union</span><span>(</span><span class="tv2">worlds</span><span>, </span><span class="tv2">throat</span><span>, </span><span class="tf num">0.4</span><span>);</span></span>
<span class="giallo-l"><span>}</span></span></code></pre>

The turn is needed because the worlds are flat 3D spaces, and a flat torus does not fit into one. Any closed surface inside ordinary 3D space is curved somewhere: at its point farthest from the centre it bulges like a ball. So where the throat meets a world, its torus cannot be flat; this recipe turns it into a donut, and the mouth in each world is a donut-shaped hole. No 5D torus is needed: every cross-section of the throat, at a fixed {% <katex> %}v{% </katex> %}, is a torus in {% <katex> %}xyzw{% </katex> %}, and the fifth coordinate only extrudes it and says how far it has turned and how big it is. The middle stretch of the throat, {% <katex> %}\|v\| \\lt  2\.5{% </katex> %}, is exactly the flat torus times a line, here a square one with `a = b = 0.5`. In the collars, where the torus turns and grows, and at the mouths, the throat is curved. Each collar is 3 long and ends in a mouth donut with `a = 3` and `b = 1.5`.

{% <figure caption="*Left:* **The donut-shaped mouth**, seen from one of the worlds. Through the donut's body you look into the throat; through its hole you see the world behind it. Around the mouth the floor bends down into the collar. *Right:* **Inside the flat throat.** Up and down the middle, the spheres repeat on an exact lattice, and so do you: the red ball in the centre is your own back. To the left the throat opens into the green world, to the right into the orange one."> %}
{% <container> %}
{{ <image path="img/throat_mouth.webp" scale="1/2" /> }}
{{ <image path="img/throat_far.png" scale="1/2" /> }}
{% </container> %}
{% </figure> %}

In the second picture, up and down is one circle of the torus, forward is the other, and left and right run along the throat. Light that goes mostly up, down or forward stays in the flat part for a long time and shows the spheres again and again, smaller and smaller, without distortion. Every copy is one of the same four spheres, or you, reached by light that went around the torus: the small red ball straight ahead is your own back, a whole circle of the torus away. Light that leans to the left or right leaves through a mouth, into the green world on the left or the orange world on the right. Those worlds come out in many stripes, because on the way out the light can wind around the torus a different number of times.

Without any turning there is an even shorter version, if you allow worlds that wrap around in one direction. Put everything into the carrier `ball(p.zw, b)`: `world(smin(7.0 - abs(p.v), extrude(p.v, ball(p.xy, a), 7.0), 0.4), ball(p.zw, b))`. That is the two-planes wormhole times a circle. The throat is a flat torus times a line again, and each world is a flat 3D space in which walking far enough in one direction brings you back to where you started.

### One wormhole for three worlds

In 4D, one wormhole for three worlds is three capsule arms that meet in the middle and are smooth-unioned, with the worlds bent into U-shapes so that they fit. With three flat parallel 3D worlds in 5D the plain version fails, and the reason is easy to see. Each arm leaves its world through the extra directions, and its cross-section is a sphere in that world's own {% <katex> %}x\, y\, z{% </katex> %}. All three arms would bring the same sphere to the centre, and three tubes with the same cross-section meet in a sharp seam that plain smoothing does not remove.

The fix is to turn each arm's carrier on the way in. Near its world, an arm's carrier is the world's own slice, as for any wormhole. Near the centre all three carriers are the same 4D space, {% <katex> %}z\=0{% </katex> %}. There the three arms are capsules that meet in one shared 4D space, and an ordinary smooth union joins them, exactly as in the 4D version. The turn happens in the middle of each arm, so both ends, where pieces are blended, have a single carrier.

<div class="co2-fig">
<svg class="diagram" viewBox="0 0 620 260" role="img" aria-label="Top view of the two extra directions: three worlds at the corners of a triangle, three arms going to a common centre where they merge. Near each world the arm's circle lies in the world's own directions; near the centre it lies in the shared space.">
  <rect x="0" y="0" width="620" height="260" rx="12" fill="var(--paper-2)"/>
  <line x1="230" y1="130" x2="230" y2="40" stroke="var(--ink-2)" stroke-width="16" stroke-linecap="round" opacity="0.25"/>
  <line x1="230" y1="130" x2="152" y2="175" stroke="var(--ink-2)" stroke-width="16" stroke-linecap="round" opacity="0.25"/>
  <line x1="230" y1="130" x2="308" y2="175" stroke="var(--ink-2)" stroke-width="16" stroke-linecap="round" opacity="0.25"/>
  <circle cx="230" cy="130" r="16" fill="var(--ink-2)" opacity="0.3"/>
  <circle cx="230" cy="32" r="12" fill="var(--green)"/>
  <circle cx="144" cy="180" r="12" fill="var(--orange)"/>
  <circle cx="316" cy="180" r="12" fill="var(--blue)"/>
  <text x="250" y="36" font-size="13" fill="var(--green)">world 1</text>
  <text x="70" y="206" font-size="13" fill="var(--orange)">world 2</text>
  <text x="300" y="210" font-size="13" fill="var(--blue)">world 3</text>
  <text x="246" y="128" font-size="13" fill="var(--ink)">centre</text>
  <text x="380" y="70" font-size="13" fill="var(--ink-2)">Top view of the two extra directions.</text>
  <text x="380" y="98" font-size="13" fill="var(--ink-2)">Near a world, an arm's carrier is</text>
  <text x="380" y="117" font-size="13" fill="var(--ink-2)">that world's own slice.</text>
  <text x="380" y="145" font-size="13" fill="var(--ink-2)">Near the centre, all three carriers</text>
  <text x="380" y="164" font-size="13" fill="var(--ink-2)">are z = 0, so the arms meet in one</text>
  <text x="380" y="183" font-size="13" fill="var(--ink-2)">shared 4D space and smooth-union.</text>
</svg>
</div>

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="c">// 3D worlds in 5D: three worlds at n = rho * d[i] in the extra plane n = p.wv,</span></span>
<span class="giallo-l"><span class="c">// d[i] = unit vectors at 90, 210 and 330 degrees</span></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">arm</span><span>(</span><span class="ty tv">vec5</span><span> </span><span class="tv">p</span><span>, </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">d</span><span>) {                     </span><span class="c">// a tube from the centre to the world in direction d</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">along</span><span> = </span><span class="fn">dot</span><span>(</span><span class="tv2">p.wv</span><span>, </span><span class="tv2">d</span><span>), </span><span class="tf">side</span><span> = </span><span class="fn">dot</span><span>(</span><span class="tv2">p.wv</span><span>, </span><span class="ty tv2">vec2</span><span>(-</span><span class="tf">d.y</span><span>, </span><span class="tf">d.x</span><span>));</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">tube</span><span>  = </span><span class="fn">capsule</span><span>(</span><span class="tv">p</span><span>, </span><span class="ty tv">vec5</span><span>(</span><span class="tf num">0.0</span><span>), </span><span class="ty tv">vec5</span><span>(</span><span class="tf num">0.0</span><span>, </span><span class="tf num">0.0</span><span>, </span><span class="tf num">0.0</span><span>, </span><span class="tf">rho</span><span> * </span><span class="tv2">d</span><span>), </span><span class="tf">r</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">angle</span><span> = </span><span class="fn">radians</span><span>(</span><span class="tf num">90.0</span><span>) * </span><span class="fn">smoothstep</span><span>(</span><span class="tf num">0.3</span><span>, </span><span class="tf num">0.7</span><span>, </span><span class="tf">along</span><span> / </span><span class="tf">rho</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="fn">world</span><span>(</span><span class="tf">tube</span><span>, </span><span class="fn">turn</span><span>(</span><span class="tf">p.z</span><span>, </span><span class="tf">side</span><span>, </span><span class="tf">angle</span><span>));   </span><span class="c">// z = 0 at the centre, the world's slice at the world</span></span>
<span class="giallo-l"><span>}</span></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">parallel_world</span><span>(</span><span class="ty tv">vec5</span><span> </span><span class="tv">p</span><span>, </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">d</span><span>) {          </span><span class="c">// the world n = rho * d</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">along</span><span> = </span><span class="fn">dot</span><span>(</span><span class="tv2">p.wv</span><span>, </span><span class="tv2">d</span><span>), </span><span class="tf">side</span><span> = </span><span class="fn">dot</span><span>(</span><span class="tv2">p.wv</span><span>, </span><span class="ty tv2">vec2</span><span>(-</span><span class="tf">d.y</span><span>, </span><span class="tf">d.x</span><span>));</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="fn">world</span><span>(</span><span class="fn">extrude</span><span>(</span><span class="tf">side</span><span>, </span><span class="tf">rho</span><span> - </span><span class="tf">along</span><span>, </span><span class="tf num">0.5</span><span>), </span><span class="tf">side</span><span>);    </span><span class="c">// just beyond the world, near its slice</span></span>
<span class="giallo-l"><span>}</span></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">three_worlds_one_wormhole</span><span>(</span><span class="ty tv">vec5</span><span> </span><span class="tv">p</span><span>) {</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">f</span><span> = </span><span class="fn">smooth_union</span><span>(</span><span class="fn">smooth_union</span><span>(</span><span class="fn">arm</span><span>(</span><span class="tv">p</span><span>, </span><span class="tv2">d</span><span>[</span><span class="tf num">0</span><span>]), </span><span class="fn">arm</span><span>(</span><span class="tv">p</span><span>, </span><span class="tv2">d</span><span>[</span><span class="tf num">1</span><span>]), </span><span class="tf">kj</span><span>), </span><span class="fn">arm</span><span>(</span><span class="tv">p</span><span>, </span><span class="tv2">d</span><span>[</span><span class="tf num">2</span><span>]), </span><span class="tf">kj</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="kw">for</span><span> (</span><span class="ty tf">int</span><span> </span><span class="tf">i</span><span> = </span><span class="tf num">0</span><span>; </span><span class="tf">i</span><span> &lt; </span><span class="tf num">3</span><span>; </span><span class="tf">i</span><span>++) </span><span class="tv2">f</span><span> = </span><span class="fn">smooth_union</span><span>(</span><span class="tv2">f</span><span>, </span><span class="fn">parallel_world</span><span>(</span><span class="tv">p</span><span>, </span><span class="tv2">d</span><span>[</span><span class="tf">i</span><span>]), </span><span class="tf">km</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="tv2">f</span><span>;</span></span>
<span class="giallo-l"><span>}</span></span></code></pre>

`capsule` is the usual capsule SDF, the distance to a segment minus a radius, in 5D. Each world's solid is "just beyond the world", like the half-spaces of the wormhole in [§1](#recap), but extruded only half a unit sideways. On the world's own slice that changes nothing, so the world itself stays whole. A full half-space would reach far past the other worlds, and where two such solids meet, `smooth_union` would blend their different carriers into a ghost world that nobody asked for ([§16](#pitfalls)). The capsule uses all five coordinates for the same reason.

{% <figure caption="*Left:* **One wormhole, three 3D worlds in 5D.** Through the single mouth you see both other worlds, repeated by the long throat. *Right:* **The 2D version in 4D.** The mouth leads into the grey tube, which splits toward the blue and orange worlds."> %}
{% <container> %}
{{ <image path="img/y_junction.webp" scale="1/2" /> }}
{{ <image path="img/scan_y_junction.webp" scale="1/2" /> }}
{% </container> %}
{% </figure> %}

<div class="co2-demo" data-scene="y_junction" data-compact="1"></div>

### A mirror wormhole {#mirror}

{% <admonition color="violet" title="❓ Question"> %}
Does a higher dimension unlock a mirror?
{% </admonition> %}

A handle from a world back to the same world normally keeps you as you are. Turn the tube's carrier by 180° on the way, and you come out mirrored. The handle below is a tube that leaves the plane through mouth 1, arches over it and comes back down through mouth 2. Follow the tube's circle along the way, with an L drawn on it.

<div class="co2-fig">
<svg class="diagram fig3d" viewBox="0 0 600 582" role="img" aria-label="A plane with a handle: a tube from one mouth over the plane to the other. Seven numbered stations along it. Below, the tube's circle at each station with an L drawn on it. For the ordinary handle the circle and its L stay the same. For the mirror handle the circle turns through the fourth direction w: in 3D it looks squashed, at station 4 it is only a line, and afterwards it shows its other face with the L mirrored.">
<rect x="0" y="0" width="600" height="582" rx="10" fill="#f0f2f5"/>
<image href="figs/mirror3d.png" x="0" y="0" width="600" height="280"/>
<text x="442.6" y="209.3" font-size="14" font-weight="600" fill="#1f2328" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">1</text>
<text x="384.3" y="83.6" font-size="14" font-weight="600" fill="#1f2328" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">2</text>
<text x="341.0" y="57.0" font-size="14" font-weight="600" fill="#1f2328" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">3</text>
<text x="293.4" y="44.4" font-size="14" font-weight="600" fill="#1f2328" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">4</text>
<text x="247.2" y="46.9" font-size="14" font-weight="600" fill="#1f2328" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">5</text>
<text x="207.6" y="63.4" font-size="14" font-weight="600" fill="#1f2328" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">6</text>
<text x="158.0" y="166.4" font-size="14" font-weight="600" fill="#1f2328" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">7</text>
<text x="503.8" y="251.4" font-size="12" font-weight="600" fill="#1f2328" text-anchor="start" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">mouth 1</text>
<text x="107.7" y="190.1" font-size="12" font-weight="600" fill="#1f2328" text-anchor="end" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">mouth 2</text>
<text x="586.0" y="22.0" font-size="12" font-weight="500" fill="#1e7c7c" text-anchor="end" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">drawn: the centre line of the tube, with 7 stations</text>
<text x="12.0" y="314.0" font-size="13" font-weight="700" fill="#1f2328" text-anchor="start" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">ordinary handle</text>
<ellipse cx="58.0" cy="358.0" rx="33.0" ry="33" fill="#f1c45a" stroke="#a8781a" stroke-width="1.6"/>
<polygon points="43.1,377.8 43.1,338.2 51.4,338.2 51.4,369.6 74.5,369.6 74.5,377.8" fill="#1f2328"/>
<text x="58.0" y="408.0" font-size="12" font-weight="600" fill="#3a3f46" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">1</text>
<ellipse cx="138.7" cy="358.0" rx="33.0" ry="33" fill="#f1c45a" stroke="#a8781a" stroke-width="1.6"/>
<polygon points="123.8,377.8 123.8,338.2 132.1,338.2 132.1,369.6 155.2,369.6 155.2,377.8" fill="#1f2328"/>
<text x="138.7" y="408.0" font-size="12" font-weight="600" fill="#3a3f46" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">2</text>
<ellipse cx="219.3" cy="358.0" rx="33.0" ry="33" fill="#f1c45a" stroke="#a8781a" stroke-width="1.6"/>
<polygon points="204.5,377.8 204.5,338.2 212.7,338.2 212.7,369.6 235.8,369.6 235.8,377.8" fill="#1f2328"/>
<text x="219.3" y="408.0" font-size="12" font-weight="600" fill="#3a3f46" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">3</text>
<ellipse cx="300.0" cy="358.0" rx="33.0" ry="33" fill="#f1c45a" stroke="#a8781a" stroke-width="1.6"/>
<polygon points="285.1,377.8 285.1,338.2 293.4,338.2 293.4,369.6 316.5,369.6 316.5,377.8" fill="#1f2328"/>
<text x="300.0" y="408.0" font-size="12" font-weight="600" fill="#3a3f46" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">4</text>
<ellipse cx="380.7" cy="358.0" rx="33.0" ry="33" fill="#f1c45a" stroke="#a8781a" stroke-width="1.6"/>
<polygon points="365.8,377.8 365.8,338.2 374.1,338.2 374.1,369.6 397.2,369.6 397.2,377.8" fill="#1f2328"/>
<text x="380.7" y="408.0" font-size="12" font-weight="600" fill="#3a3f46" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">5</text>
<ellipse cx="461.3" cy="358.0" rx="33.0" ry="33" fill="#f1c45a" stroke="#a8781a" stroke-width="1.6"/>
<polygon points="446.5,377.8 446.5,338.2 454.7,338.2 454.7,369.6 477.8,369.6 477.8,377.8" fill="#1f2328"/>
<text x="461.3" y="408.0" font-size="12" font-weight="600" fill="#3a3f46" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">6</text>
<ellipse cx="542.0" cy="358.0" rx="33.0" ry="33" fill="#f1c45a" stroke="#a8781a" stroke-width="1.6"/>
<polygon points="527.1,377.8 527.1,338.2 535.4,338.2 535.4,369.6 558.5,369.6 558.5,377.8" fill="#1f2328"/>
<text x="542.0" y="408.0" font-size="12" font-weight="600" fill="#3a3f46" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">7</text>
<text x="12.0" y="432.0" font-size="13" font-weight="700" fill="#1f2328" text-anchor="start" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">mirror handle</text>
<ellipse cx="58.0" cy="476.0" rx="33.0" ry="33" fill="#f1c45a" stroke="#a8781a" stroke-width="1.6"/>
<polygon points="43.1,495.8 43.1,456.2 51.4,456.2 51.4,487.6 74.5,487.6 74.5,495.8" fill="#1f2328"/>
<text x="58.0" y="526.0" font-size="12" font-weight="600" fill="#3a3f46" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">1</text>
<ellipse cx="138.7" cy="476.0" rx="32.9" ry="33" fill="#f1c45a" stroke="#a8781a" stroke-width="1.6"/>
<polygon points="123.9,495.8 123.9,456.2 132.1,456.2 132.1,487.6 155.1,487.6 155.1,495.8" fill="#1f2328"/>
<text x="138.7" y="526.0" font-size="12" font-weight="600" fill="#3a3f46" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">2</text>
<ellipse cx="219.3" cy="476.0" rx="25.7" ry="33" fill="#f1c45a" stroke="#a8781a" stroke-width="1.6"/>
<polygon points="207.8,495.8 207.8,456.2 214.2,456.2 214.2,487.6 232.2,487.6 232.2,495.8" fill="#1f2328"/>
<text x="219.3" y="526.0" font-size="12" font-weight="600" fill="#3a3f46" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">3</text>
<ellipse cx="300.0" cy="476.0" rx="1.3" ry="33" fill="#f1c45a" stroke="#a8781a" stroke-width="1.6"/>
<text x="300.0" y="526.0" font-size="12" font-weight="600" fill="#3a3f46" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">4</text>
<ellipse cx="380.7" cy="476.0" rx="25.7" ry="33" fill="#8fb1ee" stroke="#2f5aa8" stroke-width="1.6"/>
<polygon points="392.2,495.8 392.2,456.2 385.8,456.2 385.8,487.6 367.8,487.6 367.8,495.8" fill="#1f2328"/>
<text x="380.7" y="526.0" font-size="12" font-weight="600" fill="#3a3f46" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">5</text>
<ellipse cx="461.3" cy="476.0" rx="32.9" ry="33" fill="#8fb1ee" stroke="#2f5aa8" stroke-width="1.6"/>
<polygon points="476.1,495.8 476.1,456.2 467.9,456.2 467.9,487.6 444.9,487.6 444.9,495.8" fill="#1f2328"/>
<text x="461.3" y="526.0" font-size="12" font-weight="600" fill="#3a3f46" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">6</text>
<ellipse cx="542.0" cy="476.0" rx="33.0" ry="33" fill="#8fb1ee" stroke="#2f5aa8" stroke-width="1.6"/>
<polygon points="556.9,495.8 556.9,456.2 548.6,456.2 548.6,487.6 525.5,487.6 525.5,495.8" fill="#1f2328"/>
<text x="542.0" y="526.0" font-size="12" font-weight="600" fill="#3a3f46" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">7</text>
<text x="300.0" y="435.0" font-size="12" font-weight="600" fill="#a06a00" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">edge-on: the circle lies along w</text>
<text x="300.0" y="556.0" font-size="11.5" font-weight="500" fill="#3a3f46" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">Each circle: the tube seen end-on at that station. Gold: the face it started with; blue: its other face.</text>
<text x="300.0" y="572.0" font-size="11.5" font-weight="500" fill="#3a3f46" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round">In 3D the circle must stay square to the tube, so it can only spin, and spinning never mirrors an L.</text>
</svg>
</div>

In the ordinary handle the circle and its L arrive as they left. In the mirror handle the carrier turns, so the circle turns through {% <katex> %}w{% </katex> %}, the fourth direction. In our 3D picture that looks like the circle being squashed: at station 4 it points straight into {% <katex> %}w{% </katex> %}, and all we see of it is a line. After that it opens up again, but now we look at its other face, and the L is mirrored. Anything that walks through the tube is turned over the same way, so a creature comes out of mouth 2 as its own mirror image. The Möbius strip of the second video plays a similar trick by twisting a rectangle, but in 3D that only works because the strip has an edge. Here the turn goes through the extra direction, and the world needs no edge.

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="c">// a tube from the mouth x = +R over the plane to the mouth x = -R</span></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">handle</span><span>(</span><span class="ty tv">vec4</span><span> </span><span class="tv">p</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">twist</span><span>) {</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">solid</span><span> = </span><span class="fn">ball</span><span>(</span><span class="ty tv">vec3</span><span>(</span><span class="fn">ball</span><span>(</span><span class="tv2">p.xz</span><span>, </span><span class="tf">R</span><span>), </span><span class="tf">p.y</span><span>, </span><span class="tf">p.w</span><span>), </span><span class="tf">r</span><span>);   </span><span class="c">// a 4D donut around the circle |xz| = R</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">along</span><span> = </span><span class="fn">atan</span><span>(</span><span class="fn">max</span><span>(</span><span class="tf">p.z</span><span>, </span><span class="tf num">0.0</span><span>), </span><span class="tf">p.x</span><span>);                 </span><span class="c">// 0 at x = +R, PI at x = -R</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">angle</span><span> = </span><span class="tf">twist</span><span> * </span><span class="fn">smoothstep</span><span>(</span><span class="tf num">0.25</span><span> * </span><span class="tf">PI</span><span>, </span><span class="tf num">0.75</span><span> * </span><span class="tf">PI</span><span>, </span><span class="tf">along</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="fn">world</span><span>(</span><span class="tf">solid</span><span>, </span><span class="fn">turn</span><span>(</span><span class="tf">p.w</span><span>, </span><span class="tf">p.y</span><span>, </span><span class="tf">angle</span><span>));</span></span>
<span class="giallo-l"><span>}</span></span>
<span class="giallo-l"><span class="c">// twist = 0: an ordinary handle; twist = PI: a mirror handle (the flip fits only these two)</span></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">plane_with_handle</span><span>(</span><span class="ty tv">vec4</span><span> </span><span class="tv">p</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">twist</span><span>) {</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">flip</span><span> = </span><span class="tf">twist</span><span> &gt; </span><span class="tf num">0.0</span><span> &amp;&amp; </span><span class="tf">p.x</span><span> &lt; </span><span class="tf num">0.0</span><span> ? -</span><span class="tf num">1.0</span><span> : </span><span class="tf num">1.0</span><span>;     </span><span class="c">// the plane, turned over where</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="fn">smooth_union</span><span>(</span><span class="fn">world</span><span>(</span><span class="tf">p.z</span><span>, </span><span class="tf">flip</span><span> * </span><span class="tf">p.w</span><span>), </span><span class="fn">handle</span><span>(</span><span class="tv">p</span><span>, </span><span class="tf">twist</span><span>), </span><span class="tf">k</span><span>);   </span><span class="c">// the turned mouth arrives</span></span>
<span class="giallo-l"><span>}</span></span></code></pre>

The tube is the upper half of a 4D donut standing on the plane; its lower half is hidden inside the plane's solid. The `flip` line is needed because a mirror world cannot have one smooth pair of numbers everywhere: going around the handle, the pair itself comes back mirrored. So somewhere the field has to jump to its mirror image. On the world both versions are zero, so the jump is harmless, as long as you never take a numerical gradient across it.

### A wormhole into itself {#mono}

{% <admonition color="violet" title="❓ Question"> %}
Can a wormhole lead back into itself? With portals in 3D, a tube from a plane can have its far end glued to itself with no seams: going in, you meet your own image, not mirrored, and you come back out into the same world. Can a 2D world in 4D do this, with its throat connected to itself?
{% </admonition> %}

Yes, but for a 2D world it always mirrors you, and no number of dimensions changes that. The far end of a tube can be glued to itself in two ways. Either every point of the end goes to the opposite point of it, or the end is folded, every point going to its mirror point across a diameter. The fold leaves the two points on that diameter where they are, and the fold has a corner at each of them. Only the first way has no seam anywhere.

Count the reversals in the first way. Crossing the end, "down the tube" becomes "up the tube": that is one. For a 3D world the end of the throat is a sphere, and taking every point of a sphere to its opposite is a second reversal, like a mirror. The two cancel, and you come out as you went in: that is the seamless wormhole into itself in 3D, and it is the only seamless way to glue a sphere to itself. For a 2D world the end is a circle, and taking every point of a circle to its opposite only turns it by half a turn. Nothing cancels the first reversal, so you come out mirrored, and the end of the tube has become a Möbius strip.

Nothing else can work for a 2D world. By the Gauss–Bonnet theorem, the total curvature of whatever closes the tube is {% <katex> %}2\\pi{% </katex> %} times its Euler characteristic, and the only piece with one edge whose Euler characteristic is zero is the Möbius strip. Every two-sided closing piece carries curvature somewhere: a cap or a fold carries {% <katex> %}2\\pi{% </katex> %}, the curvature of half a sphere. A round cap spreads it over the cap; the fold puts it all at its two corners. So a 2D world can have a seamless wormhole into itself, or an unmirrored one, but not both. The unmirrored one does not even need 4D. It is a tube squeezed flat at its end, like a toothpaste tube: along the fold it is flat and your twin comes towards you unmirrored, and near the two ends of the fold the view is distorted. A portal can glue the end by the fold exactly; then its two corners are points where the world is folded onto itself, which reflect light straight back and cannot be seen (more on this below). A smooth world has to round them off. (In topology: the 2D version adds a projective plane to the world, which has one side; the 3D version adds projective 3-space, which has two.)

The seamless version needs 4D. In 3D, a Möbius strip whose edge is the mouth of a plane cannot be attached to the plane without crossing it, because a surface that divides space always has two sides ([§18](#questions)). In 4D it fits, flat, and its field is one more turned carrier. Turn the normal plane by twice the angle around the mouth. Seen in the turned frame, the world is just a plane with a dome over the mouth, squashed so that {% <katex> %}\|u\|\^2 \+ 4s\^2 \= R\^2{% </katex> %}. Then every circle of the dome has the same length {% <katex> %}2\\pi R{% </katex> %} in 4D, and the dome is a flat tube. At the top all the turned frames meet, so the top point opens into a whole circle, and the two opposite points of each circle of the dome arrive at the same point of it. That circle is the far end, glued to itself point to opposite point.

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="c">// a plane whose mouth leads back into itself: a flat tube of circumference 2 PI R, whose far end</span></span>
<span class="giallo-l"><span class="c">// is glued to itself, every point to the opposite one (a Möbius strip)</span></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">mono_wormhole</span><span>(</span><span class="ty tv">vec4</span><span> </span><span class="tv">p</span><span>) {</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">r</span><span> = </span><span class="fn">length</span><span>(</span><span class="tv2">p.xy</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">spin</span><span> = </span><span class="tf">twist</span><span> * </span><span class="fn">pow</span><span>(</span><span class="fn">max</span><span>(</span><span class="tf num">1.0</span><span> - </span><span class="tf">r</span><span> * </span><span class="tf">r</span><span> / (</span><span class="tf">R</span><span> * </span><span class="tf">R</span><span>), </span><span class="tf num">0.0</span><span>), </span><span class="tf num">2.0</span><span>);   </span><span class="c">// keeps turning inside: a longer throat</span></span>
<span class="giallo-l"><span>    </span><span class="kw">if</span><span> (</span><span class="tf">r</span><span> &gt; </span><span class="tf num">0.5</span><span> * </span><span class="tf">R</span><span>) {</span></span>
<span class="giallo-l"><span>        </span><span class="ty tf">float</span><span> </span><span class="tf">angle</span><span> = </span><span class="tf num">2.0</span><span> * </span><span class="fn">atan</span><span>(</span><span class="tf">p.y</span><span>, </span><span class="tf">p.x</span><span>) + </span><span class="tf">spin</span><span>;     </span><span class="c">// the normal plane, turned twice as you go around</span></span>
<span class="giallo-l"><span>        </span><span class="ty tf">float</span><span> </span><span class="tf">s</span><span> = </span><span class="fn">turn</span><span>(</span><span class="tf">p.z</span><span>, </span><span class="tf">p.w</span><span>, </span><span class="tf">angle</span><span>), </span><span class="tf">c</span><span> = </span><span class="fn">turn</span><span>(</span><span class="tf">p.w</span><span>, -</span><span class="tf">p.z</span><span>, </span><span class="tf">angle</span><span>);</span></span>
<span class="giallo-l"><span>        </span><span class="kw">return</span><span> </span><span class="fn">smooth_union</span><span>(</span><span class="fn">world</span><span>(</span><span class="tf">s</span><span>, </span><span class="tf">c</span><span>), </span><span class="fn">world</span><span>(</span><span class="fn">ball</span><span>(</span><span class="ty tv">vec3</span><span>(</span><span class="tv2">p.xy</span><span>, </span><span class="tf num">2.0</span><span> * </span><span class="tf">s</span><span>), </span><span class="tf">R</span><span>), </span><span class="tf">c</span><span>), </span><span class="tf">k</span><span>);   </span><span class="c">// a plane with a dome</span></span>
<span class="giallo-l"><span>    }</span></span>
<span class="giallo-l"><span>    </span><span class="c">// at the top of the dome the turning breaks down; there: lines through the centre,</span></span>
<span class="giallo-l"><span>    </span><span class="c">// at half the angle of p.zw (once around, the half angle jumps: a harmless sign flip)</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">half</span><span> = </span><span class="tf num">0.5</span><span> * (</span><span class="fn">atan</span><span>(</span><span class="tf">p.w</span><span>, </span><span class="tf">p.z</span><span>) - </span><span class="tf">spin</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="fn">world</span><span>(</span><span class="fn">ball</span><span>(</span><span class="ty tv">vec3</span><span>(</span><span class="tv2">p.xy</span><span>, </span><span class="tf num">2.0</span><span> * </span><span class="fn">length</span><span>(</span><span class="tv2">p.zw</span><span>)), </span><span class="tf">R</span><span>), </span><span class="fn">turn</span><span>(</span><span class="tf">p.y</span><span>, -</span><span class="tf">p.x</span><span>, </span><span class="tf">half</span><span>));</span></span>
<span class="giallo-l"><span>}</span></span></code></pre>

Without `spin` the throat is only {% <katex> %}1\.2R{% </katex> %} long. To lengthen it, keep turning the normal plane as you go in: the throat then spirals around the extra plane, which adds length but no curvature, since every circle still has length {% <katex> %}2\\pi R{% </katex> %}. At the top of the dome the turned frame is undefined, because at {% <katex> %}u \= 0{% </katex> %} there is no angle around the mouth. There the field uses the other natural description of the throat: straight lines through the centre, at half the angle of `p.zw`. Once around, that half angle jumps by half a turn and flips the carrier's sign. It is the same harmless cut as the mirror handle's flip, for the same reason: a world that mirrors you cannot have one smooth pair of numbers. As with the flip, gradients are taken on one side of the cut, and of the switch between the two descriptions. The pictures use `R = 1`, `k = 0.15` and `twist = 16`, a throat 3.6 long. The red creature is you, with a white nose in front and a white ear on its left.

{% <figure caption="*Left:* **From the plane, looking into the mouth.** Light that goes straight in comes back out of the same mouth on its far side, so beyond the throat you see the plane again. Light slanted at the right angle comes back out towards you: far into the mouth, the two tiny red marks are you, mirrored. *Right:* **Inside the throat, near its far end.** At the edges, a whole circumference to each side, the copies you see by looking around the tube: exactly like you. In between, half a circumference away and just across the glued end, your image through the end. It faces you with its ear on the same side of the picture as yours, as in a mirror; a twin facing you would have it on the other side."> %}
{% <container> %}
{{ <image path="img/scan_mono_outside.webp" scale="1/2" /> }}
{{ <image path="img/scan_mono_inside.webp" scale="1/2" /> }}
{% </container> %}
{% </figure> %}

<div class="co2-demo" data-scene="mono" data-compact="1"></div>

### Into itself, one dimension up {#mono3}

{% <admonition color="violet" title="❓ Question"> %}
What about a 3D world in 5D? Does it have two kinds of wormhole into itself, one that mirrors you and one that does not? Or is there one wormhole that does either, depending on where you go in?
{% </admonition> %}

Two kinds, and for a smooth world the shape of the mouth decides which you can have. A ball-shaped mouth has a throat whose cross-section is a sphere, and a sphere can be glued to itself, leaving no point in place, in only one way: every point to its opposite. As counted above, that keeps you as you are, so a smooth ball-shaped wormhole into itself never mirrors you. A donut-shaped mouth, like the flat throat of this section, has a torus as its cross-section, and a torus has more seamless ways to be glued to itself: any of its symmetries that move every point. Shift it half way around one of its circles, and the torus stays the same way round; only the trip back up the tube reverses you, so you come out mirrored. Shift it half way around one circle while reflecting the other, and the torus is reversed as well; the two reversals cancel, and you come out as you went in.

One wormhole cannot do both. Every trip through it crosses the glued end once, and the end is glued by a single rule, the same at every point, so whether a trip mirrors you does not depend on where you go in. A throat that forks into two ends glued in different ways would mirror you on one branch and not on the other. And in a world with a mirror in it, being mirrored belongs to the trip, not to the place: go through the mirroring wormhole twice and you are back to normal.

A portal can get both kinds from a ball. The wormhole into itself in the renderer of the videos is a short tube whose end is glued to itself by a portal that takes the left half of the end sphere to the right half: by a reflection, which keeps you as you are, or by a half turn, which mirrors you. Both leave points in place, a whole circle for the reflection and two points for the half turn, and there the world is folded onto itself. Around the circle there is only half a turn of room, and around each of the two points the world is a cone over the projective plane, which is not even a piece of ordinary space. Still nothing shows. Near those points the world is ordinary space folded by a symmetry, so light behaves as in the unfolded space, and a ray that meets the fold comes back as if from a perfect retroreflector. A smooth world cannot do this, in any number of dimensions: it has no such points, and rounding them off puts their curvature where you can see it, as near the corners of the toothpaste tube above. So what limits the field is not the number of extra dimensions but smoothness. The gluings that leave no point in place are exactly the ones a smooth world can copy: the Möbius end for a 2D world, and the opposite-point end for a 3D ball, built below.

The mirroring donut is the 2D wormhole into itself, revolved. Use the distance from an axis instead of {% <katex> %}x{% </katex> %}, and every half-plane through the axis holds a copy of the 2D world: the mouth becomes a donut, the throat a torus times an interval, and its far end glues every point to the opposite side of the tube's small circle.

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="c">// 3D worlds in 5D, p = (x, y, z, w, v): the 2D wormhole into itself, revolved around the z-axis</span></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">mono_donut</span><span>(</span><span class="ty tv">vec5</span><span> </span><span class="tv">p</span><span>) { </span><span class="kw">return</span><span> </span><span class="fn">mono_wormhole</span><span>(</span><span class="ty tv">vec4</span><span>(</span><span class="fn">length</span><span>(</span><span class="tv2">p.xy</span><span>) - </span><span class="tf">c</span><span>, </span><span class="tf">p.z</span><span>, </span><span class="tf">p.w</span><span>, </span><span class="tf">p.v</span><span>)); }</span></span></code></pre>

In the 3D pictures you are drawn too: a red ball just behind the eye, with a white nose in front, a white ear on its left and a yellow top. (In the 2D views and the playground you are the red creature in the middle.) The pictures use `R = 1`, `twist = 16` and a ring of radius `c = 2.6`.

{% <figure caption="*Left:* **The mirroring donut, from in front.** Light that goes into the tube comes back out of its other side, so the ring shows the floor and the sky again, in bands: on the way the light can also travel some way around the ring. *Right:* **Inside the throat, near the glued end,** looking around the tube's small circle, with the end above. Above you, half a circumference away and just across the end, is your image: upside down, yellow top below, but its ear still on its left, so it is a reflection, not a turn. Straight ahead, a whole circumference around the tube, are copies of your own back, as you are."> %}
{% <container> %}
{{ <image path="img/mono_donut_front.png" scale="1/2" /> }}
{{ <image path="img/mono_donut_inside.png" scale="1/2" /> }}
{% </container> %}
{% </figure> %}

The ball-shaped one is harder, because there is no angle around a ball to turn the extra plane by. Its far end is a projective plane, the set of all lines through the centre, and that does not fit into the two extra directions alone; it has to lean into the world's own directions too. Four pieces of field do it. The far end is the family of segments {% <katex> %}X\(t\, d\) \= \\big\(\(t \- i\\\,a\\\,d\_z\)\(d\_x \+ i d\_y\)\,\\\; t\\\,d\_z\,\\\; \\mathit\{depth\} \+ b\\\,\(d\_x \+ i d\_y\)\^2\\big\){% </katex> %} over the directions {% <katex> %}d{% </katex> %}, where {% <katex> %}\(t\, d\){% </katex> %} and {% <katex> %}\(\-t\, \-d\){% </katex> %} are the same point: each line through the centre meets the end in one segment, and its two halves are glued. Around it a collar untwists the segments and brings the world down from the height `depth` to the flat world at a round mouth of radius `2a + width`; between, the throat is a sphere times an interval. Two of the pieces need a scalar equation solved by a few Newton steps.

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="c">// the ball-shaped wormhole into itself (it keeps you as you are). u = p.xy, h = p.z, v = p.wv</span></span>
<span class="giallo-l"><span class="c">// T + A^2 h^2 / T - A^2 h^4 / T^2 = r^2 and dot(u, u) = (h^2 / q + a^2 q)(1 - q): a few Newton steps each</span></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">mono_ball</span><span>(</span><span class="ty tv">vec5</span><span> </span><span class="tv">p</span><span>) {</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">u</span><span> = </span><span class="tv2">p.xy</span><span>, </span><span class="tv2">v</span><span> = </span><span class="tv2">p.wv</span><span>; </span><span class="ty tf">float</span><span> </span><span class="tf">h</span><span> = </span><span class="tf">p.z</span><span>, </span><span class="tf">r</span><span> = </span><span class="fn">length</span><span>(</span><span class="tv">p.xyz</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="kw">if</span><span> (</span><span class="tf">r</span><span> &gt;= </span><span class="tf num">2.0</span><span> * </span><span class="tf">a</span><span> + width) </span><span class="kw">return</span><span> </span><span class="tv2">v</span><span>;                                        </span><span class="c">// outside: the flat world</span></span>
<span class="giallo-l"><span>    </span><span class="kw">if</span><span> (</span><span class="tf">r</span><span> &gt;= </span><span class="tf">a</span><span>) {                                                              </span><span class="c">// the collar, a graph</span></span>
<span class="giallo-l"><span>        </span><span class="ty tf">float</span><span> </span><span class="tf">A</span><span> = </span><span class="tf">a</span><span> * </span><span class="fn">cutoff</span><span>(</span><span class="tf">r</span><span>, </span><span class="tf">a</span><span>, </span><span class="tf num">2.0</span><span> * </span><span class="tf">a</span><span>), </span><span class="tf">T</span><span> = </span><span class="fn">collar_root</span><span>(</span><span class="tf">r</span><span> * </span><span class="tf">r</span><span>, </span><span class="tf">h</span><span>, </span><span class="tf">A</span><span>);</span></span>
<span class="giallo-l"><span>        </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">w2</span><span> = </span><span class="tf">T</span><span> * </span><span class="fn">cmul</span><span>(</span><span class="fn">cmul</span><span>(</span><span class="tv2">u</span><span>, </span><span class="tv2">u</span><span>), </span><span class="fn">cinv</span><span>(</span><span class="fn">cpow</span><span>(</span><span class="ty tv2">vec2</span><span>(</span><span class="tf">T</span><span>, -</span><span class="tf">A</span><span> * </span><span class="tf">h</span><span>), </span><span class="tf num">2</span><span>)));</span></span>
<span class="giallo-l"><span>        </span><span class="kw">return</span><span> </span><span class="tv2">v</span><span> - </span><span class="fn">cutoff</span><span>(</span><span class="tf">r</span><span>, </span><span class="tf num">2.0</span><span> * </span><span class="tf">a</span><span>, </span><span class="tf num">2.0</span><span> * </span><span class="tf">a</span><span> + width) * (</span><span class="ty tv2">vec2</span><span>(depth, </span><span class="tf num">0.0</span><span>) + </span><span class="tf">b</span><span> * </span><span class="tv2">w2</span><span>);</span></span>
<span class="giallo-l"><span>    }</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">eta</span><span> = (</span><span class="tv2">v</span><span> - </span><span class="ty tv2">vec2</span><span>(depth, </span><span class="tf num">0.0</span><span>)) / </span><span class="tf">b</span><span>;</span></span>
<span class="giallo-l"><span>    </span><span class="kw">if</span><span> (</span><span class="fn">length</span><span>(</span><span class="tv2">eta</span><span>) &lt; </span><span class="tf num">0.25</span><span> &amp;&amp; </span><span class="fn">dot</span><span>(</span><span class="tv2">u</span><span>, </span><span class="tv2">u</span><span>) &lt; </span><span class="tf">h</span><span> * </span><span class="tf">h</span><span> / </span><span class="tf num">2.0</span><span> + </span><span class="tf num">2.0</span><span> * </span><span class="tf">a</span><span> * </span><span class="tf">a</span><span> / </span><span class="tf num">9.0</span><span>) { </span><span class="c">// around the poles, a graph</span></span>
<span class="giallo-l"><span>        </span><span class="ty tf">float</span><span> </span><span class="tf">q</span><span> = </span><span class="fn">pole_root</span><span>(</span><span class="fn">dot</span><span>(</span><span class="tv2">u</span><span>, </span><span class="tv2">u</span><span>), </span><span class="tf">h</span><span>);</span></span>
<span class="giallo-l"><span>        </span><span class="kw">return</span><span> </span><span class="tv2">v</span><span> - </span><span class="ty tv2">vec2</span><span>(depth, </span><span class="tf num">0.0</span><span>) - </span><span class="tf">b</span><span> * </span><span class="tf">q</span><span> * </span><span class="fn">cmul</span><span>(</span><span class="fn">cmul</span><span>(</span><span class="tv2">u</span><span>, </span><span class="tv2">u</span><span>), </span><span class="fn">cinv</span><span>(</span><span class="fn">cpow</span><span>(</span><span class="ty tv2">vec2</span><span>(</span><span class="tf">h</span><span>, -</span><span class="tf">a</span><span> * </span><span class="tf">q</span><span>), </span><span class="tf num">2</span><span>)));</span></span>
<span class="giallo-l"><span>    }</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">Q</span><span> = </span><span class="fn">cmul</span><span>(</span><span class="fn">cmul</span><span>(</span><span class="tv2">u</span><span>, </span><span class="tv2">u</span><span>), </span><span class="fn">cinv</span><span>(</span><span class="tv2">eta</span><span>));                                      </span><span class="c">// the middle: closed form</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">s</span><span> = </span><span class="fn">length</span><span>(</span><span class="tv2">eta</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="ty tv2">vec2</span><span>(</span><span class="tf">h</span><span> + </span><span class="tf">Q.y</span><span> / (</span><span class="tf num">2.0</span><span> * </span><span class="tf">a</span><span>), </span><span class="tf">a</span><span> * (</span><span class="tf">s</span><span> - </span><span class="tf num">1.0</span><span>) + (</span><span class="fn">dot</span><span>(</span><span class="tv2">u</span><span>, </span><span class="tv2">u</span><span>) / </span><span class="tf">s</span><span> - </span><span class="tf">Q.x</span><span>) / (</span><span class="tf num">2.0</span><span> * </span><span class="tf">a</span><span>));</span></span>
<span class="giallo-l"><span>}</span></span></code></pre>

Here `cutoff(r, r0, r1)` is a smooth step from 1 below `r0` to 0 above `r1`. The charts are chosen at the point and kept fixed while its gradients are taken, as for the flip above; on the world the field is regular (its gradients never get shorter than 1), and a frame carried through the wormhole comes back the same way round. The construction and its checks are by the fourth codex run of [§19](#prior). The pictures use `a = b = width = 1` and `depth = 6`.

{% <figure caption="*Left:* **The ball-shaped wormhole into itself, from in front.** Light that goes in comes back out of the opposite side of the same mouth, so the ball shows the world behind and around it, warped by the trip. *Right:* **Inside its throat,** looking up towards the glued end. The world comes back from all sides, and so do you, the right way round."> %}
{% <container> %}
{{ <image path="img/mono_ball_front.png" scale="1/2" /> }}
{{ <image path="img/mono_ball_inside.png" scale="1/2" /> }}
{% </container> %}
{% </figure> %}

# Part III. What two numbers add

## 9. The pair is a complex number {#complex}

Everything so far would work with any number of numbers. What makes two special is that a pair {% <katex> %}\(\\textcolor\{0c7869\}\{f\}\,\\textcolor\{0c7869\}\{g\}\){% </katex> %} can be read as a complex number {% <katex> %}\\textcolor\{0c7869\}\{f\}\+i\\\,\\textcolor\{0c7869\}\{g\}{% </katex> %}, so worlds can be multiplied, divided and raised to powers. Rotating the pair, the free choice of [§5](#meaning), is then multiplication by a unit complex number. In code a complex number is just a <code class="tv2">vec2</code>, with these helpers:

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">cmul</span><span>(</span><span class="ty tv2">vec2</span><span> </span><span class="tv2">a</span><span>, </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">b</span><span>) { </span><span class="kw">return</span><span> </span><span class="ty tv2">vec2</span><span>(</span><span class="tf">a.x</span><span> * </span><span class="tf">b.x</span><span> - </span><span class="tf">a.y</span><span> * </span><span class="tf">b.y</span><span>, </span><span class="tf">a.x</span><span> * </span><span class="tf">b.y</span><span> + </span><span class="tf">a.y</span><span> * </span><span class="tf">b.x</span><span>); }</span></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">conj</span><span>(</span><span class="ty tv2">vec2</span><span> </span><span class="tv2">z</span><span>)         { </span><span class="kw">return</span><span> </span><span class="ty tv2">vec2</span><span>(</span><span class="tf">z.x</span><span>, -</span><span class="tf">z.y</span><span>); }</span></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">cinv</span><span>(</span><span class="ty tv2">vec2</span><span> </span><span class="tv2">z</span><span>)         { </span><span class="kw">return</span><span> </span><span class="fn">conj</span><span>(</span><span class="tv2">z</span><span>) / </span><span class="fn">max</span><span>(</span><span class="fn">dot</span><span>(</span><span class="tv2">z</span><span>, </span><span class="tv2">z</span><span>), </span><span class="tf num">1e-30</span><span>); }    </span><span class="c">// 1 / z</span></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">cexp</span><span>(</span><span class="ty tf">float</span><span> </span><span class="tf">t</span><span>)        { </span><span class="kw">return</span><span> </span><span class="ty tv2">vec2</span><span>(</span><span class="fn">cos</span><span>(</span><span class="tf">t</span><span>), </span><span class="fn">sin</span><span>(</span><span class="tf">t</span><span>)); }               </span><span class="c">// the unit number at angle t</span></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">cpow</span><span>(</span><span class="ty tv2">vec2</span><span> </span><span class="tv2">z</span><span>, </span><span class="ty tf">int</span><span> </span><span class="tf">n</span><span>)  { </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">w</span><span> = </span><span class="tv2">z</span><span>; </span><span class="kw">for</span><span> (</span><span class="ty tf">int</span><span> </span><span class="tf">i</span><span> = </span><span class="tf num">1</span><span>; </span><span class="tf">i</span><span> &lt; </span><span class="tf">n</span><span>; </span><span class="tf">i</span><span>++) </span><span class="tv2">w</span><span> = </span><span class="fn">cmul</span><span>(</span><span class="tv2">w</span><span>, </span><span class="tv2">z</span><span>); </span><span class="kw">return</span><span> </span><span class="tv2">w</span><span>; }</span></span></code></pre>

Three operations come out of this, one per section: a product of worlds opens their crossing into a wormhole ([§10](#neck)), a root splits one world into several and gives portals ([§11](#portal)), and a power puts extra angle around a point ([§12](#cone)).

This only works for two numbers. Numbers you can multiply and divide exist in 1, 2, 4 and 8 dimensions: real numbers, complex numbers, quaternions and octonions, and nothing in between. So for 3D worlds in 6D, with three numbers, there is no general product and no roots. A few tricks survive, in [§10](#neck) and [§13](#higher).

## 10. Multiply: wormholes from touching worlds {#neck}

A product of complex numbers is zero when either factor is zero. So `cmul(A, B)` describes world A and world B together. That is a union, but a crude one: where the two worlds meet, the result is a sharp crossing.

In 4D, two planes in general position meet at a single point. Now ask for the product to be a small number {% <katex> %}\\varepsilon{% </katex> %} instead of zero: {% <katex> %}A\\cdot B\=\\varepsilon{% </katex> %}. Far from the meeting point one factor is large, so the other must be tiny, and you are almost exactly on one of the two worlds. Near the meeting point both are small, and the surface opens into a tube of radius about {% <katex> %}\\sqrt\\varepsilon{% </katex> %} that connects the two worlds. The touching point has become a wormhole. In 3D the same equation with real numbers, {% <katex> %}xy\=\\varepsilon{% </katex> %}, gives two separate curved sheets; it is the complex version that connects.

The version below only changes the worlds near the meeting point (inside radius <code class="tf">k</code>) and keeps the field distance-like. Near world A it is "A equals {% <katex> %}\\varepsilon\/B{% </katex> %}", and near world B the same with the roles swapped. It takes any two worlds that cross at a single point the way two planes in general position do: their four gradients there point in four different directions. Keep the neck well inside the region it modifies, {% <katex> %}\\sqrt\\varepsilon \\lt  k\/2{% </katex> %}; a larger neck gets a crease where the formula switches sides.

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="ty tf">float</span><span> </span><span class="fn">cutoff</span><span>(</span><span class="ty tf">float</span><span> </span><span class="tf">t</span><span>) { </span><span class="kw">return</span><span> </span><span class="tf num">1.0</span><span> - </span><span class="fn">smoothstep</span><span>(</span><span class="tf num">0.5</span><span>, </span><span class="tf num">1.0</span><span>, </span><span class="tf">t</span><span>); }   </span><span class="c">// 1 near the point, 0 beyond k</span></span>
<span class="giallo-l"></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">neck_union</span><span>(</span><span class="ty tv2">vec2</span><span> </span><span class="tv2">A</span><span>, </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">B</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">eps</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">k</span><span>) {</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="fn">length</span><span>(</span><span class="tv2">A</span><span>) &lt; </span><span class="fn">length</span><span>(</span><span class="tv2">B</span><span>)</span></span>
<span class="giallo-l"><span>        ? </span><span class="tv2">A</span><span> - </span><span class="tf">eps</span><span> * </span><span class="fn">cutoff</span><span>(</span><span class="fn">length</span><span>(</span><span class="tv2">B</span><span>) / </span><span class="tf">k</span><span>) * </span><span class="fn">cinv</span><span>(</span><span class="tv2">B</span><span>)</span></span>
<span class="giallo-l"><span>        : </span><span class="tv2">B</span><span> - </span><span class="tf">eps</span><span> * </span><span class="fn">cutoff</span><span>(</span><span class="fn">length</span><span>(</span><span class="tv2">A</span><span>) / </span><span class="tf">k</span><span>) * </span><span class="fn">cinv</span><span>(</span><span class="tv2">A</span><span>);</span></span>
<span class="giallo-l"><span>}</span></span>
<span class="giallo-l"></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">two_worlds_one_neck</span><span>(</span><span class="ty tv">vec4</span><span> </span><span class="tv">p</span><span>) {</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">A</span><span> = </span><span class="fn">world</span><span>(</span><span class="tf">p.z</span><span>, </span><span class="tf">p.w</span><span>);       </span><span class="c">// the xy-plane</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">B</span><span> = </span><span class="fn">world</span><span>(</span><span class="tf">p.x</span><span>, </span><span class="tf">p.y</span><span>);       </span><span class="c">// the zw-plane: touches A only at the origin</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="fn">neck_union</span><span>(</span><span class="tv2">A</span><span>, </span><span class="tv2">B</span><span>, </span><span class="tf">eps</span><span>, </span><span class="tf">k</span><span>);</span></span>
<span class="giallo-l"><span>}</span></span></code></pre>

Two practical notes. The formula switches sides at the waist of the neck, so take its gradients from the side chosen at the point where you take them ([§16](#pitfalls)). And at the meeting point itself both worlds are zero and the field is undefined; that point is not on the world, and rays never get there.

{% <figure caption="**Two perpendicular planes that touch at one point**, joined by `neck_union`. The orange world appears through the neck."> %}
{{ <image path="img/scan_neck.webp" scale="1/2" /> }}
{% </figure> %}

<div class="co2-demo" data-scene="neck" data-compact="1"></div>

### Three worlds at one point

{% <admonition color="violet" title="❓ Question"> %}
Can three worlds touch at a single point, and what happens there?
{% </admonition> %}

Three planes in general position meet pairwise at three different points, and two nested `neck_union`s connect every pair. If you put all three planes through *one* point instead, you get a single junction between all three worlds. Multiply all three, and subtract {% <katex> %}\\varepsilon{% </katex> %}:

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="c">// three planes; every two of them touch at one point</span></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">three_necks</span><span>(</span><span class="ty tv">vec4</span><span> </span><span class="tv">p</span><span>) {</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">A</span><span> = </span><span class="fn">world</span><span>(</span><span class="tf">p.z</span><span>, </span><span class="tf">p.w</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">B</span><span> = </span><span class="fn">world</span><span>(</span><span class="tf">p.x</span><span>, </span><span class="tf">p.y</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">C</span><span> = </span><span class="fn">world</span><span>(</span><span class="tf">p.x</span><span> + </span><span class="tf">p.z</span><span> - </span><span class="tf">c</span><span>, </span><span class="tf">p.y</span><span> + </span><span class="tf">p.w</span><span>) / </span><span class="fn">sqrt</span><span>(</span><span class="tf num">2.0</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="fn">neck_union</span><span>(</span><span class="fn">neck_union</span><span>(</span><span class="tv2">A</span><span>, </span><span class="tv2">B</span><span>, </span><span class="tf">eps</span><span>, </span><span class="tf">k</span><span>), </span><span class="tv2">C</span><span>, </span><span class="tf">eps</span><span>, </span><span class="tf">k</span><span>);</span></span>
<span class="giallo-l"><span>}</span></span>
<span class="giallo-l"><span class="c">// the planes u = 0, v = 0 and u = v all pass through the origin</span></span>
<span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">triple_point</span><span>(</span><span class="ty tv">vec4</span><span> </span><span class="tv">p</span><span>) {</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">u</span><span> = </span><span class="tv2">p.xy</span><span>, </span><span class="tv2">v</span><span> = </span><span class="tv2">p.zw</span><span>;</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">all</span><span> = </span><span class="fn">cmul</span><span>(</span><span class="fn">cmul</span><span>(</span><span class="tv2">u</span><span>, </span><span class="tv2">v</span><span>), </span><span class="tv2">u</span><span> - </span><span class="tv2">v</span><span>);     </span><span class="c">// zero on all three: their union, crossing at the origin</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">r2</span><span> = </span><span class="fn">dot</span><span>(</span><span class="tv2">u</span><span>, </span><span class="tv2">u</span><span>) + </span><span class="fn">dot</span><span>(</span><span class="tv2">v</span><span>, </span><span class="tv2">v</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">open</span><span> = </span><span class="tv2">all</span><span> - </span><span class="ty tv2">vec2</span><span>(</span><span class="tf">eps</span><span> * </span><span class="fn">cutoff</span><span>(</span><span class="fn">sqrt</span><span>(</span><span class="tf">r2</span><span>) / </span><span class="tf">k</span><span>), </span><span class="tf num">0.0</span><span>);   </span><span class="c">// open the crossing</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="tv2">open</span><span> / (</span><span class="tf">r2</span><span> + </span><span class="tf num">0.05</span><span>);                                  </span><span class="c">// divide to stay distance-like</span></span>
<span class="giallo-l"><span>}</span></span></code></pre>

The triple point is a little richer than it looks. Besides joining the three worlds, the smoothed junction contains a small handle, a loop that goes around inside it, which the Y-junction of [§8](#turn) does not have.

{% <figure caption="*Left:* **Three planes, three meeting points, three necks.** From the green world you see two of them. *Right:* **Three planes through one point, smoothed.** One junction; through it you see both other worlds."> %}
{% <container> %}
{{ <image path="img/scan_three_necks.webp" scale="1/2" /> }}
{{ <image path="img/scan_triple_point.webp" scale="1/2" /> }}
{% </container> %}
{% </figure> %}

<div class="co2-demo" data-scene="triple_point" data-compact="1"></div>

For 2D worlds in 4D this works because two planes in 4D meet at a single point: {% <katex> %}2\+2\=4{% </katex> %}. For 3D worlds the count changes. Two 3D spaces inside 5D that cross always share at least a whole line, {% <katex> %}3\+3\-5\=1{% </katex> %}, just as two planes inside 3D share a line. So in 5D the same recipe gives three worlds meeting along a line: the 2D triple point with the fifth coordinate ignored, an infinite `extrude`. For a single point, take 6D, where {% <katex> %}3\+3\=6{% </katex> %}: there two 3D worlds can cross at exactly one point, as two planes do in 4D.

In 6D each world is described by three numbers, not a pair, and the step needs the 3-number `fix` of [§13](#higher). The triple point needs one more thing: a product of three worlds that is zero exactly on them. For pairs, `cmul` gave it. For three numbers there is no such multiplication ([§9](#complex)), but quaternions get close. A quaternion is four numbers that can be multiplied and divided, so a product of quaternions is zero only where one of the factors is zero. Read each world's three numbers as a quaternion with no real part and multiply the three. The product has four numbers, one too many. Keep the three that are not the real part; `qmul3` writes them out:

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="c">// the three non-real numbers of the quaternion product a * b * c, for quaternions with no real part</span></span>
<span class="giallo-l"><span class="ty tv">vec3</span><span> </span><span class="fn">qmul3</span><span>(</span><span class="ty tv">vec3</span><span> </span><span class="tv">a</span><span>, </span><span class="ty tv">vec3</span><span> </span><span class="tv">b</span><span>, </span><span class="ty tv">vec3</span><span> </span><span class="tv">c</span><span>) { </span><span class="kw">return</span><span> </span><span class="fn">dot</span><span>(</span><span class="tv">a</span><span>, </span><span class="tv">c</span><span>) * </span><span class="tv">b</span><span> - </span><span class="fn">dot</span><span>(</span><span class="tv">a</span><span>, </span><span class="tv">b</span><span>) * </span><span class="tv">c</span><span> - </span><span class="fn">dot</span><span>(</span><span class="tv">b</span><span>, </span><span class="tv">c</span><span>) * </span><span class="tv">a</span><span>; }</span></span>
<span class="giallo-l"></span>
<span class="giallo-l"><span class="c">// 3D worlds in 6D: u = p.xyz and v = the other three coordinates.</span></span>
<span class="giallo-l"><span class="c">// The worlds v = 0, u = 0 and u = v share only the origin.</span></span>
<span class="giallo-l"><span class="ty tv">vec3</span><span> </span><span class="fn">three_worlds_at_a_point</span><span>(</span><span class="ty tv">vec3</span><span> </span><span class="tv">u</span><span>, </span><span class="ty tv">vec3</span><span> </span><span class="tv">v</span><span>) {</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv">vec3</span><span> </span><span class="tv">all</span><span> = </span><span class="fn">qmul3</span><span>(</span><span class="tv">v</span><span>, </span><span class="tv">u</span><span>, </span><span class="tv">u</span><span> - </span><span class="tv">v</span><span>);          </span><span class="c">// zero on all three worlds, and nowhere else</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">r2</span><span> = </span><span class="fn">dot</span><span>(</span><span class="tv">u</span><span>, </span><span class="tv">u</span><span>) + </span><span class="fn">dot</span><span>(</span><span class="tv">v</span><span>, </span><span class="tv">v</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv">vec3</span><span> </span><span class="tv">open</span><span> = </span><span class="tv">all</span><span> - </span><span class="ty tv">vec3</span><span>(</span><span class="tf num">0.0</span><span>, </span><span class="tf num">0.0</span><span>, </span><span class="tf">eps</span><span> * </span><span class="fn">cutoff</span><span>(</span><span class="fn">sqrt</span><span>(</span><span class="tf">r2</span><span>) / </span><span class="tf">k</span><span>));   </span><span class="c">// open the crossing</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="tv">open</span><span> / (</span><span class="tf">r2</span><span> + </span><span class="tf num">0.05</span><span>);                                       </span><span class="c">// divide to stay distance-like</span></span>
<span class="giallo-l"><span>}</span></span></code></pre>

Dropping the real part could add new zeros, but here it does not. Written out, `all` is {% <katex> %}\-\|v\|\^2\\\,u \+ \(2\\\,u\\cdot v \- \|u\|\^2\)\\\,v{% </katex> %}. If {% <katex> %}u{% </katex> %} and {% <katex> %}v{% </katex> %} were not parallel, both coefficients would have to be zero, and {% <katex> %}\|v\|\^2\=0{% </katex> %} would make {% <katex> %}v\=0{% </katex> %}. So either {% <katex> %}v\=0{% </katex> %}, which is the first world, or {% <katex> %}u\=\\lambda v{% </katex> %}, and then the expression is {% <katex> %}\\lambda\(1\-\\lambda\)\|v\|\^2\\\,v{% </katex> %}, zero only for {% <katex> %}\\lambda\=0{% </katex> %} (the world {% <katex> %}u\=0{% </katex> %}) and {% <katex> %}\\lambda\=1{% </katex> %} (the world {% <katex> %}u\=v{% </katex> %}). Checked numerically, the opened field is regular everywhere: its three gradients never become dependent, and the junction is one connected piece that reaches all three worlds. (The pictures use `eps = 1.0` and `k = 2.6`.) Here are three 3D worlds that meet at one point in the middle, seen from one of them:

{{ <gallery images={[
	"img/point_junction_0.webp",
	"img/point_junction_45.webp",
	"img/point_junction_90.webp",
	"img/point_junction_top.webp",
]} alts={[
	"**From the green world, at 0°.** The meeting point opens into a round mouth. Through it you see the orange world, and inside that the blue one.",
	"**At 45°.** Walking around the mouth changes where each world shows.",
	"**At 90°.** The orange and the blue world side by side.",
	"**From above.** The same mouth, with the floor bending around it.",
]} nth={2} /> }}

## 11. Roots: a flat portal {#portal}

{% <admonition color="violet" title="❓ Question"> %}
What does a true portal look like, flat at the entrance with only its edge special, if it is built as a smooth surface?
{% </admonition> %}

By a portal we mean what portal games do: the space at the entrance is completely flat, you cannot feel the crossing, and only the edge is special. A wormhole is different, because its throat is curved and you would feel squeezed passing through. This section builds a true portal as a smooth surface.

Start with two parallel worlds. In the two extra directions, written as one complex number <code class="tv2">n</code>, world 1 sits at {% <katex> %}n\=\+\\rho{% </katex> %} and world 2 at {% <katex> %}n\=\-\\rho{% </katex> %}. Both together are the solutions of

{% <katex block={true}> %}n^2 = \rho^2\,W, \qquad\text{with } W = 1 .{% </katex> %}

With {% <katex> %}N{% </katex> %} instead of 2 there are {% <katex> %}N{% </katex> %} worlds, at the corners of a regular polygon. As code, with the worlds at <code class="tf">rho</code> times the {% <katex> %}N{% </katex> %} roots of <code class="tv2">W</code>:

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">roots</span><span>(</span><span class="ty tv2">vec2</span><span> </span><span class="tv2">n</span><span>, </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">W</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">rho</span><span>, </span><span class="ty tf">int</span><span> </span><span class="tf">N</span><span>) { </span><span class="kw">return</span><span> </span><span class="tf">rho</span><span> * (</span><span class="fn">cpow</span><span>(</span><span class="tv2">n</span><span> / </span><span class="tf">rho</span><span>, </span><span class="tf">N</span><span>) - </span><span class="tv2">W</span><span>) / </span><span class="ty tf">float</span><span>(</span><span class="tf">N</span><span>); }</span></span></code></pre>

Now let {% <katex> %}W{% </katex> %} depend on the position in the world. Far away keep {% <katex> %}W\=1{% </katex> %}. Near a ring, the portal's frame, make {% <katex> %}W{% </katex> %} go once around zero as you walk through the ring. A square root halves angles, so while {% <katex> %}W{% </katex> %} turns a full 360°, {% <katex> %}n\=\\rho\\sqrt W{% </katex> %} turns only 180°. You started at {% <katex> %}\+\\rho{% </katex> %} and you end at {% <katex> %}\-\\rho{% </katex> %}: in the other world. Walking through the disc inside the frame takes you from world 1 to world 2.

<div class="co2-fig">
<svg class="diagram" viewBox="0 0 620 230" role="img" aria-label="Left: the value W goes once around zero along a loop around the portal frame. Right: n, the square root, only goes half way round, from plus rho to minus rho, so the path ends in the other world.">
  <defs><marker id="ar3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--orange)"/></marker></defs>
  <rect x="0" y="0" width="620" height="230" rx="12" fill="var(--paper-2)"/>
  <line x1="40" y1="115" x2="260" y2="115" stroke="var(--rule)" stroke-width="1.5"/><line x1="150" y1="20" x2="150" y2="210" stroke="var(--rule)" stroke-width="1.5"/>
  <circle cx="150" cy="115" r="70" fill="none" stroke="var(--orange)" stroke-width="2.5"/>
  <polygon points="142,40 156,33 156,47" fill="var(--orange)"/>
  <circle cx="220" cy="115" r="6" fill="var(--green)"/>
  <text x="228" y="140" font-size="13" fill="var(--green)">W = 1</text>
  <text x="20" y="30" font-size="13" fill="var(--ink-2)">a full turn around 0</text>
  <line x1="360" y1="115" x2="580" y2="115" stroke="var(--rule)" stroke-width="1.5"/><line x1="470" y1="20" x2="470" y2="210" stroke="var(--rule)" stroke-width="1.5"/>
  <path d="M 550 115 A 80 80 0 0 0 390 115" fill="none" stroke="var(--orange)" stroke-width="2.5" marker-end="url(#ar3)"/>
  <circle cx="550" cy="115" r="7" fill="var(--green)"/><circle cx="390" cy="115" r="7" fill="var(--orange)"/>
  <text x="540" y="140" font-size="13" fill="var(--green)">+&rho;: world 1</text>
  <text x="362" y="140" font-size="13" fill="var(--orange)">&minus;&rho;: world 2</text>
  <text x="360" y="215" font-size="13" fill="var(--ink-2)">n = &rho;&middot;&radic;W only turns half way</text>
</svg>
</div>

The surface is smooth everywhere, including at the frame, where {% <katex> %}W\=0{% </katex> %} and the worlds merge. What makes it a true portal is how {% <katex> %}W{% </katex> %} changes. Inside the frame, {% <katex> %}W{% </katex> %} depends only on the coordinate that goes *through* the portal. Outside the frame it is exactly 1. The worlds are then bent in the extra directions along one coordinate only, like a sheet of paper bent in one direction, and a bent sheet of paper is not curved inside. So the space is exactly flat everywhere except a thin band around the frame. Going through takes a little longer than the frame region is thick, because the world also travels along the extra plane while you cross, but nothing in it bends. Here it is for 3D worlds in 5D:

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">flat_portal</span><span>(</span><span class="ty tv">vec5</span><span> </span><span class="tv">p</span><span>, </span><span class="ty tf">int</span><span> </span><span class="tf">N</span><span>) {                                </span><span class="c">// N worlds; N = 2: a portal</span></span>
<span class="giallo-l"><span>    </span><span class="ty tf">float</span><span> </span><span class="tf">frame</span><span> = </span><span class="tf num">1.0</span><span> - </span><span class="fn">smoothstep</span><span>(</span><span class="tf">R</span><span> - </span><span class="tf">a</span><span>, </span><span class="tf">R</span><span> + </span><span class="tf">a</span><span>, </span><span class="fn">length</span><span>(</span><span class="tv2">p.xy</span><span>)); </span><span class="c">// 1 inside the frame, 0 outside</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv2">vec2</span><span>  </span><span class="tv2">full_turn</span><span> = </span><span class="fn">cexp</span><span>(-</span><span class="tf">TAU</span><span> * </span><span class="fn">smoothstep</span><span>(-</span><span class="tf">T</span><span>, </span><span class="tf">T</span><span>, </span><span class="tf">p.z</span><span>));      </span><span class="c">// once around 0 as you go through</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv2">vec2</span><span>  </span><span class="tv2">W</span><span> = </span><span class="fn">mix</span><span>(</span><span class="ty tv2">vec2</span><span>(</span><span class="tf num">1.0</span><span>, </span><span class="tf num">0.0</span><span>), </span><span class="tv2">full_turn</span><span>, </span><span class="tf">frame</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="fn">roots</span><span>(</span><span class="tv2">p.wv</span><span>, </span><span class="tv2">W</span><span>, </span><span class="tf">rho</span><span>, </span><span class="tf">N</span><span>);</span></span>
<span class="giallo-l"><span>}</span></span></code></pre>

<code class="tf">R</code> is the frame radius and <code class="tf">a</code> the width of the curved band around it. <code class="tf">T</code> is how deep the crossing region is, and <code class="tf">rho</code> the distance of the worlds from the centre of the extra plane. With `N = 3` there are three worlds at the corners of a triangle, and the cube root takes you to the next world when you go through from the front and to the previous one from behind. That is the image at the top of the page: one ring, three worlds. It also answers the three-world question a third way, with a junction that is symmetric by construction.

{{ <gallery images={[
	"img/flat_gate3.webp",
	"img/flat_gate3_back.webp",
	"img/flat_gate2.webp",
	"img/flat_gate2_bare.webp",
	"img/scan_flat_portal.webp",
]} alts={[
	"**A portal between three parallel 3D worlds in 5D.** From the green world, the ring shows the blue world. The space inside the ring is exactly flat; only the frame is curved.",
	"**The same ring from behind** leads to the third, orange world. The whole scene is one short formula.",
	"**Two worlds.** The golden frame is drawn where `W=0`.",
	"**Without the drawn frame** the edge shows only as a thin band of lensing. Everything inside it looks undistorted.",
	"**2D worlds in 4D.** The frame is two points and the portal is the slit between them; the grid runs straight through.",
]} nth={3} /> }}

<div class="co2-demo" data-scene="flat_portal" data-compact="1"></div>

Tick *curvature* under the widget to see where the space is curved. Everything stays grey, inside the frame and outside it, except at the two ends of the slit. A first version of this portal used {% <katex> %}W\=\(\|x\|\^2\-R\^2\+2iRy\)\/\(\|x\|\^2\+R\^2\){% </katex> %}, which winds around zero just as well but curves the whole space a little; it is still in the playground as the curved portal, for comparison.

## 12. Powers: more than 360° around a point {#cone}

{% <admonition color="violet" title="❓ Question"> %}
A flat cone in 3D has less than 360° around its tip. Is more possible in 4D?
{% </admonition> %}

A world can also be a graph: the two extra coordinates as a function of the position in the world, like a height map with two heights.

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">graph</span><span>(</span><span class="ty tv2">vec2</span><span> </span><span class="tv2">n</span><span>, </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">h</span><span>) { </span><span class="kw">return</span><span> </span><span class="tv2">n</span><span> - </span><span class="tv2">h</span><span>; }      </span><span class="c">// the world at height h in the extra plane n</span></span></code></pre>

Take the height {% <katex> %}c\\cdot u\^2\/\|u\|{% </katex> %}, where {% <katex> %}u{% </katex> %} is the position in the world as a complex number. Squaring doubles the angle, so walking once around the tip, the height goes around twice, and the world has more room than a plane:

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="ty tv2">vec2</span><span> </span><span class="fn">cone</span><span>(</span><span class="ty tv">vec4</span><span> </span><span class="tv">p</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">c</span><span>, </span><span class="ty tf">float</span><span> </span><span class="tf">delta</span><span>) {         </span><span class="c">// delta rounds the tip</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">u</span><span> = </span><span class="tv2">p.xy</span><span>;</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv2">vec2</span><span> </span><span class="tv2">h</span><span> = </span><span class="tf">c</span><span> * </span><span class="fn">cmul</span><span>(</span><span class="tv2">u</span><span>, </span><span class="tv2">u</span><span>) / </span><span class="fn">sqrt</span><span>(</span><span class="fn">dot</span><span>(</span><span class="tv2">u</span><span>, </span><span class="tv2">u</span><span>) + </span><span class="tf">delta</span><span> * </span><span class="tf">delta</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> </span><span class="fn">graph</span><span>(</span><span class="tv2">p.zw</span><span>, </span><span class="tv2">h</span><span>);</span></span>
<span class="giallo-l"><span>}   </span><span class="c">// angle around the tip, on large circles: 360 deg * sqrt((1 + 4c^2) / (1 + c^2)), up to 720 deg</span></span></code></pre>

{% <figure caption="**540° around the tip**, measured on large circles (c = 0.845). Rays passing the tip spread apart."> %}
{{ <image path="img/scan_cone.webp" scale="1/2" /> }}
{% </figure> %}

<div class="co2-demo" data-scene="cone" data-compact="1"></div>

Such cones exist in 3D too, which is a surprise: the cone over a wavy closed curve has as much angle as the curve is long, like a ruffled skirt. What 4D adds is the round, symmetric version and a one-line field. A rounded tip always carries curvature that makes up the difference from 360°: here it is negative, the blue of a saddle. For a 3D world the same cone extruded along one more axis gives a line with too much angle around it.

## 13. 3D worlds in 5D and 6D {#higher}

Nothing in the kernel depends on the dimension. In 5D the field still returns two numbers, the gradients have five components, and `fix` is the same 2×2 solve. GLSL has no <code class="tv">vec5</code>; in a shader you keep the world's own <code class="tv">vec3</code> and the two extra coordinates as a <code class="tv2">vec2</code>, and everything above stays the same. The per-pixel geodesics of the videos' renderer stay as they are.

A 3D world in 6D needs three numbers, and `fix` becomes a 3×3 linear system. There is no complex-number trick for three numbers ([§9](#complex)), so square roots are gone, and so is a general product. Two things survive. One is the product of three worlds borrowed from quaternions, which joins three worlds at one point ([§10](#neck)). The other is dividing a vector by its squared length, {% <katex> %}B\/\|B\|\^2{% </katex> %}, which is what `cinv` did for pairs. With it the neck works again. Two 3D worlds in 6D meet at one point, and `A - eps * B / dot(B, B)` turns that point into a spherical wormhole with no tube at all:

{% <figure caption="**Two 3D worlds in 6D that touch at one point**, joined by the 3-number version of `neck_union`."> %}
{{ <image path="img/neck6d.webp" scale="3/4" /> }}
{% </figure> %}

## 14. Playground {#demo}

Every scene below is built from this small library, on top of the `ball`, `extrude` and `smin` of [§1](#recap):

| Function | What it gives | § |
|-|-|-|
| `world(solid, carrier)` | A world: the boundary of the solid, inside the carrier. | 6 |
| `plane`, `sphere`, `donut`, `in_slice` | Ordinary SDFs, placed in the slice {% <katex> %}w\=0{% </katex> %}. | 6 |
| `flat_torus(p, a, b)` | The flat torus: a circle in {% <katex> %}xy{% </katex> %} and a circle in {% <katex> %}zw{% </katex> %}. | 6 |
| `union`, `subtract`, `smooth_union` | Booleans on the solid; the carrier is carried along. Joined pieces must share the carrier where they meet. | 7 |
| `extrude(world, p, h)` | The solid extruded along the coordinate `p`. | 7 |
| `turn(a, b, angle)` | A carrier swung from `a` towards `b`, around the place where both are zero. | 8 |
| `torus(p, a, b, angle)` | One torus: a donut at 0°, the flat torus at 90°. | 8 |
| `neck_union(A, B, eps, k)` | Two worlds that cross at a point, joined by a wormhole there. | 10 |
| `roots(n, W, rho, N)` | {% <katex> %}N{% </katex> %} worlds at the {% <katex> %}N{% </katex> %}-th roots of `W`; a portal where `W` turns around 0. | 11 |
| `graph(n, h)` | The world at height `h` in the extra plane. | 12 |

All 2D scenes of this page, traced live with the same code. Left: the view from inside, the scan of the videos. You are the red creature in the middle, with a white nose in front and a white ear on its left, so you can tell your copies from your mirror images. W/S walk, A/D turn, the wheel zooms, drag to walk. Right: the world seen from outside. *Projection* drops one of the four coordinates; drag to orbit, shift-drag to rotate in 4D. *Slice* fixes one coordinate, {% <katex> %}y{% </katex> %} by default, as in the slices of the videos: the slider moves it, and the view shows what the other three coordinates contain. Under the controls, *code* shows the current scene in the notation of this page.

Tick *curvature* to colour both views by Gaussian curvature, with the colours of the videos: grey where the world is flat, blue where it is saddle-shaped, orange where it is dome-shaped. *K range* sets the curvature that gets the full colour.

<div class="co2-demo" data-scene="flat_portal"></div>

The curvature view needs one formula that the codimension-1 version does not. On a surface in 3D you measure how the normal turns when you step along the surface, and combine the turns as `s11 * s22 - s12 * s21`. In 4D there are two normals, so what turns is the plane they span. Step along a tangent direction and see how the part of that direction which leaves the world changes. That change is a vector, not a number, so the products become dot products:

<pre class="giallo co2-code" style="color: #1F1F1F; background-color: #F5F5F5;" data-lang="glsl"><code data-lang="glsl"><span class="giallo-l"><span class="c">// the part of w that leaves the world</span></span>
<span class="giallo-l"><span class="ty tv">vec4</span><span> </span><span class="fn">leaving</span><span>(</span><span class="ty tv">vec4</span><span> </span><span class="tv">w</span><span>, </span><span class="ty ts">Field</span><span> </span><span class="ts">F</span><span>) { </span><span class="kw">return</span><span> </span><span class="tv">w</span><span> - </span><span class="fn">tangent</span><span>(</span><span class="tv">w</span><span>, </span><span class="ts">F</span><span>); }</span></span>
<span class="giallo-l"></span>
<span class="giallo-l"><span class="c">// p on the world; t1, t2: perpendicular unit tangent directions at p</span></span>
<span class="giallo-l"><span class="ty tf">float</span><span> </span><span class="fn">gauss_curvature</span><span>(</span><span class="ty tv">vec4</span><span> </span><span class="tv">p</span><span>, </span><span class="ty tv">vec4</span><span> </span><span class="tv">t1</span><span>, </span><span class="ty tv">vec4</span><span> </span><span class="tv">t2</span><span>) {</span></span>
<span class="giallo-l"><span>    </span><span class="kw">const</span><span> </span><span class="ty tf">float</span><span> </span><span class="tf">h</span><span> = </span><span class="tf num">0.03</span><span>;</span></span>
<span class="giallo-l"><span>    </span><span class="ty ts">Field</span><span> </span><span class="ts">F1p</span><span> = </span><span class="fn">field</span><span>(</span><span class="tv">p</span><span> + </span><span class="tf">h</span><span> * </span><span class="tv">t1</span><span>), </span><span class="ts">F1m</span><span> = </span><span class="fn">field</span><span>(</span><span class="tv">p</span><span> - </span><span class="tf">h</span><span> * </span><span class="tv">t1</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="ty ts">Field</span><span> </span><span class="ts">F2p</span><span> = </span><span class="fn">field</span><span>(</span><span class="tv">p</span><span> + </span><span class="tf">h</span><span> * </span><span class="tv">t2</span><span>), </span><span class="ts">F2m</span><span> = </span><span class="fn">field</span><span>(</span><span class="tv">p</span><span> - </span><span class="tf">h</span><span> * </span><span class="tv">t2</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv">vec4</span><span> </span><span class="tv">s11</span><span> = </span><span class="fn">leaving</span><span>(</span><span class="tv">t1</span><span>, </span><span class="ts">F1p</span><span>) - </span><span class="fn">leaving</span><span>(</span><span class="tv">t1</span><span>, </span><span class="ts">F1m</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv">vec4</span><span> </span><span class="tv">s22</span><span> = </span><span class="fn">leaving</span><span>(</span><span class="tv">t2</span><span>, </span><span class="ts">F2p</span><span>) - </span><span class="fn">leaving</span><span>(</span><span class="tv">t2</span><span>, </span><span class="ts">F2m</span><span>);</span></span>
<span class="giallo-l"><span>    </span><span class="ty tv">vec4</span><span> </span><span class="tv">s12</span><span> = </span><span class="tf num">0.5</span><span> * (</span><span class="fn">leaving</span><span>(</span><span class="tv">t2</span><span>, </span><span class="ts">F1p</span><span>) - </span><span class="fn">leaving</span><span>(</span><span class="tv">t2</span><span>, </span><span class="ts">F1m</span><span>)</span></span>
<span class="giallo-l"><span>                    + </span><span class="fn">leaving</span><span>(</span><span class="tv">t1</span><span>, </span><span class="ts">F2p</span><span>) - </span><span class="fn">leaving</span><span>(</span><span class="tv">t1</span><span>, </span><span class="ts">F2m</span><span>));</span></span>
<span class="giallo-l"><span>    </span><span class="kw">return</span><span> (</span><span class="fn">dot</span><span>(</span><span class="tv">s11</span><span>, </span><span class="tv">s22</span><span>) - </span><span class="fn">dot</span><span>(</span><span class="tv">s12</span><span>, </span><span class="tv">s12</span><span>)) / (</span><span class="tf num">4.0</span><span> * </span><span class="tf">h</span><span> * </span><span class="tf">h</span><span>);</span></span>
<span class="giallo-l"><span>}</span></span></code></pre>

Only the plane spanned by the two gradients enters, not the gradients themselves, so rotating the pair ([§5](#meaning)) does not change the result, and neither does a field that switches formulas off the world, as the neck does. For <code class="tv">t1</code>, take `tangent()` of an axis and normalize it; for <code class="tv">t2</code>, the same with a second axis, minus its part along <code class="tv">t1</code>. In float32, raise the step in `field()` to 1e-3 for this; the error on a sphere is then under 1%. Checked on known shapes: 1/r² on a round sphere, exactly 0 on the flat torus, and the textbook formula on the neck `u·v = ε`.

## 15. The same thing in geometric algebra {#ga}

{% <admonition color="violet" title="❓ Question"> %}
Is projective geometric algebra the answer? Instead of storing two normals, can we store just a bivector?
{% </admonition> %}

Partly. For two numbers, geometric algebra and complex numbers turn out to be the same thing, and PGA describes the push-back beautifully, but it cannot do the joining.

{% <admonition color="gray" title="🛠 Outer product"> %}
In geometric algebra, the outer product {% <katex> %}a\\wedge b{% </katex> %} of two vectors is the oriented parallelogram they span, called a *bivector*. Think of it as a small piece of a plane with a size and a direction of rotation. Its squared size is exactly the `det` in `fix`. For the two gradients, {% <katex> %}a\\wedge b{% </katex> %} is the plane of directions that leave the world, the plane drawn in [§5](#meaning). So the normal plane, which needed two normals before, is now one object.
{% </admonition> %}

{% <admonition color="green3" title="✨ Where complex numbers come from"> %}
In geometric algebra a unit bivector multiplied by itself gives {% <katex> %}\-1{% </katex> %}, and multiplying a vector in its plane by it rotates that vector by 90°. That is exactly what {% <katex> %}i{% </katex> %} does. So inside the normal plane, "{% <katex> %}f \+ g\\cdot{% </katex> %}bivector" behaves exactly like the complex number {% <katex> %}f\+ig{% </katex> %}. The complex numbers of this page *are* geometric algebra, the part of it that lives in the normal plane. For three numbers (worlds in 6D) the normal space is 3D. There the geometric-algebra object is a trivector, a piece of 3D volume, and its values do not form a number system you can divide in. That is the same statement as in [§9](#complex), seen from the other side.
{% </admonition> %}

{% <admonition color="gray" title="🛠 Projective GA (PGA)"> %}
Plain geometric algebra only knows directions. PGA adds one extra basis vector {% <katex> %}e\_0{% </katex> %} for offsets, so a plane that does not pass through the origin is a single object, written as "normal plus offset times {% <katex> %}e\_0{% </katex> %}". In PGA, one field evaluation (value and gradient) already is such a plane: the tangent plane of that number. The outer product of two planes is their intersection, {% <katex> %}L\=H\_f\\wedge H\_g{% </katex> %}: the flat 2D plane that touches the world. `fix` is the PGA projection of the point onto that flat, {% <katex> %}\(P\\cdot L\)L\^\{\-1\}{% </katex> %}. This was checked numerically in 4D and 5D PGA ({% <katex> %}\\mathbb R\_\{4\,0\,1\}{% </katex> %} and {% <katex> %}\\mathbb R\_\{5\,0\,1\}{% </katex> %}): the two give the same point to rounding error. PGA is the nicest way to *describe* the push-back. In a shader the 2×2 solve does the same work with less code.
{% </admonition> %}

{% <admonition color="red2" title="❌ What PGA cannot do"> %}
It is the joining. The outer product of the two planes does not change when you rotate the pair {% <katex> %}\(f\,g\){% </katex> %}, so it forgets the angle that [§7](#union) needs for unions. That is why the code stores the two numbers and not the bivector. In GA terms the object that composes is the bivector *together with* a chosen direction in its plane: the complex number.
{% </admonition> %}

# Part IV. Notes

## 16. Things that go wrong, and fixes {#pitfalls}

{% <admonition color="orange" title="⚠️ Gradients across a jump"> %}
`union` switches between two pieces. If both pieces describe the same world with different angles (as in the three-world scene, where each world appears in two pairs), the second number jumps right on the world. A numerical gradient taken across the jump is garbage, and the scene produced NaNs until the gradient was taken of the winning piece only. `neck_union` has the same issue where it switches sides, at the waist of the neck; so does the mirror handle at its `flip` line. Take the gradient of the selected branch, at the point where you take it. Analytic gradients carried through the operators, a value-plus-gradient struct, do this automatically.
{% </admonition> %}

{% <admonition color="orange" title="⚠️ Ghost worlds"> %}
`smooth_union` blends the carriers. If two pieces with different carriers blend somewhere, the blend can cancel to zero where no world should be. Building the Y-junction produced exactly that: a stray world far from the wormhole, where the solids of two pieces with different carriers met. The fix is to keep every piece's solid close to its own carrier: the capsule uses all five coordinates, and each world's solid is extruded only a little sideways ([§8](#turn)). A test finds such strays quickly: push thousands of random points onto the field and check that each lands on a piece you meant to build.
{% </admonition> %}

{% <admonition color="orange" title="⚠️ When one field covers a whole world"> %}
For an ordinary world, two-sided and without a mirror twist, you can always write one smooth pair of numbers for the whole thing. For a world that mirrors you, you cannot, and the field needs a cut where it jumps to its mirror image ([§8](#turn)).
{% </admonition> %}

{% <admonition color="orange" title="⚠️ Accuracy of the push-back"> %}
`fix` pushes to where the straight-line approximation of the world is, so after one push the point is very close to the world but not exactly on it, and a second push is usually enough. That is also why the order of the pushes matters in `walk`.
{% </admonition> %}

{% <admonition color="orange" title="⚠️ Kinks in the blend"> %}
A smooth union rounded with `smin` is smooth only once: its curvature jumps where the blend starts. Rays do not mind, but the curvature view shows the jump as a thin seam; `smootherstep` and a twice-smooth `smin` remove it.
{% </admonition> %}

## 17. Representations compared, and ideas that did not work {#dropped}

Before settling on "two SDFs, read as one complex number", several other ways to describe a codimension-2 world were tried.

| Representation | Pushing back and normals | Joining | Verdict |
|-|-|-|-|
| Plain distance to the world | The gradient gives only one of the two directions that leave the world; a kink on the world | `min` gives a union, but no holes and no blends | dead end |
| Squared distance {% <katex> %}d\^2\/2{% </katex> %} | Exact: the gradient is the vector to the nearest point | Needs second derivatives; no inside or outside | a theory tool |
| The vector to the nearest point | Exact one-step push-back | One number per dimension and no rule for unions | a theory tool |
| A field of normal planes (bivectors) | Gives the plane of directions, not the offset | Averaging two bivectors does not give a plane any more | dead end |
| The PGA flat {% <katex> %}L\=H\_f\\wedge H\_g{% </katex> %} | The exact push-back step | Forgets the angle, so no unions | a way to describe the kernel |
| **Two SDFs / one complex number** | The 2×2 solve | Booleans on the solid, plus complex products and roots | **chosen** |
| A parametric chart of the world | The nearest point in parameters | Needed for some exotic worlds | a fallback |

{% <pros text="Why two SDFs, read as one complex number:"> %}
* Pushing back onto the world is one 2×2 solve, with the two gradients.
* Booleans act on the solid, and the carrier comes along: unions, holes and smooth unions work as in the videos.
* Products, inverses and roots of the pair give wormholes from touching worlds, flat portals and cones.
{% </pros> %}

{% <cons text="What it costs:"> %}
* The pair is not an exact distance; the smooth operations only keep it distance-like.
* Pieces must share their carrier where they are joined.
* A world that mirrors you needs a cut where the pair flips sign.
{% </cons> %}

{% <admonition color="gray" title="🛠 What smooth union can mean"> %}
Codimension-2 worlds have no inside of their own, so union splits into separate operations depending on how the pieces meet. Pieces that share a carrier near the junction, like a tube ending on a world, use `smooth_union`; that covers every wormhole mouth. Pieces that cross, at points in 4D or along lines in 5D, use `neck_union`. Pieces that are apart, like parallel worlds, cannot be joined by anything local; you have to say how, with a tube or with a root. In codimension 2 the honest operation is *connect A and B, like this*, not one universal `smin`. Two choices cannot be made canonical: the mirror-image choice of a neck, and the angle alignment between joined pieces when their carriers differ. Both are the codimension-2 version of the sign choice that makes `min` a union and `max` an intersection. In fact "union with respect to angle {% <katex> %}\\alpha{% </katex> %}", picking the value with the smallest real part of {% <katex> %}e\^\{\-i\\alpha\}F{% </katex> %}, slides continuously from union ({% <katex> %}\\alpha\=0{% </katex> %}) to intersection ({% <katex> %}\\alpha\=\\pi{% </katex> %}).
{% </admonition> %}

{% <admonition color="green3" title="✨ The same equations over real and complex numbers"> %}
Codimension 2 behaves like codimension 1 with complex numbers, and the shapes get richer in a specific way:
{% </admonition> %}

| Equation | Real numbers (codimension 1) | Complex numbers (codimension 2) |
|-|-|-|
| {% <katex> %}xy\=\\varepsilon{% </katex> %} | two separate curved sheets: a fold-shaped smooth union | one tube: a neck between the two worlds |
| {% <katex> %}n\^2\=\\rho\^2W{% </katex> %} | sheets end where {% <katex> %}W\\lt 0{% </katex> %}: a wormhole throat | sheets branch where {% <katex> %}W\=0{% </katex> %}: a portal frame |
| {% <katex> %}n\^2\=u{% </katex> %} | a fold | a cone with 720° around its tip |
| the sign of {% <katex> %}f{% </katex> %} | two choices: inside or outside | a whole circle of choices: which side is the solid |

{% <admonition color="red" title="❌ Ideas that did not work"> %}
* **One number, the plain distance.** It has a kink right on the world, like {% <katex> %}\|x\|{% </katex> %}, and its gradient only gives one of the two directions that leave the world. No holes can be cut with it.
* **Storing the bivector instead of two numbers.** Good for pushing back, useless for joining, because it forgets the angle. Blending two bivectors also does not give a bivector of a plane any more, and blending two normal-plane projectors does not give a projector.
* **A blend that needs no choice.** Blending the two normal planes along the shortest path between them is not unique exactly in the generic case, two perpendicular planes in 4D. The ambiguity is the same choice as above, hidden.
* **Averaging the two fields**, `mix(A, B, w)`. Where the two pairs point in opposite directions it cancels, and between two parallel worlds it creates a third world in the middle instead of a connection.
* **Union by length.** It never cuts holes ([§7](#union)).
* **Only exact complex formulas**, such as `cmul(u, v) - eps` with no cutoff. They give beautiful shapes (they are minimal surfaces, like soap films), but the worlds are never exactly flat anywhere: there are no such formulas that are zero outside a region. The cutoff versions trade that beauty for flatness.
* **Three worlds on one ring-shaped slice.** Place three worlds around a circular carrier. Walking around the circle you cross three world surfaces, and the inside and outside of the solid would have to flip three times, which cannot close up (an odd number of flips). Two or four worlds work.
* **The Y-junction with straight arms**: three tubes with the same sphere meet in a seam that no smoothing removes ([§8](#turn)).
{% </admonition> %}

## 18. Black holes, mirrors, rotations, cones {#questions}

{% <admonition color="violet" title="❓ Question"> %}
Does a higher dimension unlock something like a black hole, a mirror, or a rotation wormhole?
{% </admonition> %}

{% <admonition color="gray" title="🕳️ Black holes"> %}
A horizon is not possible this way: light paths on a surface are reversible, so a smooth world cannot be one-way. What you can render is how a black hole bends light. Light around a non-rotating black hole follows the shortest paths of a curved space, its "optical geometry". In its equatorial plane the circumference at radius {% <katex> %}r{% </katex> %} is {% <katex> %}2\\pi r\/\\sqrt\{1\-r\_s\/r\}{% </katex> %}, which has a minimum at the photon sphere, {% <katex> %}r\=1\.5\\\,r\_s{% </katex> %}. So that space looks like a wormhole whose throat is the photon sphere, and behind the throat it opens into an endless, ever-widening region where the horizon would be. As a surface of revolution in 3D it can be built down to {% <katex> %}r\=\\tfrac98 r\_s{% </katex> %}, an ordinary codimension-1 wormhole; the extra dimension does not help the symmetric version. Rays that pass the throat inward never come back anyway, so you stop them there and colour them black.
{% </admonition> %}

{% <admonition color="violet" title="🔁 Mirrors"> %}
A mirror wormhole in a world without edges needs codimension 2 ([§8](#turn)). So does the seamless wormhole into itself of [§8](#turn), which for a 2D world always mirrors you; for a 3D world it mirrors you only if its mouth is a donut. A complete world that sits in space as a hypersurface separates space into two sides, so it always has two sides and can never mirror you. The Möbius strip gets around this with an edge. For 3D worlds in 5D the same handle works with the tube's sphere turning through the fifth axis; an explicit mirror-making 3D core in 5D is a twisted bundle of spheres over a circle.
{% </admonition> %}

{% <admonition color="blue" title="🔄 Rotations"> %}
A wormhole that rotates you already exists one dimension down. Going through a round tube carries your directions along the tube's centre line, and a centre line that winds through 4D turns them.
{% </admonition> %}

{% <admonition color="orange" title="📐 Cones with more than 360°"> %}
Yes, round ones in 4D, and wavy ones even in 3D ([§12](#cone)). The 3D-world version is a line with too much angle around it, a "negative-mass cosmic string": the 2D cone extruded along one more axis.
{% </admonition> %}

{% <admonition color="green3" title="✨ What the extra dimension unlocks"> %}
* Flat worlds that close up in more directions. A complete flat surface in 3D is a cylinder over a curve, so only one direction can close up. In 4D two can: the flat torus, the Asteroids screen. In 5D a 3D world can be flat and closed in two directions, as in the flat throat. A 3D world closed in all three directions, a 3D Asteroids, needs 6D: a closed flat 3D world does not fit into 5D (Tompkins). The flat Klein bottle does fit into 4D (Bushmelev), but as a world that mirrors you it needs the cut of [§8](#turn).
* Smooth portals, with any frame shape and any number of worlds.
* Wormholes from touching worlds, with no tube.
* Mirror worlds.
* Room to arrange worlds around each other, as in the triangle of worlds, without bending them.
{% </admonition> %}

## 19. Prior art and how this was made {#prior}

The method this article builds on, curved spaces as SDF surfaces with geodesics by step-and-push-back, is the one of the three videos: optozorax, [*What would a wormhole look like in the real life?*](https://youtu.be/zA85gINcW1g); Artem Yashin, [*How does a 2D creature see curved space?*](https://www.youtube.com/watch?v=9JbYDDjhnx4) and [*What if our world is just a surface of a 4D object?*](https://www.youtube.com/watch?v=LyqkcvSir4w). The curvature colours and the slices are theirs too.

Searches found no existing calculus of composable codimension-2 distance fields: no union, smooth union or offset operators for complex- or {% <katex> %}\\mathbb R\^2{% </katex> %}-valued fields, and no geodesic rendering of codim-2 implicit worlds. The individual pieces exist, spread over several communities.

### Projection onto codim-2 zero sets

* Atzmon, Haim, Yariv, Israelov, Maron, Lipman, *Controlling neural level sets*, NeurIPS 2019 ([arXiv:1905.11911](https://arxiv.org/abs/1905.11911)). They note that for codimension above 1 "no such function exists" as an SDF, use a vector-valued {% <katex> %}F{% </katex> %}, and project with {% <katex> %}p\-DF\^\{\+\}F{% </katex> %}. Their Lemma 1 shows this is the exact orthogonal projection for affine {% <katex> %}F{% </katex> %}.
* Burchard, Cheng, Merriman, Osher, *Motion of curves in three spatial dimensions using a level set approach*, J. Comput. Phys. 2001 ([doi](https://doi.org/10.1006/jcph.2001.6758)): curves in ℝ³ as intersections of two level sets. Gomes & Faugeras, *The vector distance functions*, IJCV 2003 ([doi](https://doi.org/10.1023/A:1022956108418)). März & Macdonald, *Calculus on surfaces with general closest point functions*, SIAM J. Numer. Anal. 2012 ([arXiv](https://arxiv.org/abs/1202.3001)): closest-point maps for intersections of level sets.
* Allgower & Georg, *Numerical Continuation Methods*, Springer 1990 ([doi](https://doi.org/10.1007/978-3-642-61257-2)): the tangent-predictor, Moore–Penrose-corrector scheme in any codimension.

### Complex zero sets, products and gauge

* Chern, Knöppel, Pinkall, Schröder, Weißmann, *Schrödinger’s Smoke*, SIGGRAPH 2016 ([doi](https://doi.org/10.1145/2897824.2925868)), [§3](#project).1. Several vortex filaments are the product of single-filament wave functions, which is union by product. Each phase jump lives on a Seifert surface.
* Ishida, Wojtan, Chern, *Hidden degrees of freedom in implicit vortex filaments*, SIGGRAPH Asia 2022 ([arXiv:2206.02008](https://arxiv.org/abs/2206.02008)). The gauge {% <katex> %}\\psi\\sim\\varphi\\psi{% </katex> %}; {% <katex> %}d\\psi{% </katex> %} on the normal plane close to an isometry as the codim-2 eikonal condition; {% <katex> %}\\\{\\arg\\psi\=0\\\}{% </katex> %} as a Seifert surface. Their *solid-angle distance function* {% <katex> %}\\psi\=d\\\,e\^\{i\\Omega\/2\}{% </katex> %} is a canonical, nearly isometric codim-2 SDF for curves in ℝ³.
* Chern & Ishida, *Implicit representations of codimension-2 submanifolds and their prequantum structure*, 2025 ([arXiv:2507.11727](https://arxiv.org/abs/2507.11727)): the general theory in any dimension, including the gauge group and "shear" and "twist" classes. Borodzik, Dangskul, Ranicki, *Solid angles and Seifert hypersurfaces*, 2020 ([arXiv:1706.06405](https://arxiv.org/abs/1706.06405)), and Erle 1969: closed oriented codim-2 submanifolds of Euclidean space have trivial normal bundles and Seifert hypersurfaces, with a canonical solid-angle phase.
* Corman, Soliman, Magnet, Gillespie, *Implicit minimal surfaces for bijective correspondences*, SIGGRAPH 2026 ([arXiv:2605.02770](https://arxiv.org/abs/2605.02770)): surfaces in a 4D product space as zero sets of complex sections.

### Necks

* McCanna & Price, *Curved vortex surfaces in four-dimensional superfluids II*, Phys. Rev. A 2024 ([arXiv:2309.08016](https://arxiv.org/abs/2309.08016)), Eq. 32: {% <katex> %}\(x\+iy\)\(z\+iw\)\-a\-ib{% </katex> %}, "a single connected surface". Middleton-Spencer, McCanna, Proment, Price ([arXiv:2411.07943](https://arxiv.org/abs/2411.07943)): reconnection of 4D vortex surfaces through the complex hyperbola.
* Imagi, Joyce, Oliveira dos Santos, Duke Math. J. 2016 ([arXiv:1404.0271](https://arxiv.org/abs/1404.0271)), Remark 1.3: such conics are exactly the minimal necks between two transverse planes. Polterovich, *The surgery of Lagrange submanifolds*, GAFA 1991 ([doi](https://doi.org/10.1007/BF01896378)), is the symplectic version of the same smoothing. Harvey & Lawson, *Calibrated geometries*, 1982 ([doi](https://doi.org/10.1007/BF02392726)), explains why complex curves are minimal.

### PGA, geodesics, embeddings

* Dorst & De Keninck, *A guided tour to the plane-based geometric algebra PGA* ([bivector.net](https://bivector.net/PGA4CS.html)): projection {% <katex> %}\(X\\cdot A\)A\^\{\-1\}{% </katex> %}. Gunn, *Geometric algebra for computer graphics*, SIGGRAPH 2019 course ([arXiv:2002.04509](https://arxiv.org/abs/2002.04509)): {% <katex> %}\(P\\cdot L\)L{% </katex> %} for normalised lines. Both are written for 3D; the {% <katex> %}n{% </katex> %}-dimensional codim-{% <katex> %}k{% </katex> %} case follows because the formulas do not depend on grade, and is checked numerically here.
* Madan & Levin, *Local surface parameterizations via smoothed geodesic splines*, ACM TOG 2025 ([arXiv:2410.06330](https://arxiv.org/abs/2410.06330)): the same step-and-project geodesics on codim-1 implicit surfaces. Andersen, RATTLE, J. Comput. Phys. 1983 ([doi](https://doi.org/10.1016/0021-9991(83)90014-1)), and Hairer, *Symmetric projection methods*, BIT 2000 ([doi](https://doi.org/10.1023/A:1022344502818)), explain why projecting the chord gives second order.
* Coulon, Matsumoto, Segerman, Trettel, *Ray-marching Thurston geometries*, Exp. Math. 2022 ([arXiv:2010.15801](https://arxiv.org/abs/2010.15801)): SDF scenes with exact intrinsic geodesics, an alternative to embedding.
* Tompkins, Duke Math. J. 1939 ([doi](https://doi.org/10.1215/s0012-7094-39-00507-7)): no compact flat {% <katex> %}n{% </katex> %}-manifold in ℝ<sup>2n−1</sup>. Bushmelev 1988 (zbMATH 0649.53005): the flat Klein bottle embeds in ℝ⁴. Abramowicz, Bengtsson, Karas, Rosquist, *Poincaré ball embeddings of the optical geometry*, 2002 ([arXiv:gr-qc/0206027](https://arxiv.org/abs/gr-qc/0206027)): the Schwarzschild optical plane embeds in ℝ³ down to {% <katex> %}r\=9M\/4{% </katex> %}.

{% <admonition color="blue" title="🛋️ Story: how this was made"> %}
Every picture here was traced with the code in the folders of this post ([Part V](#code)). The 2D views use 8192 rays per image with 10 000 steps each and 10 samples per pixel. The 3D views use a C++ port of the same kernel, with 10 samples per pixel and step sizes that shrink near curved regions. The explanatory 3D figures are rendered by a small ray tracer of their own. Every claim with a number was checked in code: the PGA projection with a small dense implementation of {% <katex> %}\\mathbb R\_\{n\,0\,1\}{% </katex> %}, the regularity of necks and junctions by sampling the gradients' singular values, flatness and curvature by the Gauss equation, cone angles by measuring circumferences, mirroring by carrying a frame through the handle, and the composed fields by pushing tens of thousands of random points onto them and checking where they land. The folders of this post hold all that code.

Four runs of another model (codex with gpt-6-astra) were part of the research. The first studied the same question without seeing these results. It reached the same overall framework, found the square-root construction for parallel worlds on its own, and contributed the facts about cones in 3D, flat throats and mirror worlds. The second and third reviewed drafts line by line and found real errors, which are fixed here. The fourth completed the field of the ball-shaped wormhole into itself ([§8](#turn)) from a partial version, proved that it is regular and keeps you as you are, and checked it numerically.
{% </admonition> %}


## 20. Open problems {#open}

{% <admonition color="green" title="💡 Ideas for later work"> %}
* **Analytic gradients through every operator**, a value-plus-gradients struct. They would remove the gradient-across-a-jump problem and replace the 8 extra samples per gradient with one evaluation.
* **Smooth unions of pieces whose carriers point different ways**, without arranging the carriers by hand. One idea: before blending, rotate one piece's pair by the rotation that best matches its two gradients to the other piece's.
* **Exactness.** None of the smooth operations keeps the pair an exact distance, just as `smin` does not keep an SDF exact. Sphere tracing with these fields would need bounds on how fast they change, which were not studied.
* **Shorter and longer throats** for the three-world wormhole, and exact flatness in its arms.
* **A shorter field for the ball-shaped wormhole into itself**, built from the page's pieces instead of four charts with two root solves, and a field for the donut whose far end is glued with a reflection, the one that keeps you as you are.
* **Three numbers** (3D worlds in 6D), where only the inversion trick and the quaternion triple product are known. Quaternions would bring products and roots back for four numbers, worlds of codimension 4.
{% </admonition> %}

# Part V. The code and how to use it {#code}

Everything on this page was traced with the code in the folders of this post: the scans and the curvature views with a small numpy kernel, the 3D views with a C++ port of the same kernel, the live widgets with a JavaScript port. The two implementations of each scene were checked against each other.

| Folder | What is inside |
|-|-|
| [`code/`](code/co2sdf.py) | The Python reference: the kernel (`co2sdf.py`), every 2D scene of the page (`scenes.py`), the scan renderer (`render_hq.py`), the numerical checks, the figure scripts, and the C++ tracer of the 3D views (`trace3d.cpp`). |
| [`demo/`](demo/index.html) | The live widget: `co2sdf.js` (the same kernel), `scenes.js` (every scene, with the pseudocode the playground shows), `demo.js` (the widget, its workers and its two views), `demo.css`. `index.html` is the full playground on its own page, `compact.html` shows the compact widgets. |
| [`mono_ball/`](mono_ball/report.txt) | The ball-shaped wormhole into itself of [§8](#mono3): codex's construction (`wormhole.py`), its checks (`check_wormhole.py`, `results.json`), its report and the brief it was given. |
| `img/`, `figs/` | The renders and the backgrounds of the labelled diagrams. |

{% <admonition color="blue2" title="🖥 What you need"> %}
* Python 3 with `numpy` and `pillow` (`matplotlib` for a few of the checks).
* A C++17 compiler with OpenMP for the 3D tracer.
* Nothing for the widget: it is plain JavaScript and runs its heavy work in Web Workers made from the page's own scripts.
{% </admonition> %}

## The kernel

The heart of everything is short: two numbers per point, their two gradients by central differences, the 2×2 Gram solve that pushes a point back onto the world ([§3](#project)), the tangent projection, and the second-order geodesic step with the chord update ([§4](#walk)). At the end of the file the page's library lives under the page's names: `ball`, `extrude`, `smin`, `world`, `smooth_union`, `extrude_world`, `turn`, `roots` and the unions with necks.

{% <details summary="`code/co2sdf.py`: the kernel and the library"> %}
{{ <include_code path="code/co2sdf.py" language="python" /> }}
{% </details> %}

The same kernel in JavaScript is [`demo/co2sdf.js`](demo/co2sdf.js).

## Scans of 2D worlds

`scenes.py` holds the 2D worlds of the page, each a class with a field `F(p)` (one complex number per point), a colour, a camera and two hint directions for its frame. Scenes with hard unions, necks, mirror cuts or several charts also define `jac`, which takes the gradients with the branch or the chart frozen at the point.

```bash
cd code
python3 render_hq.py scan neck 640 10 8192 10000           # 8192 rays, 10 000 steps, 10 samples per pixel
CURV=1 python3 render_hq.py scan clifford 640 10 8192 10000  # coloured by Gaussian curvature
WORKERS=8 python3 render_hq.py scan mono_inside 640 10 8192 10000
```

The output is `hq_scan_<scene>.png`. The scenes are `plane`, `sphere`, `torus`, `clifford`, `two_planes`, `three_parallel`, `y_junction`, `handle`, `klein`, `neck`, `three_necks`, `triple_point`, `flat_portal`, `flat_portal3`, `portal`, `portal3`, `cone`, `mono`, `mono_inside` and `pocket`. Scenes with `creature = True` draw you, the red creature with a white nose and a white ear, so that copies can be told from mirror images.

{% <admonition color="green2" title="👨‍💻 Life hack"> %}
`render_hq.py` uses 32 processes by default; set `WORKERS` to the number of your cores. For a quick look, drop the quality: `python3 render_hq.py scan neck 320 1 2048 2000` takes a few seconds.
{% </admonition> %}

{% <details summary="`code/scenes.py`: every 2D scene"> %}
{{ <include_code path="code/scenes.py" language="python" /> }}
{% </details> %}

The renderer itself is [`code/render_hq.py`](code/render_hq.py).

## 3D views of 3D worlds

`trace3d.cpp` traces 3D worlds inside 5D (and 6D) with the same kernel, a second-order step and adaptive step sizes. Every scene draws the camera as a red ball just behind the eye, with a white nose in front, a white ear on its left and a yellow top; that is how you see yourself in the flat throat and near the wormholes into themselves.

```bash
cd code
g++ -O3 -march=native -fopenmp -std=c++17 trace3d.cpp -o trace3d
FOG=0.006 ./trace3d mono_donut_inside 640 360 10 10000 out.rgbf   # scene, width, height, samples, steps, output
python3 -c "import numpy as np; from PIL import Image; a=np.fromfile('out.rgbf',np.float32).reshape(360,640,3); Image.fromarray((np.clip(a,0,1)*255+.5).astype(np.uint8)).save('out.png')"
./trace3d throat_mouth eval < points.txt                           # print the field at points, 5 numbers per line
```

{% <admonition color="gray" title="🛠 The 3D scenes"> %}
* `flat_gate2`, `flat_gate2_bare`, `flat_gate3`, `flat_gate3_back`: the flat portal of [§11](#portal).
* `tubes3`, `y_junction`: three worlds joined by tubes, and by one three-way wormhole ([§7](#union), [§8](#turn)).
* `throat_mouth`, `throat_far`: the flat throat ([§8](#throat)), in the proportions of portal_gravity's `base_5d` scene.
* `point_junction_0`, `_45`, `_90`, `_top`: three 3D worlds meeting at one point in 6D ([§10](#neck)).
* `neck6d`: two 3D worlds in 6D joined by the inversion neck ([§13](#higher)).
* `mono_donut_front`, `mono_donut_inside` and `mono_ball_front`, `mono_ball_inside`: the 3D wormholes into themselves ([§8](#mono3)).
* `FOG=0.006` gives the far-horizon look of the page, `NOSELF=1` hides the camera ball.
{% </admonition> %}

The tracer is one file, [`code/trace3d.cpp`](code/trace3d.cpp) (about 1000 lines): the kernel, the shading, and one struct per scene.

## The live widget

The widget needs one stylesheet, three scripts and an element per widget. Its heavy work runs in Web Workers that it builds from its own scripts, so it needs no server and no build step.

```html
<link rel="stylesheet" href="demo.css">
<div class="co2-demo" data-scene="neck" data-compact="1"></div>
<div class="co2-demo" data-scene="y_junction" data-compact="1" data-outside="slice"></div>
<div class="co2-demo" data-scene="flat_portal"></div>   <!-- the full playground, with a scene list -->
<script src="co2sdf.js"></script>
<script src="scenes.js"></script>
<script src="demo.js"></script>
```

{% <admonition color="blue" title="Usage"> %}
* `data-scene`: one of the scene names of `scenes.js` (the same names as in Python).
* `data-compact="1"`: the small version used inside the text; without it you get the playground with the scene list, the sliders and the code.
* `data-outside="slice"` starts the right view as a slice, `data-slice="w"` picks the fixed coordinate, `data-curvature="1"` starts with the curvature colours, `data-params="0"` hides the sliders.
* In the view from inside: drag or W/S to walk, right-drag or Q/E to turn, the wheel to zoom (ctrl+wheel in the small widgets, so that the page still scrolls). In the view from outside: drag to orbit, shift-drag to rotate in 4D.
* Theme it with the CSS variables `--co2-bg`, `--co2-fg`, `--co2-accent` and `--co2-line`.
* Add a scene: a class in `scenes.js` with `F(p, o)`, `color(p, rgb)`, a camera, hint vectors and, for the playground, `params`, `box()` and `code`.
{% </admonition> %}

The scenes of the widget are in [`demo/scenes.js`](demo/scenes.js), the widget itself in [`demo/demo.js`](demo/demo.js).

## Checks

{% <admonition color="gray" title="🛠 Every check prints its result"> %}
* `python3 checks_composable.py`: pushes tens of thousands of random points onto each composable construction and checks that every converged point lies on a piece that was meant to be built, that the two gradients stay independent, and the flatness claims (the turning torus against its curvature formula, the flat throat, the Y-junction in 4D and 5D, the handles keeping or mirroring orientation).
* `python3 test_kernel.py`: projection and geodesics on the Clifford torus, neck regularity, cone angles.
* `python3 test_integrators.py` … `test_integrators4.py`: the convergence order of the geodesic step. The fourth runs the videos' first-order step and the same loop with the chord update, which is second order.
* `python3 test_klein.py`: frame transport through the ordinary handle (orientation kept) and the mirror handle (orientation reversed).
* `python3 test_pga.py`: the PGA form of the push-back step of [§15](#ga).
* `python3 cmp_cpp2.py`: the C++ tracer against the numpy one.
* `cd ../mono_ball && python3 check_wormhole.py`: codex's checks of the ball-shaped wormhole into itself, written to `results.json`.
{% </admonition> %}

{% <details summary="`mono_ball/wormhole.py`: the ball-shaped wormhole into itself (codex)"> %}
{{ <include_code path="mono_ball/wormhole.py" language="python" /> }}
{% </details> %}

## The labelled diagrams

The explanatory 3D figures of [§2](#two)–[§8](#turn) come from `fig3d.py`, a small numpy ray tracer of translucent planes and discs with grids, rods, cones and balls with exact front-to-back blending. It also writes the SVG labels that sit on top of each picture. `fig_planes.py`, `fig_push.py`, `fig_meaning.py`, `fig_circle.py` and `fig_mirror.py` make the five figures, and `preview.py` draws the labels onto the PNG for a quick look.

{% <admonition color="blue" title="🛋️ Story"> %}
The article started as one self-contained HTML page with the widgets, the pictures and a highlighter that coloured every name in the code by its type. This post is the same text, moved into the blog, with the same pictures, diagrams and widgets, and the same colours for the kinds of value in the code and in the formulas.
{% </admonition> %}

<script src="demo/co2sdf.js"></script>
<script src="demo/scenes.js"></script>
<script src="demo/demo.js"></script>
