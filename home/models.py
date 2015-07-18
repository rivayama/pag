from django.db import models
from django_pgjson.fields import JsonField

class Task(models.Model):
    space = models.CharField(max_length=30)
    token = JsonField()
    project_id = models.IntegerField()

