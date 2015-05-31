from django.http import JsonResponse
from django.views.decorators.http import require_GET
from pag import utils

@require_GET
def projects(request):
    try:
        backlog = utils.backlog(request, request.session['space'], token=request.session['token'])
        projects = backlog.get_projects().json()
    except KeyError:
        projects = []
    return JsonResponse(projects, safe=False)


@require_GET
def grade(request, project_id):
    try:
        backlog = utils.backlog(request, request.session['space'], token=request.session['token'])
        grade = backlog.get_grade(project_id)
    except KeyError:
        grade = []
    return JsonResponse(grade, safe=False)

