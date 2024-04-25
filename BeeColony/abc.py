
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


"""
    Obs.: Each time fit() was executed, the algorithm iterate 
    'iterations' times resuming from last fit() execution.
"""

"""
    Parameters
    ----------
    function : Name
        A name of a function to minimize/maximize.
        Example: if the function is:
            def my_func(x): return x[0]**2 + x[1]**2 + 5*x[1]
            
            Use "my_func" as parameter.


    boundaries : List of Tuples
        A list of tuples containing the lower and upper boundaries of 
        each dimension of function domain.

        Obs.: The number of boundaries determines the dimension of 
        function.

        Example: A function F(x1, x2) = y with:
            (-5 <= x1 <= 5) and (-20 <= x2 <= 20) have the boundaries:
                [(-5,5), (-20,20)]


    [colony_size] : Int --optional-- (default: 40)
        A value that determines the number of bees in algorithm. Half 
        of this amount determines the number of points analyzed (food 
        sources).

        According articles, half of this number determines the amount 
        of Employed bees and other half is Onlooker bees.


    [scouts] : Float --optional-- (default: 0.5)
        Determines the limit of tries for scout bee discard a food 
        source and replace for a new one.
            - If scouts = 0 : 
                Scout_limit = colony_size * dimension

            - If scouts = (0 to 1) : 
                Scout_limit = colony_size * dimension * scouts
                    Obs.: scouts = 0.5 is used in [3] as benchmark.

            - If scouts >= 1 : 
                Scout_limit = scouts

        Obs.: Scout_limit is rounded down in all cases.


    [iterations] : Int --optional-- (default: 50)
        The number of iterations executed by algorithm.


    [min_max] : String --optional-- (default: 'min')
        Determines if algorithm will minimize or maximize the function.
            - If min_max = 'min' : (default)
                Locate the minimum of function.

            - If min_max = 'max' : 
                Locate the maximum of function.


    [nan_protection] : Boolean --optional-- (default: True)
        If true, re-generate food sources that get NaN value as cost 
        during initialization or during scout events. This option 
        usually helps the algorithm stability because, in rare cases, 
        NaN values can lock the algorithm in a infinite loop.
        
        Obs.: NaN protection can drastically increases calculation 
        time if analysed function has too many values of domain 
        returning NaN.


    [log_agents] : Boolean --optional-- (default: False)
        If true, beecolpy will register, before each iteration, the
        position of each food source. Useful to debug but, if there a
        high amount of food sources and/or iterations, this option
        drastically increases memory usage.


    [seed] : Int --optional-- (default: None)
        If defined as an int, set the seed used in all random process.


    Methods
    ----------
    fit()
        Execute the algorithm with defined parameters.

        Obs.: Returns a list with values found as minimum/maximum 
        coordinate.


    get_solution()
        Returns the value obtained after fit() the method.


    get_status()
        Returns a tuple with:
            - Number of complete iterations executed
            - Number of scout events during iterations
            - Number of times that NaN protection was activated


    get_agents()
        Returns a list with the position of each food source during
        each iteration if "log_agents = True".

        Parameters
        ----------
        [reset_agents] : bool --optional-- (default: False)
            If true, the food source position log will be cleaned in
            next fit().
"""





"""
    Obs.: Each time fit() was executed, the algorithm iterate 
    'iterations' times resuming from last fit() execution.
"""

"""
    Parameters
    ----------
    function : Name
        A name of a function to minimize/maximize.

        Example: if the function is:
            def my_func(x): return x[0] or (x[1] and x[2])

            Use "my_func" as parameter.


    -=x=--=x=--=x=--=x=--=x=-

    Just one of these parameters are mandatory. If you don't know 
    exactly how binary solvers work, just inform the number of bits 
    (bits_count) and the default boundaries will be used. These 
    boundaries usually are enough to solve most problems.

    bits_count : Int
        The number of bits that compose the output vector.


    boundaries : List of Tuples
        A list of tuples containing the lower and upper boundaries 
        that will be applied over sigmoid or angle modulation function 
        to determine the probability to bit become 1.

        Example: A function F(b1, b2) = y with:
            (-5 <= b1 <= 5) and (-20 <= b2 <= 20) have the boundaries:
                [(-5,5), (-20,20)]

    Obs.:
        - If boundaries are set: 
            boundaries take the priority over the bits_count.

        - If boundaries are not set: 
            boundaries became (-2,2) to each bit in AMABC method or 
            (-10,10) to each bit in BABC method.

    -=x=--=x=--=x=--=x=--=x=-


    [method] : String --optional-- (default: 'am')
        Select the applied solver:
            - If method = 'am' : (default)
                Applied Angle Modulated ABC (AMABC).

            - If method = 'bin' : 
                Applied Binary ABC (BABC).


    [colony_size] : Int --optional-- (default: 40)
        A value that determines the number of bees in algorithm. Half 
        of this amount determines the number of points analyzed 
        (food sources).

        According articles, half of this number determines the amount 
        of Employed bees and other half is Onlooker bees.


    [scouts] : Float --optional-- (default: 0.5)
        Determines the limit of tries for scout bee discard a food 
        source and replace for a new one.
            - If scouts = 0 : 
                Scout_limit = colony_size * dimension

            - If scouts = (0 to 1) : 
                Scout_limit = colony_size * dimension * scouts
                    Obs.: scouts = 0.5 is used in [3] as benchmark.

            - If scouts >= 1 : 
                Scout_limit = scouts

        Obs.1: Scout_limit is rounded down in all cases.

        Obs.2: In Binary form, the scouts tends to be more relevant 
        than in continuous form. If your problem are badly solved, 
        try to reduce the scouts value.


    [iterations] : Int --optional-- (default: 50)
        The number of iterations executed by algorithm.


    [min_max] : String --optional-- (default: 'min')
        Determines if algorithm will minimize or maximize the function.
            - If min_max = 'min' : (default)
                Locate the minimum of function.

            - If min_max = 'max' : 
                Locate the maximum of function.


    [nan_protection] : Boolean or Int --optional-- 
    (default (boolean): True)
        With "method='am'", this variable are used as a boolean.

        With "method='bin'", this variable determines the number of 
        times the function are recalculated when it returns a NaN. 
        (default (int): 3)

        If true or greater than 0, re-generate food sources that get 
        NaN value as cost during initialization or during scout 
        events. This option usually helps the algorithm stability 
        because, in rare cases, NaN values can lock the algorithm in 
        a infinite loop.

        Obs.: NaN protection can drastically increases calculation 
        time if analysed function has too many values of domain 
        returning NaN.


    [transfer_function] : String --optional-- (default: 'sigmoid')
        Only used with "method='bin'". Defines the transfer function 
        used to calculate the probability for each bit becomes '1'.

        The possibilities are explained on article [6]:
            - If transfer_function = 'sigmoid' : (default)
                S(x) = 1/(1 + exp(-x))

            - If transfer_function = 'sigmoid-2x' : 
                S(x) = 1/(1 + exp(-2*x))

            - If transfer_function = 'sigmoid-x/2' : 
                S(x) = 1/(1 + exp(-x/2))

            - If transfer_function = 'sigmoid-x/3' : 
                S(x) = 1/(1 + exp(-x/3))


    [result_format] : String --optional-- (default: 'best')
        Only used with "method='bin'". In a stochastic method, the 
        result vector are represented by a probability vector with
        the probability of each bit becomes "True". This property 
        determines how output bit vector will be estimated.
            - If result_format = 'average' :
                Returns the most frequent bit vector after 
                "best_model_iterations" simulations of the probability
                vector. This approach is ideal to solve problems with
                highly random elements.
                    Obs.: To use this method efficiently, use high 
                    values in "best_model_iterations". Usually values 
                    greater than 100 have better results.

            - If result_format = 'best' : (default)
                Returns the best result after "best_model_iterations" 
                simulations of the probability vector. This approach is 
                useful to solve highly noisy problems.


    [best_model_iterations] : int --optional-- 
    (default: iterations count)
        Only used with "method='bin'". Due stochastic aspect of 
        Binary form of particle based metaheuristic, after execution 
        of ABC, the cost function will be calculated 
        "best_model_iterations" times and the "best" or the "most 
        frequent" result will be returned.
            - If best_model_iterations = 0 : (default)
                Tries "iterations" times. 

            - If best_model_iterations = N : 
                Tries "N" times.

            Obs.: If "best_model_iterations" (or "iterations") is even, 
            then "best_model_iterations" is increased by one.


    [log_agents] : Boolean --optional-- (default: False)
        If true, beecolpy will register, before each iteration, the
        position of each food source. Useful to debug but, if there a
        high amount of food sources and/or iterations, this option
        drastically increases memory usage.


    [seed] : Int --optional-- (default: None)
        If defined as an int, set the seed used in all random process.


    Methods
    ----------
    fit()
        Execute the algorithm with defined parameters.

        Obs.: Returns a list with values found as minimum/maximum 
        coordinate.


    get_solution()
        Returns the value obtained after fit() the method.

        Parameters
        ----------
        [probability_vector] : bool --optional-- (default: False)
            Only used with "method='bin'". Returns the vector with 
            probability of each bit becomes "True". Useful to use 
            probability as component of stopping criteria or to 
            evaluate solution stability.
                - If probability_vector = True :
                    "get_solution" returns a vector with the 
                    probability of each bit becomes "True".

                - If probability_vector = False: (default)
                    "get_solution" returns the solution bit vector.


    get_status()
        Returns a tuple with:
            - Number of complete iterations executed
            - Number of scout events during iterations
            - Number of times that NaN protection was activated


    get_agents()
        Returns a list with the position of each food source during
        each iteration if "log_agents = True".

        Obs.: In binary form, this method returns the position of 
        each food source after transformation "binary -> continuous". 
        I.e. returns the values applied on angle modulation function 
        in AMABC or the values applied on transfer function in BABC.

        Parameters
        ----------
        [reset_agents] : bool --optional-- (default: False)
            If true, the food source position log will be cleaned in
            next fit().
"""