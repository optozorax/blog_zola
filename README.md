# Мой личный блог [optozorax.github.io](https://optozorax.github.io)

## Компиляция

* `git submodule update --init --recursive`
* Компилируется `zola v0.23.6`
* В репозитории [optozorax.github.io](https://github.com/optozorax/optozorax.github.io/) надо выполнить скрипт `.copy`.

## Английская версия

* Русский — основной язык, его адреса не меняются. Английская версия поста — это `index.en.md` рядом с `index.md`, она публикуется по адресу `/en/<тот же путь>`. Для разделов — `_index.en.md`.
* У каждого поста уже есть заготовка `index.en.md` с переведёнными заголовком, описанием и тегами и с `draft = true`. Чтобы опубликовать перевод: написать текст после front matter и удалить строку `draft = true`. Если в русской версии поменялись дата или `[extra]`, их надо поменять и в английской.
* Посмотреть заготовки локально: `zola serve --drafts`. Обычные `zola build`/`zola serve` их не видят.
* Пока не опубликован ни один английский пост, для читателя сайт не меняется: переключатель языка в шапке, `hreflang` и английские страницы в `sitemap.xml` появляются автоматически после публикации первого перевода. У поста переключатель есть, только если перевод опубликован.
* В шапке перевода пишется, с какого языка и кем он сделан: `[extra.translation]` с `from = "ru"` и `by = "..."` (например, `"Claude Opus 5.5"` или `"автор вместе с Claude Opus 5.5"`). В заготовках уже стоит `by = "Claude Opus 5.5"`.
* Строки интерфейса — в `config.toml`: `[translations]` для русского и `[languages.en.translations]` для английского.
* Картинки и видео лежат в папке поста и общие для обоих языков, в компонентах пути пишутся так же. Но Zola копирует файлы папки в `/en/` для каждого опубликованного перевода, так что перевод поста удваивает его размер на сайте.
* Ссылки на другие посты в тексте перевода: `/en/p/<пост>/`, если тот пост уже переведён, иначе `/p/<пост>/`.
* У редактируемых страниц из `e/` может быть свой `changelog.en.txt`, иначе показывается `changelog.txt`.

## Использованные материалы

### Генератор

* [Zola](https://www.getzola.org/) — отличный генератор статических сайтов.

### Тема

* [Cayman blog](https://github.com/lorepirri/cayman-blog) — основа темы.
* [LoveIt](https://hugoloveit.com/theme-documentation-extended-shortcodes/) — украл много стилей отсюда.

### Сервисы

* [utterances](https://utteranc.es/) — комментарии на основе GitHub.
* [KaTeX](https://katex.org/) — рендеринг математических формул.

### Ресурсы

* [iconmonstr](https://iconmonstr.com/) - svg иконки.
* [Как создать полный набор favicon вашего сайта для всех типов устройств](https://pugofka.com/blog/technology/how-to-create-a-complete-set-favicon-on-your-site-for-all-device-types/), [realfavicongenerator.net](https://realfavicongenerator.net) - favicon'ы для всех типов устройств.
* [Encode mp4 for web](https://gist.github.com/jaydenseric/220c785d6289bcfd7366) — статья о том как энкодить видео чтобы они работали в браузере через тэг `<video>`.
* [draw.io](https://www.draw.io/) - сайт для рисования векторной графики. Рисовал в нём изображения для некоторых статей.
* [GraphViz online](https://dreampuf.github.io/GraphvizOnline/) — для рисования графов для некоторых статей.
* [hammerjs](https://hammerjs.github.io/) — библиотека для обработки касаний пальцем. Используется для пролистывания содержания и просмотра картинки в полном разрешении.
* [Генераторы анимаций](https://icons8.com/preloaders/) — использовал это для создания нормальной гифки загрузки, которую очень сложно найти в гугле, вылезает либо очень большая гифка, либо просто фигня.

### HTML/CSS/JS обучающие материалы

* [To change any SVGs color](https://stackoverflow.com/a/53336754)
* [All you need to know about hyphenation in CSS](https://medium.com/clear-left-thinking/all-you-need-to-know-about-hyphenation-in-css-2baee2d89179)
* [Hammer JS Pinch Pan Zoom Image](https://codepen.io/josephmaynard/pen/OjWvNP)
* [How TO - Modal Images](https://www.w3schools.com/howto/howto_css_modal_images.asp)
* [How TO - Slideshow Gallery](https://www.w3schools.com/howto/howto_js_slideshow_gallery.asp)
