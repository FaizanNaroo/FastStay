from django.urls import path, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from faststay_app.views import SignupView
from faststay_app.views import Add_App_Suggestion_view
from faststay_app.views import Student_Detail_Entry_view, Update_Student_Detail_view
from faststay_app.views import Add_Manager_Details_view, Update_Manager_Details_view, delete_Hostel_Manager_view
from faststay_app.views import Add_Hostel_Details_view, Update_Hostel_Details_view
from faststay_app.views import Add_Kitchen_Details_view, Update_Kitchen_Details_view
from faststay_app.views import Add_Mess_Details, Update_Mess_Details, Delete_Mess_Details_view, Add_New_Dish_View

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
    path('UserDetail/add/', Student_Detail_Entry_view.as_view(), name='DetailEntry'),
    path('UserDetail/update/', Update_Student_Detail_view.as_view(), name='UpdateStudentDetail'),
    path('addAppSuggestion/', Add_App_Suggestion_view.as_view(), name='Add_App_Suggestion'),
    path('ManagerDetails/add/', Add_Manager_Details_view.as_view(), name='Add_Manager_Details'),
    path('ManagerDetails/update/', Update_Manager_Details_view.as_view(), name='Update_Manager_Details'),
    path('ManagerDetails/delete/', delete_Hostel_Manager_view.as_view(), name='Delete_Hostel_Manager'),
    path('hostel/add/', Add_Hostel_Details_view.as_view(), name='add_hostel'),
    path('hostel/update/', Update_Hostel_Details_view.as_view(), name='update_hostel'),
    path('kitchenDetails/add/', Add_Kitchen_Details_view.as_view(), name='Add_Kitchen_Detail'),
    path('kitchenDetails/update/', Update_Kitchen_Details_view.as_view(), name='Update_Kitchen_Detail'),
    path('messDetails/add/', Add_Mess_Details.as_view(), name='Add_Mess_Detail'),
    path('messDetails/update/', Update_Mess_Details.as_view(), name='Update_Mess_Detail'),
    path('messDetails/delete/', Delete_Mess_Details_view.as_view(), name='Delete_Mess_Detail'),
    path('messDetails/AddNewDish/', Add_New_Dish_View.as_view(), name='Add_Mess_Dish'),


    # Swagger URLs
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]


