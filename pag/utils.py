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


def get_point(numer, denom, max_point):
    try:
        point = max_point * (numer / denom)
    except ZeroDivisionError:
        point = 0
    return point


def get_row(title, numer, denom, point, advice):
    return [title, int(numer), int(denom), int(point), advice]


def append_adv_issues(issue_list, append_issue, point):
    if point < 1: issue_list.append(append_issue)
    return issue_list


def set_Dict(key_list, rows):
    result = [""] * len(rows)
    for i in range(len(rows)):
        result[i] = {}
        for j in range(len(key_list)):
            result[i][key_list[j]] = rows[i][j]
    return result

