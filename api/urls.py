from django.conf.urls import include, url

from api import views

urlpatterns = [
    url(r'^projects/$', views.projects, name='projects'),
    url(r'^users/myself$', views.myself, name='myself'),
    url(r'^grade/(?P<project_id>[0-9]+)/$', views.grade, name='grade'),
    url(r'^summary/(?P<project_id>[0-9]+)/$', views.summary, name='summary'),
]
