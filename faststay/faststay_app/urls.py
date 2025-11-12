from django.urls import path, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from faststay_app.views.signup_view import SignupView
from faststay_app.views.Student_Detail_Entry_view import Student_Detail_Entry_view
from faststay_app.views.Update_Student_Detail_view import Update_Student_Detail_view
from faststay_app.views.Add_App_Suggestion_view import Add_App_Suggestion_view
from faststay_app.views.Add_Manager_Details_view import Add_Manager_Details_view
from faststay_app.views.Update_Manager_Details_view import Update_Manager_Details_view

schema_view = get_schema_view(
    openapi.Info(
        title='FastStay API',
        default_version='v1',
        description='API documentation for FastStay',
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns=[
    path('signup/', SignupView.as_view(), name='signup'),
    path('UserDetail/', Student_Detail_Entry_view.as_view(), name='DetailEntry'),
    path('UpdateUserDetail/', Update_Student_Detail_view.as_view(), name='UpdateStudentDetail'),
    path('addAppSuggestion/', Add_App_Suggestion_view.as_view(), name='Add_App_Suggestion'),
    path('AddManagerDetails/', Add_Manager_Details_view.as_view(), name='Add_Manager_Details'),
    path('UpdateManagerDetails/', Update_Manager_Details_view.as_view(), name='Update_Manager_Details'),

    # Swagger URLs
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]


