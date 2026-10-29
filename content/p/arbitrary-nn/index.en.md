+++
title = "Arbitrary neural network"
date = 2020-01-06
description = "What you can do with a neural network whose neurons are connected haphazardly: roughly the way it should be in our brain."

[taxonomies]
tags = ["notation", "neural-networks"]

[extra]
image = "arbitrary_nn_white_background.png"
vk = "https://vk.com/optoblog?w=wall-169103586_29"

[extra.translation]
from = "ru"
by = "Claude Opus 5.5"
+++

# Introduction

Have you ever had the feeling that all current neural networks are somehow too linear? Take the perceptron, for example:

{% <figure caption="[Source](https://ru.wikipedia.org/wiki/%D0%9F%D0%B5%D1%80%D1%86%D0%B5%D0%BF%D1%82%D1%80%D0%BE%D0%BD#/media/%D0%A4%D0%B0%D0%B9%D0%BB:Perceptron-ru.svg) (in Russian)"> %}
{{ <image path="perceptron.en.png" /> }}
{% </figure> %}

Or a multilayer neural network:

{% <figure caption="[Source](https://ru.wikipedia.org/wiki/%D0%9F%D0%B5%D1%80%D1%86%D0%B5%D0%BF%D1%82%D1%80%D0%BE%D0%BD#/media/%D0%A4%D0%B0%D0%B9%D0%BB:Neuro.PNG) (in Russian)"> %}
{{ <image path="multilayered.png" /> }}
{% </figure> %}

When I was first learning about this topic, I had this thought:

> Why does the signal in them only travel from left to right? Where are the loops? How can you do complex computations without loops?

But actually, neural networks don't have to be arbitrary. Even in this form they handle a huge number of tasks.

By the way, thanks to this linearity we can squeeze the most out of our current computing power by using very large neural networks. The signal travels through them without any loops, which means they're faster to compute.

And besides, it was for networks like these that the backpropagation algorithm was invented back in the day.

# An example of an arbitrary neural network

I don't know where we get all this from, but we know for sure that the brain can't have such one-way connections: there just have to be loops and other really complicated stuff in there. The neural network in our brain must look something like this:

{{ <image path="arbitrary_nn.png" /> }}

That is, just a plain directed graph without any restrictions.

Obviously, such a neural network should be able to "remember" things for a short time and to make cyclic movements. A neural network like this is perfect for agents inside simulations.

If we simulate an agent in some environment, we have to simulate the "signal propagation" process directly, set some limit on the number of these signal moves per step, accumulate the result on the red output neurons, and so on.

I didn't put the weights of the connections on this image so as not to clutter it, but in reality they should be there.

By the way, an arbitrary neural network was used in this video:

{{ <myyoutube id="5lJuEW-5vr8" /> }}

And really, it's intuitively obvious that to simulate agents trying to evolve in a virtual or real world, you should use the most general class of neural networks: arbitrary ones!

For a very long time I was bothered by the question of why I couldn't find anything anywhere on the internet about how scientists use such arbitrary neural networks. Could it be that a whole category of neural networks is just sitting idle??? So I can come along with my arbitrary neural networks and blow science wide open?!

Unfortunately, no.

# Recurrent neural network

To follow the rest of the story, you need to understand what a recurrent neural network is. As an introduction, I recommend this video (in Russian):

{{ <myyoutube id="ADcu9rWK_3I" /> }}

It explains not only how it works in general, but also one very clever modern architecture, LSTM.

Or you can just skip it (it's an hour long, after all) and try to get the gist from the context.

# Reducing an arbitrary neural network to a recurrent one

First, let's number all the neurons.

{{ <image path="arbitrary_nn_enumerated.png" /> }}

Then we remove all the connections, arrange all the neurons from top to bottom, and make a second column that duplicates the first one. This is shown on the left of the next picture.

Now all that's left is to add the connections, but we'll add them in such a way that a connection can only go from the left column to the right one. The result is shown on the right side of the picture.

{{ <image path="arbitrary_nn_two.png" /> }}

This is exactly what a recurrent neural network is: we've reduced everything to it! So a recurrent neural network can represent any neural network topology, and there's no point in reinventing the wheel.

As you can see, the output neurons aren't used on the left, and the input neurons aren't used on the right.

And indeed, if you think about how the signals flow here, it's just another way of notating a neural network with an arbitrary architecture. It even resembles the adjacency matrix used to represent a graph. So you can visualize it like this:

{{ <image path="matrix_nn.png" /> }}

Since the weights aren't specified, we can simply mark that a connection exists with a red square. And in this form it's obvious that the input and output data should be represented as a vector, and the neural network itself as a matrix.

By the way, in this form you can't represent more than one connection from one node to another. I don't really know why you'd ever need that, except to use different activation functions, and that's a pretty pointless thing too, so let's leave this case aside.

{{ <image path="not_allowed.en.png" /> }}

# Why this is better

I'll even say that in this form an arbitrary neural network turns out better than in its original intuitive form. Why?

**First**, you can use all the power that has grown up around recurrent neural networks, be it software for training them or lots of research papers, for example on overcoming exploding gradients.

**Second**, representing it in memory this way is more computationally efficient. Think about how you would implement a class that runs the neural network we drew at the very beginning. You'd most likely do it the straightforward way: store an array of impulses somewhere, store the graph of connections, and move the impulses along this graph. And parallelizing that kind of thing is really hard.

Recurrent neural networks, on the other hand, are very easily represented by a matrix, which you can simply multiply by a vector of numbers. That's way more efficient even from the CPU cache's point of view. On top of that, people have already written a whole truckload of super-fast parallel libraries for matrix multiplication, not to mention matrix multiplication on the GPU.

# How I came to this idea

Completely by accident. Nobody states it outright anywhere. I don't understand why, because it's really important! They could have just written:

> A recurrent neural network can imitate a neural network that is an arbitrary graph.

# Conclusion

So we won't blow science wide open with our arbitrary neural networks: they already existed before us, just hiding under a different name, and nobody really knew it was them.

And now, the next time you decide to write your own agent evolution with arbitrary neural networks and anime girls, you won't fall into the trap of reinventing the wheel, and you'll be able to use the battle-tested and optimized toolkit of recurrent neural networks!

By the way, I invite everyone interested in simulating evolution to the Telegram chat (in Russian): <https://t.me/emergevolution>
