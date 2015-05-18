import os
from django.shortcuts import render, redirect

from pag.libs.backloglib2 import Backlog

def index(request):
    context = {}
    try:
        client = Backlog(request.session['space'], token=request.session['token'])
        context['projects'] = client.get_projects()
    except KeyError:
        pass
    return render(request, 'home/index.html', context)


def auth(request):
    client = Backlog(request.POST['space'])
    auth_url, state = client.auth_url()
    request.session['space'] = request.POST['space']
    request.session['state'] = state
    return redirect(auth_url)


def callback(request):
    client = Backlog(request.session['space'], state=request.session['state'])
    response_uri = request.build_absolute_uri(request.get_full_path()).replace('http', 'https')
    request.session['token'] = client.fetch_token(response_uri)
    return redirect('index')

