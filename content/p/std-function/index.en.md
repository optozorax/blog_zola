+++
title = "Uses of std::function"
date = 2019-01-30
description = "How to improve code quality with the function data type and lambda functions."

[taxonomies]
tags = ["programming", "c++"]

[extra]
image = "preview.png"

[extra.translation]
from = "ru"
by = "Claude Opus 5.5"
+++

# An article about using std::function

I wrote this article because I wanted to put in order everything I learned while coding lab assignments for courses such as [Numerical Methods](https://github.com/optozorax/numerical_methods), [Equations of Mathematical Physics](https://github.com/optozorax/labs_emf) and [Optimization Methods](https://github.com/optozorax/optimization_methods). I hope this article will be useful not only to students of the Faculty of Applied Mathematics and Computer Science at NSTU (Novosibirsk State Technical University), but to a wide range of readers.

# Introduction

In C/C++ you can pass a function as an argument to another function in the form of a function pointer. You probably know this scary syntax:

```c++
int add(int x, int y) {
	return x+y;
}

void call_operation(int (*operation)(int, int)) {
	int c = operation(1, 2);
}

call_operation(add);
```

Since C++11 there is a convenient interface for describing function objects called `std::function`, and it has a nicer syntax:

```c++
#include <functional>

int add(int x, int y) {
	return x+y;
}

int call_operation(std::function<int(int, int)> operation) {
	return operation(1, 2);
}

int c = call_operation(add); // c = 3
```

Moreover, unlike C, C++ lets you describe any function object this way, that is, any object that supports the call operator `()`:

```c++
// ...

struct Adder
{
	int operator()(int a, int b) {
		return state + a + b;
	}
	
	int state;
};

Adder add = {1};

int d = call_operation(add); // d = 4
```

[Lambdas](https://habr.com/ru/post/66021/) (in Russian) can be used in the same way:

```c++
// ...

int state = 2;

int e = call_operation([&](int a, int b) -> int {
	return state + a + b;
}); // e = 5
```

This way, you can pass functions as arguments to other functions.

# Numerical differentiation

Suppose we have some function `f` that takes a `double` and returns a `double`. Then we can compute the derivative of this function numerically like this:

```c++
double f(double x);

double derivative_f(double x) {
	double h = 0.0001;
	return (f(x+h)-f(x))/h;
}
```

But writing a separate derivative function for every function is impractical! So we can solve this problem with `std::function`:

```c++
std::function<double(double)> derivative(std::function<double(double)> f) {
	return [f] (double x) -> double {
		double h = 0.0001;
		return (f(x+h)-f(x))/h;
	}
}
```

This function takes a function and returns a function that computes its derivative. Usage example:

```c++
double f(double x) {
	return x*x;
}

auto df = derivative(f);

double a = f(1); // a == 1
double a = df(1); // a == 2
```

And below is code for computing the first and second derivatives of functions, taken from [my Equations of Mathematical Physics coursework](https://github.com/optozorax/labs_emf/blob/60b62fb5746aa83e3c52a802d5da1741950b6292/coursework/fem.cpp#L283); feel free to use it in your own projects.

```c++
typedef std::function<double(double)> function_1d_t; 

function_1d_t calc_first_derivative(const function_1d_t& f) {
	return [f](double x) -> double {
		const double h = 0.001;
		return (-f(x + 2 * h) + 8 * f(x + h) - 8 * f(x - h) + f(x - 2 * h)) / (12 * h);
	};
}

function_1d_t calc_second_derivative(const function_1d_t& f) {
	return [f](double x) -> double {
		const double h = 0.001;
		return (-f(x+2*h) + 16*f(x+h) - 30*f(x) + 16*f(x-h) - f(x-2*h))/(12*h*h);
	};
}
```

It may seem that making the value `0.001` smaller would increase the accuracy, but that's not so: in practice the accuracy only got worse for me, and with this value the derivative is already computed very well.


# An example of using `std::bind`

Okay, we have a function for computing the derivative of a one-dimensional function, but what if our function takes two arguments, for example `f(x, y)`? How do we compute its partial derivative with respect to one of the parameters? 

`std::bind` comes to the rescue: a function that takes a function and a list of arguments and returns another function. The best way to understand how it works is to see an example:

```c++
double f(double x, double y) {
	return 2*x + 3*y;
}

// Derivative of f with respect to x at y=0
auto fx = calc_first_derivative(std::bind(f, std::placeholders::_1, 0));

// Derivative of f with respect to y at x=0
auto fy = calc_first_derivative(std::bind(f, 0, std::placeholders::_1));

double fx_value = fx(1); // fx_value = 2; 
double fy_value = fy(1); // fy_value = 3;
```

Here `std::placeholders::_1` stands for the first parameter of the outer function that `std::bind` will return.

Unfortunately, in this case `fx` turns out to be a function of one variable, with `y=0` fixed. To get a function `fx` that takes two parameters but returns the derivative with respect to `x`, you can use the following trick:

```c++
auto fx = [] (double x, double y) -> double {
	return calc_first_derivative(std::bind(f, std::placeholders::_1, y))(x);
};

double fx_value = fx(1, 0); // df(1, 0)/dx
```

It could probably be improved, so that you don't have to copy-paste these lines, by coming up with a new `std::bind2` using C++ template magic, but I don't know how to do that. If you can do it, be sure to send a pull request here!

Or another example:

```c++
double f(double x, double y, double t);

using namespace std::placeholders;

std::function<double(double, double)> g = std::bind(f, _2, 5, _1);

double gv = g(1, 2);
double fv = f(2, 5, 1);

// gv == fv
```

# Computing the right-hand side automatically

In a course like Equations of Mathematical Physics, we have to solve the following differential equation: 

`-div(lambda * grad u) + gamma * u + sigma * du/dt = f`, 

where `u = u(x, y, t)` is the unknown function. It is solved numerically with the Finite Element Method (FEM).

In Cartesian coordinates this equation expands into `-lambda*(d^2 u/dx^2 + d^2 u/dy^2)  + gamma * u + sigma * du/dt = f`

To test the solver program, we make up some function `u`, for example `u = x*x + y*y + t`, make up values of the constants `lambda`, `gamma`, `sigma`, and then, using the equation above, we can compute the function `f` that turns the differential equation into an identity.

To test our program on a wide range of functions, we can write a function that computes this right-hand side automatically, using the derivative functions described above:

```c++
typedef std::function<double(double, double, double)> function_3d_t;

/** All constants of the equation being solved. */
struct constants_t
{
	double lambda; /// Coefficient inside div
	double gamma;  /// Coefficient of u
	double sigma;  /// Coefficient of du/dt
};

function_3d_t calc_right_part(
	const function_3d_t& u,
	const constants_t& cs
) {
	// f = -div(lambda * grad u) + gamma * u + sigma * du/dt
	return [=](double x, double y, double t) -> double {
		using namespace placeholders;
		auto ut = calc_first_derivative(bind(u, x, y, _1));

		auto uxx = calc_second_derivative(bind(u, _1, y, t));
		auto uyy = calc_second_derivative(bind(u, x, _1, t));

		return -cs.lambda * (uxx(x) + uyy(y)) + cs.gamma * u(x, y, t) + cs.sigma * ut(t);
	};
}
```

The code is again taken from [the Equations of Mathematical Physics repository](https://github.com/optozorax/labs_emf/blob/60b62fb5746aa83e3c52a802d5da1741950b6292/coursework/fem.cpp#L304).

This way we get the function `f` from the function `u` that we know.

This saves us the needless routine of computing derivatives by hand when testing, since the process is automated, and it also reduces the chance of making a mistake.

# A wrapper for counting function calls

For example, we need to test some method that finds the minimum of a given function `f`. We want to find out how good it is by determining how many times it had to call `f`, because calling `f` is usually considered the most expensive operation. 

This can be done without touching the method's code and explicitly adding `count++` at every function call, by passing a wrapper around the function instead of the function itself:

```c++
typedef std::function<double(const Vector&)> Function;

Function setFunctionToCountCalls(int* where, const Function& f) {
	(*where) = 0;
	return [where, f](const Vector& v) -> double {
		(*where)++;
		return f(v);
	};
}

double f(const Vector& v) {
	// ...
}

int fCount = 0;
auto result = optimize(/* ... */, setFunctionToCountCalls(&fCount, f), /* ... */);
```

Taken from [lab 2 in Optimization Methods](https://github.com/optozorax/optimization_methods/blob/feb65cda80b43145a58ada90b6de7c5ae8e777a4/2/methods.cpp#L268).


# Measuring execution time

Say our task is to measure how long some code runs. We could do it like this:

```c++
#include <chrono>

using namespace chrono;
auto start = high_resolution_clock::now();

// ...
// main code
// ...

auto end = high_resolution_clock::now();
double time = duration_cast<microseconds>(end - start).count();
```

But this solution is bad because we have to copy these pieces of code all the time, and we can potentially lose the start or the end of the measurement. So we can use the RAII concept and do it in the following elegant way, by passing the code to be timed as a lambda to the timing function:

```c++
#include <chrono>
#include <functional>

/** Computes the execution time of function f in microseconds. */
inline double calc_time_microseconds(const std::function<void(void)>& f) {
	using namespace std::chrono;
	auto start = high_resolution_clock::now();
	f();
	auto end = high_resolution_clock::now();
	return duration_cast<microseconds>(end - start).count();;
}

double time = calc_time_microseconds([&](){
	// ...
	// main code
	// ...
});
```

And thanks to lambdas, we don't lose access to local variables.

The code is taken from [my Equations of Mathematical Physics coursework](https://github.com/optozorax/labs_emf/blob/60b62fb5746aa83e3c52a802d5da1741950b6292/coursework/lib.h#L24).

# Double integral

Suppose we have a function that computes the integral of a one-dimensional function:

```c++
#include <functional>

typedef std::function<double(double)> function_1d_t; 

double calc_integral_gauss3(
	double a, double b, int n, // n - number of internal nodes
	const function_1d_t& f
);
```

Then the double integral of a two-dimensional function can be computed like this:

```c++
double calc_integral_gauss3(
	double ax, double bx, int nx,
	double ay, double by, int ny,
	const function_2d_t& f
) {
	return calc_integral_gauss3(ax, bx, nx, [ay, by, ny, f](double x)->double {
		return calc_integral_gauss3(ay, by, ny, bind(f, x, _1));
	});
}
```

The code is taken from [my Equations of Mathematical Physics coursework](https://github.com/optozorax/labs_emf/blob/60b62fb5746aa83e3c52a802d5da1741950b6292/coursework/fem.cpp#L269).

# Testing functions

Imagine we have many methods that solve the same problem, each in its own way, but all with the same interface. And the task is to test them all in a uniform way and build tables. This can also be done nicely with `std::function`, by writing a prototype of the method function:

```c++
typedef std::function<MethodResult(/* Method args. */)> Method;

MethodResult method1(/* Method args. */);
MethodResult method2(/* Method args. */);
MethodResult method3(/* Method args. */);
MethodResult method4(/* Method args. */);
MethodResult method5(/* Method args. */);

void makeTableForMethod(
	const Method& method,
	const std::string& file,
	/* Method args. */	
) {
	// ...
}

std::vector<pair<Method, string>> methodsToTest = {
	{method1, "table1.txt"},	
	{method2, "table2.txt"},
	{method3, "table3.txt"},
	{method4, "table4.txt"},
	{method5, "table5.txt"},
};

for (auto& i : methodsToTest)
	makeTableForMethod(i.first, i.second, /* Method args. */);
```

Some people do this with copy-paste, but I don't think I need to explain to you why copy-paste is worse than this approach.

The code is taken from [lab 2 in Optimization Methods](https://github.com/optozorax/optimization_methods/blob/feb65cda80b43145a58ada90b6de7c5ae8e777a4/2/make_tables.cpp#L9).

# Line search

In Optimization Methods, multidimensional methods for finding the minimum of a function use a one-dimensional optimization function. And the assignment was to plug in different one-dimensional optimization methods to test their efficiency specifically in this setting. Well, in that case we won't hardcode the one-dimensional optimization function in the program, but will pass it as an argument to the multidimensional optimization function:

```c++
typedef std::function<double(const double&)> OneDimensionFunction;
typedef std::function<double(const OneDimensionFunction&, double, double, double)> OneDimenshionExtremumFinder;

double oneDimensionOptimizator1(const OneDimensionFunction& f, double a, double b, double eps);
double oneDimensionOptimizator2(const OneDimensionFunction& f, double a, double b, double eps);
double oneDimensionOptimizator3(const OneDimensionFunction& f, double a, double b, double eps);
double oneDimensionOptimizator4(const OneDimensionFunction& f, double a, double b, double eps);


typedef std::function<double(const Vector&)> Function;

MethodResult multiDimenshionOptimize1(
	const Function& f, 
	const OneDimenshionExtremumFinder& argmin, 
	const Vector& x0, 
	const double& eps
);

MethodResult multiDimenshionOptimize2(
	const Function& f, 
	const OneDimenshionExtremumFinder& argmin, 
	const Vector& x0, 
	const double& eps
);
```

The code is taken from [lab 2 in Optimization Methods](https://github.com/optozorax/optimization_methods/blob/feb65cda80b43145a58ada90b6de7c5ae8e777a4/2/methods.h#L18).

# The listener pattern

Sometimes you need to output information about the internal state of a method. For example, you're solving an optimization problem, and at every iteration you need to output the current solution, the gradient of the function at that point, etc., to build a table. Instead of doing this explicitly, you can pass a `listener` function to the method's function; it will receive the whole internal state of the method and decide by itself what to do with it.

In one case it can print it to the screen, in another write it to a file, and in a third, when you need maximum performance, do nothing with this information.

Actually, I haven't used this in practice; I took the example of this pattern from a [differential evolution](https://github.com/optozorax/differential-evolution/blob/9cfefc0b36ed3bf4ca6c37d786244d56c0b3b2ba/de_test/tutorial.cpp#L71) library.

There you can also see the **termination strategy pattern**, which lets you pass the method a function that decides when to stop the method. But within our curriculum this is an unnecessary abstraction, and different termination strategies would never be used.

# Encapsulating with `std::function`

In Equations of Mathematical Physics, our task is to get a finite element approximation of a function from the right-hand side of the differential equation and a finite element mesh. Given this information, the FEM solver could look like this:

```c++
vector_t solve_differential_equation(
	const function_3d_t& f,
	const grid_t& grid
);
```

It returns a vector because we only find an approximation of the weights `q`, and that's exactly what the method returns.

But when solving with FEM, we can't ignore the fact that we need to set boundary conditions. Boundary conditions are the known values of the function on the boundary of the domain. Without the boundary values the problem can't be solved; it simply won't converge.

So we have to somehow set the boundary conditions inside the function that solves the differential equation.

In our Equations of Mathematical Physics course we don't solve real-world problems, we only study how well the method copes with functions `u` that we know, so you might be tempted to write this:

```c++
vector_t solve_differential_equation(
	const function_3d_t& f,
	const grid_t& grid,
	const function_3d_t& true_function_u
) {
	// doing smth
	// setting boundary conditions using function u on the domain boundary
	// doing smth further
}
```

But this is terrible style! Why would we use numerical methods to find the values of a function we already know? It looks like nonsense, so a more elegant approach is to pass a **function that sets the boundary conditions**:

```c++
vector_t solve_differential_equation(
	const function_3d_t& f,
	const grid_t& grid, 
	const boundary_setter_function_t& set_boundary_conditions
) {
	// doing smth
	set_boundary_conditions(/* ... */);
	// doing smth further
}
```

This is a very elegant solution that can be used for solving real-world problems, where we genuinely don't know the true function but do know the boundary values. It makes the code much more abstract and lets you reuse it in other projects.

Since you can use this in practice, see the code from my Equations of Mathematical Physics coursework for more details:
* [Prototype of the function that sets boundary conditions.](https://github.com/optozorax/labs_emf/blob/60b62fb5746aa83e3c52a802d5da1741950b6292/coursework/fem.h#L146)
* [The function itself, which sets boundary conditions based on the known function u.](https://github.com/optozorax/labs_emf/blob/60b62fb5746aa83e3c52a802d5da1741950b6292/coursework/fem.h#L149)
* [The FEM solver function.](https://github.com/optozorax/labs_emf/blob/60b62fb5746aa83e3c52a802d5da1741950b6292/coursework/fem.h#L159)
* [Usage example.](https://github.com/optozorax/labs_emf/blob/60b62fb5746aa83e3c52a802d5da1741950b6292/coursework/main.cpp#L32)

# Conclusion

I've shown how `std::function` lets you get rid of needless copy-paste, encapsulate code and data, and in general make your code much more abstract and elegant. If you've come up with another interesting use of `std::function`, write about it in the comments!