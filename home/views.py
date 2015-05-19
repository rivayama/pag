import os
from django.shortcuts import render, redirect

from pag.libs.backloglib2 import Backlog

def index(request):
    context = {}
    try:
        backlog = __init_backlog(request, request.session['space'], token=request.session['token'])
        context['projects'] = backlog.get_projects()
    except KeyError:
        pass
    return render(request, 'home/index.html', context)


def auth(request):
    backlog = __init_backlog(request, request.POST['space'])
    auth_url, state = backlog.auth_url()
    request.session['space'] = request.POST['space']
    request.session['state'] = state
    return redirect(auth_url)


def callback(request):
    backlog = __init_backlog(request, request.session['space'], state=request.session['state'])
    response_uri = request.build_absolute_uri(request.get_full_path()).replace('http', 'https')
    request.session['token'] = backlog.fetch_token(response_uri)
    return redirect('index')


# No route for this. Provate use.
def __init_backlog(request, space, state=None, token=None):
    def token_updater(token):
        request.session['token'] = token
    return Backlog(space, state=state, token=token, token_updater=token_updater)

