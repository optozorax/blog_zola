+++
title = "Как я впервые в жизни начал делать графические приложения: плюсы и минусы ImGui"
date = 2021-08-14
description = "Рассказываю об инструменте, который изменит ваше отношение к программированию графических интерфейсов. Если раньше вы в своих пет-проектах ограничивались только консольными утилитами, то теперь можете смело начать делать и графические утилиты с примерно таким же количеством усилий."
aliases = ["imgui-post"]

[taxonomies]
tags = ["программирование", "rust"]

[extra]
image = "portal_explorer.png"
tg = "https://t.me/optozorax_dev/493"
tg_comments = 8
+++

# Что это такое

[Immediate Mode Graphical User Interface (ImGui)](https://en.wikipedia.org/wiki/Immediate_mode_GUI) это паттерн/концепция/идея того как можно организовать реализовать библиотеку для графического интерфейса. Эту концепцию реализуют библиотеки, которые можно подключить и использовать в коде.

Пример библиотек:
* [Dear ImGui](https://github.com/ocornut/imgui) — самая популярная библиотека. Все называют её просто ImGui 😑, из-за чего возникает много путаницы. Библиотека изначально написана для C++, но существуют биндинги для [JS](https://github.com/flyover/imgui-js), [Python](https://github.com/hoffstadt/DearPyGui), [Rust](https://github.com/imgui-rs/imgui-rs), [.NET](https://github.com/mellinoe/ImGui.NET). Я её не использовал.
	* Кстати, существуют две демки по запуску этой библиотеки в браузере через компиляцию C++ в WASM:
		* [Демка 1](https://jnmaloney.github.io/WebGui/imgui.html), [исходники](https://github.com/jnmaloney/WebGui).
		* [Демка 2](https://pbrfrat.com/post/imgui_in_browser.html)
* [egui](https://github.com/emilk/egui) — крайне перспективная библиотека для интерфейса на Rust. Я делал интерфейсы почти только на ней, так что можно считать, что вся данная статья написана под влиянием этой библиотеки. Мне кажется что в Dear ImGui должно быть примерно так же, но это только логичные догадки.
	* А у этой библиотеки официально и из коробки поддерживается запуск в браузере: [демка](https://emilk.github.io/egui/#demo).

Обязательно зайдите в веб-демки и посмотрите как они выглядят.

# Суть

Существуют классические интерфейсы, которые, как я понял, называются [Retained Mode GUI](https://en.wikipedia.org/wiki/Retained_mode). Я не знаю всех их глубин, и работал только с Delphi много лет назад. Насколько я помню с того опыта, чтобы создать кнопку, нужно:
* Заранее сказать что эта кнопка существует, нарисовать её в специальном окошке, выбрать размеры итд.
* Поставить коллбэк-функцию с названием вида `on_button_click_1337`, которая будет вызываться каждый раз когда по кнопке кликают.

В то время как чтобы сделать кнопку в ImGui, нужна всего-лишь одна строка кода:

```rust
if ui.button("Next").clicked() {
  // do on click
}
```

Никаких рисований, никаких коллбэков, нажатие кнопки проверяется прямо сейчас, и если прямо сейчас кнопка не нажата, то и ничего не происходит. От этого и получается название Immediate.

Если вы хотите что-то посложнее, то вот пример, взятый из ридмишки egui:
```rust
ui.heading("My egui Application");
ui.horizontal(|ui| {
    ui.label("Your name: ");
    ui.text_edit_singleline(&mut name);
});
ui.add(egui::Slider::new(&mut age, 0..=120).text("age"));
if ui.button("Click each year").clicked() {
    age += 1;
}
ui.label(format!("Hello '{}', age {}", name, age));

```

{{ image(path="demo.png") }}

Если в retained mode вы задаёте для каждого виджета его координаты, то здесь вы описываете каждый виджет сверху-вниз слева-направо. Его соответствующие координаты вычисляются автоматически, всё размещается компактно.

Ещё виджеты можно задавать в цикле или внутри if, и всё будет прекрасно работать:
```rust
for i in 0..10 {
    ui.horizontal(|ui| {
        if ui.button(i.to_string()).clicked() {
            ui.label(format!("{} is clicked", i));
        }
    });
}
```

Здесь будет создано 10 кнопок, которые расположены сверху-вниз, и если кликнуть по одной кнопке, то на момент клика справа от кнопки появляется надпись о том что она кликнута.

Можете представить себе такое в retained mode? Такая возможность позволяет отлично абстрагировать и переиспользовать элементы интерфейса без сложных классов, наследований, Dependency Injection итд.

# Как это работает

Если для retained mode хотя бы приблизительно понятно как он работает, да и мы к нему привыкли, то для immediate mode не очевидно.

* Интерфейс ImGui вызывается в цикле, каждая итерация цикла считается одним кадром. 
* Перед началом кадра библиотека должна получить все данные касательно положения мыши, нажатых клавиш и прочих вводных. 
* Затем вызывается функция, в которой пользователь библиотеки получает структуру `ui`, рисует свой интерфейс. В этот момент библиотека в реальном времени формирует все виджеты, для каждого виджета определяет попала ли на него мышь, и формирует вершины и треугольники, которые потом будут рисоваться.
* Теперь библиотека возвращает все сформированные mesh'и и отдаёт их на рисование бэкенду. Он рисует это на экран.
* И так повторяется 60 кадров в секунду.

Особенность здесь в том, что мы заранее не знаем будут у нас какие-то виджеты или нет, как бы мы это знали в retained mode, а значит весь интерфейс должен сформировываться полностью заново каждый кадр.

# Плюсы и минусы

{{ pros_start() }}
* Писать интерфейс очень просто
* Идеально подходит для заимствований Rust 
{{ pros_end() }}
{{ cons_start() }}
* Жрёт ресурсы компьютера
* Невозможность автоматически вычислить layout
{{ cons_end() }}

Вообще на тему плюсов и минусов, советую почитать [ридмишку egui](https://github.com/emilk/egui#why-immediate-mode), там хорошо расписывается что и как. Некоторые пункты я лишь пересказываю.

## Писать интерфейс очень просто

* Для того чтобы создать кнопку вам нужно всего-лишь написать одну строчку в if'е.
* Вся информация об интерфейсе хранится в одной переменной — `ui`, которую вам просто нужно таскать в нужные функции.
* Можно переиспользовать сложные интерфейсы простым написанием функции, без создания класса, наследования итд.
* Нельзя получить рассинхрон интерфейса и данных, так как весь интерфейс существует только сейчас. Можно поддерживать существование интерфейса одновременно с данными.
* Не надо думать декларативно или асинхронно, весь код интерфейса пишется императивно сверху-вниз, из прошлого в будущее.

Вообще, просто попробуйте сами. Увидите насколько это просто.

## Идеально подходит для заимствований Rust

Rust очень строгий к ссылкам, и я даже не представляю как на нём можно написать retained mode без использования `Arc<RefCell<_>>`. Ведь там надо чтобы одновременно какое-нибудь поле ввода знало куда ему вводить информацию, и одновременно чтобы эта информация хранилась где-то ещё, кроме самого интерфейса.

А в ImGui ничего такого не нужно вообще, так как обращение к данным существует только в сейчас, можно передавать обычные ссылки. Давайте посмотрим на то как работает поле ввода:

```rust
ui.text_edit_singleline(&mut name);
```

В него мы просто кидаем изменяемую ссылку на строку. Если за этот кадр нажались какие-то символы и данная строка изменилась, то она изменится после того как функция завершится.

## Жрёт ресурсы компьютера

Для того чтобы каждый кадр заново вычислять весь интерфейс, требуется много вычислений. В retained mode почти всё можно вычислить заранее, и хранить только вычисленное, в том числе весь массив виджетов, перерисовывать только изменяющиеся части. В ImGui же такое невозможно, всё вычисляется и рисуется заново каждый кадр.

Это значит потребляется:
* Оперативная память
* Ресурсы процессора
* Батарея

А ещё это значит что ваша программа не может работать на слабом железе, которое не может совершать такие вычисления 60 раз в секунду. В то время как retained mode на слабом железе работает прекрасно.

Или это значит что ваша программа будет красть ресурсы у других процессов, которые тоже хотят что-то делать каждый кадр, и в целом программа будет работать медленней.

Хотя это не настолько критично на современном железе.

## Невозможность автоматически вычислить layout

Ещё одна проблема — мы не знаем что будет дальше. Это одновременно и мощь, потому что вы можете рисовать виджеты в цикле или через if, и одновременно вы не знаете какой итоговый размер будет у всего окна. Поэтому размер окна вычисляется пост-фактум.

Первый минус этого — ваше окно будет неадекватно реагировать на ресайзинг. Посмотреть на это можно [здесь (eng.)](https://github.com/emilk/egui/issues/94). Там же есть ответ от создателя библиотеки почему это адекватное поведение для ImGui.

Второй минус — вам будет сложно засунуть виджеты в таблицу или сетку, потому что для нормальной отрисовки сетки нужно изначально знать размер одной ячейки.

Вообще, egui как-то с этим справляется, но я бы не стал надеяться что это будет работать идеально.

# Нужно принять правила игры

Мы очень привыкли к интерфейсам в retained формате. И при использовании ImGui так и хочется сделать интерфейс похожий на то что ты раньше видел.

Или хочется поругаться на ImGui что он отличается.

Но я понял что всё это не нужно, нужно просто принять правила игры. Нужно принять что:
* У вас будет тратиться процессор.
* Ваши окна не смогут нормально реагировать на ресайзинг.
* Вы будете размещать все виджеты сверху-вниз справа-налево, никакого ручного плейсинга по координатам.
* Ваши окошки будут расти в высоту, а не в ширину, из-за того что вы не сможете адекватно использовать пространство сбоку.

Надо с этим просто смириться, и думать об интерфейсах в этих ограничениях. Тогда вы можете максимально эффективно использовать ImGui в своей жизни. Ведь не бывает такой простоты за бесплатно.

# Зачем он нужен

ImGui со всеми его минусами выглядит так, что он не создан для серьёзных интерфейсов по типу Photoshop, браузеров или мессенджеров. Зачем тогда он может быть нужен?

## Пет-проекты

Вы можете писать пет-проект по нескольким причинам:
* Для того чтобы научиться какой-то технологии
* По приколу

В первом случае он не подходит, а вот во втором очень даже. Обычно при написании пет-проекта хотелось бы тратить на него как можно меньше времени, чтобы получить результат как можно быстрее, ибо на него нельзя тратить 40 часов в неделю, и надо ещё как-то жить человеческую жизнь.

Вот тут можно прекрасно пойти на компромисс всех минусов ImGui и просто забить на них, делая интерфейс, который просто работает.

## Программа на несколько человек

Скажем вы работаете в какой-то компании, и у вас есть не-программисты, которым для решения каких-то внутренних процессов нужно написать программу именно с графическим интерфейсом, потому что пользоваться консольными утилитами или программированием они не умеют.

В этом случае понятно что данная программа не будет представлена наружу, она нужна для нескольких человек, и тратить на неё огромные ресурсы для разработки интерфейса в retained mode просто неразумно.

Поэтому можно позволить себе написать программу для них на ImGui силами одного-двух разработчиков.

## Редкая программа

Скажем, вы делаете свою программу для задания раскладки клавиатуры по типу [MSKLC](https://ru.wikipedia.org/wiki/Microsoft_Keyboard_Layout_Creator). Сколько в вашей программе суммарно будет сидеть каждый пользователь? Дай бог за всю свою жизнь каждый пользователь просидит в вашей программе 5 часов. Ибо он один-два раза настроит свою раскладку, и успокоится.

Учитывая такое маленькое время использования, можно пойти на очень много жертв, чтобы не тратить слишком много времени на разработку. Тут можно и сделать программу, которая жрёт батарею, выглядит не идеально, не может нормально ресайзиться и так далее.

## Прототип

Я недавно написал [программу для изучения английских слов](/learn-words-post), и только после того как я её написал и попопользовался несколько дней, я понял какие фичи прям позарез нужны. И до этих фич я бы не смог додуматься без написания программы, каким умным бы я ни был.

В нашем мире сейчас всё идёт к тому, что истина только в прототипах. Надо как можно раньше выпускать продукт на пользователей и допиливать только после обратной связи.

Это означает что на ImGui можно написать прототип серьёзной программы или какой-то фичи, опробовать её на практике, найти недостающие фичи, и только потом писать серьёзно, на миллионы пользователей, в retained mode.

# Что я сделал на ImGui

## The Tenet of Life

Самый первый проект где я познакомился с ImGui — симулятор обратимых клеточных автоматов. Здесь я просто заюзал ImGui, который шёл внутри библиотеки macroquad, для того чтобы написать текст и сделать пару кнопочек.

{{ image(path="critters.png") }}

Казалось бы такая простота, а это кардинально изменило юзабельность программы, ведь раньше все мои программы с графикой управлялись исключительно через нажатия букв на клавиатуре, которые написаны в текстовом файле `help.txt`. Например, так было в [моей программе из 2015 года](/net-creater#управление-программой).

## Portal Explorer

Я рисовал сцены с порталами через код при помощи рейтрейсинга. Чтобы подвинуть или повернуть что-то мне приходилось редактировать код и перекомпилировать проект. В один момент мне это надело и я захотел поворачивать вещи в реальном времени.

Сделал чтобы через интерфейс можно было вращать матрицы и это отображалось в реальном времени.

Это показалось слишком просто, я почувствовал силушку богатырскую, взял и напилил целый визуальный редактор на ImGui:

{{ figure_start() }}
{{ image(path="twitter_1369940146460762112.png", scale="2/3") }}
{{ figure_end(caption="[Ссылка на твит](https://twitter.com/optozorax/status/1369940146460762112)") }}

Уже через него можно было редактировать матрицы, объекты и их код в шейдерах. Это на порядок упрощало процесс создания сцен, благодаря чему я стал эффективнее. Главный прикол что я сделал его просто за пару дней и он просто работал. Это самое приятное чувство при использовании ImGui.

Более подробно об этом можно почитать в моём канале в телеграме, начиная отсюда: [@optozorax_dev/351](https://t.me/optozorax_dev/351).

А уже потом я ударился во все тяжкие, начал делать сложные интерфейсы, [inline элементы](https://t.me/optozorax_dev/398), [формулы](https://t.me/optozorax_dev/358), и интерфейс который задаёт другой интерфейс.

Вообще знаете, когда я всё это задумывал, я изначально думал: «Ну сделаю чтобы в структурках на расте можно было писать порталы, и чтобы это потом кодогенерилось. Но, блин, это такой гемор, столько всего надо сделать.», а тут я нафиг сделал не только это, но ещё и сделал ко всему этому интерфейс, я вообще даже не мечтал о таком результате, который есть сейчас.

Настолько великую силу даёт ImGui. От абсолютного нуля до realtime sophisticated визуального редактора 3D сцен за один проект.

{{ image(path="portal_explorer.png") }}

## Learn Words

Об этом проекте я написал [статью](/learn-words-post). Его особенность в том, что заодно с написанием продукта, я решил проверить гипотезу о том что с ImGui напишу программу очень быстро. И написал. Быстро. На минимально рабочий прототип ушло 6ч чистого времени, а чтобы полностью завершить проект, ушло 40ч чистого времени. И это при учёте того что программа полностью построена на графическом интерфейсе, и там есть довольно сложные элементы.

Я бы такую программу с retained mode не написал бы никогда.

{{ image(path="../learn-words-post/full.png") }}

# Схожесть с консольными утилитами

Обычно люди в качестве пет-проектов, или просто начинающие программисты пишут консольные утилиты, потому что они проще, потому что они не требуют слишком много разбираться и ломать голову.

ImGui предоставляет точно такие же преимущества. И если раньше школьники начинали с консольных приложений, потому что они проще, то сейчас они могут начинать с ImGui.

Я уверен, что если школьник сразу начнёт делать свои программы и видеть результат в ImGui, то весь процесс будет для него в 10 раз интересней, чем когда он вводит данные из файла или в консоли. Это увеличивает вовлечённость и потенциал обучения программированию.

Надеюсь образовательные программы возьмут это на вооружение и будут школьников с первых уроков обучать ImGui.

# Заключение

ImGui позволил мне впервые в жизни создать графические интерфейсы. Причём эти интерфейсы не просто делают программу чуть удобнее, чем нажимать буквы на клавиатуре, а кардинально меняют и моё взаимодействие со своим продуктом (визуальный редактор).

У этого вида интерфейсов есть свои плюсы и минусы. Нужно просто понимать когда его можно использовать, а когда нет; нужно принять все его ограничения, и тогда вы получите максимальные дивиденды.
