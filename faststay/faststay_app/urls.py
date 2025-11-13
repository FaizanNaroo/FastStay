from django.urls import path
from faststay_app.views.signup_view import SignupView
from faststay_app.views.get_all_users_view import GetAllUsersView
from faststay_app.views.login_view import LoginView 
urlpatterns={
    path('signup/', SignupView.as_view(), name='signup'),
    path('users/all/', GetAllUsersView.as_view(), name='get_all_users'),
    path('login/', LoginView.as_view(), name='login'),
}
