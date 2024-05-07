from bitstring import BitArray 
from random import randint

class Problem:

  def generateInitPopulation(
      self, 
      limit_inferior: int, 
      limit_superior: int, 
      bitstring_length: int, 
      quantity: int
    ):
    population = []
    values = []

    for _ in range(quantity):
      value = int(randint(limit_inferior, limit_superior))
      values.append(value)

    for value in values:
      value_bitstring = BitArray(int = value, length = int(bitstring_length))
      population.append(value_bitstring)
    
    return population
