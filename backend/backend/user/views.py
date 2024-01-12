from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.decorators import api_view

from django.contrib.auth.hashers import make_password

from .models import User

# Create your here.

@api_view(['POST'])
def createUser_view(request):

  # Recupere os dados do corpo da requisição
  data = request.data

  # Faça algo com os dados
  username = data.get('username')
  email = data.get('email')
  country = data.get('country')
  institution = data.get('institution')
  password = make_password(data.get('password'))

  print(username)
  print(email)
  print(country)
  print(institution)
  print(password)

  # Realize as operações desejadas com os dados
  user = User()
  user.create_user(username, email, country, institution, password)

  # Retorne uma resposta, por exemplo, um JSON
  resposta = {
    'message': f'Usuário "{username}" criado com sucesso!',
  }
  return Response(resposta, status=200)