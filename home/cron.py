import cronjobs

from django.http import HttpRequest

from .models import Task
from api.views import compute_grade

@cronjobs.register
def grade():
    print('========== Start background grading ==========')
    try:
        tasks = Task.objects.all()
        print('%d tasks detected.' % len(tasks))
    except:
        print('No tasks. Abort.')
        return

    request = HttpRequest()

    for task in tasks:
        print('Execute grade api for project_id %d...' % task.project_id)
        request.session = {'space': task.space, 'token': task.token}
        request.GET     = {'force': 1, 'background': 1}
        try:
            compute_grade(request, task.project_id)
        except:
            print('Something error happened.')
        task.delete()
        print('End.')

    print('==============================================')
