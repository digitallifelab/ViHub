"""BindHub URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from Hub.views import ElementViewSet, MembersViewSet, FavoriteViewSet, set_favorite
from connect.views import AccountViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'elements', ElementViewSet)
router.register(r'element-members', MembersViewSet)
router.register(r'element-favorite', FavoriteViewSet)
router.register(r'users', AccountViewSet)

# hello_world
urlpatterns = [
    url(r'^', include('Hub.urls', namespace='hub')),
    url(r'^admin/', admin.site.urls),
    url(r'^connect/', include('connect.urls', namespace='connect')),
    # url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^rest/', include(router.urls)),
    url(r'^set_favorite/(?P<id_obj>\d+)$', set_favorite),
]
