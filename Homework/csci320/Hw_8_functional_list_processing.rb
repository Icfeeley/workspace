# Ian Feeley
# Nov. 12, 2013
# HW8 - functional list processing in ruby

# Test inputs
test_int1 = 1
test_int2 = 99
test_int3 = 5255
test_list1 = [[1,2],2,3,4,5]
test_list2 = [[[1,2,3,4,5]]]
test_list3 =[1,2,3,4]

# Returns the sum of the values in a numeric list that may contain other lists.
def sum(list)
	if list.empty?
		return 0
	elsif (list.first.class == Array) == true
		first, *rest = list
		return sum(first) + sum(rest)
	else
		first, *rest = list
		return first + sum(rest)
	end
end

print "sum(list) Test:
	if list = " + test_list1.inspect() + "
	then sum(list) = " + sum(test_list1).to_s()
print "
	if list = " + test_list2.inspect() + "
	then sum(list) = " + sum(test_list2).to_s()
print "
	if list = " + test_list3.inspect() + "
	then sum(list) = " + sum(test_list3).to_s()
puts "\n\n"

# Takes a numeric list and returns a numeric list with all odd numbers removed.
def remove_odd(list)
	if list.empty?
		return list
	else
		first, *rest = list
		if (first.class == Array) == true
			return remove_odd(rest).unshift(remove_odd(first))
		elsif first.odd?
			return remove_odd(rest)
		else
			return remove_odd(rest).unshift(first)
		end
	end
end

print "remove_odd(list) Test:
	if list = " + test_list1.inspect() + "
	then remove_odd(list) = " + remove_odd(test_list1).inspect()
print "
	if list = " + test_list2.inspect() + "
	then remove_odd(list) = " + remove_odd(test_list2).inspect()
print "
	if list = " + test_list3.inspect() + "
	then remove_odd(list) = " + remove_odd(test_list3).inspect()
puts "\n\n"

# Returns the length of an integer
def digits(int)
	if int.div(10) == 0
		return 1
	else 
		return 1 + digits(int.div(10))
	end
end

print "digits(int) Test:
	if int = " + test_int1.to_s() + "
	then digits(int) = " + digits(test_int1).to_s()
print "
	if int = " + test_int2.to_s() + "
	then digits(int) = " + digits(test_int2).to_s()
print "
	if int = " + test_int3.to_s() + "
	then digits(int) = " + digits(test_int3).to_s()
puts "\n\n"

# Return the ith digit of an integer (where digits are counted from right 
# to left starting at position zero).
def ith_digit(int, ith)
	if ith == 0
		return int.modulo(10)
	else 
		return ith_digit(int.div(10), ith -1)
	end
end

print "ith_digit(int, ith) Test:
	if int = " + test_int1.to_s() + ", ith = 0
	then ith_digit(int, ith) = " + ith_digit(test_int1, 0).to_s()
print "
	if int = " + test_int2.to_s() + ", ith = 1
	then ith_digit(int, ith) = " + ith_digit(test_int2, 1).to_s()
print "
	if int = " + test_int3.to_s() + ", ith = 2
	then ith_digit(int, ith) = " + ith_digit(test_int3, 2).to_s()
puts "\n\n"

# Returns the number of occurrances of some digit in a given number
def occurrances(int, digit)
	if int.div(10) == 0 && int == digit
		return 1
	elsif int.div(10) == 0 
		return 0
	elsif int.modulo(10) == digit
		return 1 + occurrances(int.div(10), digit)
	else
		return occurrances(int.div(10), digit)	
	end	
end

print "occurrances(int, digit) Test:
	if int = " + test_int1.to_s() + ", digit = 0
	then occurrances(int, digit) = " + occurrances(test_int1, 0).to_s()
print "
	if int = " + test_int2.to_s() + ", digit = 9
	then occurrances(int, digit) = " + occurrances(test_int2, 9).to_s()
print "
	if int = " + test_int3.to_s() + ", digit = 5
	then occurrances(int, digit) = " + occurrances(test_int3, 5).to_s()
puts "\n\n"


# Returns the sum of the didgits in a given integer
def digital_sum(int)
	if int.div(10) == 0
		return int.modulo(10)
	else
		return int.modulo(10) + digital_sum(int.div(10))
	end
end

print "digital_sum(int) Test:
	if int = " + test_int1.to_s() + "
	then digital_sum(int) = " + digital_sum(test_int1).to_s()
print "
	if int = " + test_int2.to_s() + "
	then digital_sum(int) = " + digital_sum(test_int2).to_s()
print "
	if int = " + test_int3.to_s() + "
	then digital_sum(int) = " + digital_sum(test_int3).to_s()
puts "\n\n"

# Return the sum of the digits in the sum of an integer until only one digit remains.
def digital_root(int)
	if int.div(10) == 0
		return int
	else
		return digital_root(digital_sum(int))
	end
end

print "digital_root(int) Test:
	if int = " + test_int1.to_s() + "
	then digital_root(int) = " + digital_root(test_int1).to_s()
print "
	if int = " + test_int2.to_s() + "
	then digital_root(int) = " + digital_root(test_int2).to_s()
print "
	if int = " + test_int3.to_s() + "
	then digital_root(int) = " + digital_root(test_int3).to_s()
puts "\n\n"