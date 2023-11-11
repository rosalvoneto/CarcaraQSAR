from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

# Create your views here.
def index(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse("login"))
    return render(request, "api/user.html")

def register(request):
    if request.method == 'GET':
        return render(request, 'api/register.html')
    else:
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        pais = request.POST.get('pais')
        departamento = request.POST.get('departamento')

        user = User.objects.filter(email=email).first()

        if user:
            return render(request, 'api/register.html', {
                "message": "Já existe um usuário com esse email!"
            })
        
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )
        user.save()

        return render(request, 'api/login.html')

def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "api/login.html", {
                "message": "Invalid credentials."
            })
    else:
        return render(request, "api/login.html")

def logout_view(request):
    logout(request)
    return render(request, "api/login.html", {
        "message": "Logged out."
    })