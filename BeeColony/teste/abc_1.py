from ecabc import ABC

def minimize_integers(integers):
  return sum(integers)

abc = ABC(10, minimize_integers)
abc.add_param(0, 1000, name='Int_1')
abc.add_param(0, 1000, name='Int_2')
abc.add_param(0, 1000, name='Int_3')
abc.add_param(0, 1000, name='Int_4')
abc.initialize()

for _ in range(100):
  abc.search()
  print('Average fitness: {}'.format(abc.average_fitness))
  print('Average obj. fn. return value: {}'.format(abc.average_ret_val))
  print('Best fitness score: {}'.format(abc.best_fitness))
  print('Best obj. fn. return value: {}'.format(abc.best_ret_val))
  print('Best parameters: {}\n'.format(abc.best_params))