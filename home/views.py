from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from pag import utils

def index(request):
    context = {}
    try:
        # 以下はライブラリの動作確認。実際は利用しない。
        backlog = utils.backlog(request, request.session['space'], token=request.session['token'])
        context['projects'] = backlog.get_projects().json()
    except KeyError:
        pass
    return render(request, 'home/index.html', context)


# XXX CSRFトークンのチェックを無効にする
# Reactでフォームを描画するとトークンの埋め込みに別途処理が必要になるため
@csrf_exempt
def auth(request):
    backlog = utils.backlog(request, request.POST['space'])
    auth_url, state = backlog.auth_url()
    request.session['space'] = request.POST['space']
    request.session['state'] = state
    return redirect(auth_url)


def callback(request):
    backlog = utils.backlog(request, request.session['space'], state=request.session['state'])
    response_uri = request.build_absolute_uri(request.get_full_path()).replace('http', 'https')
    request.session['token'] = backlog.fetch_token(response_uri)
    return redirect('index')

