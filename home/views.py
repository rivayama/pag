from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from pag import utils

from django.http import HttpRequest
from api.views import compute_grade
import re


def index(request):
    return render(request, 'home/index.html', {})


# XXX CSRFトークンのチェックを無効にする
# Reactでフォームを描画するとトークンの埋め込みに別途処理が必要になるため
@csrf_exempt
def auth(request):
    space = request.POST['space']
    if not space or not re.match(r'^\w+$', space):
        return render(request, 'home/index.html', {})

    backlog = utils.backlog(request, space)
    auth_url, state = backlog.auth_url()
    request.session['space'] = space
    request.session['state'] = state
    return redirect(auth_url)


def callback(request):
    backlog = utils.backlog(request, request.session['space'], state=request.session['state'])
    response_uri = request.build_absolute_uri(request.get_full_path()).replace('http', 'https')
    request.session['token'] = backlog.fetch_token(response_uri)
    return redirect('index')


def signout(request):
    request.session.flush()
    return redirect('index')


def collect(request):
    backlog = utils.backlog(request, request.session['space'], token=request.session['token'])
    projects = backlog.get_projects().json()

    data = []
    for project in projects:
        grade = compute_grade(request, project['id'])
        try:
            if grade['summary']['issue_count'] < 80: continue
        except KeyError:
            continue
        d = {}
        d['name']  = grade['summary']['project_name']
        d['total'] = grade['summary']['point']
        for detail in grade['detail']:
            d[detail['title']] = detail['point']
        data.append(d)

    return render(request, 'home/collect.html', {'data': data})

