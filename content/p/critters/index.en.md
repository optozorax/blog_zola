+++
title = "Reversible cellular automata"
date = 2020-07-27
description = "How changes in the present can affect the past, with the Critters automaton as an example."

[taxonomies]
tags = ["cellular-automata", "reversible-automata", "programming"]

[extra]
image = "preview.png"
tg = "https://t.me/optozorax_dev/235"

[extra.translation]
from = "ru"
by = "Claude Opus 5.5"
+++

Everyone has heard of the cellular automaton called ["Conway's Game Of Life"](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).

This automaton has a property called irreversibility: a given arrangement of cells can have anywhere from 0 to infinitely many predecessors that lead to it. States that can't have any predecessor are called [Gardens of Eden](https://en.wikipedia.org/wiki/Garden_of_Eden_%28cellular_automaton%29).

It's easy to see that this automaton is irreversible: you can build states in it that lead to empty space. Obviously, emptiness has infinitely many predecessors.

To get rid of this property, people invented reversible cellular automata: in such an automaton a state always has a predecessor, exactly one, and it's easy to compute algorithmically.

Essentially, such an automaton lets you look into the past if you know the present!

There's very little information about these automata online, which is exactly why they got me so interested. One example of such an automaton is [Critters](https://en.wikipedia.org/wiki/Critters_%28block_cellular_automaton%29). Here's how it works: all non-overlapping `2x2` squares are examined and replaced according to the transformation on Wikipedia. Then the grid of squares is shifted by `1` diagonally and the same thing is done again. Now one step counts as done, and the grid is shifted by `1` diagonally again (back to where it was).

Let me introduce a bit of notation:
* `0` - the current state,
* `10` - simulating `10` steps forward from the current state,
* `-10` - simulating `10` steps back.

What interested me about this automaton:
* what `-10` will look like if I draw something in `0`;
* what `0` will look like if I simulate up to `10`, modify something there, and then simulate back.

There's so little information about these automata online that I couldn't even find a simulation of Critters. So I had to write the program myself.

I quickly threw together a small program and put it on [github:critters](https://github.com/optozorax/critters).

---

This is how the critters evolve in a normal forward simulation starting from the drawing "hi".

{{ <video_gif path="hi_forward_web.mp4" /> }}

---

And here is the drawing "hi" evolving backward.

{{ <video_gif path="hi_backward.gif_web.mp4" /> }}

---

The top shows the current state of the field. The bottom shows what the field will look like if you simulate it back to step `0`. First the simulation runs up to step `95`. You can see that the field at the bottom stays unchanged. But then I start changing the field in the present, deleting white dots in some places. You can see that deleting a single glider or a couple of pixels immediately changes the past dramatically. And the effect is explosive: a whole structure falls apart.

{{ <video_gif path="to_zero.gif_web.mp4" /> }}

---

This shows what the transformation rules from Wikipedia look like and how they're written in my program. The array for the backward simulation is computed from it. In fact, any permutation of this array is also a reversible cellular automaton; there's probably something more interesting to be found among all these permutations.

{{ <image path="rules.jpg" /> }}

---

An example of one of the permutations of this array.

{{ <video_gif path="other_rules.gif_web.mp4" /> }}

---

I made this automaton on a wrap-around field, so the number of states is finite and bounded by `2^(WxH)`. And given that every state always has exactly one successor and one predecessor, any state is bound to return to itself after some number of steps. The same reasoning explains why a Rubik's Cube always returns to its initial state after a certain number of repetitions if you keep applying the same move sequence to it. Likewise, if our world is a finite reversible automaton, then after a certain number of Big Bangs and Big Crunches it will repeat itself exactly (reminds me of a Futurama episode :) ).

Also, this automaton can't lose information, because it has to be reversible. What this means is easiest to explain with an example: say you wanted to build a device in this finite automaton that multiplies two numbers. Then the device must be able to run backward, which means it must be able to take one number and produce the two numbers whose product it is. But the number alone won't be enough: you'll also need meta-information, or "garbage", to get back to the initial state. Most likely this "garbage" will be a bunch of gliders that flew out of the multiplication device along the way. So no breaking RSA with this :) By the way, reversible programming languages exist! For example, [Janus](https://en.wikipedia.org/wiki/Janus_%28time-reversible_computing_programming_language%29).

In the Game of Life, no gliders fly out when you build a multiplication device: everything works very cleanly, and after multiplying, the device can return to its initial state. That's because that automaton loses information.

Can our world be simulated backward? I've heard that according to classical mechanics, yes. About quantum effects I'm not so sure. By the way, physics has a problem known as the [black hole information paradox](https://en.wikipedia.org/wiki/Black_hole_information_paradox).

The GIFs show that Critters looks rather boring in motion, nothing like how beautiful the Game of Life looks. Maybe the rules just aren't very good, but I think the main problem is that Critters can't lose information, which is why its evolution looks so boring. In fact, there's no real evolution going on at all, just noise being noisy; thankfully, at least gliders exist.

Then again, considering that our world is reversible too, it looks way too interesting for that. I think the point is that at first glance it looks like the Game of Life, but on closer inspection all the "garbage" needed to simulate it backward is stored as heat and electromagnetic radiation. Moreover, the interesting states (atoms) strongly affect the world, while the uninteresting states needed to preserve information (heat, electromagnetic radiation, photons) barely affect it. So apparently we should also try to design a cellular automaton that turns all the boring stuff into weak states and the most interesting stuff into strong states.

All in all, I'm a bit disappointed in this automaton: its past isn't interesting, and neither is its future. I guess I need to come up with a more complex automaton with more states per cell, maybe somehow using the idea from the previous paragraph.
