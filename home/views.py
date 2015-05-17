import os
from django.shortcuts import render, redirect

from requests_oauthlib import OAuth2Session

client_id     = os.environ.get('BACKLOG_CLIENT_ID')
client_secret = os.environ.get('BACKLOG_CLIENT_SECRET')
auth_path     = '/OAuth2AccessRequest.action'
token_path    = '/api/v2/oauth2/token'


def index(request):
    return render(request, 'home/index.html', {})


def auth(request):
    client = OAuth2Session(client_id)
    auth_base_url = 'https://' + request.POST['space'] + '.backlog.jp' + auth_path
    authorization_url, state = client.authorization_url(auth_base_url)
    return redirect(authorization_url)


def callback(request):
    context = {'auth_response': request.path}
    return render(request, 'home/callback.html', context)

