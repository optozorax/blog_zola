+++
title = "Свойства обратимых 1D автоматов"
date = 2021-07-28
description = "Исследую свойства одномерных клеточных автоматов, нахожу тривиальные преобразования и 4 группы автоматов."

[taxonomies]
tags = ["математика", "клеточные-автоматы", "программирование", "обратимые-автоматы"]

[extra]
image = "preview.png"
tg = "https://t.me/optozorax_dev/484"
tg_comments = 59
+++

<style>
.container { 
  display: flex; 
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 90%;
  border: 1px solid gray;
  padding: 10px;
  margin: 5px;
}
.automata-col {
  border: 1px solid rgba(39,41,43,0.1); 
  background-color: rgba(39,41,43,0.03);
  padding: 10px;
  margin: 5px;
  min-width: 110px;
  flex: 1 0 0%;
}
.pixelated {
  -ms-interpolation-mode: nearest-neighbor;
  image-rendering: crisp-edges;
  image-rendering: pixelated;
}

.skip-img {
  display: none;
}

.skip-img, .both-img, .any-img {
  width: 150px;
  margin: 2px;
  border-radius: 0px;
}
.automata-name {
  font-size: 12pt;
  font-family: monospace;
}
.svg {
}
</style>

# Введение

Предполагается что перед чтением этой статьи вы уже знакомы с тем что такое Клеточный автомат, и знакомы с правилом `110` или правилом `30`.

Если нет, то рекомендуется прочитать эти две статьи:
* [Простейшие клеточные автоматы и их практическое применение](https://habr.com/ru/post/273393/)
* [30.000$ за решение задач о Правиле 30 для клеточных автоматов — конкурс от Стивена Вольфрама](https://habr.com/ru/company/wolfram/blog/470425/)

Ещё предполагается что вы знакомы с тем что такое **обратимый** клеточный автомат. Если нет, то рекомендуется прочитать эту статью на Википедии:
* [Криттеры](https://ru.wikipedia.org/wiki/%D0%9A%D1%80%D0%B8%D1%82%D1%82%D0%B5%D1%80%D1%8B)

Так же я писал про обратимые автоматы в своём телеграм канале начиная отсюда: [optozorax_dev/235](https://t.me/optozorax_dev/235) на 7 постов.

# Таблица автоматов

В данной статье я хочу аналогично предыдущим рассмотреть одномерные обратимые клеточные автоматы и выяснить их свойства.

Обратимые клеточные автоматы можно получить множеством способов, но я выберу именно тот, которым сконструированы Криттеры, а именно — соседство Марголуса. В одномерном случае оно будет иметь размер 2 бита, поэтому количество возможных состояний будет равно 2² = 4, а количество возможных правил равно 2²! = 24.

Все эти автоматы можно посмотреть в таблице ниже. Здесь всё начинается со случайной строки из нулей и единиц, конец которой замкнут на начало. Затем к ней применяются правила данного автомата, и каждая получающаяся строка прибавляется вниз картинки. То есть на картинках время идёт вниз, а направление вправо или влево. Сверху подписан номер автомата (число от 0 до 23), а снизу подписано правило этого автомата, то есть перестановка чисел `[0, 1, 2, 3]`.


<center>
<div class="container">
<div class="automata-col trivial trivial_two time_symmetricale anti_time_symmetricale self_mirror self_inverse save_count">
<span class="automata-name"><b>0</b></span><br>
<img class="pixelated skip-img" src="img/0_skip.png">
<img class="pixelated both-img" src="img/0_both.png">
<span class="automata-name">[0 1 2 3]</span>
</div>
<div class="automata-col time_symmetricale">
<span class="automata-name"><b>1</b></span><br>
<img class="pixelated skip-img" src="img/1_skip.png">
<img class="pixelated both-img" src="img/1_both.png">
<span class="automata-name">[0 1 3 2]</span>
</div>
<div class="automata-col time_symmetricale anti_time_symmetricale self_mirror self_inverse save_count">
<span class="automata-name"><b>2</b></span><br>
<img class="pixelated skip-img" src="img/2_skip.png">
<img class="pixelated both-img" src="img/2_both.png">
<span class="automata-name">[0 2 1 3]</span>
</div>
<div class="automata-col">
<span class="automata-name"><b>3</b></span><br>
<img class="pixelated skip-img" src="img/3_skip.png">
<img class="pixelated both-img" src="img/3_both.png">
<span class="automata-name">[0 2 3 1]</span>
</div>
<div class="automata-col">
<span class="automata-name"><b>4</b></span><br>
<img class="pixelated skip-img" src="img/4_skip.png">
<img class="pixelated both-img" src="img/4_both.png">
<span class="automata-name">[0 3 1 2]</span>
</div>
<div class="automata-col time_symmetricale">
<span class="automata-name"><b>5</b></span><br>
<img class="pixelated skip-img" src="img/5_skip.png">
<img class="pixelated both-img" src="img/5_both.png">
<span class="automata-name">[0 3 2 1]</span>
</div>
<div class="automata-col time_symmetricale">
<span class="automata-name"><b>6</b></span><br>
<img class="pixelated skip-img" src="img/6_skip.png">
<img class="pixelated both-img" src="img/6_both.png">
<span class="automata-name">[1 0 2 3]</span>
</div>
<div class="automata-col trivial_two time_symmetricale anti_time_symmetricale self_inverse">
<span class="automata-name"><b>7</b></span><br>
<img class="pixelated skip-img" src="img/7_skip.png">
<img class="pixelated both-img" src="img/7_both.png">
<span class="automata-name">[1 0 3 2]</span>
</div>
<div class="automata-col">
<span class="automata-name"><b>8</b></span><br>
<img class="pixelated skip-img" src="img/8_skip.png">
<img class="pixelated both-img" src="img/8_both.png">
<span class="automata-name">[1 2 0 3]</span>
</div>
<div class="automata-col anti_time_symmetricale">
<span class="automata-name"><b>9</b></span><br>
<img class="pixelated skip-img" src="img/9_skip.png">
<img class="pixelated both-img" src="img/9_both.png">
<span class="automata-name">[1 2 3 0]</span>
</div>
<div class="automata-col self_inverse save_count">
<span class="automata-name"><b>10</b></span><br>
<img class="pixelated skip-img" src="img/10_skip.png">
<img class="pixelated both-img" src="img/10_both.png">
<span class="automata-name">[1 3 0 2]</span>
</div>
<div class="automata-col">
<span class="automata-name"><b>11</b></span><br>
<img class="pixelated skip-img" src="img/11_skip.png">
<img class="pixelated both-img" src="img/11_both.png">
<span class="automata-name">[1 3 2 0]</span>
</div>
<div class="automata-col">
<span class="automata-name"><b>12</b></span><br>
<img class="pixelated skip-img" src="img/12_skip.png">
<img class="pixelated both-img" src="img/12_both.png">
<span class="automata-name">[2 0 1 3]</span>
</div>
<div class="automata-col self_inverse save_count">
<span class="automata-name"><b>13</b></span><br>
<img class="pixelated skip-img" src="img/13_skip.png">
<img class="pixelated both-img" src="img/13_both.png">
<span class="automata-name">[2 0 3 1]</span>
</div>
<div class="automata-col time_symmetricale">
<span class="automata-name"><b>14</b></span><br>
<img class="pixelated skip-img" src="img/14_skip.png">
<img class="pixelated both-img" src="img/14_both.png">
<span class="automata-name">[2 1 0 3]</span>
</div>
<div class="automata-col">
<span class="automata-name"><b>15</b></span><br>
<img class="pixelated skip-img" src="img/15_skip.png">
<img class="pixelated both-img" src="img/15_both.png">
<span class="automata-name">[2 1 3 0]</span>
</div>
<div class="automata-col trivial_two time_symmetricale anti_time_symmetricale self_inverse">
<span class="automata-name"><b>16</b></span><br>
<img class="pixelated skip-img" src="img/16_skip.png">
<img class="pixelated both-img" src="img/16_both.png">
<span class="automata-name">[2 3 0 1]</span>
</div>
<div class="automata-col anti_time_symmetricale">
<span class="automata-name"><b>17</b></span><br>
<img class="pixelated skip-img" src="img/17_skip.png">
<img class="pixelated both-img" src="img/17_both.png">
<span class="automata-name">[2 3 1 0]</span>
</div>
<div class="automata-col anti_time_symmetricale">
<span class="automata-name"><b>18</b></span><br>
<img class="pixelated skip-img" src="img/18_skip.png">
<img class="pixelated both-img" src="img/18_both.png">
<span class="automata-name">[3 0 1 2]</span>
</div>
<div class="automata-col">
<span class="automata-name"><b>19</b></span><br>
<img class="pixelated skip-img" src="img/19_skip.png">
<img class="pixelated both-img" src="img/19_both.png">
<span class="automata-name">[3 0 2 1]</span>
</div>
<div class="automata-col">
<span class="automata-name"><b>20</b></span><br>
<img class="pixelated skip-img" src="img/20_skip.png">
<img class="pixelated both-img" src="img/20_both.png">
<span class="automata-name">[3 1 0 2]</span>
</div>
<div class="automata-col time_symmetricale anti_time_symmetricale self_mirror self_inverse save_count">
<span class="automata-name"><b>21</b></span><br>
<img class="pixelated skip-img" src="img/21_skip.png">
<img class="pixelated both-img" src="img/21_both.png">
<span class="automata-name">[3 1 2 0]</span>
</div>
<div class="automata-col anti_time_symmetricale">
<span class="automata-name"><b>22</b></span><br>
<img class="pixelated skip-img" src="img/22_skip.png">
<img class="pixelated both-img" src="img/22_both.png">
<span class="automata-name">[3 2 0 1]</span>
</div>
<div class="automata-col trivial trivial_two time_symmetricale anti_time_symmetricale self_mirror self_inverse save_count">
<span class="automata-name"><b>23</b></span><br>
<img class="pixelated skip-img" src="img/23_skip.png">
<img class="pixelated both-img" src="img/23_both.png">
<span class="automata-name">[3 2 1 0]</span>
</div>
</div>
</center>

Так как соседство Марголуса требует на чётных шагах применять правила, начиная с чётных ячеек, а на нечётных шагах применять правила для нечётных ячеек, я добавил возможность включать и выключать показ нечётных шагов. Некоторые автоматы ведут себя одинаково для чётных шагов, например `0` ~ `23`, `2` ~ `10` ~ `13` ~ `21`. Это можно настраивать здесь:<br>

<label><input type="checkbox" id="img_intermediate" name="img_intermediate" checked>&nbsp;Показывать нечётные шаги</label>

# Различные свойства

Ещё в данной таблице можно показать различные свойства автоматов. Можете выбирать конкретное свойство и пролистать вверх, автоматы обладающие им, подсветятся красным цветом.

<form name="properties_radio">
<label><input type="radio" name="prop" value="all" checked > Убрать свойства</label><br>
<label><input type="radio" name="prop" value="trivial" /> Сохраняют текущее состояние</label><br>
<label><input type="radio" name="prop" value="trivial_two" /> Сохраняют через два состояния</label><br>
<label><input type="radio" name="prop" value="self_mirror" /> Зеркалирование правил приводит к самому себе</label><br>
<label><input type="radio" name="prop" value="save_count" /> Сохраняют количество закрашенных клеток</label><br>
<label><input type="radio" name="prop" value="time_symmetricale" /> Одинаковые законы для симуляции назад и вперёд во времени</label><br>
<label><input type="radio" name="prop" value="anti_time_symmetricale" /> Правило для симуляции назад во времени равно текущему с инвертированными цветами</label><br>
<label><input type="radio" name="prop" value="self_inverse" /> Инвертирование цвета правил приводит к самому себе</label><br>
</form>

Все свойства вычисляются для автоматов через 2 шага, то есть после чётного и нечётного хода. Мне кажется оценивать свойства автомата после 1 шага, не зная какой был до этого: чётный или нечётный не очень полезно, потому что вариантов становится слишком много, и свойств практически не остаётся. Некоторые свойства я объясню далее:

Самые скучные автоматы - **сохраняющие текущее состояние**. Это автоматы `0` и `23`. Они не делают ничего.

Чуть менее скучные автоматы — **сохраняющие через два состояния**. Относительно данного шага, их шаг в прошлое и шаг в будущее должны быть одинаковы. В итоге это выливается в то, что они приходят к изначальному состоянию максимум через 4 шага. Тут добавляется ещё два автомата: `7` и `16`.

Ещё чуть менее-скучные автоматы — **при зеркалировании приводящие сами в себя**. То есть они не способны различать где лево, а где право. Тут к тривиальным `0` и `23` добавляются `2 и 21`.

**Одинаковые законы для симуляции назад и вперёд во времени** — мне кажется это свойство аналогично [T-симметрии](https://ru.wikipedia.org/wiki/T-%D1%81%D0%B8%D0%BC%D0%BC%D0%B5%D1%82%D1%80%D0%B8%D1%8F), хотя я не знаю насколько справедливо проводить такие аналогии. К ним относится треугольный `1` и порождаемые им (далее мы увидим это).

**Правило для симуляции назад во времени равно текущему с инвертированными цветами** — то же самое, что и предыдущее, только инвертированное. Это свойство интересно, ведь Криттеры именно такими и являются. То есть если в криттерах инвертировать всё поле, то там будут возникать глайдеры, состоящие не из заполненных клеток, а из пустых клеток, и эти глайдеры будут двигаться назад во времени, а не вперёд.

**Инвертирование цвета правил приводит к самому себе** — тут интересны автоматы `10` и `13`, потому что другими особыми свойствами они не обладают.

Давайте соберём список нетривиальных автоматов, которые обладают своим уникальным свойством:
* `{1, 5, 6, 14}` не различают направление времени.
* `{9, 17, 18, 22}` двигаются назад во времени для инвертированных цветов.
* `{2, 21}` не различают лево и право.
* `{10, 13}` не различают белый и чёрный.

# Красивые автоматы

* `1` похож на правило `30` для обычных автоматов, тоже формирует треугольники, только повёрнутые на 90°.
* `2` похож на узор для рубашки.
* `21` похож на [правило Tron](https://en.wikipedia.org/wiki/Block_cellular_automaton#Tron).

<center>
<div class="container">
<div class="automata-col">
<span class="automata-name"><b>1</b></span><br>
<img class="pixelated any-img" src="img/1_both.png">
</div>
<div class="automata-col">
<span class="automata-name"><b>2</b></span><br>
<img class="pixelated any-img" src="img/2_both.png">
</div>
<div class="automata-col">
<span class="automata-name"><b>21</b></span><br>
<img class="pixelated any-img" src="img/21_both.png">
</div>
</div>
</center>

# Порождение правил

Если вернуться в начало и посмотреть на все автоматы, то можно заметить, что для автомата `1`, `5` является его зеркальным отражением, `6` его инверсией, а `14` одновременно инверсией и зеркальным отражением.

<center>
<div class="container">
<div class="automata-col">
<span class="automata-name"><b>1</b></span><br>
<img class="pixelated any-img" src="img/1_both.png">
</div>
<div class="automata-col">
<span class="automata-name"><b>5</b></span><br>
<img class="pixelated any-img" src="img/5_both.png">
</div>
<div class="automata-col">
<span class="automata-name"><b>6</b></span><br>
<img class="pixelated any-img" src="img/6_both.png">
</div>
<div class="automata-col">
<span class="automata-name"><b>14</b></span><br>
<img class="pixelated any-img" src="img/14_both.png">
</div>
</div>
</center>

Поэтому можно задаться вопросом: а какие автоматы можно вывести из каких при помощи различных операций над правилами?

## Тривиальные порождения

Возьмём преобразования правил, для которых мы можем точно сказать: да, это одно и то же правило, только немного-по другому.
* Поменять местами лево и право. Будет обозначаться <span style="color: green; font-weight: bold;">Зелёным цветом</span>.
* Инвертировать белый на чёрный. Будет обозначаться <span style="color: red; font-weight: bold;">Красным цветом</span>.
* Инвертировать правила на симуляцию назад во времени. Будет обозначаться <span style="font-weight: bold;">Чёрным цветом</span>.

Тогда все правила будут иметь такие связи:

<div class="container">
<img class="svg" src="svg/3.svg">
<img class="svg" src="svg/4.svg">
<img class="svg" src="svg/5.svg">
<img class="svg" src="svg/6.svg">
<img class="svg" src="svg/7.svg">
<img class="svg" src="svg/8.svg">
</div>

Тут что-то не так. Почему-то `0` и `23` никак не связаны, как не связаны `2` и `21`, а ведь они одинаковы если пропустить нечётные шаги:

<center>
<div class="container">
<div class="automata-col">
<span class="automata-name"><b>0</b></span><br>
<img class="pixelated any-img" src="img/0_skip.png">
</div>
<div class="automata-col">
<span class="automata-name"><b>23</b></span><br>
<img class="pixelated any-img" src="img/23_skip.png">
</div>
<div class="automata-col">
<span class="automata-name"><b>2</b></span><br>
<img class="pixelated any-img" src="img/21_skip.png">
</div>
<div class="automata-col">
<span class="automata-name"><b>21</b></span><br>
<img class="pixelated any-img" src="img/21_skip.png">
</div>
</div>
</center>

Зато автоматы `1`, `5`, `6`, `14` связаны между собой, и это радует:

Значит нам нужно придумать ещё какое-то правило для порождения нового правила, чтобы другие можно было связать.

## Полуинверсия

Давайте добавим правило, которое реализуется полу-инверсией. Если правило можно представить в следующем виде: `[00, 01, 10, 11] → [11, 01, 0, 10]`, то обычная инверсия инвертирует биты с двух сторон, а полу-инверсия только с правой стороны. Будем обозначать её <span style="color: purple; font-weight: bold;">Фиолетовым цветом</span>. Тогда наши графы будут выглядеть следующим образом:

<div class="container">
<img class="svg" src="svg/9.svg">
<img class="svg" src="svg/10.svg">
<img class="svg" src="svg/11.svg">
<img class="svg" src="svg/12.svg">
</div>

Тут интересная особенность. Кластер правил, порождённых от `1`, связался с кластером правил, порождённых от `22`. Ну и они довольно похожи:

<center>
<div class="container">
<div class="automata-col">
<span class="automata-name"><b>1</b></span><br>
<img class="pixelated any-img" src="img/1_both.png">
</div>
<div class="automata-col">
<span class="automata-name"><b>22</b></span><br>
<img class="pixelated any-img" src="img/22_both.png">
</div>
</div>
</center>

А кластер правил, порождённых от `3`, связался с кластером от `20`. Они выглядят похожим образом при пропуске нечётных шагов:

<center>
<div class="container">
<div class="automata-col">
<span class="automata-name"><b>3</b></span><br>
<img class="pixelated any-img" src="img/3_skip.png">
</div>
<div class="automata-col">
<span class="automata-name"><b>20</b></span><br>
<img class="pixelated any-img" src="img/20_skip.png">
</div>
</div>
</center>

Если посмотреть на то как новая операция связывает правила, то можно сказать что она просто делает `23-x`. То есть с этой операцией мы можем получить любое правило с `12` включительно, если нам известны все правила до 11. Это хорошо, потому что можно выкинуть половину правил и знать что она будет симметрична первой половине относительно полу-инверсии.

Но у нас всё ещё не связаны правила `2` и `10`, которые просто идентичны без нечётных шагов:

<center>
<div class="container">
<div class="automata-col">
<span class="automata-name"><b>2</b></span><br>
<img class="pixelated any-img" src="img/2_skip.png">
</div>
<div class="automata-col">
<span class="automata-name"><b>10</b></span><br>
<img class="pixelated any-img" src="img/10_skip.png">
</div>
</div>
</center>

## Странная операция

Я не смог найти комбинацию из обращения времени, отзеркаливания, инверсии, их половинок и всех их комбинаций, чтобы связать `2` и `10` правило. Единственное что я нашёл, это операцию: поменять местами 0 и 1 элемент, и поменять местами 2 и 3 элемент в массиве правила (обозначается квадратными скобками в таблице). Назовём это **странной операцией**, и будем обозначать <span style="color: cyan; font-weight: bold;">Циановым цветом</span>

Тогда у нас получается следующий набор графов:

<div class="container">
<img class="svg" src="svg/13.svg">
<img class="svg" src="svg/14.svg">
<img class="svg" src="svg/15.svg">
<img class="svg" src="svg/16.svg">
</div>

Ура! Теперь у нас связаны тривиальные автоматы `{0, 7, 16, 23}` и чуть более сложные, но тоже очень простые `{2, 10, 13, 21}`. А что касается остальных автоматов, с ними не произошло ничего особенного. Что уже было связано прежними операциями, так и осталось связано ими.

Итого у нас получается 4 группы автоматов, которые можно получить довольно простыми операциями, которые не очень сильно меняют поведение автомата. Можно сказать что если мы изучим свойства автомата `1`, то по идее можем эктраполировать его свойства с учётом полу-инверсии на `22` автомат.

Правда мне эта **странная операция** не нравится совсем. Ведь я не понимаю что будет если её обобщить на:
* Автоматы с большим размером блока (от 3 и больше)
* Автоматы с большим числом цветов (от 3 и больше)
* Автоматы с большей размерностью (от 2 и больше)

Поэтому если у вас есть идеи что с этим можно сделать — пишите.

# 2D время

Следующее исследование свойств вдохновлено статьёй о том как создать 2D время для необратимых клеточных автоматов:
* [CELLULAR AUTOMATA WITH 2 TEMPORAL DIMENSIONS](http://dmishin.blogspot.com/2014/06/cellular-automata-with-2-temporal.html)

Там автор предлагает идею 2D времени, которая требует иметь две функции \\(f, g\\), которые дают одинаковый результат независимо от порядка их применения \\(f(g(x)) = g(f(x))\\). Поэтому можно проверить все автоматы и узнать кто с кем коммутирует. Прежде всего надо сказать что автоматы `{0, 23, 7, 16}` коммутируют со всеми, а они совсем тривиальны и не интересны, поэтому я исключил их из графа. И у меня получился следующим результат:

<div class="container">
<img class="svg" src="svg/commute0.svg">
<img class="svg" src="svg/commute1.svg">
<img class="svg" src="svg/commute2.svg">
</div>

Тут задействованы правила только из групп, порождённых `2` и `3`, но нет автоматов, порождённых от треугольной `1`, что довольно печально.

Получается примерно тот же результат, как и в той статье, что между собой коммутируют только довольно скучные автоматы, не считая тривиальных.

То что можно рисовать графы между правилами было вдохновлено этой статьёй:
* [GRAPH OF COMMUTING ELEMENTARY CELLULAR AUTOMATA](http://dmishin.blogspot.com/2016/01/graph-of-commuting-elementary-cellular.html)

Для вычисления того коммутируют два правила или нет, я просто беру очень длинную строку на 10к бит, и проверяю формулу `f(g(x)) = g(f(x))` на ней одной. Так что мои результаты не идеальны, но вероятность ошибки крайне мала.

# Исходники

Исходники для вычисления картинок, свойств и графов для этой статьи находятся в репозитории: [optozorax/time_2d_inversible_automata](https://github.com/optozorax/time_2d_inversible_automata).

# Дальнейшая работа

Мне кажется должны найтись очень интересные правила для:
* Обратимых одномерных автоматов с **3** цветами и размером блока **2**
* Обратимых одномерных автоматов с **2** цветами и размером блока **3**

В первом случае получается 3²! = 362_880, а во втором 2³! = 40_320 автоматов, что тоже очень много...

Тут придётся уже писать софт, чтобы в графах искать компоненты связности. И больше раскидывать мозгами. Но думаю что количество групп, из которых можно вывести всё остальное, должно быть не таким большим. А далее уже можно исследовать группы на коммутативность. Может среди этих вариантов найдутся интересные правила, для которых можно образовать двумерное время.

<script>
function highlight(name) {
  let elements = document.getElementsByClassName(name);
  for (var i = elements.length - 1; i >= 0; i--) {
    elements[i].style["background-color"] = 'rgba(255,41,43,0.20)';
  }
}
function leave(name) {
  let elements = document.getElementsByClassName(name);
  for (var i = elements.length - 1; i >= 0; i--) {
    elements[i].style["background-color"] = "rgba(39,41,43,0.03)";
  }
}
function show(skip_img, both_img) {
  let elements = document.getElementsByClassName("skip-img");
  for (var i = elements.length - 1; i >= 0; i--) {
    elements[i].style.display = skip_img;
  }

  elements = document.getElementsByClassName("both-img");
  for (var i = elements.length - 1; i >= 0; i--) {
    elements[i].style.display = both_img;
  }
}

show("none", "block");

let rad = document.properties_radio.prop;
let prev = { value: 'all' };
for (var i = 0; i < rad.length; i++) {
    rad[i].addEventListener('change', function() {
        if (this !== prev) {
            leave(prev.value);
            highlight(this.value);
        }
        prev = this;
    });
}

document.getElementById('img_intermediate').addEventListener('change', function() {
    if (this.checked) {
      show("none", "block");
    } else {
      show("block", "none");
    }
});
</script>
