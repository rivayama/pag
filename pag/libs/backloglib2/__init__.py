#!/usr/bin/env python
# -*- coding:utf-8 -*-

import os
from requests_oauthlib import OAuth2Session

import gevent

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


    def get_host(self):
        return self.host


    def fetch_token(self, auth_response_uri):
        return self.client.fetch_token(
            '%s/api/v2/oauth2/token' % (self.host),
            client_secret=client_secret,
            authorization_response=auth_response_uri
        )


    def get_projects(self):
        api = '%s/api/v2/projects' % (self.host)
        return self.client.get(api)


    def get_projects_detail(self, project_id):
        api = '%s/api/v2/projects/%s' % (self.host, project_id)
        return self.client.get(api)


    def get_myself(self):
        api = '%s/api/v2/users/myself' % (self.host)
        return self.client.get(api)


    def get_users(self, project_id):
        api = '%s/api/v2/projects/%s/users' % (self.host, project_id)
        return self.client.get(api)


    def get_issues(self, project_id, offset=0):
        api = '%s/api/v2/issues' % self.host
        params = {
            'projectId[]': project_id,
            'offset': offset,
            'count': 100,
        }
        return self.client.get(api, params=params)


    def get_comments(self, issue_id, is_parallel=False):
        api = '%s/api/v2/issues/%d/comments' % (self.host, issue_id)
        if is_parallel:
            self.results.append(self.client.get(api))
        else :
            return self.client.get(api)


    def get_count_issues(self, project_id):
        api = '%s/api/v2/issues/count?projectId[]=%s' % (self.host, project_id)
        return self.client.get(api)


    def get_count_issues_assigned(self, project_id, assigneeId):
        api = '%s/api/v2/issues/count?projectId[]=%s&assigneeId[]=%s' % (self.host, project_id, assigneeId)
        return self.client.get(api)


    def get_count_issues_assigned_status(self, project_id, assigneeId, statusId):
        api = '%s/api/v2/issues/count?projectId[]=%s&assigneeId[]=%s&statusId[]=%s' % (self.host, project_id, assigneeId, statusId)
        return self.client.get(api)


    def get_count_issues_status(self, project_id, statusId):
        api = '%s/api/v2/issues/count?projectId[]=%s&statusId[]=%s' % (self.host, project_id, statusId)
        return self.client.get(api)


    def get_comments_in_parallel(self, issue_ids):
        self.threads = []
        self.results = []
        for issue_id in issue_ids:
            self.threads.append(gevent.spawn(self.get_comments, issue_id, True))
        gevent.joinall(self.threads)
        return self.results

