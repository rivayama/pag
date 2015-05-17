import os
from django.shortcuts import render, redirect

from requests_oauthlib import OAuth2Session

client_id     = os.environ.get('BACKLOG_CLIENT_ID')
client_secret = os.environ.get('BACKLOG_CLIENT_SECRET')
auth_path     = '/OAuth2AccessRequest.action'
token_path    = '/api/v2/oauth2/token'


def index(request):
    context = {}
    try:
        client = OAuth2Session(client_id, token=request.session['token'])
        context['projects'] = client.get(projects_url(request.session['backlog_space'])).json()
    except KeyError:
        pass
    return render(request, 'home/index.html', context)


def auth(request):
    client = OAuth2Session(client_id)
    authorization_url, state = client.authorization_url(auth_base_url(request.POST['space']))
    request.session['backlog_space'] = request.POST['space']
    request.session['oauth_state'] = state
    return redirect(authorization_url)


def callback(request):
    client = OAuth2Session(client_id, state=request.session['oauth_state'])
    response_url = request.build_absolute_uri(request.get_full_path()).replace('http', 'https')
    token = client.fetch_token(
        token_url(request.session['backlog_space']),
        client_secret=client_secret,
        authorization_response=response_url
    )
    request.session['token'] = token
    return redirect('index')



def auth_base_url(space):
    return 'https://' + space + '.backlog.jp' + auth_path

def token_url(space):
    return 'https://' + space + '.backlog.jp' + token_path

def projects_url(space):
    return 'https://' + space + '.backlog.jp' + '/api/v2/projects'
