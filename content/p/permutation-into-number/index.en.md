+++
title = "How to write a permutation as a number"
date = 2020-11-08
description = "How to represent any permutation as a number from 1 to N! and, conversely, get a permutation from any number."

[taxonomies]
tags = ["math", "reversible-automata"]

[extra]
image = "permutation-into-number.png"
tg = "https://t.me/optozorax_dev/261"
tg_comments = 5

[extra.translation]
from = "ru"
by = "Claude Opus 5.5"
+++

For an upcoming little program where you can run reversible cellular automata, I want to make it possible to specify arbitrary rules. As I described in [my post about Critters](/en/p/critters/), any permutation of an array from `0` to `N` is a valid rule. So there should be a way to specify a permutation as something you can copy-paste into the program.

On [one site with reversible automata](https://dmishin.github.io/js-revca/index.html), a permutation is specified like this:

`0,2,8,3,1,5,6,7,4,9,10,11,12,13,14,15`

To me, this is pretty boring and not very convenient.

So I came up with the idea of showing it as a single number, which you can change by `+1` or `-1` and it will still be valid. And then also converting this number to base `64` to make it even shorter.

So, for an array of `N` distinct elements there are `N!` possible permutations. That means we can somehow number every permutation with a single number. And if we do that, the user can play around by changing the numbers and will always get a valid rule. Unless, of course, they enter a number greater than `N!`, but that mistake is quite easy to prevent.

So, the permutation shown at the beginning can be written as the number:

`125023449600`

Or, if you convert this number to base `64`:

`08D+rQ1`

I made a small library to calculate all these things: [permutation_string](https://github.com/optozorax/permutation_string/blob/master/src/lib.rs).

In my program, you'll be able to specify rules in all three of these ways.

I also want to make a GUI where you can drag the rules around with the mouse, with all these representations shown next to them. Luckily, with [megaui](https://twitter.com/fedor_games/status/1313119249146281986) in [macroquad](https://twitter.com/fedor_games/status/1313219605981204482) this is pretty easy to do. By the way, I didn't know Immediate Mode GUI was this simple o_O. It feels like a kind of dissonance after you've built GUIs with all those callbacks. Try reading the code and poking around.

And now I'll explain exactly how you can turn a permutation into a single number.

Let's say we have a permutation `A` of five elements: `[4,1,2,3,0]`. The main property of any permutation is that all the numbers in it are unique. So we can transform this array into a slightly different one.

Suppose we also have this array `B`: `[0,1,2,3,4]`.

Next, we take our permutation and ask: at what index is its first element? `4` is at index `4`, so that's what we write into array `C`. We remove the number `4` from both array `B` and array `A`.

`A = [1,2,3,0]. B = [0,1,2,3]. C = [4].`

Take the next number from `A`: `1`. At what index is it? `1`. We write that down and remove these elements from `B` and `A`.

`A = [2,3,0]. B = [0,2,3]. C = [4,1].`

And now the most interesting part begins. Take the next number from `A`: `2`. It is at index `1`. We write that down and remove it from `A` and `B`.

`A = [3,0]. B = [0,3]. C = [4,1,1].`

Continuing this way, we end up with: `A = []. B = []. C = [4,1,1,1,0]`.

What's interesting about array `C`? With each subsequent element, the maximum possible number decreases by `1`. That is, the maximum `C = [4,3,2,1,0]` is achieved for the permutation `[4,3,2,1,0]`. And `C = [0,0,0,0,0]` is obtained for the permutation `[0,1,2,3,4]`.

So `C` stores digits in an unusual number system, with a different base for each digit position. And then we can use `C` to get the number of the permutation:

`0*0! + 1*1! + 1*2! + 1*3! + 4*4! = 105.`

So this number lies in the range from `0` to `N!-1`. And that's how we numbered every permutation.

By the way, it's not hard to modify the algorithm to handle permutations with repeated elements.

---

I've been told that I reinvented the [factorial number system](https://en.wikipedia.org/wiki/Factorial_number_system).
