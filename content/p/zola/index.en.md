+++
title = "Moving my blog to Zola and why it's better than Jekyll"
date = 2021-08-30T00:00:02+00:00
description = "Zola is a great static site generator. I moved my blog to it, and it inspired me to implement many cool features and to speed up the blog. This article focuses on the pros and cons of Zola as a static site generator."

[taxonomies]
tags = ["meta", "blog", "review", "zola"]

[extra]
image = "preview.png"
tg = "https://t.me/optozorax_dev/506"
tg_comments = 37

[extra.translation]
from = "ru"
by = "Claude Opus 5.5"
+++

# Introduction

{% <admonition color="gray" title="Context"> %}
[**Zola**](https://www.getzola.org/) is a static site generator: from templates and markdown articles it generates web pages once, and those pages can be hosted statically, without any complicated backends or frontends.
{% </admonition> %}

I recently moved my blog from [Jekyll](https://jekyllrb.com/) to [Zola](https://www.getzola.org/). So this article focuses on how that move went, and along the way you'll learn why you should or shouldn't use Zola yourself. This article covers:
* How I moved to Zola, and what problems and conveniences I ran into.
* The pros and cons of Zola.
* My thoughts on this static generator and how it could be better.

In this article I won't retell the documentation or explain how to set up a blog. This is a review article.

# The move

## Why

It all started when I began playing with shortcodes in Zola, and that turned into me creating a whole lot of new features, which I wrote a big article about: [New features of this blog](/en/p/new-features/).

Then I started playing with the `resize_image` function, felt the power of optimization, and optimized the whole site so well and in such an interesting way that I had to write a separate article about that too: [Speeding up a static website](/en/p/blog-optimization/).

For those specific topics, see the corresponding articles. Here I'll focus on the practical side of using Zola.

## Preparation

Before moving to Zola, I did a few things:
* Played around with it on some theme, peeking into the documentation and its search along the way. Built up some neural connections and a pool of questions and things I didn't get.
* Read the [documentation of the Tera template language](https://keats.github.io/tera/).
* Read the [documentation of Zola itself](https://www.getzola.org/documentation/getting-started/overview/).

Here I want to point out a huge advantage of Zola: it's small. So you can read the whole documentation cover to cover in a few hours and learn every little detail there is.

Zola gets a lot of praise for this, because I've read online that if you try to do the same with Hugo, you won't manage. Its documentation is incredibly large.

That said, if you've never blogged before and are just about to start, don't do what I did under any circumstances: pick any ready-made theme and use it, write content as soon as possible, and figure out everything else sometime later. As [Vitaly Golovanov](https://www.youtube.com/channel/UCKzffzoHBE1bmYs8tAuXTrw) (in Russian) says:

> Stop dicking around.

Because I had read the whole documentation, I found lots of interesting things, and later I knew right away what to do to port the non-standard features of my blog.

## Aliases

Conveniently, in Zola you can set the `aliases` option for each page: an array of URLs that should lead to that page. This is great when you're migrating your blog to Zola. You can keep your old links working.

## Moving the comments

My comments were implemented with [utterances](https://utteranc.es/), so a separate problem was moving them to a new repository and to the new page names. But everything is great here: you can `transfer` an issue to any repository, and if you change the page URL in the issue title, the comments move to that page, so all the comments I had stayed in place.

# In Zola, everything* is done right

There are lots of features, and Zola knows users need them, so they're built right into the engine! Why make people write their own hacky workarounds in the language itself, come on...

## Shortcodes

This is the ability to insert a custom-configured piece of HTML into a markdown article. It's such a great feature that I wrote [a separate article about the new features of my blog](/en/p/new-features/) that I implemented with it.

In Jekyll you can do something like this with hacks, but nobody really uses that, and the documentation doesn't say a word about it, so back then I didn't know it was possible...

## One folder per article

Hallelujah! In Jekyll all images and other materials are stored in the assets folder, and posts are stored in a single `_posts` folder, and you can't create a folder there to put a post and its images in: that folder immediately turns into a category. And you can't put images there anyway. I wrote about this in [One repository = One blog post](/en/p/submodules-jekyll/): there I did keep the images next to the post, yes, but to make them work I added JS that fixes the image paths when the page loads...

Here it just works out of the box: by default every post acts like a folder with its own name containing an `index.md` file. Anyway, I now keep all images and other stuff next to the posts and I'm really enjoying it. Creating a folder inside the `assets` folder every time was a pain.

{% <admonition color="blue3" title="Quote from [the documentation](https://www.getzola.org/documentation/content/page/)"> %}
As you can see, creating an `about.md` file is equivalent to creating an `about/index.md` file. The only difference between the two methods is that creating the `about` directory allows you to use asset co-location, as discussed in the overview section.
{% </admonition> %}

## Table Of Contents

Or «Содержание», as it's called in Russian.

Again, remembering Jekyll: what do you need to make a table of contents? Weell, either a plugin or a hack. Here's [an example of such a hack](https://github.com/allejo/jekyll-toc/blob/master/_includes/toc.html), which I just blindly copy-pasted into my blog.

And what about Zola in the meantime? There, table of contents parsing is already built into the engine, it's automatically available for every page, and it's a convenient structured object with a documented type:

{% <admonition color="blue3" title="Quote from [the documentation](https://www.getzola.org/documentation/templates/pages-sections/#table-of-contents)"> %}
Both page and section templates have a `toc` variable that corresponds to an array of `Header`. A `Header` has the following fields:
```ts
// The hX level
level: 1 | 2 | 3 | 4 | 5 | 6;
// The generated slug id
id: String;
// The text of the header
title: String;
// A link pointing directly to the header, using the inserted anchor
permalink: String;
// All lower level headers below this header
children: Array<Header>;
```
{% </admonition> %}

So you just take [this example](https://www.getzola.org/documentation/content/table-of-contents/) and generate whatever table of contents you need.

## Taxonomies

Say we want our articles to have tags, and to be able to browse those tags somewhere later.

So what do we do in Jekyll? Right, we reinvent everything from scratch and google how to do it. Here's [the result](https://hyunyoung2.github.io/2016/12/17/Category_And_Tags_In_Jekyll/).

And what about Zola in the meantime? It has a concept called taxonomies. You can try reading about it [in the documentation](https://www.getzola.org/documentation/content/taxonomies/), but you'll need to concentrate, because the concept is a bit non-trivial. With it you can declare at the engine level that you have tags, write exactly those in your articles, and then get these tags through a convenient interface, again with a convenient type, and process them easily.

When I ported the [tags page](/en/tags/) to Zola, it was just trivial, that's how simple and convenient everything is there.

And this feature lets you do far more complex and interesting things, like the movie website example in the documentation.

You can also automatically generate an RSS or Atom feed for taxonomies! Which, again, in Jekyll would take some serious hacks.

## Image processing

As I already said, image processing is simply OP. An incredibly cool feature that will greatly improve the usability of your blog. This is covered in detail in the article about [blog optimization](/en/p/blog-optimization/).

What I didn't cover there is the ability to get an image's dimensions right at site build time, which is great for inserting `width` and `height` attributes, or even for [vertical centering](/en/p/new-features/#vertical-centering)!

## Blocks and page inheritance

In Zola you can mark certain parts of an `html` page as blocks, and then inherit this page in other pages and override what the blocks do. For example, we have a page `base.html`:
{% raw %}```html
<title>{% block title %}My blog{% endblock title %}</title>
```{% endraw %}

Then we want to create a new page `post.html` based on `base.html` with a different title; then we can write the following:
{% raw %}```html
{% extends "base.html" %}

{% block title %}My post{% endblock title %}
```{% endraw %}

And now a page generated from the `post.html` template will be just like `base.html` in every way, except that its title will be `My post`.

And if you also want the old title, you can simply use `{% raw %}{{ super() }}{% endraw %}` inside the block.

It's also handy to create blocks that are initially empty, for example `extra_head`, so that a child template can additionally define whatever it needs in the `<head>` section.

Although inheritance is considered somewhat bad practice in programming, there are very few pages here, so it's perfectly fine. All in all, it's a convenient mechanism. I haven't seen anything like it in Jekyll; there, pages are put together with some hacks based on `include`.

## Debugging

{% <admonition color="blue3" title="Quote from [the documentation](https://keats.github.io/tera/#variables)"> %}
A magical variable is available in every template if you want to print the current context: `__tera_context`.
{% </admonition> %}

This is very handy during initial development: instead of constantly looking things up in the documentation, you immediately see which variables have which values. I use it like this, to get the result in a convenient form right on the page:

{% raw %}```html
<pre><code>
{{ __tera_context | escape_xml | safe }}
</code></pre>
```{% endraw %}

And I debug regular variables like this:

{% raw %}```html
<pre><code>
{{ variable | json_encode(pretty=true) | safe }}
</code></pre>
```{% endraw %}

There's one problem, though: once your blog fills up with content, debugging with `__tera_context` becomes impossible, because it contains all the content, and the page gets very heavy and bogs down the browser. I [requested a feature](https://zola.discourse.group/t/add-analogue-of-tera-context-but-without-content/1023) for this: a new variable that does the same thing but without the content, so drop by and leave a like.

## load_data

There's a function [`load_data`](https://www.getzola.org/documentation/templates/overview/#load-data) that lets you read data in some structured format and then use it when rendering pages.

### arewegameyet.rs

The [arewegameyet.rs](https://arewegameyet.rs/) website uses it to store all the crates and links to games in a structured format and then render them on the site.

Here's a link to [`data.toml`](https://github.com/rust-gamedev/arewegameyet/blob/master/content/games/data.toml), and here's a link to [how it's used](https://github.com/rust-gamedev/arewegameyet/blob/da72488bf9f8031c3345095bebbc272e538226c4/templates/categories/page.html#L46).

So Zola can be used not only for blogs, but also for list sites like this one, with non-trivial functionality.

### External tools

This `load_data` function can also read data from a URL on the internet. I used this to create something like a "plugin" that can run complex code depending on external tools. For example, if you want to:
* Convert formulas to `svg` with the [tex2svg](https://tex.stackexchange.com/questions/255470/compile-tex-directly-into-svg-using-the-command-line) command-line tool.
* Automatically re-encode videos with `ffmpeg`, the same way it's done with images.

Then you don't need any new features for that. You just need to run a local service that Zola will send the corresponding requests to.

I [wrote a short guide](https://zola.discourse.group/t/run-commands/1018/3?u=optozorax) on the Zola forum on how to do this.

I was about to use this myself, but then I realized that I'd need to run this local service, and also reinstall the conversion tool every time I reinstall my system, so I gave up. After all, the "forget about dependencies" idea is very appealing.

## Pagination

If you have a lot of posts, Zola supports splitting them across pages out of the box, so you get a 2nd, 3rd and further pages of content.

I don't use it on principle, but it may be useful for others.

I don't use it because I believe that:
* I won't write so many articles that there would be too many of them for one page and I'd have to use pagination.
* I want all my posts to be on one page, because nobody looks past the second page. And if everything is on one page and you only need to scroll down, any user will tell you: "why not ¯\\\_(ツ)\_/¯".

Also, it drives me crazy when people make pagination that consists only of "Next page" and "Previous page" buttons, **without showing the number of pages**!!! Just saying, since I brought it up.

## Little things

* Good error messages: they even show where the error happened. But sometimes they're a bit weak, and you have to find the exact spot yourself by deduction.
* It's very fast. It's written in Rust, after all.
* When you run it in `serve` mode, a script is added to the page that automatically reloads it whenever something changes.
* A single binary, no dependencies. Unlike Jekyll, for which you have to litter your system with Ruby, then something else, then a million more things, and only then can you run your site.

# So what's wrong with Zola

The previous big section has an asterisk for a reason: not everything in Zola is as rosy as one would like.

## Shortcodes with a body

Zola has this feature:

{% <admonition color="blue3" title="Quote from [the documentation](https://web.archive.org/web/20220207162812/https://www.getzola.org/documentation/content/shortcodes/#shortcodes-with-body)"> %}
Let's imagine that we have the following shortcode `quote.html` template:
{% raw %}```html
<blockquote>
    {{ body }} <br>
    -- {{ author }}
</blockquote>
```{% endraw %}
We could use it in our Markdown file like so:
{% raw %}```md
As someone said:

{% quote(author="Vincent") %}
A quote
{% end %}
```{% endraw %}
The body of the shortcode will be automatically passed down to the rendering context as the body variable and needs to be on a new line.
{% </admonition> %}

The problem is that `body` is passed as text. That is, if we write some markdown or another shortcode in there, it is passed on as plain text. Okay, to parse it you just need to write:
{% raw %}```zola
{{ body | markdown | safe }}
```{% endraw %}

But there are a few problems with this:
* If there are headings in it, they won't get into the table of contents.
* Shortcodes inside it seem to work.
* But the `resize_image` function is no longer available.

Because of this, shortcodes with a body become completely unusable. That's why all [my features](/p/new-features/) consist of two parts, a start and an end:

{% raw %}```zola
{{ pros_start(text="Плюсы: (_фичи_)") }}
* плюс1
* плюс2
{{ pros_end() }}
```{% endraw %}

Where `pros_start.html` is:
{% raw %}```html
<div class="pros">
<span style="color: #090"><big><b>{%/* if text*/ %}{{/*text | markdown(inline=true) | safe/*}}{%/* else */%}Плюсы:{%/* endif */%}</b></big></span>
```{% endraw %}

and `pros_end.html` is:
```html
</div>
```

This way the "body" of my `pros` shortcode is parsed automatically by the Zola engine, and I only insert my stuff between the two parts. I believe shortcodes with a body should work like this by default.

{% <cons text="Cons of my approach:"> %}
* I have to create one more file
* I have to use one more name
* If I forget to close something, Zola won't complain, because these are two different shortcodes
{% </cons> %}

But what can you do, that's how it has to be done.

## The template language

### Filters

There's a small problem: some things can only be obtained through the filter mechanism, for example:
{% raw %}```zola
{{ [1, 2, 3] | length }}
```{% endraw %}

But you can't put this mechanism inside parentheses. So if you want to add one to the result, you have to write it in two lines:
{% raw %}```zola
{% set temp = [1, 2, 3] | length %}
{{ temp + 1 }}
```{% endraw %}

And filters can't be applied in the form `length(value=[1, 2, 3])`, which is pretty sad. I [wrote a feature request about it](https://zola.discourse.group/t/allow-writing-filters-inside-parenthesis/1025), so drop by and leave a like.

### Falsy

{% <admonition color="blue3" title="Quote from [the documentation](https://keats.github.io/tera/#if)"> %}
Undefined variables are considered falsy. This means that you can test for the presence of a variable in the current context by writing:

{% raw %}```zola
{% if my_var %}
    {{ my_var }}
{% else %}
    Sorry, my_var isn't defined.
{% endif %}
```{% endraw %}
{% </admonition> %}

That's the problem. I think it would be much better if the presence of a variable were checked with a function, for example `exists("my_var")` and `exists_field(config.extra, "variable")`, and if accessing a nonexistent field didn't return some `null`-like thing but threw an error right away.

I got burned by this: I published the site without one important feature and spent a long time figuring out why, because I had made a typo in `enable_something` in `{% raw %}{% if config.extra.enable_something %}{% endraw %}`.

In general, the whole language gives the impression of a relaxed, dynamically and weakly typed language like JS or Python. Personally, I'd like an offspring of Rust to be as strict as Rust itself. But unfortunately, it is what it is.

## Rough edges

At the moment Zola has the following problems with images:
* You can't resize `webp` images.
* You can't resize some `png` images into `webp`: something crashes and refuses to work.

All of this comes down to a single bug in a third-party crate for working with `webp`; I opened an [issue](https://github.com/jaredforth/webp/issues/7) about it. Waiting for a fix.

Another thing: Zola struggles with rendering shortcodes in markdown; there are a couple of bugs about it:
* [Shortcodes are broken inside blockquotes](https://github.com/getzola/zola/issues/1600)
* [Shortcodes with body containing code blocks are broken](https://github.com/getzola/zola/issues/1601)

And let's not forget my feature suggestions, plus there's a lot of other stuff that isn't supported. You could say that at the moment Zola is still pretty rough around the edges. At least compared to something like Hugo.

## diff

Syntax highlighting for `diff` is awful. It seems to be this bad in all themes.
```diff
+added line
-removed line
```

# Conclusion

As it turned out, for me moving to Zola wasn't just about moving, but also an excuse to:
* rewrite all the code, so that I know what every line of the templates is responsible for;
* throw out the bloat;
* make new features I had put off for so long;
* fix problems that had been sitting in the backlog for so long.

As you can see, my blog has really blossomed under ~~Mayor Sobyanin~~ Zola.

## Pros and cons

Let's sum up and gather all the arguments for and against Zola in one place:

{% <pros> %}
* One folder per article: images can be stored locally, right next to the article.
* Table of contents parsing out of the box.
* Taxonomies are supported out of the box and make tags easy.
* Image resizing and getting image metadata out of the box.
* Page inheritance and the concept of blocks.
* Good debugging.
* `load_data`.
* Error messages.
* High speed.
* Live reloading on changes in `zola serve` mode.
* No dependencies required, everything is in one binary.
{% </pros> %}
{% <cons> %}
* Shortcodes with a body are inconvenient to use.
* Filters can't be written in parentheses.
* The `falsy` concept lets errors go unnoticed.
* Pretty rough around the edges.
{% </cons> %}

## Links to all my feature requests and bug reports

Feature requests:
* [Run commands](https://zola.discourse.group/t/run-commands/1018/3) — better not to implement this feature, just read the guide on how to do it yourself.
* [Word wrap in code with indent](https://zola.discourse.group/t/word-wrap-in-code-with-indent/1020).
* [Tag to disable counting of words and reading time](https://zola.discourse.group/t/tag-to-disable-counting-of-words-and-reading-time/1021)
* [Add analogue of `__tera_context` but without content](https://zola.discourse.group/t/add-analogue-of-tera-context-but-without-content/1023)
* [Allow writing filters inside parenthesis](https://zola.discourse.group/t/allow-writing-filters-inside-parenthesis/1025)

Bug reports:
* [Shortcodes are broken inside blockquotes](https://github.com/getzola/zola/issues/1600)
* [Shortcodes with body containing code blocks are broken](https://github.com/getzola/zola/issues/1601)
* [Encoder panic](https://github.com/jaredforth/webp/issues/7)
