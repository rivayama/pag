#!/usr/bin/env python
# -*- coding:utf-8 -*-

import os

from requests_oauthlib import OAuth2Session

client_id     = os.environ.get('BACKLOG_CLIENT_ID')
client_secret = os.environ.get('BACKLOG_CLIENT_SECRET')

class Backlog():

    def __init__(self, space, state=None, token=None, token_updater=None):
        self.client = OAuth2Session(client_id, state=state, token=token, token_updater=token_updater)
        self.host = 'https://' + space + '.backlog.jp'


    def fetch(self, api):
        try:
            return self.client.get(api).json()
        except:
            # XXX なぜかTokenExpiredErrorが拾えないので、後で直す
            self.client.token = self.refresh_token()
            return self.fetch(api)


    def auth_url(self):
        base_url = self.host + '/OAuth2AccessRequest.action'
        return self.client.authorization_url(base_url)


    def fetch_token(self, auth_response_uri):
        return self.client.fetch_token(
            self.host + '/api/v2/oauth2/token',
            client_secret=client_secret,
            authorization_response=auth_response_uri
        )


    def refresh_token(self):
        api = self.host + '/api/v2/oauth2/token'
        extra = {
            'client_id': client_id,
            'client_secret': client_secret,
        }
        return self.client.refresh_token(api, **extra)


    def get_projects(self):
        api = self.host + '/api/v2/projects'
        return self.fetch(api)

