from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = [
    url(r'^$', 'home.views.index', name='index'),
    url(r'^auth/$', 'home.views.auth', name='auth'),
    url(r'^callback/$', 'home.views.callback', name='callback'),
    url(r'^api/', include('api.urls', namespace='api')),
]


urlpatterns += patterns('django.contrib.staticfiles.views',
    url(r'^static/(?P<path>.*)$', 'serve', kwargs={"insecure": True}),
)
