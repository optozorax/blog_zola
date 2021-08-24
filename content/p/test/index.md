+++
title = "test"
date = 2021-08-24
description = "Тестирование."

[taxonomies]
tags = ["мета", "блог"]

[extra]
image = "preview.png"
+++

# раз

{{ figure_start() }}
{{ image(path="preview.png") }}
{{ figure_end(caption="This is the `snthh` preview") }}

# два

{{ admonition_start(color="gray", title="Summary `ololo` hi") }}
When building the website, you can set a theme by using `--theme` option. However, we suggest you modify the 
configuration file (`config.toml`) and set the theme as the default.
{{ figure_start() }}
{{ image(path="preview.png") }}
{{ figure_end(caption="This is the `snthh` preview") }}
{{ admonition_end() }}

{{ admonition_start(color="blue", title="Summary `ololo` hi") }}
When building the website, you can set a theme by using `--theme` option. However, we suggest you modify the 
configuration file (`config.toml`) and set the theme as the default.
{{ admonition_end() }}

{{ admonition_start(color="green", title="Summary `ololo` hi") }}
When building the website, you can set a theme by using `--theme` option. However, we suggest you modify the 
configuration file (`config.toml`) and set the theme as the default.
{{ admonition_end() }}

{{ admonition_start(color="orange", title="Summary `ololo` hi") }}
When building the website, you can set a theme by using `--theme` option. However, we suggest you modify the 
configuration file (`config.toml`) and set the theme as the default.
{{ admonition_end() }}

{{ admonition_start(color="violet", title="Summary `ololo` hi") }}
When building the website, you can set a theme by using `--theme` option. However, we suggest you modify the 
configuration file (`config.toml`) and set the theme as the default.
{{ admonition_end() }}

## два два

{{ pros_cons_start() }}
* обработка картинок, возможность создавать уменьшенные картинки
* возможность узнать размер картинки заранее, чтобы в галерее сделать вертикальное центрирование!!! это ваще огонь
* шорткоды — вызов кастомных функций
* сообщения об ошибках нормальные, только не работают в zola serve, но это обещают исправить в ближайшее время
* не надо париться насчёт toc, он уже рассчитан
* маленькая, и можно всю документацию от и до прочитать за один присест
* можно хранить картинки в одной папке с постом (ура!!!!!)
* такономии, через которые из коробки можно сделать теги без всяких костылей и сложного кода как у меня было на jekyll
{{ pros_cons_middle() }}
* permalink возвращает адрес, который привязан к айпишнику на который раздаёшь, то есть если зайти с телефона по вайфаю, ничего не будет работать. ну бред же, какая теоретическая выгода от этого есть?
* permalink неадекватно много используется, даже в toc, где он должен быть просто `#адрес`, там пишется полный адрес :facepalm:
* шорткоды с телом не рендерят то что внутри них изначально
* язык можно было бы сделать и пожёстче с нормальными option и работы с ними, а то все вот эти `if page.variable then` очень неприятны когда у тебя там хранится какая-то фигня. да и вообще написать что-то типо `unwrap_or` было бы в миллион раз проще и удобней, чем городить сотню ифов.
{{ pros_cons_end() }}

### два три

```diff
--- /path/to/original	timestamp
+++ /path/to/new	timestamp
@@ -1,3 +1,9 @@
+This is an important
+notice! It should
+therefore be located at
+the beginning of this
+document!
+
 This part of the
 document has stayed the
 same from version to
@@ -8,13 +14,8 @@
 compress the size of the
 changes.

-This paragraph contains
-text that is outdated.
-It will be deleted in the
-near future.
-
 It is important to spell
-check this dokument. On
+check this document. On
 the other hand, a
 misspelled word isn't
 the end of the world.
@@ -22,3 +23,7 @@
 this paragraph needs to
 be changed. Things can
 be added after it.
+
+This paragraph contains
+important new additions
+to this document.
```

# три

|а|б|в|г|
|-|-|-|-|
|й|ц|у|к|
|й|ц|у|к|
|й|ц|у|к|
|й|ц|у|к|
|й|ц|у|к|
|й|ц|у|к|
|й|ц|у|к|

{{ gallery(images=[
    "../portals/368.png", 
    "../portals/369.png", 
    "../portals/370.png", 
    "../portals/371.png", 
    "../portals/372.png", 
    "../portals/373.png", 
    "../portals/374.png", 
    "../portals/375.png",
]) }}