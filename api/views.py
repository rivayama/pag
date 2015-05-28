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
    grade = [
        {"grade": [
            {"title": "grade_item_1", "count":  8, "all_count": 20, "point": 18},
            {"title": "grade_item_2", "count":  4, "all_count": 19, "point": 14},
            {"title": "grade_item_3", "count": 11, "all_count": 13, "point": 16},
            {"title": "grade_item_4", "count":  8, "all_count": 29, "point": 11},
        ]},
        {"advice": [
            {"message": "hogehoge", "issues": [1, 2, 3]},
            {"message": "hogehoge", "issues": [1, 2, 3]},
            {"message": "hogehoge", "issues": [1, 2, 3]},
            {"message": "hogehoge", "issues": [1, 2, 3]},
        ]},
    ]
    return JsonResponse(grade, safe=False)

