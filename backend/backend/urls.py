"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import routers
from myapp import views

router = routers.DefaultRouter()
router.register(r'umbrellas', views.UmbrellaView, 'umbrella')
router.register(r'constants', views.ConstantView, 'constant')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    re_path(r'api/reservations/$', views.ReservationList.as_view(), name='reservation-list'),
    re_path(r'api/reservations/(?P<pk>[0-9]+)/$', views.ReservationDetail.as_view(), name='reservation-detail'),
    re_path(r'api/subscriptions/$', views.SubscriptionList.as_view(), name='subscription-list'),
    re_path(r'api/subscriptions/(?P<pk>[0-9]+)/$', views.SubscriptionDetail.as_view(), name='subscription-detail'),
    # re_path(r'api/umbrella-list/$', views.CustomUmbrellaList, name='umbrella-list'),
    re_path(r'api/sunbeds-count/$', views.SunbedsFreeView.as_view(), name='sunbeds-count'),
    re_path(r'api/reserved-umbrella-count/$', views.ReservedUmbrellaView.as_view(), name='reserved-umbrella-count'),
    re_path(r'api/print-ticket/$', views.PrintTicketView.as_view(), name='print-ticket'),
    re_path(r'api/get-matrix/$', views.HomeView.as_view(), name='get-matrix'),
    re_path(r'api/free-umbrella-reservation/$', views.FreeUmbrellaReservationView.as_view(), name='free-umbrella-reservation')
]
