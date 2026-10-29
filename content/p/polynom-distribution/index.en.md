+++
title = "Approximating a data distribution with a polynomial"
date = 2023-06-07
description = "I had a lot of flight data from a micro drone and wanted to make a nice smooth plot... I couldn't find a ready-made solution on the internet."

[taxonomies]
tags = ["math", "programming", "rust"]

[extra]
image = "image.png"
use_katex = true

[extra.translation]
from = "ru"
by = "Claude Opus 5.5"
+++

# Introduction

I flew a lot of laps with my drone at home and timed them automatically: there were 8.5 s laps, a lot of 10 s laps, a fair number of 15 s laps, and very few 30 s and 60 s laps. Of course, I could just plot a histogram to visualize these results, but I wanted some kind of smooth curve, so that I wouldn't have to pick the bin width of the histogram, and so that this smooth curve would take into account how close the results are to each other.

I tried googling it and found nothing. Or I found something but didn't understand a thing (like [this paper](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0174573): it started ~~with a bang~~ well, but then wandered off somewhere and lost me). So I had to invent everything myself. I sat over a notebook for a bit, thought it through, then coded for a while and got a result (not right away, of course). In this post I'll explain how to approximate a one-dimensional distribution with a polynomial of degree N. The resulting algorithm has complexity {% <katex> %}O(m){% </katex> %}, where {% <katex> %}m{% </katex> %} is the number of points.

# Derivation

We have a lot of data points: {% <katex> %}D_i{% </katex> %}, {% <katex> %}M{% </katex> %} of them in total. We want to approximate their distribution with a polynomial {% <katex> %}P(x) = \sum_{i = 0}^n c_i x^i{% </katex> %}.

What does it mean to approximate a distribution? It means that on any interval {% <katex> %}[a_k, b_k]{% </katex> %} the integral of this function approaches the density of the data ({% <katex> %}count_{a_k}^{b_k} D{% </katex> %} is the number of points of {% <katex> %}D{% </katex> %} that fall into the interval {% <katex> %}[a_k, b_k]{% </katex> %}):

{% <katex block={true}> %}\int_{a_k}^{b_k} P(x) dx \approx \frac{count_{a_k}^{b_k} D}{M}{% </katex> %}

{% <katex block={true}> %}\int_{a_k}^{b_k} \left[\sum_{i = 0}^n c_i x^i \right] dx - \frac{count_{a_k}^{b_k} D}{M} \approx 0{% </katex> %}

{% <katex block={true}> %}\sum_{i = 0}^n c_i \cdot \frac{a_k^{i+1} - b_k^{i+1}}{i+1} - \frac{count_{a_k}^{b_k} D}{M} \approx 0{% </katex> %}

And if we take all the intervals, and there are K of them:

{% <katex block={true}> %}\sum_{k = 0}^K \left[ \sum_{i = 0}^n c_i \cdot \frac{a_k^{i+1} - b_k^{i+1}}{i+1} - \frac{count_{a_k}^{b_k} D}{M} \right]^2 \to \min{% </katex> %}

Here I squared the difference so that it's always greater than 0, and so that summing over different intervals gives a positive number. And so that the final sum over all intervals doesn't equal zero but tends to some minimum. In this equation we want to find the unknowns {% <katex> %}c_i{% </katex> %}.

If we expand the brackets and collect like terms, we get an equation of the following form:

{% <katex block={true}> %}a_{0,0} + a_{0,1} c_0 + \dots + a_{1, 1} c_0^2 + a_{1, 2} c_0 c_1 + \dots a_{n+1,n+1} c_n^2 \to min{% </katex> %}

You can see that this is a quadratic equation with many unknowns. And the minimum of such a function can be found directly: take the derivative and set it to 0:

{% <katex block={true}> %}
\left\{
\begin{aligned}
	&-a_{0, 1} = a_{1, 1} c_0 + a_{1, 2} c_1 + \ldots + a_{1, n+1} c_n \\
	&-a_{0, 2} = a_{2, 1} c_0 + a_{2, 2} c_1 + \ldots + a_{2, n+1} c_n \\
	
	&\ldots \\
	&-a_{0, n} = a_{n, 1} c_0 + a_{n, 2} c_1 + \ldots + a_{n+1, n+1} c_n \\
\end{aligned}
\right.
{% </katex> %}

So all we have to do is compute some coefficients {% <katex> %}a_{i, j}{% </katex> %} and then solve the system of linear equations (SLE), and we get the coefficients of a polynomial that honestly approximates the given distribution.

# Algorithm

Input:
* {% <katex> %}D_i{% </katex> %}: an array of M values whose distribution we want to approximate.
* {% <katex> %}N{% </katex> %}: the degree of the resulting polynomial.
* {% <katex> %}K{% </katex> %}: the number of intervals.

Obviously, the degree of the polynomial should be small (5-10), so as not to "overfit" the data and end up with a plot that equals the histogram or something like that.

The number of intervals shouldn't be very large either. I figured that {% <katex> %}5\cdot M{% </katex> %} would be plenty. In practice it turned out that {% <katex> %}N \cdot M{% </katex> %} is optimal.

So the whole algorithm consists of two stages:
* Iterating over {% <katex> %}K{% </katex> %} intervals to build the matrix and the vector.
* Solving a system of linear equations of size {% <katex> %}N{% </katex> %}, which is not very large.

There are two ways to iterate over the intervals:
* Randomly
* Systematically

In the random case, the most expensive operation is counting the number of points that fall into the interval, which takes {% <katex> %}O(\ln n){% </katex> %} if the data is sorted.

If instead we iterate over the intervals systematically, from the minimum to the maximum, we can use the two-pointer technique and know the number of points in the current interval in {% <katex> %}O(1){% </katex> %}. And since the number of intervals is {% <katex> %}O(n){% </katex> %}, this is the optimal option.

Altogether, the whole algorithm looks like this in pseudocode:

```rust
vec = /* 1D vector of size n+1 */
mat = /* 2D matrix of size n+1 */
minv = D[0];
maxv = D[-1];
seg_count = sqrt(K);
step = (maxv - minv) / seg_count;

apos = 0;
for ai in 0..seg_count+1 {
	a = minv + ai * step;
	while apos < M && a > D[apos] { apos += 1; }

	bpos = apos;
	for bi in ai+1..seg_count+1 {
		b = minv + bi * step;
		while bpos < M && b > D[bpos] { bpos += 1; }

		count = (bpos - apos) / M;

		for i in 0..n+1 {
			vec[i] += 2 * count * (b^(i+1) - a^(i+1))/(i+1);
		}

		for i in 0..n+1 {
			for j in 0..n+1 {
				to_add = (b^(i+1) - a^(i+1))/(i+1) 
				       * (b^(j+1) - a^(j+1))/(j+1);

				mat[i, j] += to_add;
				mat[j, i] += to_add;
			}
		}
	}
}

x = solve_SLE(vec, mat)
```

# Web interface

Links:
* [Online interface in a separate tab](https://optozorax.github.io/distribution_approximation/)
* [Source code](https://github.com/optozorax/distribution_approximation/blob/master/src/app.rs#L67-L129)

I put in some effort and coded a web interface where you can play with this algorithm. And anyway, what's the point of talking about some algorithm you came up with if there's no code? If that paper had at least had code, never mind a web interface, maybe I wouldn't have had to invent anything myself...

My drone flight data is already loaded in there. Yes, I flew 300 laps in a day, and what are you going to do about it 😁. You can see how much my skill on this track leveled up the next day: faster times became much more frequent.

<iframe src="https://optozorax.github.io/distribution_approximation/" width="100%" height="500px" style="border:0;"></iframe>
