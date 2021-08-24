# Used

* svg icons from https://iconmonstr.com
* yandex metrica
* https://stackoverflow.com/a/53336754, https://codepen.io/sosuke/pen/Pjoqqp
* https://medium.com/clear-left-thinking/all-you-need-to-know-about-hyphenation-in-css-2baee2d89179
* firefox красавчики, поддерживают переносы на новую строку почти для каждого популярного языка: https://developer.mozilla.org/en-US/docs/Web/CSS/hyphens
* katex from https://www.getzola.org/themes/even/

https://codepen.io/josephmaynard/pen/OjWvNP
https://www.w3schools.com/howto/howto_css_modal_images.asp
https://www.w3schools.com/howto/howto_js_slideshow_gallery.asp
https://hammerjs.github.io/

фичи:
* картинки центрируются
* картинки реенкодятся
* можно открыть фулскрин
* в фулскрине можно масштабировать и двигать картинку

debug:
```
<code><pre>
{{variable | json_encode(pretty=true) | safe}}
</pre></code>
```

debug all:
```
<code><pre>
{{__tera_context | escape_xml | safe}}
</pre></code>
```


что мне нравится в золе:
* обработка картинок, возможность создавать уменьшенные картинки
* возможность узнать размер картинки заранее, чтобы в галерее сделать вертикальное центрирование!!! это ваще огонь
* шорткоды — вызов кастомных функций
* сообщения об ошибках нормальные, только не работают в zola serve, но это обещают исправить в ближайшее время
* не надо париться насчёт toc, он уже рассчитан
* маленькая, и можно всю документацию от и до прочитать за один присест
* можно хранить картинки в одной папке с постом (ура!!!!!)
* такономии, через которые из коробки можно сделать теги без всяких костылей и сложного кода как у меня было на jekyll

что мне не нравится:
* permalink возвращает адрес, который привязан к айпишнику на который раздаёшь, то есть если зайти с телефона по вайфаю, ничего не будет работать. ну бред же, какая теоретическая выгода от этого есть?
* permalink неадекватно много используется, даже в toc, где он должен быть просто `#адрес`, там пишется полный адрес :facepalm:
* шорткоды с телом не рендерят то что внутри них изначально
* язык можно было бы сделать и пожёстче с нормальными option и работы с ними, а то все вот эти `if page.variable then` очень неприятны когда у тебя там хранится какая-то фигня. да и вообще написать что-то типо `unwrap_or` было бы в миллион раз проще и удобней, чем городить сотню ифов.

я сделал: https://zola.discourse.group/t/run-commands/1018/3


мои принципы:
* у меня посты не показываются по страницам, ибо страницы никто листать не будет, все посты на одной странице. я не смогу написать настолько много постов, чтобы они занимали слишком много места
* рядом с каждым постом картинка, чтобы она прикреплялась при добавлении в социальную сеть, и чтобы привлекать внимание и показывать какие все посты разные
* сохранил все шрифты, скрипты и стили локально
* пагинация плоха для заголовков статей, которые занимают не так много места. а ещё она отвратительна просто когда количество страниц не говорится, а говорится только текущая, и нельзя выбирать произвольную страницу

статья:
* можно нарисовать граф какая страница от какой наследуется
* теперь есть rss, даже отдельно для каждого тега (слава таксономиям!)
* у github pages время кэша 10 минут, и это нельзя настроить, надо уходить
* круто что дебажить легко
* написать отдельную главу проперенос слов через дефис
* перечитать статью про jekyll submodules и сравнить подходы
* одна из немногих статей, оставшаяся с прямым html-ем — 1д обратимые автоматы, ибо она довольно интерактивная

переод новых статей:
* не использовать обычный инклюдинг картинок ![]()


# shortcodes

## scale allowed values

`1, 3/4, 1/2, 1/4, 2/3, 1/3`

## image

```
{{ image(path="") }}
```

scale, format

## video

```
{{ video(path="") }}
```

scale

## video_gif

```
{{ video_gif(path="") }}
```

scale

## container

```
{{ container_start() }}
{{ video_gif(path="explanation_4/4_0_web.mp4", scale="1/2") }}
{{ image(path="explanation_4/pythagor_0.png", scale="1/2") }}
{{ container_end() }}
```

## gallery

```
{{ gallery(images=[
	"explanation_5/3_0.png",
	"explanation_5/20_9.png",
]) }}
```

format, alts

## katex

```
{{ katex(body="\pi") }}
```

```
{{ katex(body="\KaTeX") }}
```

```
{% katex(block=true) %}
\KaTeX
{% end %}
```

чтобы было по центру, добавить `block=true`

## telegram

```
```

# page

```
[extra]
use_katex = true
```
