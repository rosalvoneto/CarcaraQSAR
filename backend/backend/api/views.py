from django.shortcuts import render

from django.http import HttpResponse, JsonResponse

# Create your views here.
def index(request):
  json = {
    "token": "lknsflnfkadgnldfnbskdjsgnsfgns"
  }
  return JsonResponse(json)

def post(request):
  json = request.data
  return JsonResponse(json)