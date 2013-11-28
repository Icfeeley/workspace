'''
parses a string containing data values in python code and determinds the 
data type of values in the string.
'''


def main():
	in1 = '[1,2]'
	in2 = '\'this is a string\''
	in3 = '1337'
	in4 = '10;20'
	in5 = '[1,2];[2,1]'
	in6 = '[1,\'2\'];2;4;\'string\''

	inputs = [in1,in2,in3, in4, in5, in6]
	for i in inputs:
		i = dataTypeParser(i)
		print i
def dataTypeParser(string):
	#evaluates a ; delemenated multivalued input 
	if string.find(';') != -1:
		string = string.split(';')
		i = 0
		for i in range(len(string)):
			string[i] = dataTypeParser(string[i])
			i += 1
	#evaluates a list
	elif string.find('[') != -1:
		string = string.replace('[','')
		string = string.replace(']','')
		string = string.split(',')
		i = 0
		for i in range(len(string)):
			string[i] = dataTypeParser(string[i])
			i += 1
	#evaluates a string
	elif string.find('\'') != -1:
		string  = string.replace('\'', '')
	#evaluates a number
	else:
		try:
			string = int(string)
		except ValueError:
			print 'The input \'' + string + '\' does not follow proper formating and could not be resolved to a python data type'
	return string
main()