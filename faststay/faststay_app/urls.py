from django.urls import path
from faststay_app.views.signup_view import SignupView
from faststay_app.views.get_all_users_view import GetAllUsersView
from faststay_app.views.login_view import LoginView 
from faststay_app.views.delete_hostel_details import DeleteHostelDetailsView
from faststay_app.views.add_hostel_pics_view import AddHostelPics
from faststay_app.views.add_room_pics_view import AddRoomPics
from faststay_app.views.delete_hostel_pics_view import DeleteHostelPics
from faststay_app.views.delete_kitchen_details_view import DeleteKitchenDetails
from faststay_app.views.display_allrooms_view import DisplayAllRoomsView
from faststay_app.views.add_securityinfo_view import AddSecurityInfoView
from faststay_app.views.delete_securityinfo_view import DeleteSecurityInfoView
from faststay_app.views.display_securityinfo_view import DisplayHostelSecurityInfoView
from faststay_app.views.update_securityinfo_view import UpdateSecurityInfoView
urlpatterns={
    path('signup/', SignupView.as_view(), name='signup'),
    path('users/all/', GetAllUsersView.as_view(), name='get_all_users'),
    path('login/', LoginView.as_view(), name='login'),
    path('hosteldetails/delete', DeleteHostelDetailsView.as_view(), name='delete_hostel_details'),
    path('hostel_pics/add', AddHostelPics.as_view(), name='add_hostel_pics'),
    path('room_pics/add', AddRoomPics.as_view(), name='add_room_pics'),
    path('hostel_pics/delete', DeleteHostelPics.as_view(), name='delete_hostel_pics'),
    path('kitchen/delete', DeleteKitchenDetails.as_view(), name='delete_kitchen_details'),
    path('display/all_rooms', DisplayAllRoomsView.as_view(), name='display_allrooms'),
    path('add/security_info', AddSecurityInfoView.as_view(), name='add_security_info'),
    path('delete/security_info', DeleteSecurityInfoView.as_view(), name='delete_security_info'),
    path('display/security_info', DisplayHostelSecurityInfoView.as_view(), name='display_security_info'),
    path('update/security_info', UpdateSecurityInfoView.as_view(), name='update_security_info'),
}
