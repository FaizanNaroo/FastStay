from django.urls import path
from faststay_app.views import signup_view
urlpatterns={
    path('signup/', signup_view, name='signup'),
}


