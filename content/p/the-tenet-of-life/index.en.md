+++
title = "A cellular automaton based on the film \"Tenet\""
date = 2020-10-29
description = "Is it possible to create an automaton that has particles moving forward in time and backward in time at the same time? Yes, and I made such an automaton: this post is about it."

[taxonomies]
tags = ["cellular-automata", "reversible-automata", "programming"]

[extra]
image = "preview.jpg"
tg = "https://t.me/optozorax_dev/252"
tg_comments = 29

[extra.translation]
from = "ru"
by = "Claude Opus 5.5"
+++

As soon as cinemas reopened here, I ran to see Nolan's "Tenet". I liked it a lot. The rest of this post is based on a concept from the film, so if you don't like spoilers, you'd better not read any further. Although maybe my spoilers go no further than the trailer, idk, I don't watch trailers because I hate spoilers of any kind. Anyway, you've been warned.

I'm not particularly interested in characters and other meatbags, but concepts and ideas — very much so. That's why I liked this film SOOO much. And "Tenet" shows just that: a VERY interesting concept where matter moving backward in time exists alongside matter moving forward in time. You can't even call it time travel, because it's not that cheating with git branches that other films show us; it's a very organic, complex, paradoxical and interesting thing. Right after the film I had one single main question: is it possible to simulate this, and how?! I'm interested at least in whether it can be simulated with a cellular automaton, never mind physics. By a nice coincidence, a couple of months earlier I had finally [implemented the reversible Critters automaton and explored it a bit](/en/p/critters/). I immediately thought that the reversibility of Critters should somehow help with the Tenet concept, but in the first few days I couldn't come up with anything.

I also started thinking about how the past could know what the future would be, so surely you would have to solve some astronomically huge system of equations to implement something like "Tenet", which means the usual concept of a step-by-step simulation might not apply here.

Then I started thinking purposefully about how to simulate it, and finally figured it out. The reversibility of Critters really did help, and based on it I made a reversible cellular automaton in which three kinds of matter exist at the same time:
* void — black cells,
* matter moving forward in time — blue cells,
* matter moving backward in time — red cells.

Damn, looks like my colors don't match the film :(

Moreover:
* If you swap red and blue and do one more little thing, then simulating time forward gives the same result as simulating time backward before the swap. That is, all states correctly move in time in the right direction, and the direction of time is relative! To the red cells it seems that they are moving forward and the blue ones backward in time, and to the blue cells it seems that they are moving forward and the red ones backward.
* Combinations of cells that consist of void, red and blue cells are handled correctly.
* While the rules of ordinary Critters have size `2^4`, in my automaton they have size `2*3^4`. Such a large size also makes designing the rules somewhat difficult.

I gave this automaton a proud name, out of respect for its inspiration: The Tenet Of Life (Critters is the closest analogue of The Game Of Life in the world of reversible automata, so it makes sense).

There were interesting problems and solutions along the way, so I want to describe all of it in detail, with pictures, but right now I have neither the time nor the motivation. I hope I'll get around to it someday.

Okay, and now it's picture time!

---

In the previous post about Critters I didn't manage to implement mouse controls, so the pictures there were of really potato quality, and you couldn't even make out the glider. Well, I've fixed that sad state of affairs: now there are mouse controls, and you can zoom and pan. There's also a UI instead of keyboard shortcuts.

{{ <video path="article_1_web.mp4" /> }}

---

This is a glider in the ordinary Critters automaton. Since it's blue, you can see that it's moving forward in time. Here you can see this glider moving in the direction it points. The grid is shown here too, so you can see how the block rules of ordinary Critters, which I described earlier, work.

{{ <video path="article_2_web.mp4" /> }}

---

And here are two gliders with different directions of time at once. The red glider points left but moves right, because it's inverted in time. Actually, this gif is a bit reminiscent of the car scene from the film :) I'm thinking of making it the logo of my automaton.

{{ <video path="article_3_web.mp4" /> }}

---

And here's just a bunch of cells from different times interacting somehow...

{{ <video path="article_4_web.mp4" /> }}

---

And this is how the rules are written in the code :))))))))))000)0 Of course, these arrays are computed. It's just that other code does the computing.

{{ <image path="article_5.jpg" scale="1/2" /> }}

---

And this is me designing the rules in draw.io. Don't try to understand it, it's just a sneak peek; I'll explain it in detail in the future.

{{ <image path="article_6.jpg" scale="1/2" /> }}

---

I don't think I saw anything interesting or revolutionary. Red and blue cells just bustle around and have nice mathematical properties. So the most interesting part is how I made it, not the result itself. The results are not interesting because the original Critters automaton itself is not very interesting. Other reversible automata should be explored with this approach.

Another reason the results aren't very interesting is that I don't have the most important feature of the film: a device that inverts in time everything that enters it. After all, it's exactly this device that creates the interesting paradoxes and the mind-blowing stuff. And judging by what I got, the mere parallel existence of two temporal kinds of matter is not very interesting and not very paradoxical.

I think introducing cells that do this kind of inversion is either impossible, or requires solving an astronomical system of equations, or is just very hard. And if you do introduce it, you have to compute the universe in advance so that it's consistent with this device, because it has to take as input two identical objects with different directions of time. That is, you have to send both a backward and a forward glider into this machine in advance, so that they enter it and disappear; then the machine's output will be like in the film.

If you manage to build such a machine and send a forward glider into it but don't send a backward one, then I think the machine will create a lot of noise even before the glider enters, and the noise will annihilate with the glider, so it dies without ever getting back in time.

Also, regarding plain reversible automata, I can recommend watching these:
* [A big overview of cellular automata by Onigiri](https://www.youtube.com/watch?v=FiO6jkNkrb4) (in Russian)
* [Quantum computers and reversible computing by Onigiri](https://www.youtube.com/watch?v=Quj5fP2Lqio) (in Russian)
* [Landauer's principle on Wikipedia](https://en.wikipedia.org/wiki/Landauer%27s_principle)

I know Onigiri personally, and funnily enough, completely by chance our topics with these automata overlapped both in timing and in content in the videos I recommended :) Unfortunately, his videos don't go deep into complex details and are aimed at a younger audience, but overall you can learn a lot of new things from them :)
