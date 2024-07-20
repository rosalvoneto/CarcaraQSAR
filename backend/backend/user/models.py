from copyreg import constructor
from django.db import models

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# Create your models here.

class MyUserManager(BaseUserManager):
  def create_user(
    self, email, username, password=None, 
    country=None, institution=None, **extra_fields
  ):
    if not email:
      raise ValueError('O endereço de e-mail deve ser fornecido!')
    email = self.normalize_email(email)
    user = self.model(email=email, username=username, country=country, institution=institution, **extra_fields)
    user.set_password(password)
    user.save(using=self._db)
    return user

  def create_superuser(self, email, username, password=None, **extra_fields):
    extra_fields.setdefault('is_staff', True)
    extra_fields.setdefault('is_superuser', True)
    return self.create_user(email, username, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin, models.Model):
  username = models.CharField(max_length=200)
  email = models.EmailField(unique=True)
  country = models.CharField(max_length=200, blank=True, null=True)
  institution = models.CharField(max_length=200, blank=True, null=True)
  password = models.CharField(max_length=200)

  is_staff = models.BooleanField(default=False)

  objects = MyUserManager()

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = ['username', 'country', 'institution', 'password']

  def create_user(self, username, email, country, institution, password):
    self.username = username
    self.email = email
    self.country = country
    self.institution = institution
    self.password = password
    self.save()

  def __str__(self):
    return self.email