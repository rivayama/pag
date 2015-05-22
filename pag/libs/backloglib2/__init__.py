#!/usr/bin/env python
# -*- coding:utf-8 -*-

import os

from requests_oauthlib import OAuth2Session

client_id     = os.environ.get('BACKLOG_CLIENT_ID')
client_secret = os.environ.get('BACKLOG_CLIENT_SECRET')

class Backlog():

    def __init__(self, space, state=None, token=None, token_updater=None):
        self.host = 'https://%s.backlog.jp' % (space)
        refresh_url = '%s/api/v2/oauth2/token' % (self.host)
        extra = {
            'client_id': client_id,
            'client_secret': client_secret,
        }
        self.client = OAuth2Session(client_id, state=state, token=token,
                auto_refresh_kwargs=extra, auto_refresh_url=refresh_url,
                token_updater=token_updater)


    def auth_url(self):
        base_url = '%s/OAuth2AccessRequest.action' % (self.host)
        return self.client.authorization_url(base_url)


    def fetch_token(self, auth_response_uri):
        return self.client.fetch_token(
            '%s/api/v2/oauth2/token' % (self.host),
            client_secret=client_secret,
            authorization_response=auth_response_uri
        )


    def get_projects(self):
        api = '%s/api/v2/projects' % (self.host)
        return self.client.get(api)


    def get_users(self, project_id):
        api = '%s/api/v2/projects/%d/users' % (self.host, project_id)
        return self.client.get(api)


    def get_issues(self, project_id):
        api = '%s/api/v2/issues' % (self.host)
        params = {'projectId[]': project_id}
        return self.client.get(api, params)


    def get_comment(self, issue_id):
        api = '%s/api/v2/issues/%d/comments' % (self.host, issue_id)
        return self.client.get(api)

