+++
title = "Папки «Спам» быть не должно"
date = 2021-02-09
description = "Это невероятно ужасное решение, и я предлагаю более разумное."
aliases = ["spam"]

[taxonomies]
tags = ["рассуждения", "идеи", "интерфейс"]

[extra]
image = "spam.jpg"
tg = "https://t.me/optozorax_dev/309"
tg_comments = 45
+++

При регистрации на каком-то сайте очень часто используется электронная почта в качестве способа активации. И практически на любом сайте после отправки письма пишут: «Проверьте папку "Спам", письмо может случайно попасть туда». В этом главная проблема. Данную папку нам навязывает любой почтовый сервис, письма складываются туда по каким-то магическим алгоритмам, главное свойство которых в том, что они ошибаются.

Из-за того алгоритмы определения спама всегда ошибаются и работают чёрт знает как, у нас развивается паранойя, из-за которой мы постоянно смотрим в эту папку, тратя драгоценные секунды. А если мы её не проверяем, можем иногда потерять важную почту.

Я считаю что папка «Спам» должна отсутствовать по умолчанию. Всё должно делаться на основе фильтров, и для фильтров должны быть жирные кнопки и более удобный и доступный интерфейс.

За всё время пользования почтой я понял самую главную вещь: если какая-то почта начала спамить вам один раз, и от этого нельзя отписаться, значит она вам будет спамить всегда. И аналогично, если какая-то почта присылает важные письма, значит она никогда не пришёт спам, а если и пришлёт, то там будет кнопочка «Отписаться». Этим свойством и будем пользоваться далее.

Вот, например, пришло вам письмо во входящие, а вы видите что это спам. Как с ним бороться, если такой папки нет? Для этого придумана концепция фильтров. Можно вручную поставить фильтр на автоматическое удаление подобных писем. В обычных почтовых сервисах для этого надо заходить в настройки и разбираться в том как работают фильтры, и смотреть на кучу полей, поэтому так никто не делает, и всем лень. Поэтому нужно упрощать интерфейс, например вместо кнопки «Пометить как спам» можно поставить кнопку для самого частого кейса создания фильтра: «Удалять все письма от этой почты». Ну и конечно, после нажатия этой кнопки все письма от данной почты тоже должны автоматически удалиться, потому что никто не полезет в настройки чтобы сделать это вручную, и потому что вспоминаем свойство. Отлично, теперь 90% кейсов использования папки «Спам» уничтожено.

Другой кейс спама — это когда человеку каждый день пишут самые разные почтовые ящики, и он просто физически не сможет фильтровать их все самостоятельно. Мне кажется только в таком случае должна быть кнопка «А давайте вы мне дадите папку спам, и заюзаете ваши магические алгоритмы». Хотя даже для этого случая я бы не стал доверять алгоритмам, и сделал по-другому. В данном случае можно создать концепцию «Доверенных почт/доменов почт». При данной концепции должны быть две папки входящих: неизвестные и известные. Все письма от неизвестных почтовых ящиков должны складываться в соответствующую папку, аналогично известные. Должен быть список всех известных почт, который можно настроить и посмотреть в настройках. И снова, при встрече соответствующего письма, в настройки никто лезть не будет, поэтому чтобы сделать какую-то почту доверенной, в каждом письме просто должна быть кнопка «Сделать доверенной почту, отправившую это письмо», аналогично наоборот. И сразу после этого все письма от этой почты должны переместиться из папки неизвестных в папку известных, потому что свойство. Таким образом, человеку могут писать хоть тысячи разных спамовых почт ежедневно, но он никогда не пропустит важную почту, и никакие папки «Спам» не нужны.

Вот и всё, теперь мы не только избавились от идиотской концепции папки со спамом, но ещё и создали в сотню раз более мощный, удобный и полезный интерфейс, который усиливает своего пользователя, а не ослабляет.

---

Жаль, что в Gmail отключить эту папку невозможно. 

Недавно, кстати, у меня письмо для активации Твиттера улетело в спам, а я думал почему так долго не приходит письмо :).