from django.urls import path
from faststay_app.views.signup_view import SignupView
from faststay_app.views.get_all_users_view import GetAllUsersView
from faststay_app.views.login_view import LoginView 
from faststay_app.views.delete_hostel_details import DeleteHostelDetailsView
from faststay_app.views.add_hostel_pics_view import AddHostelPics
from faststay_app.views.add_room_pics_view import AddRoomPics
from faststay_app.views.delete_hostel_pics_view import DeleteHostelPics
from faststay_app.views.delete_kitchen_details_view import DeleteKitchenDetails
urlpatterns={
    path('signup/', SignupView.as_view(), name='signup'),
    path('users/all/', GetAllUsersView.as_view(), name='get_all_users'),
    path('login/', LoginView.as_view(), name='login'),
    path('hosteldetails/delete', DeleteHostelDetailsView.as_view(), name='delete_hostel_details'),
    path('hostel_pics/add', AddHostelPics.as_view(), name='add_hostel_pics'),
    path('room_pics/add', AddRoomPics.as_view(), name='add_room_pics'),
    path('hostel_pics/delete', DeleteHostelPics.as_view(), name='delete_hostel_pics'),
    path('kitchen/delete', DeleteKitchenDetails.as_view(), name='delete_kitchen_details'),
}
