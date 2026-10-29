+++
title = "Evolved Virtual Creatures (a video from 1994)"
date = 2019-09-09
description = "I list the sources, explain how it works and share my ideas."

[taxonomies]
tags = ["youtube", "evolution", "ideas"]

[extra]
image = "evolution.png"
vk = "https://vk.com/optoblog?w=wall-169103586_15"

[extra.translation]
from = "ru"
by = "Claude Opus 5.5"
+++

# Introduction

I stumbled upon this entertaining video somewhere on the internet and liked it so much that I decided to share it with Russian-speaking viewers: I translated it and dubbed it into Russian. I published the result on YouTube:

{{ <myyoutube id="2ZJijzzJzWU" /> }}

Below I give the links, explain in a bit more detail how it all works, and talk about the ideas I had after watching it.

# Links

* The [original](https://archive.org/details/sims_evolved_virtual_creatures_1994) video on archive.org.
* The [page](http://www.karlsims.com/evolved-virtual-creatures.html) about this project on Karl Sims' website.
* The [scientific paper](http://www.karlsims.com/papers/alife94.pdf) about this work; you can also find it on the page above.
* A slightly extended [paper](http://www.karlsims.com/papers/siggraph94.pdf) for the SIGGRAPH conference. I highly recommend reading it: there are no complicated formulas in it, only ideas and results. Plus it has more information than the paper above. Everything below, except my own ideas, is based on this paper.
* A [video](https://www.youtube.com/watch?v=WmrTNrtE-Lk) where Karl himself explains the same things as the original video. There's no particularly new information in it, but I'm including it just in case.
* [Patent #5511158](https://patents.google.com/patent/US5511158?oq=5511158), which describes in detail how to create and mutate the directed graphs from which the creatures' bodies and brains are built.

# Evolution

In case it wasn't clear: the video shows results obtained by simulating evolution of some creatures in a simulated physical environment. The best creatures were selected by how efficiently they solved their tasks. For example, at the very beginning the narrator says that swimming speed was used to determine survival. All the creatures evolved independently, each one can only do its own task; there is no creature that does all three.

I assume the reader of this article knows how evolution or a `genetic algorithm` works, so there's no need to go into it. If not, drop everything and go watch [this video](https://youtu.be/mcAq9bmCeR0) or [this one](https://youtu.be/SfEZSyvbj2w) (in Russian). Actually, I plan to collect lots of materials on simulating evolution soon, so subscribe to my group on VK.

# 1994, seriously?

I was incredibly surprised too! The results are great, and it's amazing that back then anyone could even think of simulating 3D creatures. I would have chosen to simulate 2D, given the limited computing power of those times.

On top of that, judging by the shadows and the pictures on the website, the rendering was done with [ray tracing](https://en.wikipedia.org/wiki/Ray_tracing_(graphics)), which is also a very computationally expensive method.

According to the paper, the program ran on the [CM-5](https://en.wikipedia.org/wiki/Connection_Machine) supercomputer, which, mind you, was number one on the [TOP500](https://en.wikipedia.org/wiki/TOP500) list in 1993.

The paper also gives an example of the program's running time: with a population of 300 individuals, processing 100 generations on 32 cores of this computer took 3 hours. I think that in 2019 our home PCs can run a program like this just as fast.

Unfortunately, judging by his website, Karl Sims didn't work on this topic any further.

But he did work on something similar earlier:

{{ <myyoutube id="aUdCS1lLiYs" /> }}

# How a creature is built

In these creatures, the brain and the body are conceptually tied together, so you can't explain how one of them works without explaining how the other one works.

A creature consists of rigid cuboids (rectangular boxes) connected by joints.

This body is built from a genetic code, which is a directed graph describing which parts can connect to which, and where. Many different creatures can be generated from a single genetic code.

Below is an example of genes and the resulting creatures. Note that some parts can be built recursively.

{{ <image path="graph_creature.png" /> }}

The parts in this picture are labeled for convenience; it's just a hand-made example.

Each node of the genetic graph contains the following information:
* The relative size of the cuboid.
* Recursion limits for this body part (if it refers to itself).
* A local neural network (the paper calls it a nested graph).

Each edge of the graph contains the following information:
* The type of joint connecting the two parts: fixed, free, around a certain axis, and others that I didn't understand (revolute, twist, universal, bend-twist, twist-bend).
* Rotation limits.
* Where on the cuboid the connection is located and at what angle.

Note that every body part has its own local neural network! In general, this decision seems logical when many creatures can be generated from the same configuration. You wouldn't want to evolve a new neural network from scratch for each of them every time!

The final neural network, obtained by combining and copying the local neural networks into a single configuration of the body, is what I call the `global neural network`.

## How the brain is built

Modern neural networks have a rigid linear architecture (a [directed acyclic graph](https://en.wikipedia.org/wiki/Directed_acyclic_graph)), and sometimes a recurrent architecture. In this work there are no such restrictions: any neuron can connect to any other neuron, the only condition is that the graph is connected. Parts that don't belong to the main graph are removed by a garbage collector.

Unlike a regular neural network, this one isn't a function that you call and immediately get an answer for the input. No, here you have to simulate the propagation of the signal, and how far the signal gets is up to the designer. This is closer to the biological approach and can potentially produce more diverse behavior.

In this work, each simulation step comes with two steps of signal propagation in the neural network.

Also, in modern neural networks all input numbers are multiplied by some constant and summed, the main difference is only in the activation function. In this work, however, arbitrary functions of the inputs are implemented, even multiplication and division. But for division there are limits on the number of inputs. And for all functions the number of inputs is at most three. The list of all functions:
* `+`, `*`, `/`
* `sum-threshold`
* `sign-of`, `abs`
* `min`, `max`
* `greater-than`, `if`
* `interpolate`
* `sin`, `cos`, `atan`
* `log`, `exp`
* `sigmoid`
* `integrate`, `differentiate`
* `smooth`
* `memory`
* `oscillate-wave`, `oscillate-saw`

Unfortunately, I don't know any more than you do about what these functions actually do, so all we can do is guess.

Some functions don't just compute an output from their inputs, but also *keep some internal state*.

Just like in ordinary NNs, each input here is multiplied by some number. An input can even be a constant.

The oscillation functions seemed the most interesting to me: thanks to them, you can make a creature move its body parts even when hardly any external signals come in. It's as if a "move" mode switches on when some condition is met.

On the other hand, this same variety of network architectures and this many functions are much more likely to produce garbage than ordinary neural networks.

### My idea about finite state machines

By the way, this gave me the idea that a creature's behavior is essentially a set of simple modes with simple actions and a bunch of rules for switching between them. So a creature's brain could be made as a finite state machine, where each state stands for some behavior, and the transitions between states are also made with neural networks.

This way you can evolve not only neural networks but finite state machines too; I even see this approach as more promising.

I was inspired by [this article](https://code.tutsplus.com/finite-state-machines-theory-and-implementation--gamedev-11867t) about building an NPC on a finite state machine. Here's a picture from it to grab your attention:

{{ <image path="attention.jpg" /> }}

## Inputs

Don't forget that every body part has its own local neural network.

Each local neural network has the following inputs for its physical part:

* **Joint angle** — passed by a separate neuron for each joint.
* **Contact sensor** — likewise, a separate neuron is created for each face. It outputs 1 if there is contact and -1 if there isn't.
* **"Photosensor"** — each part has its own copy. It outputs the normalized relative direction vector to the light source or the green cube. The name is in quotes because real light isn't simulated, and the creature sees the light even if it's actually blocked by other objects.

In his work Karl Sims says that it would be interesting to use accelerometers, [proprioceptors](https://en.wikipedia.org/wiki/Proprioception), and smell and sound detectors as sensors. But nothing like that is used in his work, because the existing ones are enough to get interesting behavior.

Together these are called `sensors`.

## Outputs

Next, each local neural network has outputs to control the body.

Each joint gets a pair of numbers as an output, which set the rotational force along different axes. For some joint types it may be a single number (but that's my own guess, it isn't actually specified there).

As I understand it, each part sends signals to the joints that connect it to its parent part.

To mirror the proposed sensors, Karl Sims notes that it would be interesting to use emitters of smells and sounds.

Together these are called `effectors`.

### My idea about new effectors

I'll add from myself that it would be interesting to use effectors that send numbers directly into the brain of the nearest creature. This would make a simple prototype of interaction between creatures, for example, to teach fish-like creatures to swim in a school.

And only once such a hack manages to evolve social behavior can we think about having them learn to communicate through the external environment, using smells, visual images, etc.

## Interaction of local neural networks

The idea of giving every body part its own copy of the same local neural network sounds super cool. For example, you can create one neural network for a tail segment of this creature:

{{ <video_gif path="creatures_web.mp4" /> }}

As a result, every segment will move in the same way, and such a creature can easily be made longer or shorter, or be given a couple of tails. Similarly, you can add legs to a creature with 2 or more legs.

Everything about this idea is great, except that it's unclear how the global neural network of an assembled creature is built. I'll try to explain this complicated process based on the papers.

The picture below shows an example from the first paper. It's fairly simple. The local neural networks interact with each other through the sensor P1, which sends information to the local neural networks.

{{ <image path="brain1.png" /> }}

The next example is taken from the extended paper for SIGGRAPH.

The dashed line shows the central neural network, which isn't attached to any part.

Note that in the genotype the sensor `J1` feeds the input of `itp`, but in the global neural network, with several parts, only one of the `J1` sensors managed to send its signal to `itp`. Obviously, this is a consequence of the limit of at most 3 inputs. And just cutting off random ones isn't a very elegant solution. The paper doesn't say how such problems are solved.

{{ <image path="brain2.png" /> }}

## My idea of how local neural networks could interact

I came up with my own idea of how to organize the interaction of local neural networks so that it's elegant and problems like this don't arise.

The idea is to make each local neural network independent of how the others work inside, to give it an *interface* through which other networks can interact with it and it with them.

That is, in addition to its own inputs (sensors) and its own outputs (effectors), each neural network gets inputs from and outputs to other neural networks. Which neural networks can send and receive information is determined by the genetic graph.

For example, let's take the genetic graph we already know and the creature generated from it:

{{ <image path="build.png" /> }}

Then, according to my idea, it gets the following local neural networks:

{{ <image path="abnn.png" /> }}

There's a lot to explain about the notation here:
* **Yellow neurons** — input neurons that receive information from other local neural networks.
* **Red neurons** — output neurons that send information to other local neural networks.
* **Light blue neurons labeled S** — sensor neurons.
* **Purple neurons labeled E** — effector neurons.

Here one circle stands for many neurons at once, a *vector of neurons*: obviously a body part has many sensors, I just didn't draw them all because that's hard and cluttered. While the number of effectors and sensors is quite clear, the number of neurons for exchanging information with each of the other local neural networks can be set genetically. It can be 0, 1, 2 or even 10 numbers.

I drew the black box like this for a reason: it really is a black box. It is the local neural network. It doesn't matter how it works inside; what matters is that it receives some signals as input and also sends signals as output.

I also made it so that a parent body part can not only send information to its children, but also receive information from them.

And local neural network A has so many inputs and outputs because it has to talk not only to the two B's, but also to its child A and potentially to its parent A.

In the end, after combining the local neural networks, we get this global neural network:

{{ <image path="all.png" /> }}

Notice that some neurons ended up not connected to anything. That's fine.

What's also important here is that Da and Db are simply copied as many times as needed.

However, this idea has no place for a central neural network that doesn't depend on body parts and is supposed to do the main, central thinking.

It could probably be added as yet another set of input and output neurons for A, and connected to just one copy of A:

{{ <image path="Global.png" /> }}

## My idea of combining brains trained on different tasks {#moia-ideia-ob-obedinenii-mozgov-ot-raznykh-zadach}

When they showed the creature that swims toward the red light, even the video mentions that it seems to flail randomly but `somehow still manages to approach the light`. I think this is a problem of that evolution --- it **overfits**. That movement can't be called beautiful or natural, it's ugly, and it doesn't require the creature to have a non-ugly shape either. So I came up with a solution that could make that creature move much more beautifully.

In short, the idea is:
* First train two different neural networks of the same creature:
	* One tries to swim as straight and as fast as possible
	* The other tries to turn on the spot to the desired angle as quickly as possible, while moving as little as possible
* Then make evolution somehow combine these two neural networks, without modifying them, to get a creature that combines moving straight and turning to perform the original task of reaching the red light.

It seems that the result should be beautiful behavior, and the creature's body itself will be optimized for efficient forward movement and turning; it might even become symmetrical.

For the notation, let's take the global neural network from the previous section and pull all the sensors and effectors out of it:

{{ <image path="global_brain.png" /> }}

Let's denote the neural network of the straight-swimming creature as 🏊, and of the turning one as ⚙️. Then the task of evolution is to train the neural networks `Din` and `Dout` in the following diagram:

{{ <image path="combined_brain.png" /> }}

Most likely the creature will learn to do something like:
* Turn until your body points at the target
* Move straight

Maybe behavior will even emerge that does these actions more or less simultaneously, without losing anything in the time to reach the target or in the length of the path.

You'll agree this solution looks much more elegant, won't you? It even resembles extracting functions, only at the level of neural networks, which are usually a mush of numbers and neurons.

In general, this looks like some kind of **construction kit**. I think the power of evolution compared to other optimization methods should lie exactly in such a construction kit: *We have to come up with algorithms that create the coolest possible building blocks, so that these building blocks can then be used to build creatures that couldn't be evolved without building blocks.*

Maybe in our own evolution, genes are these building blocks too?

By the way, I came up with the idea of genes inside neural networks long ago, and drew it something like this:

{{ <image path="genes_in_neural_network.png" /> }}

# Reproduction

According to the paper, in 40% of cases a creature is simply copied with a mutation applied, in 30% of cases a kind of mating called `crossovers` is used, and in the remaining 30% of cases a kind of mating called `grafting`.

Graph mutation is described in detail in the paper, so look there for more details, although anyone can come up with their own graph mutation algorithm: the general idea is obvious, nothing interesting.

As for mating, look at the paper too if you're interested. The first method is similar to ordinary bit-string crossover, and the second is like grafting a pear branch onto an apple tree.

Personally, though, I'm very skeptical about crossover. I even [tweeted about it once](https://twitter.com/optozorax/status/1141021230176227328) (in Russian). If the purpose of crossover is to get genes that can potentially be used by other creatures, or to let genes evolve by fighting each other, as described in Richard Dawkins' "The Selfish Gene", then I can think of completely different algorithms made specifically for that purpose, but certainly not crossover.

*For example:* directly simulate the existence of some categories of "genes", which could be pieces of neural networks, and force these genes to be used in various creatures that do various things: swim, run, jump. Then select the best genes and use evolution simulation to move toward the most useful and best ones. Then we could get genes, or rather building blocks, with a high level of abstraction, which could potentially be used in other creatures for completely different purposes. Although I'm almost sure there will be lots of pitfalls.

# "The success of a strategy is often highly dependent on the opponent."

When I heard this phrase, it immediately dawned on me that here it is --- a gold mine of endlessly increasing complexity for evolution: battles between two rivals! You can first train two rivals hard against each other, then swap them all around, evolve them again, repeat this forever, and get very interesting creatures!

The thing is, an evolution simulation usually looks like this graph:

{% <figure caption="Taken from [here](https://www.researchgate.net/publication/221472180_Skin_Lesion_Diagnosis_Using_Fluorescence_Images)."> %}
{{ <image path="fitness_function.png" /> }}
{% </figure> %}

The **fitness function** is a function that evaluates how well an individual solves the given task. As we can see from the graph, during evolution the value of this function grows, then converges to some limit and stops changing.

This is one of the main problems of evolutionary algorithms --- how to make evolution proceed so that the creatures' complexity keeps growing, so that they solve the task better and better, build up a genetic construction kit, and so that, in the limit, we could run evolution on a supercomputer, leave it for a couple of years and get Skynet. :) (personally, this is my main motivation for studying evolution)

My guess is that one such engine of ever-increasing complexity could be the competitive system shown in the video. In it, a creature's success doesn't depend on the environment and isn't some static function that can converge to something; no, it depends on a constantly changing opponent, who in turn changes depending on its own opponent!

You could even pause the evolution of the stronger side whenever the other one is too weak, giving the weaker one time to surpass its rival, and then they swap places again, while still staying as different as possible.

But the intuition of a seasoned pragmatist tells me that no, this system won't converge to complex and efficient solutions. I hope I'm wrong, and I hope that in the near future we'll be able to create such `emergent evolution`.

By the way, the paper shows and discusses various competition systems, both between creatures of one population and between two populations:

{{ <image path="tournaments.png" /> }}

# Future work

In this section of his paper, the author suggests developing this idea into a simulation of whole ecosystems, where many creatures live at the same time and can not only compete but also cooperate.

Unfortunately, judging by what I've managed to google, nothing worthwhile came out of this. :(

For example, [this](https://www.youtube.com/watch?v=_m97_kL4ox0) video about the [Polyworld](https://en.wikipedia.org/wiki/Polyworld) program discusses a system similar to evolved virtual creatures, but with a full-fledged ecosystem simulation, where the creatures are supposed to come up with complex behavior. The results are sad: no complex behavior emerged, the complexity of the brain eventually converged to some limit, and the author raises this topic seriously in the video itself. By the way, that's exactly where I learned that Karl Sims' video exists. :)

{{ <image path="neural_complexity.png" /> }}

# Low dimensionality

A naive reader might think that you can demand that the creatures do some super-complex things, like getting an image from a camera and walking on their legs based on it, put the evolution on a supercomputer and get some result, and potentially even strong AI.

Unfortunately, no: evolution works great at low dimensionality of the brain and behavior, but at high dimensionality we're unlikely to get anything sensible, or to converge to a solution at all. I don't have data on this, I'm just sure of it. Besides, if this were actually possible, modern games would have long had NPCs based on the same kind of neural networks that Karl Sims described, but sadly there's nothing even close to that: all NPCs are written by hand using [finite state machines](https://code.tutsplus.com/finite-state-machines-theory-and-implementation--gamedev-11867t), and the movement of their legs is set by ordinary animations instead of adaptive movement.

# Conclusion

First of all, this video caught my interest with its results and with the heap of ideas I had while watching it. So I wrote this article in the hope that it will inspire someone in the same way. By the way, I'll be glad if you implement my ideas and put them to the test! Just don't forget to credit the source. :)

Simulating evolution is my absolute favorite topic of all, so there will be more than one article like this in the future: subscribe to my [VK](https://vk.com/optoblog) page (in Russian). :)
