+++
title = "The 5-point rating scale is wrong"
date = 2020-08-26
description = "The whole world is wrong again, and once again I have a brilliant solution."

[taxonomies]
tags = ["ideas", "notation"]

[extra]
image = "symmetric-marks.png"
tg = "https://t.me/optozorax_dev/287"

[extra.translation]
from = "ru"
by = "Claude Opus 5.5"
+++

# The conflict

This post was inspired by the following message:

{% <figure caption="[Link to the message](https://t.me/klavaorgwork/159174) (in Russian)"> %}
{{ <image path="tg_klavaorgwork_159174.png" scale="2/3" /> }}
{% </figure> %}

In it, a guy says that a `3` is the "satisfactory" rating, for when a service works as it should. He gives a `4` when there's something really good about it. And that's when it hit me: my whole life I had thought a `3` was for bad work. So by default I gave `5` stars, and if something didn't work well, I gave a lower rating depending on how bad it was. In other words, for me a `5` was the equivalent of "satisfactory". And I don't think I'm the only one. Our understanding of these ratings was broken by the school system (Russian schools grade on a 5-point scale, where a `3` officially means "satisfactory"), which says that you mustn't be a `3` student, that the only acceptable grade is a `4`, or better yet a `5`.

I think this problem isn't only caused by school; the very way these ratings are set up is also wrong: it goes against intuition. So, almost everywhere we're asked to give a rating either from `1` to `5` or from `0` to `10`. The first obvious problem with these ratings: they all consist of positive numbers. We're asked to rate something only by its degree of goodness. Something that is "good" at the level of `1` out of `5` actually means "bad", and that's counterintuitive.

# The proposal

"Good" should be rated with positive numbers, and "bad" with negative ones. So the rating system should use integers from `-2` to `+2`, where `0` is neutral, "satisfactory". `±2` is the maximum degree of good and bad. `+1` should be the rating for something good enough not to be neutral, but not yet the very best, that is, an intermediate one. No more intermediate values are needed, otherwise choosing becomes too hard.

I propose calling this the _symmetric rating scale_.

Besides being unintuitive, the five-point scale carries some baggage: its ideology. According to this ideology, any rating below `5` is bad, and nobody wants to get a `3`. So "satisfactory" means "bad", however contradictory that may sound. And at school, you earn a `5` when you've done all the tasks. For example, if you solved all the problems on a test, you get a `5`. A `5` isn't the best possible grade, it's simply what you get when you've solved everything. There's nothing above it, only below. If you got a `4` or a `3`, you're seen as deficient, because you didn't do all the tasks. I guess that's why I gave every app a `5` by default.

Another problem with any positive-only scale is that its intermediate values can be interpreted in different ways, and the interpretation can differ from person to person (the 10-point scale is even worse in this respect). The symmetric scale, on the other hand, is very hard to interpret any other way: it clearly defines what neutral, negative, positive and maximum mean.

A new scale must come with a new ideology. First, everyone should stop chasing the maximum rating, and `0` should become the socially acceptable norm. It should be normal and not shameful to do `0`-point work. Likewise, at school it should be perfectly normal to be a `0` student; this grade should be the bare required minimum. Second, since `0` is now a normal grade, tests have to be redesigned. Tests can no longer give `+2` for a complete solution; they should consist of separate sections: the required problems (solving all of them gives a `0`) and extra problems that let you show you're smarter than the required minimum. To get a `+2`, students should be given problems comparable in difficulty to those of specialized schools for gifted students or of academic olympiads. This way schools will be able to grade overachieving students, not just those who've hit the `5`-point ceiling.

I believe all rating scales should become symmetric. Not only in schools, but also in app stores, on Kinopoisk (a Russian movie database), IMDb, etc.

In general, for different purposes the scale can be extended to `[-5, 5]`; the main thing is that it stays symmetric and keeps all the other principles of this scale.

# Criticism from others

On this topic I also recommend checking out my friend's article: [Infuriating! 10 stars.](https://telegra.ph/steloj-10-20) (in Russian), also available on [Telegram](https://t.me/bpblog/111).

Also, I googled the five-point scale, and everywhere you look, people say it's bad and that schools should replace it with another positive-definite scale: 10, 12, 15 😂 IMHO, without negative numbers, and especially without zero, that will only be a half-measure.

There's also a great [illustration from Reddit](https://www.reddit.com/r/gaming/comments/ky7lqq/how_gamers_see_review_scores_now/) of how gamers see game review scores:

{{ <image path="gamer-marks.jpg" /> }}
