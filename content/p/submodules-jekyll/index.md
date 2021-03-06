+++
title = "Один репозиторий = Один пост в блоге"
date = 2020-11-16
description = "Делаем такое возможным с помощью `git submodules` на Jekyll + GitHub Pages."
aliases = ["submodules-jekyll"]

[taxonomies]
tags = ["мета", "блог", "git"]

[extra]
image = "jekyll.png"
tg = "https://t.me/optozorax_dev/263"
tg_comments = 3
+++


# Что я сделал?

Я сделал возможность отображать `.md` файлы в своих репозиториях как посты в блоге `username.github.io`. При этом:
* Данный блог написан на [Jekyll](https://jekyllrb.com/), и автоматически компилится [GitHub Pages](https://pages.github.com/) в статический сайт.
* В одном репозитории может быть множество "блогпостов".
* В `.md` файле с основным контентом не добавляется ничего лишнего. Все настройки отображения блогпоста (теги, дата, урл итд) производятся в соседнем `.md` файле под любым названием и в любом месте.
* Не нужно тупо дублировать информацию благодаря использованию `git submodules`.
* Есть немножко костылей.

*Пример:* у меня имеется такой репозиторий: [@optozorax/4D](https://github.com/optozorax/4D), и его `README.md` продублировано в моём блоге на этой странице: [/4D](https://optozorax.github.io/4D).

Зачем я это сделал? Ну, мне в последнее время частенько приходят письма от Яндекса о том как они индексируют мой сайт, и даже полтора человека кликают на мой блог в поисковой выдаче. А у меня есть много репозиториев с крутыми ридмишками, которые могли бы очень хорошо гуглиться (4D например). Поэтому я решил сделать это таким образом. Плюс я очень давно хотел отделить статьи от блога, и вынести каждую статью в свою репошку, со своей историей и локальными файлами.

# Submodules

Чтобы рассказать как я это сделал, сначала надо ввести вас в контекст.

В git есть такая интересная вещь под названием `submodules`. Воспользоваться ей можно так: `git submodule add <path-to-repository>`. С точки зрения вашей локальной копии она делает то же самое что и `git clone <path-to-repository>`, а с точки зрения git'а она добавляет особое отслеживание состояния данной склонированной папки. На удалённое хранилище вашего репозитория (eg Github) отправляется минимальная информация о том, что находится в этой папке: адрес к репозиторию и хэш коммита. В гитхабе это отображается папкой со стрелкой и ведёт на репозиторий куда ссылается данный сабмодуль:

{{ image(path="submodule.png") }}

Довольно удобная фича для старых языков программирования без пакетных менеджеров.

Что хорошо, GitHub Pages перед компиляцией сайта на Jekyll сначала клонирует локально себе все сабмодули, так что мы можем использовать это.

Кстати обновить каждый репозиторий, который включён таким образом очень легко: `git submodule foreach git pull origin master`. Вообще после `foreach` выполняется любая bash-команда, так что так можно много чего делать массово.

# Step-to-step

## Шаг 0: настройка репозитория, который будет публиковаться как статья

Необходимо в этом репозитории создать `blogpost.md` файл (назвать можно как угодно), со следующим содержимым:


```md
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
```

* Тэги здесь должны перечисляться не через пробелы, как это делается в обычных постах, а внутри квадратных скобок и через запятые. Почему-то это работает только так, я хз почему.
* `image` - это моя опция, позволяющая добавлять к посту картинку на главной странице. Здесь я указываю картинку из текущего репозитория, так что к ней надо прописать абсолютный путь (y jekyll огроооомные проблемы с локальными путями, но об этом потом). Видно, что текущий репозиторий называется 4D и он будет храниться по адресу `submodules/`.
* `submodule: true` - это опция, показывающая что данная страница сделана через механизм описываемый в этой статье. Далее этот флаг будет использоваться чтобы определить что данную страницу надо отобразить вместе с остальными блогпостами.
* `thisname: submodules/4D` - надо указать абсолютный путь к текущей папке внутри репозитория `username.github.io`. Это нужно для костыльного фикса картинок, но об этом позже.
* `date` - дата "публикации" данного блогпоста.
* `github` - показывает кнопочку `Эта страница на github`, которая перенаправляет на страницу репозитория где лежит данная ридмишка.
* Остальные параметры редактируются так же как и для обычного блогпоста.
* Контент в данном файле выглядит как `{% include_relative README.md %}`, потому что к счастью (или к сожалению) внутри `.md` файлов работает liquid синтаксис (язык (?), окружение (?) используемое jekyll). И данная команда позволяет заинклюдить нужный нам файл. Вместо `README.md` можно указать свой файл.

## ШАГ 1: настройка submodules

Заходим в репозиторий блога `username.github.io`, и создаём в корне папку `submodules`. Внутри этой папки добавляем все репозитории, которые мы настроили как в шаге 0.

Вообще, даже без шага 0 все `.md` страницы на этом этапе уже как-то, где-то бы отображались. Шаг 0 просто позволяет это всё настроить и привести к нормальному виду.

А теперь главный вопрос: почему мы создаём отдельную папку `submodules`, а не делаем это в папке `_posts`? Ну, проблема в том, что в итоговый статический сайт из папки `_posts` попадают только `.md` файлы, которые содержат [Front Matter](https://jekyllrb.com/docs/front-matter/) - эту настройку вначале `.md` файла.

Соответственно никакие картинки не попадут в итоговый файл. Плюс, у jekyll большие проблемы с локальными путями. Если мы в папку `_posts` положим папку, внутри которой лежат картинки и `.md` файл, и этот файл ссылается на картинки следующим образом: `![](./my_image.png)`, то jekyll скажет что он не знает такой картинки и нифига не нарисует. Поэтому во всех туториалах к jekyll говорят что надо создавать папку `assets`, где ты хранишь все картинки для всех постов. И моё ИМХО: это отвратительное и очень неудобное решение. Картинки удобно хранить локально. Каждый пост удобно хранить локально. Жаль что авторы jekyll решили захардкодить такую архитектуру.

Ещё одна важная деталь: папки, начинающиеся с `_` не попадают в итоговый статический сайт, а папки без него вначале, попадают. Благодаря этому папка `assets` работает, а картинки внутри `_posts` - нет.

Поэтому мы и создаём папку `submodules`, чтобы она полностью вошла в итоговый статический сайт, чтобы мы могли использовать картинки.

Но как будут работать картинки, если в репозиториях мы указываем к ним локальный адрес: `/img/1.png`, а надо абсолютный: `/submodules/4D/img/1.png`?

А об этом следующий шаг и первый костыль...

## Шаг 2: заставляем картинки работать

Открываем файл `_post.html` и чему-то, что оборачивает контент, задаём айдишник `content`. В моём случае было так:
```diff
- <div itemprop="articleBody">
+ <div itemprop="articleBody" id="content">
```


Затем после этого `div` вставляем такой js код:
```html
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
```


Во-первых данный код инклюдится только если данная страница устроена по механизму сабмодулей, тут нам пригождается `submodule: true`, что мы указали:

```
{% if page.submodule %}
```


Во-вторых, данный код перебирает все картинки, и в случае неудачи пытается добавить к ним абсолютный адрес. Тут нам пригождается `thisname: submodules/4D` что мы указывали ранее.

```
img.src = "{{ page.thisname }}" + url.pathname;
```


Хотел бы я картинки фиксить статически, но что поделать, нету доступа к коду jekyll. Захардкожено в нём всё. Поэтому фиксим такими костылями на фронтенде. Работает вполне незаметно, так что вроде даже норм.

## Шаг 3: отображаем эти страницы в той же ленте что и обычные блогпосты

Так, значит на данный момент наши страницы существуют, но они не отображаются в ленте на домашней странице. Исправляем это, редактируя файл `_layouts/home.html`:


```diff
- {% for post in site.posts %}
+ {% assign pages_posts = site.pages | where: "submodule", true %}
+ {% assign concatted_posts = site.posts | concat: pages_posts %}
+ {% assign result_posts = concatted_posts | sort_natural: "date" | reverse %}
+ {% for post in result_posts %}
```


По сути тут мы просто заменяем обращение к постам на обращение к постам, сконкатенированным с нашими страницами `submodule: true`.

Кстати, тут есть такой код как `sort_natural: "date"`. Он сортирует посты в хронологическом порядке, используя сравнение строк дат (обычный `sort` здесь не будет работать). Для того чтобы это работало, надо ещё кое-что сделать...

## Шаг 4: заставляем страницы сортироваться в хронологическом порядке

Вспоминаем что на домашней странице у нас есть такая фича как:
* ✨⭐️ Сортировка по дате публикации ⭐️✨

Кажется запахло жареными костылями.

Чтож. Скажу вам, что в liquid нету возможности сортировать по датам (простым `sort`), поэтому мы вставляем ещё один костыль: найдите где в настройках задаётся дата для всего блога, и поставьте там: `%Y-%M-%d`. Это чтобы дата отображалась в виде `YYYY-MM-DD`, чтобы при сортировке по строке, мы могли получить правильный хронологический порядок. Это работает, потому что при задании этой опции, где-то внутри jekyll для каждой страницы происходит преобразование даты в строку по этому формату...

У меня надо было поменять в `_config.yml`:
```yml
cayman-blog:
  date_format: "%Y-%M-%d"
```

Затем во всех местах где происходит обращение к этой дате по умолчанию `site.cayman-blog.date_format` замените на ту дату, которая у вас была до этого, и которая вам больше нравится. У меня надо было поменять лишь в двух местах:


`_layouts/home.html`, `_layouts/default.html`:
```diff
- {% assign date_format = site.cayman-blog.date_format | default: "%b %-d, %Y" %}
+ {% assign date_format = "%d %b %Y" %}
```


## Шаг 5: фиксим баги в остальной части блога, у меня - это тэги

Я пишу эту статью-инструкцию для своего блога, а я свой блог персонализировал, поэтому у меня вылилось ещё пара мест где пришлось фиксить всё и вся. Ну и плюс надо где-то вставить новые фичи, чтобы такие статьи по особому отображались.

Я вставил такой код в `_layouts/default.html`:

```html
{% if page.github %}
    <br><a href="{{ page.github }}" class="btn" style="margin: 0px;">Эта страница на GitHub</a>
{% endif %}
```


Чтобы у меня на статьях, которые взяты с репозитория на гитхабе отображалась такая кнопка:

{{ image(path="open-in-github.png") }}

Следующее место, которое у меня сломалось - это тэги. Я откуда-то из глубинок интернета стащил код, который генерит страницу с тегами: [/tags](/tags). Ну, чтобы её починить пришлось тупо написать много кода. Вставлять я все эти изменения я не буду, просто скажу что ВСЕ изменения что здесь описаны можно посмотреть в этом коммите: [@optozorax/optozorax.github.io@f1efe22](https://github.com/optozorax/optozorax.github.io/commit/f1efe22917146e9c53cd0b99c3efa3ed2bb3afb3)

В процессе я неоднократно обращался к этим двум страницам с документацией, может они тоже вам пригодятся:
* https://shopify.github.io/liquid/basics/introduction/
* https://jekyllrb.com/docs/

Во время написания этого кода я заметил, что весь этот синтаксис jekyll выглядит как какое-то обрезанное функциональное программирование. Там даже сложение пишется через псевдофункциональный стиль: `{% assign size = size | plus: 1 %}`.

Только к сожалению чего-то им не хватило чтобы привести это к полноценному функциональному коду, и в некоторых местах приходится вставлять for, и считать количество чего-то через мутабельную переменную 😑.

Так же хочется поругать сообщения об ошибках. Они ужасные, непонятно что, где и почему сломалось.

# Конкретно мой блог

Вот список статей, которые сделаны таким образом:

> Раньше здесь был список статей сделанных таким образом, но теперь их нет, так как во-первых этот блог перехал на [zola](https://www.getzola.org/), а во-вторых я считаю такой подход плохим и просто скопировал все ридмишки в отдельное место вручную. Благо в золе можно для каждого поста иметь отдельную папку. Об этом написана [отдельная статья](/p/zola) и конкретно про судьбу submodules: [раз](/p/new-features/#strukturnye), [два](/p/new-features/#sozdal-otdel-nuiu-kategoriiu-redaktiruemykh-stranits-1).

Если вы их ещё не читали, то welcome!

Получил я этот список, кстати, довольно хитрым образом: =)


```
{{ }}
{%- for item in site.pages -%}
{%- if item.submodule -%}
* [{{ item.title }}]({{ item.url }})
{{ }}
{%- endif -%}
{%- endfor -%}
{{ }}
```


# Выводы

Не используйте Jekyll только потому что он по умолчанию поддерживается GitHub Pages. Это движок с неправильной архитектурой организации блогпостов (нельзя сделать картинки локально к посту!!!!!1111), и с слабым языком "программирования" то ли функциональным, то ли императивным. Вместо этого публикуйте свой блог на отдельную ветку, которая будет отправляться на ваш `username.github.io` сразу html-ками. Используйте для их генерации любой удобный для вас движок. Вы, наверное, даже можете настроить чтобы html-ки сами билдились при пуше в репозиторий с исходным кодом блога через всякие бесплатные CI/CD.

Я остаюсь на Jekyll, потому что уход на другой блог-движок займёт слишком много времени, а результат этой статьи я получил за один день.

Может быть этот пост вдохновит вас на своём блоге сделать всё аналогично через `git submodule`.
