"""
To find the minimum  of sphere function on interval (-10 to 10) with
2 dimensions in domain using default parameters:
"""

from beecolpy import abc

def sphere(x):
	total = 0
	for i in range(len(x)):
		total += x[i]**2
	return total
	
#Load data
abc_obj = abc(sphere, [(-10,10), (-10,10)])
#Execute the algorithm
abc_obj.fit()


#If you want to get the obtained solution after execute the fit() method:
solution = abc_obj.get_solution()
print(solution)
