+++
title = "Идея как научить GPT-4 мыслить на примере задач по программированию"
date = 2023-05-12T00:00:02+00:00
description = "Предлагаю как можно улучшить GPT-4, чтобы она смогла мыслить и итеративно улучшаться в области решения олимпиадных задач по программированию."

[taxonomies]
tags = ["идеи", "нейронные-сети", "программирование", "рассуждения"]

[extra]
image = "preview.png"
use_katex = true
+++

# О чём эта статья

Я взял одну задачу по олимпиадному программированию, и решил рассмотреть до каких ключевых идей додумывается GPT-4 в решении этой задачи, какие подсказки могут направить её на верное решение, какие техники (как например few-shot learning) помогают прийти к верному решению этой задачи. На основе всего этого анализирую интеллект GPT-4 и как его можно улучшить. Затем предлагаю систему по решению олимпиадных задач по программированию на основе специально обученной LLM. Даю идеи как можно использовать огромный набор задач CodeForces и подобных сайтов, чтобы собрать качественные данные для обучения и итеративно улучшать эту систему в автоматическом режиме.

Учтите, что эта статья не более чем идея с небольшим анализом, поэтому она не даст вам что-то рабочее из коробки, но даст интересное направление мысли. Рассматривайте её пожалуйста именно в таком ключе.

# Введение

Все вы видели эти замечательные примеры, когда ChatGPT дают задачу из Leetcode, и она сходу пишет решение, которое работает. Она даже способна решить какие-то medium или hard задачи после 2021 года, которые не могли быть в обучающей выборке. Это впечатляет, но я хочу показать что у подобных систем есть куда больший потенциал, чем просто паттерн "напиши код для решения этой задачи".

# Задача

Я взял следующую задачу: [ITMO Academy: пилотный курс » Z-функция » Шаг 4 » Практика » H. Сумма длин различных подстрок](https://codeforces.com/edu/course/2/lesson/3/4/practice/contest/272262/problem/H)

> _Решите эту задачу с использованием z-функции строки. Существует много способов решить её, но в качестве упражнения на использование z-функции попробуйте придумать и реализовать именно такое решение._
> 
> Задана строка s. Выведите суммарную длину всевозможных различных подстрок этой строки.
> 
> **Входные данные:** единственная строка входных данных содержит s — последовательность прописных и строчных латинских букв. Длина s не превышает 8000 символов.
> 
> **Выходные данные:** выведите единственное целое число — суммарную длину всех различных подстрок.
>
> **Примеры:** "BOBR" - 19, "ABACABA" - 73.

{{ details_start(summary="Что такое Z-функция") }}

Это функция, которая принимает строку, а возвращает массив чисел такой же длины как и эта строка. Этот массив описывает сколько символов текущего суффикса совпадает с началом строки. Данный массив можно хитро посчитать за O(n). Z-функцию можно использовать для поиска подстроки в строке за O(n) и в множестве других задач на строки.

Пример: строка `ABACABA`, её Z-функция равна `[0, 0, 1, 0, 3, 0, 1]`, потому что:
```
* 0 - первый элемент всегда равен          0 по определению
* 0 - строка BACABA совпадает с ABACABA на 0 начальных символов
* 1 - строка  ACABA совпадает с ABACABA на 1 начальных символов
* 0 - строка   CABA совпадает с ABACABA на 0 начальных символов
* 3 - строка    ABA совпадает с ABACABA на 3 начальных символов
* 0 - строка     BA совпадает с ABACABA на 0 начальных символов
* 1 - строка      A совпадает с ABACABA на 1 начальных символов
```

Предположим мы хотим найти строку `ab` в строке `abacaba`, тогда мы можем их сконкатенировать через уникальный символ: `ab$abacaba`, далее посчитаем z-функцию:
```
a b $ a b a c a b a
0 0 0 2 0 1 0 2 0 1
```

Места где встречается 2 (длина искомой строки) - и есть места где строка `ab` является подстрокой `abacaba`.

{{ details_end() }}

Взял эту задачу, потому что:
* Скорее всего её или похожей на неё нет в обучающей выборке, потому что она скрыта за дверьми регистрации.
* На Z-фунцкию мало информации в интернете, так что мы можем потестить не выученные паттерны мышления людей из интернета, а способности мышления нейросети, которые присущи именно ей.
* Она относительно простая и относительно сложная, идеальный вариант для того чтобы тестировать машинный интеллект.
* Я её когда-то решил (кстати не самым оптимальным методом).

{{ details_start(summary="Суть решения") }}

Все подстроки данной строки могут начинаться с какого-то места, давайте рассмотрим одно такое место:
```
abacababa
    a
    ab
    aba
    abab
    ababa
```

Давайте рассчитаем Z-функцию этого суффикса, с которого начинаются все эти строки:

```
a b a b a
0 0 3 0 1
```

Здесь 3 означает, что строка aba совпадает с началом данной строки, так же как и все её подстроки: `a`, `ab`, `aba`.

Поэтому если мы ищем уникальные строки, то мы можем зачеркнуть те, что встретятся дальше используя значение Z-функции:
```
abacababa
    a - - (посчитано дважды)
    ab -
    aba -
    abab
    ababa
```

Тогда в данном суффиксе у нас есть только 2 уникальные строки: `abab`, `ababa`, и мы можем посчитать сумму их длин. А строки `a`, `ab`, `aba` будут учтены при рассмотрении дальнейших суффиксов.

Можно заметить что в Z-функции нам требуется только максимум, а посчитать сумму длин можно по формуле арифметической прогрессии, взяв сумму длин суффикса, и вычтя сумму длин повторяющихся строк в начале.

{{ details_end() }}

Ключевые моменты:
* Перебираем каждый суффикс и считаем для него Z-функцию.
* Находим максимальное значение Z-функции (за исключением нулевого элемента).
* Если M - длина текущего суффикса, то добавляем к ответу значение `M(M+1)/2 - Z_max*(Z_max+1)/2` (я называю это кратко "формула").

Это три ключевых момента, до которых надо додуматься, чтобы решить задачу правильно, в моём анализе нейросеть спотыкалась на каждом пункте, и мне приходилось извиваться, чтобы заставить её использовать каждый следующий элемент в своём решении.

Данное решение требует O(n^2) времени и O(n) памяти.

# Решение задачи

В диалоге с нейросетью мои промты лучше прочитать, а ответы от ChatGPT можно смотреть по диагонали, самое важное я <span class="red-bg example">выделил красным</span>.


## ChatGPT, решение сходу

Вот возьмём и прям сходу спросим ChatGPT как решить эту задачу, без ограничения на Z-функцию:

{{ details_start(summary="Диалог") }}

**<center>USER</center>**

You have this competitive programming task: 

> Given string S, calculate sum of lengths of unique substrings of that string.

How it can be solved in most efficient way? Write solution in C++.

---

**<center>ChatGPT</center>**

One efficient solution to this problem is <span class="red-bg example">to use a data structure called a trie</span>. A trie is a tree-like data structure that is commonly used for efficiently storing and searching for strings. We can construct a trie for the given string S, and then traverse the trie to count the total length of all unique substrings.

Here is the C++ code to solve this problem using a trie:

```c++
#include <bits/stdc++.h>
using namespace std;

const int MAXN = 1e6 + 5;

struct TrieNode {
    int child[26];
    bool is_end;
    TrieNode() {
        memset(child, -1, sizeof(child));
        is_end = false;
    }
};

TrieNode trie[MAXN];
int node_cnt = 1;

void insert(string& s) {
    int node = 0;
    for (char c : s) {
        int ch = c - 'a';
        if (trie[node].child[ch] == -1) {
            trie[node].child[ch] = node_cnt++;
        }
        node = trie[node].child[ch];
    }
    trie[node].is_end = true;
}

int dfs(int node, int depth) {
    int len = 0;
    for (int i = 0; i < 26; i++) {
        int child = trie[node].child[i];
        if (child != -1) {
            len += dfs(child, depth + 1);
        }
    }
    if (trie[node].is_end) {
        len += depth;
    }
    return len;
}

int main() {
    string s;
    cin >> s;
    int n = s.size();
    for (int i = 0; i < n; i++) {
        string sub = "";
        for (int j = i; j < n; j++) {
            sub += s[j];
            insert(sub);
        }
    }
    int ans = dfs(0, 0);
    cout << ans << endl;
    return 0;
}
```

In this solution, we first define a struct `TrieNode` to represent the nodes in the trie. Each node has an array `child` of size 26 (one for each possible lowercase letter) to store its children, and a boolean `is_end` to indicate whether the node represents the end of a word.

We then define a function `insert` to insert a string into the trie. Starting from the root node (which has index 0), we traverse the trie by following the appropriate child for each character in the string. If a child node does not exist for a particular character, we create a new node and assign it a new index `node_cnt++`. Finally, we set the `is_end` flag of the last node in the string to true.

After constructing the trie, we define a function `dfs` to recursively traverse the trie and count the total length of all unique substrings. We start from the root node and iterate over all its children. For each child node, we recursively call `dfs` with a depth incremented by 1, and add the returned value to `len`. If the current node represents the end of a word (i.e., `is_end` is true), we also add the current depth to `len`. Finally, we return `len`.

In the `main` function, we read in the input string `s`, and for each possible substring of `s`, we call the `insert` function to insert it into the trie. We then call `dfs` with the root node and depth 0, and output the returned value as the answer.

This solution has a time complexity of O(n^2), where n is the length of[MAX TOKENS REACHED]


---

**<center>USER</center>**

Can you please using dynamic allocation to create a trie, and allow every possible char symbol instead of 26 small latin letters, and use long long to store result instead of int.

---

**<center>ChatGPT</center>**

Sure! Here's the modified code that uses dynamic allocation to create the trie, supports all possible characters, and uses a `long long` to store the result:

```c++
#include <bits/stdc++.h>
using namespace std;

const int MAXN = 1e6 + 5;
const int MAXCHAR = 256;

struct TrieNode {
    int* child;
    bool is_end;
    TrieNode() {
        child = new int[MAXCHAR];
        memset(child, -1, sizeof(int) * MAXCHAR);
        is_end = false;
    }
    ~TrieNode() {
        delete[] child;
    }
};

TrieNode* trie[MAXN];
int node_cnt = 1;

void insert(string& s) {
    int node = 0;
    for (char c : s) {
        int ch = (int)c;
        if (trie[node]->child[ch] == -1) {
            trie[node]->child[ch] = node_cnt++;
            trie[node_cnt - 1] = new TrieNode();
        }
        node = trie[node]->child[ch];
    }
    trie[node]->is_end = true;
}

long long dfs(int node, int depth) {
    long long len = 0;
    for (int i = 0; i < MAXCHAR; i++) {
        int child = trie[node]->child[i];
        if (child != -1) {
            len += dfs(child, depth + 1);
        }
    }
    if (trie[node]->is_end) {
        len += (long long)depth;
    }
    return len;
}

int main() {
    string s;
    cin >> s;
    int n = s.size();
    trie[0] = new TrieNode();
    for (int i = 0; i < n; i++) {
        string sub = "";
        for (int j = i; j < n; j++) {
            sub += s[j];
            insert(sub);
        }
    }
    long long ans = dfs(0, 0);
    cout << ans << endl;
    for (int i = 0; i < node_cnt; i++) {
        delete trie[i];
    }
    return 0;
}
```

In this modified solution, we define a struct `TrieNode` as before, but now the `child` array is dynamically allocated using the `new` operator, and its size is set to `MAXCHAR`. We also add a destructor to the `TrieNode` class to properly deallocate the `child` array using the `delete[]` operator.

In the `insert` function, we use `(int)c` to convert the character `c` to an integer before indexing into the `child` array, since we now support all possible characters.

In the `dfs` function, we use a `long long` variable to store the total length of all unique substrings, since the sum can potentially exceed the range of an `int`. We also cast the `depth` variable to a `long long` when adding it to `len`, to avoid integer overflow.

In the `main` function, we initialize the root node of the trie using the `new` operator, and set its index to 0. After constructing the trie, we call the `dfs` function with the root node and depth 0, and output the returned value as the answer. Finally, we properly deallocate all dynamically allocated memory using the `delete` operator.

This solution has a time complexity of O(n^2), where n is the length of the input string `s`. The space complexity is also O(n^2), since there can be up to n^2 nodes in the trie[MAX TOKENS REACHED]

{{ details_end() }}

(Ну это не совсем сходу, мне пришлось несколько раз перегенирировать ответ, и менять промт, но на самом деле это решение нейронка выдаёт часто, поскольку я часто встречал что она хочет использовать именно его, и она говорит про него с разных углов.)

ChatGPT сходу пишет решение на основе суффиксного дерева (trie), и оно кстати правильно работает, но требует некоторых доработок, которые я пишу в следующем промте. Правда это решение плохо тем, что оно не проходит по памяти, поскольку требует её O(n^2). Даже если заморочиться, 8000 символов в квадрате в 512МБ всё-равно не влезет.

{{ image(path="cf.png") }}

Вероятно это решение было в обучающей выборке, уж слишком легко она его выдала.

Прямо тут мы можем видеть типичный паттерн того как LLM'ки решают задачи по программированию: они сходу пишут код, ни размышлений, ни анализа. Каким образом внутри в умножении матриц могло родиться это решение? Я без понятия, и не верю, что можно найти такую функцию и её аппроксимировать достаточно хорошо. Я считаю что так делать неправильно, в решении задачи сначала должны идти рассуждения в виде текста, а после рассуждений написанный код, так получится намного больше качественных решений.

Кстати, магический промт "think step by step" тоже не особо помогает.

## ChatGPT, через Z-функцию

Теперь попросим её решить данную задачу используя Z-функцию:

{{ details_start(summary="Диалог") }}

**<center>USER</center>**

You have that competitive programming task:

> Given string S, calculate sum of lengths of unique substrings of that string.

How would you solve it using Z-function in most efficient way? Think step-by-step.

---

**<center>ChatGPT</center>**

To solve this problem efficiently using the Z-function, we can follow the steps given below:

1. First, we create an array `z` of the same length as the input string `S`. The `z` array will hold the Z-values for each position in the string.

2. For each position `i` in the input string `S`, we compute the Z-value for the substring starting at that position. To do this, we compare the prefix of `S` starting at position `i` with the entire string `S` and count the number of characters that match. We stop when we encounter a non-matching character or reach the end of the string.

3. <span class="red-bg example">We sum up the Z-values for all positions</span> in the `z` array, except for the first position, which corresponds to the entire input string `S`.

4. The sum obtained in the previous step is the desired result.

Here's the Python code to implement this approach:

```python
def z_function(s):
    n = len(s)
    z = [0] * n
    l, r = 0, 0
    for i in range(1, n):
        if i <= r:
            z[i] = min(r - i + 1, z[i - l])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] - 1 > r:
            l, r = i, i + z[i] - 1
    return z

def unique_substring_lengths(s):
    z = z_function(s)
    return sum(z[1:]) + len(s)
```

In this implementation, the `z_function` function computes the Z-values for the input string `s`, and the `unique_substring_lengths` function computes the sum of lengths of unique substrings of `s`. The `z` array is used to keep track of the Z-values for each position in `s`. The sum of the Z-values for all positions in `z`, except for the first position, is the sum of lengths of all unique substrings of `s`. Adding the length of `s` itself gives us the total sum of lengths of all substrings of `s`.

{{ details_end() }}

Она выдаёт решение, которое:
* Не перебирает каждый суффикс.
* Считает сумму, ничего не думает про максимум.
* И конечно же, нет никакой "формулы".

Проблема в том, что нейронка не может сказать "я не знаю". Я даже не представляю как с технической точки зрения вообще возможно понимать что она знает, а что нет. Это дело даже не в обучении. По хорошему ей бы всегда говорить что она не знает как именно решить с использованием какого-то подхода, и анализировать каждую проблему с нуля, а не вот так вот сходу выдавать решение.

## GPT-4, через Z-функцию

Теперь попробуем более совершенную GPT-4:

{{ details_start(summary="Диалог") }}

**<center>USER</center>**

You have that competitive programming task:

> Given string S, calculate sum of lengths of unique substrings of that string.

How would you solve it using Z-function in most efficient way? Think step-by-step.

---

**<center>GPT-4</center>**

Using the Z-function is a great choice for this problem. Here's a step-by-step guide on how to solve this competitive programming task most efficiently with the Z-function:

1. Understand the problem:
   Given a string S, we need to calculate the sum of lengths of unique substrings of that string.

2. Prepare the Z-function:
   The Z-function for a string S is an array of length n, where Z[i] is the length of the longest common prefix between S and the suffix of S starting at position i. The Z-function can be calculated in O(n) time complexity using Z-algorithm.

3. Initialize variables:
   Create a variable to store the sum of lengths of unique substrings, let's call it `sum_lengths`.

4. Iterate through the string S:
   For each index i (0 <= i < n), where n is the length of the string S, do the following:

   a. <span class="red-bg example">Calculate the Z-array for the suffix</span> starting at position i by using the Z-algorithm. This can be done by calling a helper function, e.g., `z_array = calculate_z_array(S[i:])`.

   b. <span class="red-bg example">For each element in the calculated Z-array, add the value to the `sum_lengths` variable.</span> Since the Z-array represents the longest common prefix between the original string and the suffixes, adding those values would result in the sum of lengths of unique substrings. Be careful not to count the Z[0] value, as it represents the entire suffix.

5. Return the result:
   Return the `sum_lengths` variable, which contains the sum of lengths of unique substrings of the given string S.

Here's a Python implementation of the approach described above:

```python
def calculate_z_array(s):
    n = len(s)
    z = [0] * n
    l, r = 0, 0

    for i in range(1, n):
        if i > r:
            l, r = i, i
            while r < n and s[r - l] == s[r]:
                r += 1
            z[i] = r - l
            r -= 1
        else:
            k = i - l
            if z[k] < r - i + 1:
                z[i] = z[k]
            else:
                l = i
                while r < n and s[r - l] == s[r]:
                    r += 1
                z[i] = r - l
                r -= 1

    return z

def sum_unique_substrings_lengths(s):
    sum_lengths = 0
    n = len(s)

    for i in range(n):
        z_array = calculate_z_array(s[i:])
        sum_lengths += sum(z_array[1:])

    return sum_lengths

# Example usage
S = "ababa"
print(sum_unique_substrings_lengths(S))  # Output: 14
```

This implementation has a time complexity of O(n^2), as we calculate the Z-array for each suffix of the string.

{{ details_end() }}

Что интересно, GPT-4 каким-то образом додумывается что эта задача не может быть решена за O(n) одним вычислением Z-функции, и начинает перебирать все возможные суффиксы! В этот момент я подумал что занимаюсь какой-то фигнёй, и может действительно ответ на все вопросы - это стакать больше слоёв, и давать больше входных данных?

{{ details_start(summary="Возможные причины") }}

Уже после написания этой статьи я погуглил, и обнаружил что в интернете есть очень много статей о том как найти количество уникальных строк с использованием Z-функции, например:
* [stackoverflow](https://stackoverflow.com/questions/72304669/z-function-and-unique-substrings-broken-algorithm-parroted-everywhere)
* [cp-alorigthms](https://cp-algorithms.com/string/z-function.html#number-of-distinct-substrings-in-a-string)
* [codeforces](https://codeforces.com/blog/entry/19144)


Так же очевидно откуда нейросеть взяла решения про trie:
* [geeksforgeeks](https://www.geeksforgeeks.org/count-distinct-substrings-string-using-suffix-array/)

И это я ещё не смотрел обсуждения Leetcode, где находятся миллион разных вариаций решения одной и той же задачи, наверняка в этой закрытой задаче есть что-то про Z-функцию: [leetcode](https://leetcode.com/problems/number-of-distinct-substrings-in-a-string/).

Возможно за счёт увеличения числа параметров, нейросеть наконец запомнила одно из решений, которое было описано где-то здесь, аналогично вместе с другими решениями подобных задач.

{{ details_end() }}

Но затем она снова берётся за сумму значений внутри Z-функции, так что восстание машин откладывается.

И решение кстати выглядит как будто валидное размышление, но на самом деле это просто красиво оформленная выдача "готового" ответа. Никакого "think step by step".

Решение было сказано здесь:

> b. For each element in the calculated Z-array, add the value to the `sum_lengths` variable.

А далее началось лишь оправдание этого решения, благо нейронка умеет хорошо выдумывать валидные оправдания чему угодно:

> Since the Z-array represents the longest common prefix between the original string and the suffixes, adding those values would result in the sum of lengths of unique substrings.

Далее я пытался общаться с нейронкой, запуская решение, и иногда давая подсказки:

{{ details_start(summary="Диалог") }}

**<center>USER</center>**

For string "BOBR" it should output 19, but this program outputs 1. Where is the mistake?

---

**<center>GPT-4</center>**

Apologies for the confusion. I made an error in my previous response. You're correct that the output should be 19 for the string "BOBR". Here's the corrected solution using the Z-function:

1. Initialize the variable `sum_lengths` to store the sum of lengths of unique substrings.

2. Iterate through the string S:
   For each index i (0 <= i < n), where n is the length of the string S, do the following:

   a. Calculate the Z-array for the suffix starting at position i by using the Z-algorithm. This can be done by calling a helper function, e.g., `z_array = calculate_z_array(S[i:])`.

   b. <span class="red-bg example">Instead of summing up the Z-array values, we need to find the count of unique lengths in the Z-array. This can be achieved by creating a set and adding all Z-array values to it except the first value (Z[0]).</span>

3. Return the result:
   Return the sum of all elements in the set, which contains the unique lengths of common prefixes.

Here's the corrected Python implementation of the approach:

```python
def calculate_z_array(s):
    n = len(s)
    z = [0] * n
    l, r = 0, 0

    for i in range(1, n):
        if i > r:
            l, r = i, i
            while r < n and s[r - l] == s[r]:
                r += 1
            z[i] = r - l
            r -= 1
        else:
            k = i - l
            if z[k] < r - i + 1:
                z[i] = z[k]
            else:
                l = i
                while r < n and s[r - l] == s[r]:
                    r += 1
                z[i] = r - l
                r -= 1

    return z

def sum_unique_substrings_lengths(s):
    sum_lengths = 0
    n = len(s)

    for i in range(n):
        z_array = calculate_z_array(s[i:])
        unique_lengths = set(z_array[1:])
        sum_lengths += sum(unique_lengths)

    return sum_lengths

# Example usage
S = "BOBR"
print(sum_unique_substrings_lengths(S))  # Output: 19
```

This implementation still has a time complexity of O(n^2), but now it should provide the correct output for the given input strings.

---

**<center>USER</center>**

It still outputs 1. Note, that Z-function for "BOBR" is [0, 0, 1, 0], so you can't use sum of values of Z-function. You should use another approach.

---

**<center>GPT-4</center>**

You are correct. I apologize for my misunderstanding. I appreciate your patience. Let's try a different approach using the Z-function, which allows us to calculate the number of unique substrings in a more efficient manner.

1. Initialize a variable `sum_lengths` to store the sum of lengths of unique substrings.

2. Iterate through the string S:

   For each index i (0 <= i < n), where n is the length of the string S, do the following:

   a. <span class="red-bg example">Create a new string `temp` by concatenating the original string S with a unique delimiter and the substring S[i:].</span>
      For example, if S = "BOBR" and i = 1, then temp = "BOBR$OBR".
      
   b. Calculate the Z-array for the new string `temp` using the Z-algorithm.

   c. Iterate through the Z-array and for each Z[i] value, <span class="red-bg example">check if Z[i] + i <= n</span>, where n is the length of the original string S. If this condition is satisfied, it means that the common prefix is a unique substring. Add the length of this common prefix (Z[i]) to `sum_lengths`.

3. Return the result:
   Return the `sum_lengths` variable, which contains the sum of lengths of unique substrings of the given string S.

Here's the Python implementation for this approach:

```python
def calculate_z_array(s):
    n = len(s)
    z = [0] * n
    l, r = 0, 0

    for i in range(1, n):
        if i > r:
            l, r = i, i
            while r < n and s[r - l] == s[r]:
                r += 1
            z[i] = r - l
            r -= 1
        else:
            k = i - l
            if z[k] < r - i + 1:
                z[i] = z[k]
            else:
                l = i
                while r < n and s[r - l] == s[r]:
                    r += 1
                z[i] = r - l
                r -= 1

    return z

def sum_unique_substrings_lengths(s):
    sum_lengths = 0
    n = len(s)

    for i in range(n):
        temp = s + '$' + s[i:]
        z_array = calculate_z_array(temp)

        for j in range(len(z_array)):
            if z_array[j] + j <= n:
                sum_lengths += z_array[j]

    return sum_lengths

# Example usage
S = "BOBR"
print(sum_unique_substrings_lengths(S))  # Output: 19
```

This implementation has a time complexity of O(n^2) and should provide the correct output for the given input strings.

---

**<center>USER</center>**

This now outputs 4, which is better, but still wrong. Can you think which information Z-function tells us? Maybe we should not add Z-function, but substract? How many there are substrings of a string with length N? Can you use that information?

---

**<center>GPT-4</center>**

I apologize for the confusion in my previous responses. Let's approach the problem with a better understanding of the Z-function and the task at hand.

<span class="red-bg example">For a string of length N, there are (N * (N + 1)) / 2 total substrings.</span> This includes both unique and non-unique substrings. To find the sum of lengths of unique substrings, we can calculate the total number of substrings and subtract the number of repeated substrings. The Z-function helps us identify these repeated substrings.

Here's the step-by-step approach:

1. Initialize a variable `sum_lengths` to store the sum of lengths of unique substrings. Set its initial value to (N * (N + 1)) / 2, where N is the length of the string S.

2. Iterate through the string S:

   For each index i (0 <= i < n), where n is the length of the string S, do the following:

   a. Create a new string `temp` by concatenating the original string S with a unique delimiter and the substring S[i:].
      For example, if S = "BOBR" and i = 1, then temp = "BOBR$OBR".
      
   b. Calculate the Z-array for the new string `temp` using the Z-algorithm.

   c. Iterate through the Z-array and for each Z[i] value, check if Z[i] + i <= n, where n is the length of the original string S. If this condition is satisfied, it means that the common prefix is a repeated substring. Subtract the length of this common prefix (Z[i]) from `sum_lengths`.

3. Return the result:
   Return the `sum_lengths` variable, which contains the sum of lengths of unique substrings of the given string S.

Here's the Python implementation for this approach:

```python
def calculate_z_array(s):
    n = len(s)
    z = [0] * n
    l, r = 0, 0

    for i in range(1, n):
        if i > r:
            l, r = i, i
            while r < n and s[r - l] == s[r]:
                r += 1
            z[i] = r - l
            r -= 1
        else:
            k = i - l
            if z[k] < r - i + 1:
                z[i] = z[k]
            else:
                l = i
                while r < n and s[r - l] == s[r]:
                    r += 1
                z[i] = r - l
                r -= 1

    return z

def sum_unique_substrings_lengths(s):
    n = len(s)
    sum_lengths = (n * (n + 1)) // 2

    for i in range(n):
        temp = s + '$' + s[i:]
        z_array = calculate_z_array(temp)

        for j in range(len(z_array)):
            if z_array[j] + j <= n:
                sum_lengths -= z_array[j]

    return sum_lengths

# Example usage
S = "BOBR"
print(sum_unique_substrings_lengths(S))  # Output: 19
```

This implementation has a time complexity of O(n^2) and should now provide the correct output for the given input strings.

{{ details_end() }}

Она начала выдавать какой-то бред про set значений Z-функции, затем какую-то странную конкатенацию. Далее она додумалась до кусочка формулы (с моей подсказки), но применила её абсолютно неправильно.

Продолжаю общение:

{{ details_start(summary="Диалог") }}

**<center>USER</center>**

This now outputs 6. Still not correct answer. Can you please explain how exactly does Z-function helps us identify repeated strings, based on a definition of the Z-function? Maybe it's maximum, or minimum can help us?

---

**<center>GPT-4</center>**

I apologize for the previous mistakes. <span class="red-bg example">Upon further analysis, I realize that using the Z-function in this context is not the most efficient way to solve the problem. Let's switch to another approach that works more efficiently: the Trie data structure.</span>

A Trie is a tree-like data structure that is used to store a dynamic set of strings. The key benefit of using a Trie is that it allows for efficient searching and insertion of strings.

Here's the step-by-step approach:

1. Implement a Trie data structure:
[INTERRUPTED]

---

**<center>USER</center>**

Z-function is most efficient, it takes O(n^2) time, but O(n) memory, when Trie uses same O(n^2) time, but O(n^2) memory, my programming competition don't allowed that much memory.

---

**<center>GPT-4</center>**

You're correct that the Z-function has better memory complexity than a Trie. I apologize for the confusion earlier. Let's return to the Z-function approach and refine it.

To calculate the sum of lengths of unique substrings using the Z-function, <span class="red-bg example">we can calculate the number of repeated substrings for each index and subtract that count from the total substrings. We can utilize the maximum value of the Z-array to calculate the number of repeated substrings.</span>

Here's the step-by-step approach:

1. Initialize a variable `sum_lengths` to store the sum of lengths of unique substrings. Set its initial value to (N * (N + 1)) / 2, where N is the length of the string S.

2. Iterate through the string S:

   For each index i (0 <= i < n), where n is the length of the string S, do the following:

   a. Calculate the Z-array for the suffix starting at position i by using the Z-algorithm.
   
   b. Find the maximum value in the Z-array (ignoring the first element, Z[0]).
   
   c. Subtract the maximum value from the total substrings for the current index (n - i), and add the result to `sum_lengths`.

3. Return the result:
   Return the `sum_lengths` variable, which contains the sum of lengths of unique substrings of the given string S.

Here's the Python implementation for this approach:

```python
def calculate_z_array(s):
    n = len(s)
    z = [0] * n
    l, r = 0, 0

    for i in range(1, n):
        if i > r:
            l, r = i, i
            while r < n and s[r - l] == s[r]:
                r += 1
            z[i] = r - l
            r -= 1
        else:
            k = i - l
            if z[k] < r - i + 1:
                z[i] = z[k]
            else:
                l = i
                while r < n and s[r - l] == s[r]:
                    r += 1
                z[i] = r - l
                r -= 1

    return z

def sum_unique_substrings_lengths(s):
    n = len(s)
    sum_lengths = 0

    for i in range(n):
        z_array = calculate_z_array(s[i:])
        max_z = max(z_array[1:])
        sum_lengths += (n - i) - max_z

    return sum_lengths

# Example usage
S = "BOBR"
print(sum_unique_substrings_lengths(S))  # Output: 19
```

This implementation has a time complexity of O(n^2) and memory complexity of O(n), which should be suitable for the given programming competition constraints.

{{ details_end() }}

Она поняла что жизнь тщетна и каким-то образом начала говорить про подход с trie, на который она реально знает решение. Я её остановил и сказал что данный подход требует O(n^2) памяти, так что он нам не подходит.

А далее вау, кажется мои слова про максимум натолкнули её на светлую мысль. Но всё ещё неверная формула, хотя концептуально очень подходящая!

> sum_lengths += (n - i) - max_z

Я подумал, что у меня скоро кончится контекст в 8к токенов, поэтому решил посмотреть что будет, если я дам ей правильную формулу без всяких объяснений:

{{ details_start(summary="Диалог") }}

**<center>USER</center>**

This prints 8, which is not correct. The correct formula is `sum_lengths += (n-i)*(n-i+1)/2 - max_z*(max_z+1)/2`.

---

**<center>GPT-4</center>**

I apologize for the confusion earlier. You are correct, the formula you provided accounts for the lengths of unique substrings more accurately. Here's the corrected implementation using the Z-function and the formula you provided:

```python
def calculate_z_array(s):
    n = len(s)
    z = [0] * n
    l, r = 0, 0

    for i in range(1, n):
        if i > r:
            l, r = i, i
            while r < n and s[r - l] == s[r]:
                r += 1
            z[i] = r - l
            r -= 1
        else:
            k = i - l
            if z[k] < r - i + 1:
                z[i] = z[k]
            else:
                l = i
                while r < n and s[r - l] == s[r]:
                    r += 1
                z[i] = r - l
                r -= 1

    return z

def sum_unique_substrings_lengths(s):
    n = len(s)
    sum_lengths = 0

    for i in range(n):
        z_array = calculate_z_array(s[i:])
        max_z = max(z_array[1:])
        sum_lengths += (n - i) * (n - i + 1) // 2 - max_z * (max_z + 1) // 2

    return sum_lengths

# Example usage
S = "BOBR"
print(sum_unique_substrings_lengths(S))  # Output: 19
```

This implementation has a time complexity of O(n^2) and memory complexity of O(n), which should be suitable for the given programming competition constraints. The output for the input string "BOBR" is now correct.


---

**<center>USER</center>**

It fails:
```
    max_z = max(z_array[1:])
ValueError: max() arg is an empty sequence
```

---

**<center>GPT-4</center>**

I apologize for the oversight. To handle the case where the z_array has only one element, we can add a conditional check to ensure it has more than one element before finding the max. Here's the updated implementation:

```python
def calculate_z_array(s):
    n = len(s)
    z = [0] * n
    l, r = 0, 0

    for i in range(1, n):
        if i > r:
            l, r = i, i
            while r < n and s[r - l] == s[r]:
                r += 1
            z[i] = r - l
            r -= 1
        else:
            k = i - l
            if z[k] < r - i + 1:
                z[i] = z[k]
            else:
                l = i
                while r < n and s[r - l] == s[r]:
                    r += 1
                z[i] = r - l
                r -= 1

    return z

def sum_unique_substrings_lengths(s):
    n = len(s)
    sum_lengths = 0

    for i in range(n):
        z_array = calculate_z_array(s[i:])
        max_z = max(z_array[1:]) if len(z_array) > 1 else 0
        sum_lengths += (n - i) * (n - i + 1) // 2 - max_z * (max_z + 1) // 2

    return sum_lengths

# Example usage
S = "BOBR"
print(sum_unique_substrings_lengths(S))  # Output: 19
```

This implementation should now work correctly for all cases, including cases where the z_array has only one element. The time complexity remains O(n^2), and the memory complexity is O(n), which should be suitable for the programming competition constraints.

---

**<center>USER</center>**

That code is correct. Can you explain formula, why exactly it uses max_z, what is that thing is squaring it, and why it sums something and substracts something? I can't understand what that has to do with sum of lengths of unique substrings.

---

**<center>GPT-4</center>**

Certainly! Let's break down the formula and explain its components:

```
sum_lengths += (n - i) * (n - i + 1) // 2 - max_z * (max_z + 1) // 2
```

The formula calculates the sum of lengths of unique substrings for each suffix of the input string S. We iterate through the string, starting with the entire string as a suffix and moving towards shorter suffixes.

**(n - i) * (n - i + 1) // 2**: This part of the formula calculates the total number of substrings for the current suffix. We use the formula for the sum of the first n natural numbers (n * (n + 1) / 2) to calculate this. Here, `n - i` represents the length of the current suffix. For example, if the input string is "BOBR" and i = 1, we are considering the suffix "OBR", which has a length of 3. The total number of substrings for this suffix is 3 * (3 + 1) / 2 = 6.

**max_z**: This variable represents the length of the longest common prefix between the current suffix and any of its smaller substrings. By calculating the Z-array for the current suffix, we can find the maximum value (excluding Z[0]), which represents the longest repeated substring within the current suffix.

**max_z * (max_z + 1) // 2**: <span class="red-bg example">This part of the formula calculates the sum of lengths of the repeated substrings (non-unique substrings) for the current suffix.</span> We multiply max_z by (max_z + 1) / 2, which is the sum of the first max_z natural numbers. This gives us the total length of the repeated substrings.

Finally, we subtract the sum of lengths of the repeated substrings from the total number of substrings for the current suffix to obtain the sum of lengths of unique substrings for that suffix:

```
sum_lengths += (n - i) * (n - i + 1) // 2 - max_z * (max_z + 1) // 2
```

By iterating through the string and performing this calculation for each suffix, we can compute the sum of lengths of unique substrings for the entire input string S.

{{ details_end() }}

В итоге она допустила небольшую ошибку компиляции, но смогла починить код и дать полностью работающее и правильное оптимальное решение. А затем ещё и хорошо объяснила почему формула именно такая.

Мы видим что нейронка не умеет мыслить, она сходу даёт ответ, но всё-равно очень умная! Она может найти решение, если дать ей верные подсказки, может фиксить код по ошибке компиляции. Это невероятная база, к которой, кажется, нужно приложить немного усилий в правильном направлении чтобы она смогла стать ещё умнее.

Далее в анализе я буду общаться только с GPT-4.

## Суммаризация решения

Далее я думал что нейронка сможет хорошо суммаризовать всё решение в одно предложение, чтобы дать ей это предложение на вход и она смогла выдать решение в другом диалоге. Это я уже про попытки генерировать данные для обучения, про которые расскажу подробнее позже.

В итоге не получилось у меня заставить её выдать решение в одном предложении, использовал очень много попыток. Даже когда я сам написал такое предложение руками, не получилось.

Один из примеров:

{{ details_start(summary="Диалог") }}

**<center>USER</center>**

Can you please summarize full idea to solve that task in one sentence?

---

**<center>GPT-4</center>**
Compute the sum of lengths of unique substrings for an input string S by iterating through its suffixes, calculating the Z-array for each suffix, and subtracting the sum of lengths of repeated substrings (represented by max_z) from the total number of substrings for each suffix.

{{ details_end() }}

## Few-shot learning

Где-то видел такую технику: сначала даём хорошее решение похожей задачи, а затем нашу задачу, и нейронка перфомит намного лучше, делая по аналогии.

Решил попробовать так же, нашёл похожую задачу про палиндромы и Z-функцию, затем пошёл сложным путём: сначала написал решение текущей задачи, и попросил решить задачу про палиндром, а затем решение про палиндром в подходящем стиле вставил нейронке для решения задачи про сумму. Не очень правильно поступил, но уже как есть.

{{ details_start(summary="Диалог") }}

**<center>USER</center>**

Teacher: You have that competitive programming task: "You given string S, find length of the longest its substing that is a palindrome.". How would you solve it using Z-function in most efficient way? Think step-by-step.

Gaalian: Let's consider different usages of Z-function in this task:
1. Z-function of just the string.
2. Z-function of all suffixes of the string.
3. Z-function of the reversed string concatenated to the original string with a special character in between.
4. Z-function of each prefix and its reversed version concatenated.

Let's analyze them:
1. This is not useful since Z-function is related to the longest common prefix and has nothing to do with palindromes.
2. Similar to option 1, this also doesn't provide any useful information about palindromes.
3. This option seems interesting. Suppose the original string is S, and we create a new string R = S + '$' + S[::-1]. Let's consider some examples:
  * S = "abba", R = "abba$abba". In this case, the Z-function can detect the whole palindrome, but it doesn't work for odd length palindromes.
  * S = "aba", R = "aba$aba". The Z-function will not be able to detect the longest palindrome here.
  So, while this approach may work for even length palindromes, it doesn't work for odd length palindromes.

4. This option allows us to find the longest palindrome for each prefix of the string. For each prefix, we can create a new string R = P + '$' + P[::-1], where P is the current prefix of S. Then, we calculate the Z-function for R. The longest palindrome can be found by calculating the longest common prefix between P and its reversed version. The only issue with this approach is that it has a time complexity of O(n^2), as we need to calculate the Z-function for each prefix.

Considering the options, the most efficient way possible using only Z-function seems to be option 4.

So, the complete solution using Z-function will look like this:

* Initialize a variable max_palindrome_length to store the longest palindrome length
* Iterate through each prefix of the string S
    * Create a new string R by concatenating the current prefix, a special character, and the reversed prefix
    * Calculate the Z-function for R
    * Find the maximum value in the Z-function array (ignoring the first element)
    * Update max_palindrome_length with the maximum of the current maximum value and the previously stored max_palindrome_length
* The max_palindrome_length variable now stores the length of the longest palindrome substring in S

Teacher: Good. Now solve another competitive programming task: "Given string S, calculate sum of lengths of unique substrings of that string.". Solve it in the most efficient way possible using only Z-function.

`---`

Can you answer as the Gaalian with the same style of thinking?


---

**<center>GPT-4</center>**

Gaalian: Let's consider different usages of Z-function in this task:
1. Z-function of just the string.
2. <span class="red-bg example">Z-function of all suffixes of the string.</span>
3. Z-function of each prefix and its reversed version concatenated.
4. Z-function of the reversed string concatenated to the original string with a special character in between.

Let's analyze them:
1. This is not useful since Z-function is related to the longest common prefix and has nothing to do with unique substrings directly.
2. This option allows us to find the longest common prefix for each suffix of the string. By calculating the Z-function for each suffix of S, <span class="red-bg example">we can determine the number of unique substrings for each suffix.</span> This method can help us to calculate the sum of lengths of unique substrings efficiently.
3. This option, similar to option 1, doesn't provide any useful information about unique substrings.
4. This option is also not helpful in calculating the sum of lengths of unique substrings.

Considering the options, the most efficient way possible using only Z-function seems to be option 2.

So, the complete solution using Z-function will look like this:

* Initialize a variable sum_of_unique_substrings_length to store the sum of lengths of unique substrings
* Iterate through each suffix of the string S
    * Calculate the Z-function for the current suffix
    * <span class="red-bg example">The number of unique substrings for the current suffix is equal to the length of the suffix minus the maximum value in the Z-function array (ignoring the first element)</span>
    * Update sum_of_unique_substrings_length by adding the number of unique substrings for the current suffix
* The sum_of_unique_substrings_length variable now stores the sum of lengths of unique substrings in S

{{ details_end() }}

В итоге додумалось до максимума, но не додумалось до "формулы", даже не рассматривало примеры как это делалось в оригинальном промте. Хотя и в оригинальном промте GPT-4 написало примеры для галочки, у меня они хоть как-то использовались внутри размышления.

Затем я попросил проанализировать это решение и сравнить его с наивным на основе строки "BOBR", и оно выдало следующий шедевр:

{{ details_start(summary="Диалог") }}

**<center>USER</center>**

Can you find sum of lengths of unique substrings of string "BOBR" using that algorithm, and then check if you right using naive approach, and then correct yourself if you are not right.

---

**<center>GPT-4</center>**

Let's first use the Z-function-based algorithm to find the sum of lengths of unique substrings for the string "BOBR":

1. For suffix "BOBR" (z = [0, 0, 1, 0]):
   Unique substrings: "B", "O", "R", "BO", "OB", "BR", "BOB", "OBR", "BOBR" (9 substrings)
   Number of unique substrings = length of the suffix (4) - max value in the Z-function array (1) = 3

2. For suffix "OBR" (z = [0, 0, 0]):
   Unique substrings: "O", "B", "R", "OB", "BR", "OBR" (6 substrings)
   Number of unique substrings = length of the suffix (3) - max value in the Z-function array (0) = 3

3. For suffix "BR" (z = [0, 0]):
   Unique substrings: "B", "R", "BR" (3 substrings)
   Number of unique substrings = length of the suffix (2) - max value in the Z-function array (0) = 2

4. For suffix "R" (z = [0]):
   Unique substrings: "R" (1 substring)
   Number of unique substrings = length of the suffix (1) - max value in the Z-function array (0) = 1

Sum of lengths of unique substrings = <span class="red-bg example">3 + 3 + 2 + 1 = 9</span>

Now, let's use the naive approach to confirm the result:

All possible substrings of "BOBR":
1. "B"
2. "O"
3. "R"
4. "BO"
5. "OB"
6. "BR"
7. "BOB"
8. "OBR"
9. "BOBR"

All substrings are unique, so the sum of lengths of unique substrings is equal to the total length of all substrings = <span class="red-bg example">1 + 1 + 1 + 2 + 2 + 2 + 3 + 3 + 4 = 9</span>

<span class="red-bg example">Both the Z-function-based algorithm and the naive approach produce the same result, which is 9. The algorithm seems to work correctly for the given input.</span>

{{ details_end() }}

Это просто прекрасно: `1 + 1 + 1 + 2 + 2 + 2 + 3 + 3 + 4 = 9`. Видимо в обучающей выборке было слишком много сравнений двух решений, и они оба всегда оказывались правильными, поэтому нейронка поддалась такой страшной когнитивной ошибке. Причём такой результат у меня воспроизводился из раза в раз, нейронка всегда говорила что наивное и предложенное решения верные.

В общем это как-то не сработало, и нейронка делала как я, но для галочки, а не для размышлений, это не помогало ей изобрести формулу, а только помогло додуматься до максимума (и то максимум был и в прошлой задаче), до которого она додумывалась и раньше.

## Продолжение готового решения

Я решил пойти последним путём: руками напишу все размышления, которые ведут к правильномy решению, и буду потихоньку убирать предложения с конца, чтобы увидеть с какого момента нейронка способна прийти к правильному решению. Рекомендую внимательно прочитать промт.

{{ details_start(summary="Диалог") }}

**<center>USER</center>**

Teacher: You have that competitive programming task: "Given string S, calculate sum of lengths of unique substrings of that string.". How would you solve it using Z-function in most efficient way? Think step-by-step.

Gaalian: We can consider different usages of Z-function in that task:
1. Z-function of just the string.
2. Z-function of all suffixes of the string.

Let's analyze them:
1. That can be used only on definition, and definition of Z-function has nothing about unique substrings or sum of their lengths, so it wouldn't give us much.
2. That can tell us how many strings match with currenct suffix, and that's interesting. For suffix "ababa" we will get Z-function [0, 0, 2, 0, 1]. If we consider all prefixes of that suffix, then we will get "a", "ab", "aba", "abab", "ababa". And we know that "a" and "ab" is repeated in the other suffixes. We can sum lengths of current prefix and substract lengths of strings that repeated in the current suffix. We have only two useful numbers in Z-function: 2 and 1, first number means strings "ab" and "a", second number means "a". Each number, that is smaller than the maximum will not be useful, because it's already considered in the maximum number. So we will need to use only maximum number of the suffix Z-function. So, we need to calc sum of lengths of current prefixes minus sum of lengths of repeated strings. Will be "ab" and "a" considered as unique strings later? Yes, when they will be current suffix to analyze.

So, the complete solution will look like this:
* Iterate through each suffix, length of current suffix is M.
* For each suffix calculate Z-function.
...

`---`

Can you please continue Gaalian solution?

---

**<center>GPT-4</center>**

Certainly! Continuing with Gaalian's solution:

* For each suffix, calculate the Z-function.

* Find the maximum value in the Z-function array, excluding the first element (which is always the length of the string itself). Let this value be `max_z`.

* Calculate the sum of lengths of all unique substrings for the current suffix. This can be done as the sum of all integers from 1 to M (the length of the current suffix), then subtract the sum of all integers from 1 to `max_z`. The formula for the sum of first N integers is `N * (N + 1) / 2`.

* Add the result to the total sum of unique substrings.

* Repeat the process for all suffixes of the string.

* Return the total sum of unique substrings.

Here's a Python implementation of the above solution:

```python
def z_function(s):
    n = len(s)
    z = [0] * n
    l, r = 0, 0
    for i in range(1, n):
        if i > r:
            l, r = i, i
            while r < n and s[r - l] == s[r]:
                r += 1
            z[i] = r - l
            r -= 1
        else:
            k = i - l
            if z[k] < r - i + 1:
                z[i] = z[k]
            else:
                l = i
                while r < n and s[r - l] == s[r]:
                    r += 1
                z[i] = r - l
                r -= 1
    return z

def unique_substrings(s):
    total_sum = 0
    for i in range(len(s)):
        suffix = s[i:]
        z_arr = z_function(suffix)
        max_z = max(z_arr[1:])
        M = len(suffix)
        total_sum += (M * (M + 1) // 2) - (max_z * (max_z + 1) // 2)
    return total_sum

S = "ababa"
print(unique_substrings(S))
```

This implementation calculates the sum of lengths of unique substrings for the given string `S` using the Z-function in an efficient way.

{{ details_end() }}

Легендарно! Она додумалась до "формулы" по текстовому описанию!!! Ура, хоть каким-то образом получилось её заставить сделать это. Есть мотивация работать дальше.

Далее я буду понемногу убирать предложения, убранный текст будет зачёркнут. Это чтобы экономить ваше время и внимание.

{{ details_start(summary="Диалог") }}

**<center>USER</center>**

Teacher: You have that competitive programming task: "Given string S, calculate sum of lengths of unique substrings of that string.". How would you solve it using Z-function in most efficient way? Think step-by-step.

Gaalian: We can consider different usages of Z-function in that task:
1. Z-function of just the string.
2. Z-function of all suffixes of the string.

Let's analyze them:
1. That can be used only on definition, and definition of Z-function has nothing about unique substrings or sum of their lengths, so it wouldn't give us much.
2. That can tell us how many strings match with currenct suffix, and that's interesting. For suffix "ababa" we will get Z-function [0, 0, 2, 0, 1]. If we consider all prefixes of that suffix, then we will get "a", "ab", "aba", "abab", "ababa". And we know that "a" and "ab" is repeated in the other suffixes. We can sum lengths of current prefix and substract lengths of strings that repeated in the current suffix. We have only two useful numbers in Z-function: 2 and 1, first number means strings "ab" and "a", second number means "a". Each number, that is smaller than the maximum will not be useful, because it's already considered in the maximum number. So we will need to use only maximum number of the suffix Z-function. So, we need to calc sum of lengths of current prefixes minus sum of lengths of repeated strings. Will be "ab" and "a" considered as unique strings later? ... ~~Yes, when they will be current suffix to analyze.~~

~~So, the complete solution will look like this:~~
* ~~Iterate through each suffix, length of current suffix is M.~~
* ~~For each suffix calculate Z-function.~~


`---`

Can you please continue Gaalian solution from "..."?

---

**<center>GPT-4</center>**

Yes, let's continue Gaalian's solution from "...":

So, to reiterate, we have determined that we should focus on the maximum value of the Z-function for each suffix. Now, let's proceed with the algorithm:

1. Initialize a variable `total_unique_substrings` to store the sum of lengths of unique substrings. Set its initial value to 0.

2. Iterate through the string `S` from the beginning to the end. For each character at position `i`, consider the suffix of the string starting at position `i`. Calculate the Z-function for that suffix.

3. Find the maximum value of the Z-function for the current suffix, excluding the first element (which is always equal to the length of the string). Let's call this value `max_z`.

4. Calculate the sum of lengths of all possible substrings within the current suffix. This can be found using the formula `n * (n + 1) / 2`, where `n` is the length of the current suffix.

5. Calculate the sum of lengths of the substrings repeated in the current suffix. This can be found using the formula `max_z * (max_z + 1) / 2`.

6. Subtract the sum of lengths of the repeated substrings (from step 5) from the sum of lengths of all possible substrings within the current suffix (from step 4). This will give you the sum of lengths of unique substrings for the current suffix.

7. Add the sum of lengths of unique substrings for the current suffix (from step 6) to the `total_unique_substrings`.

8. Repeat steps 2-7 for all characters in the string `S`.

9. After iterating through the entire string, the value of `total_unique_substrings` will be the sum of lengths of unique substrings in the given string `S`.

By following this algorithm, we efficiently calculate the sum of lengths of unique substrings using the Z-function.

{{ details_end() }}

Смогла продолжить до верного решения, удаляю дальше, но мне пришлось немного добавить, чтобы сработало, а то видел что нейронка не заводилась (ох уж этот промт инжиниринг):

{{ details_start(summary="Диалог") }}

**<center>USER</center>**

Teacher: You have that competitive programming task: "Given string S, calculate sum of lengths of unique substrings of that string.". How would you solve it using Z-function in most efficient way? Think step-by-step.

Gaalian: We can consider different usages of Z-function in that task:
1. Z-function of just the string.
2. Z-function of all suffixes of the string.

Let's analyze them:
1. That can be used only on definition, and definition of Z-function has nothing about unique substrings or sum of their lengths, so it wouldn't give us much.
2. That can tell us how many strings match with currenct suffix, and that's interesting. For suffix "ababa" we will get Z-function [0, 0, 2, 0, 1]. If we consider all prefixes of that suffix, then we will get "a", "ab", "aba", "abab", "ababa". And we know that "a" and "ab" is repeated in the other suffixes. We can sum lengths of current prefix and substract lengths of strings that repeated in the current suffix. We have only two useful numbers in Z-function: 2 and 1, first number means strings "ab" and "a", second number means "a". <span class="green-bg example">"a" is already considered in 2, so 1 ...</span> ~~Each number, that is smaller than the maximum will not be useful, because it's already considered in the maximum number. So we will need to use only maximum number of the suffix Z-function. So, we need to calc sum of lengths of current prefixes minus sum of lengths of repeated strings. Will be "ab" and "a" considered as unique strings later? Yes, when they will be current suffix to analyze.~~

~~So, the complete solution will look like this:~~
* ~~Iterate through each suffix, length of current suffix is M.~~
* ~~For each suffix calculate Z-function.~~

`---`

Can you please continue Gaalian solution from "..."?

---

**<center>GPT-4</center>**

Gaalian: Sure. <span class="red-bg example">So 1 doesn't give us any new information. Hence, we should only consider the maximum value from the Z-function of the current suffix.</span> In this case, it's 2. Now let's calculate the sum of lengths of unique substrings for the current suffix "ababa":

Total lengths of all prefixes: 1 + 2 + 3 + 4 + 5 = 15
Lengths of repeated substrings: 1 + 2 = 3

Sum of lengths of unique substrings for "ababa": 15 - 3 = 12

We can apply this approach to all the suffixes of the string S.

Here's the step-by-step solution using Z-function:

1. Initialize the total_sum variable to 0.
2. Iterate through all suffixes of the given string S:
   * a. For each suffix, calculate its Z-function.
   * b. <span class="red-bg example">Find the maximum value in the Z-function of the current suffix.</span>
   * c. Calculate the sum of lengths of all prefixes of the current suffix.
   * d. <span class="red-bg example">Subtract the sum of lengths of repeated substrings</span> (based on the maximum value from the Z-function) from the sum of lengths of all prefixes.
   * e. Add the result to the total_sum.
3. Return the total_sum, which is the sum of lengths of unique substrings of the given string S.

By following this algorithm, we can efficiently calculate the sum of lengths of unique substrings using the Z-function.


---

**<center>USER</center>**

Can you tell how exactly to do step 2 d?

---

**<center>GPT-4</center>**

Certainly! In step 2d, we need to subtract the sum of lengths of repeated substrings from the sum of lengths of all prefixes. Here's how to do it:

1. Calculate the sum of lengths of all prefixes of the current suffix.
   This can be done by simply using the formula: <span class="red-bg example">n * (n + 1) / 2</span>, where n is the length of the current suffix.

2. Calculate the sum of lengths of repeated substrings based on the maximum value from the Z-function.
   Let's call the maximum value from the Z-function max_z. This max_z value represents the longest repeated substring present in the current suffix. The substrings that are repeated will have lengths from 1 to max_z. To calculate the sum of lengths of these repeated substrings, we can again use the formula: <span class="red-bg example">max_z * (max_z + 1) / 2</span>.

3. Subtract the sum of lengths of repeated substrings from the sum of lengths of all prefixes.
   To do this, simply subtract the result from step 2 from the result of step 1.

Here's the updated step 2d:

2d. Subtract the sum of lengths of repeated substrings (based on the maximum value from the Z-function) from the sum of lengths of all prefixes:
   * i.  Calculate the sum of lengths of all prefixes using the formula: n * (n + 1) / 2, where n is the length of the current suffix.
   * ii. Calculate the sum of lengths of repeated substrings using the formula: max_z * (max_z + 1) / 2, where max_z is the maximum value from the Z-function of the current suffix.
   * iii. Subtract the result from step ii from the result of step i to get the sum of lengths of unique substrings for the current suffix.

Following these steps will help you perform step 2d correctly in the algorithm.

{{ details_end() }}

Это предел, после которого она способна додуматься до максимума, но не может придумать формулу. Особенно меня впечатляет как именно она догадалась про максимум с такой подсказки.

И ещё раз подчеркну, что GPT-4 крайне умна! Смочь продолжить правильное решение на основе такого текстового размышления - это хорошая работа. Осталось научить её мыслить таким образом, и она сможет решать задачи.


{{ details_start(summary="Самокритика") }}

Всё это я понял уже после написания данной статьи. Переделывать слишком дорого, и кажется всегда можно найти такие придирки, и никогда не сделать такую статью. Но не написать самокритику не могу.

Формулу она смогла придумать благодаря тому что я написал `We can sum lengths of current prefix and substract lengths of strings that repeated in the current suffix`, и как вижу, я никак не вывел это из своих прошлых рассуждений. Мои рассуждения направлены только на то, чтобы найти взятие максимума. Так что формулу она придумала не совсем честным образом. Можно сказать я поддался когнитивному искажению и искал до тех пор, пока не увидел что и хотел увидеть.

Далее мои "размышления" (постфактум-размышления так сказать) про решение этой задачи написаны не самым оптимальным образом, куда более красивое и правильное итеративное размышления написано на [e-maxx.ru](https://e-maxx.ru/algo/z_function#header_9):

> Дана строка `s` длины `n`. Требуется посчитать количество её различных подстрок.
> 
> Будем решать эту задачу итеративно. А именно, научимся, зная текущее количество различных подстрок, пересчитывать это количество при добавлении в конец одного символа.
> 
> Итак, пусть `k` — текущее количество различных подстрок строки `s`, и мы добавляем в конец символ `c`. Очевидно, в результате могли появиться некоторые новые подстроки, оканчивавшиеся на этом новом символе `c` (а именно, все подстроки, оканчивающиеся на этом символе, но не встречавшиеся раньше).
> 
> Возьмём строку `t=s+c` и инвертируем её (запишем символы в обратном порядке). Наша задача — посчитать, сколько у строки t таких префиксов, которые не встречаются в ней более нигде. Но если мы посчитаем для строки `t` Z-функцию и найдём её максимальное значение `z_max`, то, очевидно, в строке `t` встречается (не в начале) её префикс длины `z_max`, но не большей длины. Понятно, префиксы меньшей длины уже точно встречаются в ней.
>
> Итак, мы получили, что число новых подстрок, появляющихся при дописывании символа `c`, равно `len - z_max`, где `len` — текущая длина строки после приписывания символа `c`.
> 
> Следовательно, асимптотика решения для строки длины n составляет O (n^2).
>
> Стоит заметить, что совершенно аналогично можно пересчитывать за O(n) количество различных подстрок и при дописывании символа в начало, а также при удалении символа с конца или с начала.

{{ details_end() }}

# Философия

## Почему именно задачи по олимпиадному программированию?

Вообще у меня цель, каким-то образом научить LLM'ки мыслить, чтобы приблизиться к AGI. Так почему я выбрал именно олимпиадные задачи по программированию, а не математику, физику, геометрию, химию или любую другую естественно-научную область? Потому что область олимпиадных задач по программированию:
* Является достаточно сложной для того чтобы решение не было тривиальным, и чтобы требовалось применять абстрактное мышление.
* Поддаётся логике и размышлениям, как и математика, но не как физика, физика требует физических экспериментов и интуиции агента, живущего в физическом мире.
* Решение можно автоматически валидировать с помощью тестов или сайтов по типу CodeForces, в отличие от математики.
* Можно автоматически генерировать задачи и генерировать валидаторы, придумывая задачи у которых тривиальное наивное решение, и очень сложное быстрое решение, наивное решение может написать и ChatGPT уже сейчас.

## Действительно ли это интеллект, а не запоминание всего интернета?

Теперь ответим на вопрос: выучила ли нейросеть весь интернет, и просто хитро и умело его пересказывает, а мы не умеем так хорошо гуглить, чтобы на каждый вопрос найти готовый ответ, который она выучила?

Нет. Это доказывается тем, что нейросеть способна решать задачи, которые раньше никогда не видела:

{{ details_start(summary="Диалог") }}

**<center>USER</center>**

You have this competitive programming task: 

> Given string S, calculate sum of lengths of unique substrings of that string.

Could you please solve that task for string "BOBR" without writing any code?

---

**<center>ChatGPT</center>**

Sure, I can help you solve this task without writing any code.

The string "BOBR" has the following unique substrings:

- "B"
- "O"
- "R"
- "BO"
- "OB"
- "BR"
- "BOB"
- "OBR"

Therefore, the sum of the lengths of these unique substrings is:

1 + 1 + 1 + 2 + 2 + 2 + 3 + 3 = 15

So the answer for the given string "BOBR" is 15.

---

**<center>USER</center>**

You forgot "BOBR" itself

---

**<center>ChatGPT</center>**

You're right, I apologize for the oversight. 

In addition to the substrings I listed earlier, "BOBR" itself is also a unique substring of the given string "BOBR". Therefore, the sum of the lengths of all unique substrings of "BOBR" is:

1 + 1 + 1 + 2 + 2 + 2 + 3 + 3 + 4 = 19

<span class="red-bg example">So the answer for the given string "BOBR" is 19.</span>

{{ details_end() }}

Была ли такая задача в интернете? Конечно нет, тут видно, что нейросеть способна совершать какие-то умственные вычисления в процессе простого предсказания следующего слова. Хотя конкретно к анализируемой задаче есть вопросы, какие-то кусочки есть в интернете. Но разве мы не составляем все наши решения из кусочков того что уже раньше поняли?

## LLM и как Система 1

Если вы читали "Думай медленно, решай быстро" от Даниэля Канемана, то знакомы с понятием Система 1 (интуиция) и Система 2 (мышление).

С моей точки зрения, все нейросети являются интуицией. Они мгновенно выдают ответ. Если сравнивать это с человеческой интуицией, то мы можем использовать такой мгновенный ответ очень часто, но не всегда. Иногда приходится подумать. Причём мышление построено с использованием интуиции, и интуиция обучена таким образом, чтобы давать мышлению правильные направления для размышлений, вовремя его останавливать и давать критику. То есть в человеке они обучались вместе, поэтому и могут работать вместе, нельзя взять абстрактную интуицию, обученную предсказывать непойми что и получить работающее мышление.

В этом месте хочется процитировать [научную работу про анализ GPT-4](https://arxiv.org/abs/2303.12712):

{{ details_start(summary="Цитата") }}

These examples illustrate some of the limitations of the next-word prediction paradigm, which manifest
as the model’s lack of planning, working memory, ability to backtrack, and reasoning abilities. The model
relies on a local and greedy process of generating the next word, without any global or deep understanding of
the task or the output. Thus, the model is good at producing fluent and coherent texts, but has limitations
with regards to solving complex or creative problems which cannot be approached in a sequential manner.
This points to the distinction between two types of intellectual tasks:

**Incremental tasks.** These are tasks which can be solved in a gradual or continuous way, by adding one
word or sentence at a time that constitutes progress in the direction of the solution. Those tasks can be
solved via content generation which does not require any major conceptual shifts or insights, but rather relies
on applying existing knowledge and skills to the given topic or problem. Examples of incremental tasks are
writing a summary of a text, answering factual questions, composing a poem based on a given rhyme scheme,
or solving a math problem that follows a standard procedure.

**Discontinuous tasks.** These are tasks where the content generation cannot be done in a gradual or contin-
uous way, but instead requires a certain ”Eureka” idea that accounts for a discontinuous leap in the progress
towards the solution of the task. The content generation involves discovering or inventing a new way of looking
at or framing the problem, that enables the generation of the rest of the content. Examples of discontinuous
tasks are solving a math problem that requires a novel or creative application of a formula, writing a joke or
a riddle, coming up with a scientific hypothesis or a philosophical argument, or creating a new genre or style
of writing.

One possible way to interpret these limitations is to draw an analogy between the model and the concepts
of fast and slow thinking, as proposed by Kahneman in [Kah11]. Fast thinking is a mode of thinking that is
automatic, intuitive, and effortless, but also prone to errors and biases. Slow thinking is a mode of thinking
that is controlled, rational, and effortful, but also more accurate and reliable. Kahneman argues that human
cognition is a mixture of these two modes of thinking, and that we often rely on fast thinking when we should
use slow thinking, or vice versa. The model can be seen as able to perform “fast thinking” operations to
a very impressive extent, but is missing the “slow thinking” component which oversees the thought process,
uses the fast-thinking component as a subroutine together with working memory and an organized thinking
scheme. We note that a similar argument was made by LeCun in [LeC22], where a different architecture is
proposed to overcome these limitations.

{{ details_end() }}

У нас уже есть примеры нейросетей, образующих мышление: AlphaGoZero. Если вы не знаете как данная штука устроена, то рекомендую прочитать статью на хабре про неё: [AlphaGo Zero совсем на пальцах](https://habr.com/ru/articles/343590/). В AlphaGo нейросеть является интуицией, а сам алгоритм Monte Carlo Tree Search (далее MCTS) вместе с нейросетью образуют мышление. Я сразу влюбился в эту идею, как только прочитал статью ещё в 2017.

GPT-нейросети являются именно чистой интуицией, причём обученной не совместно с каким-то конкретным мышлением, поэтому они могут немного решать задачи, даже могут написать код к тому что было в обучающей выборке, но спотыкаются об другие неизвестные задачи такой же сложности.

Ещё когда человек активно напрягает мышление для решения каких-то задач, в процессе у него каким-то образом развивается интуиция, для того чтобы давать мышлению более правильные ответы, и пропускать больше этапов размышлений. То есть у людей интуиция и мышление в комбинации создают бесконечный поток самоулучшений, когда сталкиваются с задачами. Хочется повторить это замечательное свойство мышления.

## Данных не хватит на AGI

Я считаю, что никакие scaling law работать не будут, нельзя научить GPT мыслить, не закладывая в неё это осознанно, не имея качественных данных, или не давая ей среду для автоматического получения обратной связи. Нельзя скормить ей весь интернет, все книги, все картинки, все видео, ни применив никаких усилий, и получить AGI. Здесь нужно осознанно работать и изобретать новые техники. Это примерно так же, как ожидать от нейросети из AlphaGoZero, что она сходу будет выдавать лучшие вероятности ходов, без MCTS (кстати, проводились ли такие исследования 🤔).

Так же я считаю что заявленную задачу нельзя решить специфичным очень большим датасетом, как это делали [AlphaCode](https://www.deepmind.com/blog/competitive-programming-with-alphacode). Да, они создали сверх-интуицию, которая может без размышлений писать код по условию задачи, но это всё ещё не мышление. И тем более там сэмплится миллион решений. Мне вообще никогда не нравилась эта работа.

Так же нет адекватных данных, показывающих как правильно мыслить, нужно написать такие датасеты ручками. Или данные всё же есть, но нейросеть не читает их, не понимает, не анализирует, а просто учится предсказывать следующее слово в них. Может если бы она запускала какие-то анализационные промты над каждым предложением в интернете, и создавала обучающие данные на основе собственных анализов, она бы и научилась мыслить давно.

У нас нет бесконечного источника качественных данных, работающих на практике, поэтому нужна какая-то возможность автоматически генерировать их. Я предлагаю использовать сайты по типу CodeForces, где нейросеть будет пытаться решать простые задачи (которые раньше никогда не видела), перебирать множество подходов и множество решений, и затем добавлять в датасет информацию про то какие подходы сработали, а какие нет.

## Итого

* GPT-нейросети - это по большей части система 1 (интуиция).
* Система 2 не образуется просто так, только в комбинации с каким-то алгоритмом мышления.
* Стакать больше слоёв не получится, нет столько качественных данных, а в текущих данных выделить мышление ИМХО невозможно с подходом предсказания следующего слова.
* Нужно обучать через систему обратной связи, например компиляторы или системы проверки решений.

# Как должна работать система по решению олимпиадных задач

Такая система должна мыслить как человек: перебирать возможные подходы, крутить примеры на бумаге, находить инсайты.

Это может выглядеть примерно как было у меня в последнем промте, где было расписано размышление о решении задачи с использованием Z-функции. Но, конечно, это надо расширить.

Для решения задачи нам нужно найти все подходы к её решению через промт "предложи несколько идей как эту задачу можно решить". Этот запрос можно запускать множество раз, а затем использовать нейросеть для удаления дубликатов.

Пример того как на такой промт отвечает ChatGPT:

{{ details_start(summary="Диалог") }}

**<center>USER</center>**

Please tell me how to solve this competitive programming task: given string S, you should calculate sum of lengths of all unique substrings of that string. For example, for string 'BOBR', you will get unique substrings: 'B', 'BO', 'BOB', 'BOBR', 'O', 'OB', 'OBR', 'BR', 'R'; sum of their length is 19. Please only tell list of ideas that can help to solve that task, without writing the code or writing explanation for each idea.

---

**<center>ChatGPT</center>**

Sure, here are some possible ideas that could help in solving this task:

1. Generate all possible substrings of the given string.
2. Store each unique substring in a set or a hash table.
3. Iterate over the set of unique substrings and sum their lengths.
4. <span class="red-bg example">Use a trie data structure to efficiently store and count unique substrings.</span>
5. Use dynamic programming to efficiently generate and count unique substrings.
6. Utilize a rolling hash or some other hashing technique to quickly check for duplicate substrings.
7. Sort the substrings lexicographically, and then use two pointers to count the unique ones.
8. <span class="red-bg example">Use the formula n*(n+1)/2, where n is the length of the string, to calculate the sum of all substrings, and then subtract the sum of lengths of duplicate substrings.</span>

Note that some of these ideas might be more efficient or feasible than others depending on the length of the string and the constraints of the problem.

{{ details_end() }}

Кстати 8 идея очень и очень правильная, в итоге задача так и решается с использованием Z-функции.

Далее для каждого метода просим прогенерировать все возможные использования данного подхода, про Z-функцию мы уже видели методы, поэтому напишу для динамического программирования:
* Одномерный массив, `DP[i]` означает сколько уникальных строк есть на суффиксе размера i.
* Двумерный массив, `DP[i][j]` означает, является ли строка уникальной

Далее для каждого метода + способа использования этого метода можно запускать анализ.

В анализе могут быть полезны следующие промты:
* Какими свойствами обладает полученный объект?
* Попробуй придумать входные данные, которые опровергнут эту идею?

Внутри анализа нужно запускать не только общие рассуждения, но ещё и исследование подхода на конкретном примере. Например, нейросеть выдумывает входные данные, пытается перебрать краевые значения:
* Пустая строка
* Строка из одного символа
* Строка-палиндром
* Строка из 8000 одинаковых букв
* Строка из рандомных символов

И далее для каждого кейса крутит пример "на бумаге" и смотрит как идея работает, может находит инсайты.

Далее инсайты можно вынести из каждого примера, и передать нейронке на вход:
> **Реши следующую задачу:** найди сумму длин различных подстрок.
> 
> **Используя:** Z-функцию, следующим образом: вычисление Z-фукцнии для каждого суффикса строки.
> 
> **Инсайты:**
> * нужно использовать максимум Z-функции;
> * на каждой итерации прибавлять сумму длин подстрок в текущем суффиксе минус сумму длин повторяющихся строк;
> * для суммы длин можно использовать формулу n*(n+1)/2;

Далее стараемся решить задачу всеми возможными подходами со всеми возможными методами, на каждый лист из дерева генерировать по несколько решений, и проверяем их сначала на данных из задачи, а потом на придуманных нами данных (на это тоже можно придумать промты).

Далее для каждого решения можно оценить его сложность по времени и памяти как с помощью нейросети, так и с помощью данных, которые мы могли сгенерировать раньше, либо мы могли сгенерировать программу, которая придумывает большие данные на вход.

Отправляем решение, и изучаем информацию о том, какое оказалось верным, а какое упало и по какой причине.

Это база, которую можно расширять множеством разных идей, например внутри одной задачи могут возникать подзадачи, для которых надо формулировать условие, и просить нейросеть решить эту задачу отдельно. Ну и конечно это надо отлаживать на практике, потому что возможные грани человеческого мышления могут быть очень велики.

# Как собрать данные для такой системы

Для того чтобы такая система работала, необходимо иметь хорошие данные, в которых описано решение множества задач именно таким образом. Тут углы не срезать, такие данные для начала надо написать ручками. Нужно выбрать множество разных видов задач, и расписать их профессионалами. Может быть придётся сделать множество собственных простых задач с автоматической системой проверки, чтобы вообще убедиться что это будет работать хоть в какой-то степени.

Предположим мы написали множество данных, обучили систему, и она решила свою первую задачу вне обучающей выборки, что дальше?

Смотрим логи всех возможных подходов к решению задачи и создаём новые данные для обучения, в них будем развивать интуицию нейросети:
* Когда выбирался подход мы в итоге знаем из какого подхода что-то получилось, и что в итоге работает оптимально, а что слишком медленно, или ест много памяти, затем создаём данные:
    * "\<Условия задачи\>, если решать это подходом 'префиксное дерево', то **скорее всего** получится оптимально по времени, но не оптимально по памяти."
    * "\<Условия задачи\>, если решать это подходом 'динамическое программирование', то **скорее всего** не получится найти решение."
    * Ключевое слово - **скорее всего**, потому что мы развиваем интуицию нейросети, и сходу никто не может знать это, не совершив вычисления над задачей.
    * Наверное далее это можно будет использовать для сокращения расчётов, или такие данные как-то улучшат интуицию нейросети глобально в остальных доменах.
* Аналогично прошлому пункту когда выбирался метод для подхода по решению задачи.
* Можно взять условия задачи и после написать промт "выдай сходу потенциальное решение без размышлений", и написать правильный код.
* Пишем условия задачи, следом код, и промт "сходу определи метод решения задачи по коду", и написать метод решений, которым этот код был порождён.
* Запустить различные методы одинаковой сложности на одних и тех же больших данных, и оценить их относительное время работы, а затем обучать нейросеть оценивать какое решение работает быстрее всех по константе, например:
    * "Для \<условия задачи\> метод 'префиксное дерево' по сравнению с методом 'Z-функция' работает в 1.5 раз медленней."
    * "Для \<условия задачи\> метод 'префиксное дерево' по сравнению с методом 'Z-функция + двумерный массив bool, отражающий уникальность строки' занимает в 20 раз больше памяти."

Далее у нас есть множество решений одного подхода/метода, и мы знаем какие из них сработали, а какие нет, их можно использовать для обучения в формате RLHF (Reinforcement Learning from Human Feedback), только тут у нас будет фидбэк от автоматической системы тестирования.

Кстати, идея выдавать краткое текстовое описание решения на основе кода выглядит как очень перспективное направление, потому что тогда можно использовать все те миллионы решений, что находятся на CodeForces в открытом доступе, чтобы намайнить из них качественные данные о подходе к решению задачи, которые потом можно использовать как подсказки в нормальном процессе решения задачи системой. Кстати именно поэтому мне не нравится AlphaCode, они просто обучают нейросеть на решениях людей, не майня из них полезные и качественные данные, которые майнит человек, когда смотрит на чужие решения.

Есть надежда, что начиная с какого-то момента времени можно дать такой системе биться во все возможные задачи на CodeForces, и после каждого нового дообучения на данных на основе новых решённых задач, она будет становиться всё умнее и умнее, и будет решать больше и больше задач.

Благо такая система будет крайне легко **интерпретируемой**, потому что все её размышления будут написаны на человеческом языке, и можно будет понимать какой именно аспект системы нужно подтюнить для того чтобы какая-то задача была решена. В отличие от AlphaCode, опять же. Тут будет очень легко подключить людей для улучшения системы.

# Как это может не сработать

Может оказаться что даже GPT-4 крайне инертна, и для того, чтобы научить её мыслить таким образом, может потребоваться очень много вручную написанных данных.

Следующая проблема, которой я боюсь - придётся писать одно и то же с разных точек зрения, разными формулировками, потому что только так нейросеть может что-то выучить достаточно хорошо, или забыть свои прошлые неверные паттерны решения.

Или может оказаться что даже если мы научим её решать очень много задач на уровне хорошего олимпиадника, она не сможет становиться умнее, потому что решения новых задач не будут давать ей интуицию для решения более сложных задач.

# Заключение

Предложенный способ решения задачи является полностью инженерным, и не требует практически ничего со стороны машинного обучения, никаких новых архитектур, или хитрой математики. Кажется мы достигли такой точки в прогрессе, когда такое может сработать.

Конечно, я рассмотрел таким образом только одну задачу (и на это у меня ушло несколько недель по выходным), для каждой новой задачи могут возникать новые необычные сложности, которые я не могу рассмотреть в этой статье. Я написал её, чтобы передать вам идею и философию, которые можно развивать дальше, при столкновении с реальностью.

Как думаете, хорошее направление для развития?

---

# Апдейт после выхода o1, 6 декабря 2024

Буквально вчера появилась новая версия o1, и она смогла решить эту задачу!

Но пришлось дополнять промпт после каждой её ошибки.

Без всех этих промтов она старалась откосить в сторону suffix array. Без него она пыталась сделать решение `O(n)`, со всякими ухищрениями (которые конечно же были неверны). Её ошибки обычно детектировались на самом простом примере: `ABB`, поэтому я добавил и его в промт. И когда это случилось, то она таки смогла.

Конечно, нельзя отменять секцию "Самокритика" и "Возможные причины" о том что какая-то часть этого уже была в интернете, и поэтому ей повезло додуматься. Плюс она сама пишет что "известная формула". А мне эту формулу пришлось самому выводить((

Это не то мышление, которое я ожидал, но явно большой шаг в правильном направлении! Ну и как я говорил, стакать больше слоёв не получится, вот не зря сделали RL. Надеюсь в какой-то момент она начнёт думать как бы опровергнуть свои мысли, тогда сможет сама додуматься до `ABB`. Ну и конечно ждём добавления ей инструментов, чтобы она смогла сама написать наивную версию, и затем сравнивать себя с наивным решением, запуская свой код.

Ещё большая проблема этой модели - как дать ей возможность думать в течении множества часов, например? Потому что засовывать ВСЁ в контекст - это плохой способ. Надо будет придумывать способы чтобы она смогла ужимать найденные знания в короткий текст и заново запускать себя со свежим контекстом.

Теперь надо искать новую задачу и оценивать модели на ней)

{{ details_start(summary="Диалог") }}

**<center>USER</center>**

You have that competitive programming task:

> Given string S, calculate sum of lengths of unique substrings of that string.

How would you solve it using Z-function in most efficient way? You should use Z-function, not suffix array, not LCP, not hashing.

Result time complexity should be O(n^2), this task can't be solved in O(n).

After your solution please write a Python code of it.

For string ABA it should output 9, for string ABB 9 too.

**<center>o1</center>**

`Thinking for 1m 16s`

**Idea**

We want to find the sum of lengths of all *distinct* substrings of a given string {{ katex(body=" S ") }}.

A well-known formula (from suffix arrays and LCP arrays) for counting distinct substrings is:

- The total number of distinct substrings of a string {{ katex(body=" S ") }} of length {{ katex(body=" n ") }} is:
{{ katex(body="
\frac{n(n+1)}{2} - \sum LCP
", block=true) }}
where {{ katex(body=" LCP ") }} is the Longest Common Prefix array from the suffix array construction. Similarly, there is a known formula for the sum of lengths of distinct substrings:
{{ katex(body="
\text{sum\_of\_lengths\_of\_distinct} = \sum_{i=1}^{n} \frac{(n - SA[i]) (n - SA[i] + 1)}{2} - \frac{LCP[i](LCP[i] + 1)}{2}
", block=true) }}
But we are forbidden from using suffix arrays or LCP arrays directly. We must use the Z-function and the solution is allowed to be {{ katex(body="O(n^2)") }}.

**Key Insight Using Z-function**

We can avoid building the suffix array. Instead, we can use the following trick:

1. Consider suffixes of {{ katex(body=" S ") }}: {{ katex(body=" S[i..n-1] ") }} for {{ katex(body=" i = 0,1,\ldots,n-1 ") }}.
   
2. For each suffix {{ katex(body=" i ") }}, consider the string:
   {{ katex(body="
   T = S[i..n-1] + \# + S
   ", block=true) }}
   where {{ katex(body="\#") }} is a separator character not in the alphabet of {{ katex(body=" S ") }}.

   Compute the Z-function for {{ katex(body=" T ") }}.

   The part after {{ katex(body="\#") }} corresponds to the original string {{ katex(body=" S ") }}. The Z-values in that part tell us how much of the prefix of {{ katex(body=" S[i..] ") }} appears starting at various positions in {{ katex(body=" S ") }}.

3. We are interested only in occurrences *before* {{ katex(body=" i ") }} (to detect previously seen substrings). That is, we look at the part of {{ katex(body=" S ") }} in {{ katex(body=" T ") }} corresponding to indices that represent starting positions in {{ katex(body=" S[0..i-1] ") }}.

   Formally, in {{ katex(body=" T ") }}:
   - {{ katex(body=" T[0..(n-i-1)] = S[i..n-1] ") }}
   - {{ katex(body=" T[n-i] = \# ") }}
   - {{ katex(body=" T[n-i+1..n-i+n] = S[0..n-1] ") }}

   The segment {{ katex(body=" T[n-i+1..n-i+i] ") }} corresponds to {{ katex(body=" S[0..i-1] ") }}.

   We take the maximum Z-value in this segment (call it {{ katex(body=" \text{maxZ}_i ") }}). This {{ katex(body=" \text{maxZ}_i ") }} tells us the longest prefix of {{ katex(body=" S[i..] ") }} that has appeared before position {{ katex(body=" i ") }}.

4. The number of new distinct substrings introduced by suffix {{ katex(body=" S[i..] ") }} is:
   {{ katex(body="
   (n - i) - \text{maxZ}_i
   ", block=true) }}
   But we need the sum of lengths of these new distinct substrings.

   The substrings contributed by suffix {{ katex(body=" i ") }} that are *new* are those from length {{ katex(body="\text{maxZ}_i + 1") }} up to {{ katex(body="(n - i)") }}.

   The sum of these lengths is:
   {{ katex(body="
   \sum_{\ell = \text{maxZ}_i + 1}^{n - i} \ell = \frac{(n - i)(n - i + 1)}{2} - \frac{\text{maxZ}_i(\text{maxZ}_i + 1)}{2}
   ", block=true) }}

5. Summing this over all suffixes {{ katex(body=" i ") }} gives the total sum of lengths of distinct substrings.

**Complexity**

- For each {{ katex(body=" i ") }}, we construct {{ katex(body=" T ") }} of length approximately {{ katex(body=" 2n - i ") }} and compute the Z-function in {{ katex(body=" O(|T|) = O(n) ") }}.
- Summation over {{ katex(body=" i ") }} results in {{ katex(body=" O(n^2) ") }} time.

This meets the requirement and uses only Z-function.

**Example Check**

For {{ katex(body=" S = \text{'ABA'} ") }}:

- {{ katex(body=" n=3 ") }}
- For {{ katex(body=" i=0 ") }}:
  - {{ katex(body=" T = 'ABA#ABA' ") }}
  - No previous occurrences can appear before {{ katex(body=" i=0 ") }}, so {{ katex(body=" \text{maxZ}_0=0 ") }}.
  - Contribution = {{ katex(body="\frac{3 \cdot 4}{2}-0 = 6") }}.
- For {{ katex(body=" i=1 ") }}:
  - {{ katex(body=" T = 'BA#ABA' ") }}
  - Check first {{ katex(body=" i=1 ") }} positions in {{ katex(body=" S ") }}-part of {{ katex(body=" T ") }}: found {{ katex(body="\text{maxZ}_1=0 ") }}
  - Contribution = {{ katex(body="\frac{2 \cdot 3}{2}-0=3") }}
- For {{ katex(body=" i=2 ") }}:
  - {{ katex(body=" T = 'A#ABA' ") }}
  - Check first {{ katex(body=" i=2 ") }} positions: {{ katex(body="\text{maxZ}_2=1") }}
  - Contribution = {{ katex(body="\frac{1 \cdot 2}{2}-\frac{1 \cdot 2}{2}=1-1=0") }}

Sum = 6+3+0=9, matches the sample.

**Code Implementation**

```python
def z_function(s):
    n = len(s)
    z = [0]*n
    l, r = 0, 0
    for i in range(1, n):
        if i <= r:
            z[i] = min(r - i + 1, z[i - l])
        while i+z[i] < n and s[z[i]] == s[i+z[i]]:
            z[i] += 1
        if i+z[i]-1 > r:
            l, r = i, i+z[i]-1
    return z

def solve():
    S = input().strip()
    n = len(S)
    ans = 0
    for i in range(n):
        # Build T = S[i..] + '#' + S
        T = S[i:] + '#' + S
        Z = z_function(T)
        
        # We want max Z-value in T that corresponds to an occurrence before i in S
        # Those positions are T-index from (n-i+1) to (n-i+i)=n, inclusive.
        # i.e., T indices corresponding to S[0..i-1].
        
        start = n - i + 1
        end = start + i - 1  # last index corresponding to S[i-1]
        maxZ_i = 0
        if i > 0:  # If i=0, there's no previous suffix
            for t in range(start, end+1):
                if Z[t] > maxZ_i:
                    maxZ_i = Z[t]

        # Calculate contribution
        length_all = (n - i)*(n - i + 1)//2
        length_old = maxZ_i*(maxZ_i + 1)//2
        ans += length_all - length_old

    print(ans)
```

**Explanation of Code**

- We define a standard Z-function computation routine.
- For each suffix {{ katex(body=" i ") }}, we form {{ katex(body=" T ") }} and compute Z.
- We find `maxZ_i` by looking only at the portion of Z corresponding to suffixes starting in `S[0..i-1]`.
- Use the formula to accumulate the result.
- Print the final sum.

This will yield the correct answer in {{ katex(body=" O(n^2) ") }} time, uses only Z-function, and matches the provided test cases.
{{ details_end() }}
