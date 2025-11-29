from django.urls import path
from faststay_app.views.signup_view import signup_view
from faststay_app.views.get_all_users_view import get_all_users_view 
from faststay_app.views.login_view import login_view 
urlpatterns={
    path('signup/', signup_view, name='signup'),
    path('users/all/', get_all_users_view, name='get_all_users'),
    path('login/', login_view, name='login'),
}
