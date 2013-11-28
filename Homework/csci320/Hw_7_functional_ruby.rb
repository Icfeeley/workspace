# Ian Feeley
# Nov. 4, 2013
# HW7 - functional programming ruby


#Takes two functions as parameters and returns a proc that, when called,
#computes the composition, given an argument.
def compose(f,g)
	return lambda{|x| f.call(g.call(x))}
end

f = lambda{|x| x + 2}
g = lambda{|x| 3 * x}

composite = compose(f,g)
print "compose(f,g) Test:
 if: f(x) = x + 2 	 g(x) = 3 * x
 then: f(g(1)) = "
print composite.call(1), "\n"
composite = compose(g,f)
print "compose(g,f) Test:
 if: f(x) = x + 2 	 g(x) = 3 * x
 then: g(f(1)) = "
print composite.call(1), "\n"
composite = compose(f,f)
print "compose(f,f) Test:
 if: f(x) = x + 2
 then: f(f(1)) = "
print composite.call(1), "\n"
composite = compose(g,g)
print "compose(g,g) Test:
 if: g(x) = 3 * x
 then: g(g(1)) = "
print composite.call(1)


puts "\n\n"


#Takes a list of functions as parameters and returns a proc that, when called,
#applies each function to given an argument and returns an array of the results.
def construct(functions)
	return lambda{ |x| functions.map {|function| function.call(x) }}
end

g = lambda {|x| x * x}
h = lambda {|x| 2 * x}
i = lambda {|x| x / 2}
my_functions = [g,h,i]

my_construct = construct(my_functions)
my_result_set = my_construct.call(4)
print "construct(functions) Test:
 if: g(x) = x * x 	 h(x) = 2 * x 	 i(x) = x / 2
 then: [g, h, i](4) yields: "
print my_result_set.inspect(), "\n"
my_construct = construct(my_functions)
my_result_set = my_construct.call(3)
print "construct(functions) Test:
 if: g(x) = x * x 	 h(x) = 2 * x 	 i(x) = x / 2
 then: [g, h, i](3) yields: "
print my_result_set.inspect(), "\n"
my_construct = construct(my_functions)
my_result_set = my_construct.call(2)
print "construct(functions) Test:
 if: g(x) = x * x 	 h(x) = 2 * x 	 i(x) = x / 2
 then: [g, h, i](2) yields: "
print my_result_set.inspect(), "\n"
my_construct = construct(my_functions)
my_result_set = my_construct.call(1)
print "construct(functions) Test:
 if: g(x) = x * x 	 h(x) = 2 * x 	 i(x) = x / 2
 then: [g, h, i](1) yields: "
print my_result_set.inspect()
puts "\n\n"

# Takes a function as parameter and returns a proc that,when called, applies the 
# function to all elements in a list of values, provided as a parameter.
def apply_to_all(function)
	return lambda{|xs| xs.map {|x| function.call(x)}}
end	

my_function1 = lambda{|x| x * x}
my_function2 = lambda{|x| x * 2}
my_function3 = lambda{|x| x * 3}
my_function4 = lambda{|x| x * 4}
my_arguments = [2,3,4]

apply_my_function_to_all = apply_to_all(my_function1)
my_results = apply_my_function_to_all.call(my_arguments)
print "apply_to_all(function) Test:
 if my_function1(x) = x * x
 then: my_function1([2, 3, 4]) yeilds: "
print my_results.inspect(), "\n"
apply_my_function_to_all = apply_to_all(my_function2)
my_results = apply_my_function_to_all.call(my_arguments)
print "apply_to_all(function) Test:
 if my_function(x) = x * 2
 then: my_function2([2, 3, 4]) yeilds: "
print my_results.inspect(), "\n"
apply_my_function_to_all = apply_to_all(my_function3)
my_results = apply_my_function_to_all.call(my_arguments)
print "apply_to_all(function) Test:
 if my_function(x) = x * 3
 then: my_function3([2, 3, 4]) yeilds: "
print my_results.inspect(), "\n"
apply_my_function_to_all = apply_to_all(my_function4)
my_results = apply_my_function_to_all.call(my_arguments)
print "apply_to_all(function) Test:
 if my_function4(x) = x * 4
 then: my_function([2, 3, 4]) yeilds: "
print my_results.inspect()
puts "\n\n"