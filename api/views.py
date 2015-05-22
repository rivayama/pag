from django.http import JsonResponse
from pag import utils

def projects(request):
    try:
        backlog = utils.backlog(request, request.session['space'], token=request.session['token'])
        projects = backlog.get_projects().json()
    except KeyError:
        projects = {}
    return JsonResponse(projects, safe=False)


def grade(request):
    grade = {"foo": "baa"}
    return JsonResponse(grade)

