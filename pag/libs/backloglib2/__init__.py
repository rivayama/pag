#!/usr/bin/env python
# -*- coding:utf-8 -*-

import os

from requests_oauthlib import OAuth2Session

client_id     = os.environ.get('BACKLOG_CLIENT_ID')
client_secret = os.environ.get('BACKLOG_CLIENT_SECRET')

class Backlog():

    def __init__(self, space, state=None, token=None, token_updater=None):
        self.client = OAuth2Session(client_id, state=state, token=token, token_updater=token_updater)
        self.host = 'https://%s.backlog.jp' % (space)


    def fetch(self, api, params={}):
        try:
            return self.client.get(api, params=params)
        except:
            # XXX なぜかTokenExpiredErrorが拾えないので、後で直す
            self.client.token = self.refresh_token()
            return self.fetch(api)


    def auth_url(self):
        base_url = '%s/OAuth2AccessRequest.action' % (self.host)
        return self.client.authorization_url(base_url)


    def fetch_token(self, auth_response_uri):
        return self.client.fetch_token(
            '%s/api/v2/oauth2/token' % (self.host),
            client_secret=client_secret,
            authorization_response=auth_response_uri
        )


    def refresh_token(self):
        api = '%s/api/v2/oauth2/token' % (self.host)
        extra = {
            'client_id': client_id,
            'client_secret': client_secret,
        }
        return self.client.refresh_token(api, **extra)


    def get_projects(self):
        api = '%s/api/v2/projects' % (self.host)
        return self.fetch(api)


    def get_users(self, project_id):
        api = '%s/api/v2/projects/%s/users' % (self.host, project_id)
        return self.fetch(api)


    def get_issues(self, project_id):
        api = '%s/api/v2/issues' % (self.host)
        params = {'projectId[]': project_id}
        return self.fetch(api, params)


    def get_comment(self, issue_id):
        api = '%s/api/v2/issues/%s/comments' % (self.host, issue_id)
        return self.fetch(api)

