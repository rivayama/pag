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

