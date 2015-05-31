import logging

from pag.libs.backloglib2 import Backlog

logger = logging.getLogger('django-site')

def debug(msg, name=None):
    if name:
        msg = "%s = %s" % (name, msg)
    logger.debug(msg)

def backlog(request, space, state=None, token=None):
    def token_updater(token):
        request.session['token'] = token
    return Backlog(space, state=state, token=token, token_updater=token_updater)


def get_linear_point(strcount, strminimum=100, strmax=400, too_much=1000):
    point = 0
    if strminimum <= strcount and strcount <= strmax:
        point = 1
    elif too_much < strcount:
        point = 0
    elif strcount < strminimum:
        point = _get_linear_point(strcount, strminimum)
    elif strcount > strmax:
        point = 1 -_get_linear_point(strcount - strmax, too_much - strmax)
    return point

def _get_linear_point(strcount, amount):
    return round(strcount / amount,1)

def get_row(title, numer, denom, max_point):
    try:
        point = round(max_point * (numer / denom),0)
    except ZeroDivisionError:
        point = 0
    return [title, numer, denom, point]

def append_imp_issues(issue_list, append_issue, point):
    if point < 1: issue_list.append(append_issue)
    return issue_list


