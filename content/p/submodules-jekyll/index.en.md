+++
title = "One repository = One blog post"
date = 2020-11-16
description = "Making it possible with `git submodules` on Jekyll + GitHub Pages."

[taxonomies]
tags = ["meta", "blog", "git"]

[extra]
image = "jekyll.png"
tg = "https://t.me/optozorax_dev/263"
tg_comments = 3

[extra.translation]
from = "ru"
by = "Claude Opus 5.5"
+++


# What did I do?

I made it possible to show `.md` files from my repositories as posts on my `username.github.io` blog. With this setup:
* This blog is built with [Jekyll](https://jekyllrb.com/) and is automatically compiled into a static site by [GitHub Pages](https://pages.github.com/).
* One repository can contain many "blog posts".
* Nothing extra gets added to the `.md` file with the main content. All the settings for how the blog post is displayed (tags, date, URL, etc.) go into a separate `.md` file with any name and in any location.
* You don't have to mindlessly duplicate anything, thanks to `git submodules`.
* There are a few hacks.

*Example:* I have this repository: [@optozorax/4D](https://github.com/optozorax/4D) (in Russian), and its `README.md` is duplicated in my blog on this page: [/4D](/en/e/4d/).

Why did I do this? Well, lately I've been getting quite a few emails from Yandex about how they index my site, and a whole one and a half people even click on my blog in the search results. And I have lots of repositories with cool READMEs that could rank really well in search (4D, for example). So I decided to do it this way. Plus, I'd wanted for a very long time to separate the articles from the blog and move each article into its own repo, with its own history and local files.

# Submodules

To explain how I did it, I first need to give you some context.

Git has an interesting thing called `submodules`. You use it like this: `git submodule add <path-to-repository>`. From the point of view of your local copy, it does the same thing as `git clone <path-to-repository>`, but from git's point of view it adds special tracking of the state of this cloned folder. Only minimal information about what's in this folder gets sent to your repository's remote (e.g. GitHub): the repository address and the commit hash. On GitHub this is shown as a folder with an arrow, and it leads to the repository that the submodule points to:

{{ <image path="submodule.png" /> }}

A pretty handy feature for old programming languages that have no package managers.

The good part is that GitHub Pages first clones all the submodules locally before compiling the site with Jekyll, so we can make use of that.

By the way, updating every repository included this way is very easy: `git submodule foreach git pull origin master`. In fact, any bash command can follow `foreach`, so you can do lots of things in bulk this way.

# Step by step

## Step 0: setting up the repository that will be published as an article

In that repository, create a `blogpost.md` file (you can name it anything) with the following contents:


{% raw %}```md
---
layout: post
title: "4D"
tags: [4D, систематизация]
permalink: 4D
description: "Сборник информации о четвёртом измерении. Если вы изучете всё что здесь находится, то сможете понять четвёртое измерение."
image: submodules/4D/img/inside4D_2.png
submodule: true
thisname: submodules/4D
date: 2020-12-15
github: https://github.com/optozorax/4D
---

{% include_relative README.md %}
```{% endraw %}

* The tags here have to be listed inside square brackets and separated by commas, not separated by spaces as in regular posts. For some reason it only works this way, no idea why.
* `image` is my own option that adds a picture to the post on the home page. Here I point to an image from the current repository, so it needs an absolute path (jekyll has huuuuuge problems with relative paths, but more on that later). You can see that the current repository is called 4D and that it will be stored under `submodules/`.
* `submodule: true` is an option that marks this page as made with the mechanism described in this article. Later this flag will be used to decide that the page should be shown together with the other blog posts.
* `thisname: submodules/4D`: here you specify the absolute path to the current folder inside the `username.github.io` repository. It's needed for a hacky image fix, but more on that later.
* `date` is the "publication" date of this blog post.
* `github` shows a `Эта страница на github` ("This page on GitHub") button that leads to the page of the repository where this README lives.
* The other parameters are set the same way as for a regular blog post.
* The content of this file is `{% raw %}{% include_relative README.md %}{% endraw %}`, because, fortunately (or unfortunately), liquid syntax (the language (?), environment (?) used by jekyll) works inside `.md` files. And this command lets us include the file we need. Instead of `README.md` you can specify your own file.

## Step 1: setting up submodules

Go to the blog repository `username.github.io` and create a `submodules` folder in its root. Inside this folder, add all the repositories that we set up as in step 0.

Actually, even without step 0 all the `.md` pages would already be shown somehow, somewhere at this stage. Step 0 just lets you configure all of it and get it into proper shape.

And now the main question: why do we create a separate `submodules` folder instead of doing this in the `_posts` folder? Well, the problem is that only the `.md` files that contain [Front Matter](https://jekyllrb.com/docs/front-matter/), that settings block at the beginning of an `.md` file, make it from the `_posts` folder into the final static site.

So none of the images get into the final output. Plus, jekyll has big problems with relative paths. If we put a folder containing images and an `.md` file into the `_posts` folder, and that file references the images like this: `![](./my_image.png)`, jekyll will say it doesn't know any such image and won't render a damn thing. That's why every jekyll tutorial tells you to create an `assets` folder where you keep all the images for all the posts. And IMHO: that's a disgusting and very inconvenient solution. It's convenient to keep images locally. It's convenient to keep each post locally. Too bad the jekyll authors decided to hardcode this architecture.

One more important detail: folders whose names start with `_` don't make it into the final static site, while folders without it at the beginning do. That's why the `assets` folder works, but images inside `_posts` don't.

That's exactly why we create the `submodules` folder: so that it goes into the final static site in full and we can use the images.

But how will the images work, if in the repositories we give them a local address, `/img/1.png`, while an absolute one is needed, `/submodules/4D/img/1.png`?

That's what the next step and the first hack are about...

## Step 2: making images work

Open the `_post.html` file and give the id `content` to whatever wraps the content. In my case it was like this:
```diff
- <div itemprop="articleBody">
+ <div itemprop="articleBody" id="content">
```


Then, after this `div`, insert this js code:
{% raw %}```html
{% if page.submodule %}
<script>
  function fixer() {
    return function(img) {
      return function() {
        if (img.trying_to_fix === undefined) {
          var url = new URL(img.src);
          console.log("[SUBMODULES FIXER] Trying to fix img: " + url);
          img.src = "{{ page.thisname }}" + url.pathname;
          img.trying_to_fix = true;
        } else {
          console.log("[SUBMODULES FIXER] Unable to fix: " + img.src);
        }
      };
    };
  }
  var collection = document.getElementById("content").getElementsByTagName("img");
  for (var i = 0; i < collection.length; i++) {
    var item = collection.item(i);
    var url = new URL(item.src);
    if (url.host === window.location.host) {
      item.addEventListener('error', fixer()(item));
    }
  }
</script>
{% endif %}
```{% endraw %}


First, this code is included only if the page is built with the submodule mechanism; this is where the `submodule: true` we specified comes in handy:

{% raw %}```
{% if page.submodule %}
```{% endraw %}


Second, this code goes through all the images and, if one fails to load, tries to prepend the absolute address to it. This is where the `thisname: submodules/4D` we specified earlier comes in handy.

{% raw %}```
img.src = "{{ page.thisname }}" + url.pathname;
```{% endraw %}


I'd love to fix the images statically, but what can you do, there's no access to jekyll's code. Everything in it is hardcoded. So we fix it with hacks like this on the frontend. It works pretty much unnoticeably, so it's even kind of fine.

## Step 3: showing these pages in the same feed as regular blog posts

Okay, so at this point our pages exist, but they aren't shown in the feed on the home page. Let's fix that by editing the `_layouts/home.html` file:


{% raw %}```diff
- {% for post in site.posts %}
+ {% assign pages_posts = site.pages | where: "submodule", true %}
+ {% assign concatted_posts = site.posts | concat: pages_posts %}
+ {% assign result_posts = concatted_posts | sort_natural: "date" | reverse %}
+ {% for post in result_posts %}
```{% endraw %}


Basically, here we just replace the loop over the posts with a loop over the posts concatenated with our `submodule: true` pages.

By the way, there's this bit of code here: `sort_natural: "date"`. It sorts the posts in chronological order by comparing the date strings (a regular `sort` won't work here). For this to work, we need to do one more thing...

## Step 4: making the pages sort in chronological order

Remember that on the home page we have this feature:
* ✨⭐️ Sorting by publication date ⭐️✨

Something smells like freshly fried hacks.

Well then. Let me tell you that liquid has no way to sort by dates (with a plain `sort`), so we add one more hack: find where the date format for the whole blog is set in the settings, and put `%Y-%M-%d` there. This makes the date show up as `YYYY-MM-DD`, so that sorting by string gives us the correct chronological order. This works because, when this option is set, somewhere inside jekyll the date of each page gets converted to a string in this format...

In my case I had to change this in `_config.yml`:
```yml
cayman-blog:
  date_format: "%Y-%M-%d"
```

Then, in every place where this default date `site.cayman-blog.date_format` is used, replace it with the date format you had before and like better. In my case I only had to change it in two places:


`_layouts/home.html`, `_layouts/default.html`:
{% raw %}```diff
- {% assign date_format = site.cayman-blog.date_format | default: "%b %-d, %Y" %}
+ {% assign date_format = "%d %b %Y" %}
```{% endraw %}


## Step 5: fixing bugs in the rest of the blog, for me it's the tags

I'm writing this how-to article based on my own blog, and I've customized my blog, so a couple more places popped up where I had to fix anything and everything. Plus, the new features have to be added somewhere so that these articles are displayed in a special way.

I added this code to `_layouts/default.html`:

{% raw %}```html
{% if page.github %}
    <br><a href="{{ page.github }}" class="btn" style="margin: 0px;">Эта страница на GitHub</a>
{% endif %}
```{% endraw %}


So that articles taken from a GitHub repository show this button:

{{ <image path="open-in-github.png" /> }}

The next thing that broke for me was the tags. I'd swiped some code from somewhere in the depths of the internet that generates the tags page: [/tags](/tags). Well, to fix it I just had to write a lot of code. I won't paste all these changes here, I'll just say that ALL the changes described here can be seen in this commit: [@optozorax/optozorax.github.io@f1efe22](https://github.com/optozorax/optozorax.github.io/commit/f1efe22917146e9c53cd0b99c3efa3ed2bb3afb3)

Along the way I kept going back to these two documentation pages, maybe they'll be useful to you too:
* https://shopify.github.io/liquid/basics/introduction/
* https://jekyllrb.com/docs/

While writing this code, I noticed that all this jekyll syntax looks like some kind of cut-down functional programming. Even addition is written in a pseudo-functional style: `{% raw %}{% assign size = size | plus: 1 %}{% endraw %}`.

Unfortunately, they fell short of making it proper functional code, and in some places you have to put in a for loop and count things with a mutable variable 😑.

I also want to rant about the error messages. They're awful: you can't tell what broke, where or why.

# My blog specifically

Here's a list of the articles made this way:

> There used to be a list of articles made this way here, but now there are none, because, first, this blog moved to [zola](https://www.getzola.org/), and second, I consider this approach bad and just copied all the READMEs to a separate place by hand. Luckily, in zola each post can have its own folder. There's [a separate article](/p/zola) about this, and about the fate of submodules specifically: [one](/p/new-features/#strukturnye), [two](/p/new-features/#sozdal-otdel-nuiu-kategoriiu-redaktiruemykh-stranits-1).

If you haven't read them yet, welcome!

By the way, I got this list in a rather sneaky way: =)


{% raw %}```
{{ }}
{%- for item in site.pages -%}
{%- if item.submodule -%}
* [{{ item.title }}]({{ item.url }})
{{ }}
{%- endif -%}
{%- endfor -%}
{{ }}
```{% endraw %}


# Conclusions

Don't use Jekyll just because GitHub Pages supports it by default. It's an engine with the wrong architecture for organizing blog posts (you can't keep images local to a post!!!!!1111) and with a weak "programming" language that can't decide whether it's functional or imperative. Instead, publish your blog to a separate branch that goes straight to your `username.github.io` as ready-made HTML files. Use whatever engine you like to generate them. You can probably even set it up so that the HTML gets built automatically on every push to the repository with the blog's source code, using one of the free CI/CD services.

I'm staying on Jekyll, because moving to another blog engine would take too much time, and I got the result of this article in a single day.

Maybe this post will inspire you to do the same thing on your blog with `git submodule`.
