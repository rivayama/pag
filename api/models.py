from django.db import models
from django_pgjson.fields import JsonBField


class Grade(models.Model):
    data = JsonBField()

    def find_by_project_id(self, project_id):
        results = Grade.objects.filter(data__jcontains={"summary": {"project_id": project_id}})
        if (results and results[0]):
            return results[0]
        return None

