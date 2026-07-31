from django.urls import path
from . import views

urlpatterns = [
    path('contacts/', views.contact_list, name='contact-list'),
    path('contacts/<int:contact_id>/', views.contact_detail, name='contact-detail'),
    path('opportunities/', views.opportunity_list, name='opportunity-list'),
    path(
        'opportunities/<int:opportunity_id>/',
        views.opportunity_detail,
        name='opportunity-detail',
    ),
    path(
        'opportunities/<int:opportunity_id>/interactions/',
        views.interaction_list,
        name='interaction-list',
    ),
    path('dashboard/', views.dashboard, name='dashboard'),
]
