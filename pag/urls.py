from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    url(r'^$', 'home.views.index', name='index'),
    url(r'^auth/$', 'home.views.auth', name='auth'),
    url(r'^callback/$', 'home.views.callback', name='callback'),
]
