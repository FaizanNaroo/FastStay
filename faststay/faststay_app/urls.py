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
from faststay_app.views.rating_views.add import AddHostelRatingView
from faststay_app.views.rating_views.update import UpdateHostelRatingView
from faststay_app.views.rating_views.delete import DeleteHostelRatingView
from faststay_app.views.rating_views.display import DisplayRatingsView
from faststay_app.views.display_views.detail_all_hostels import DisplayAllHostelsView
from faststay_app.views.display_views.details_hostel_mess import DetailsHostelMess
from faststay_app.views.display_views.details_kitchen import DetailsKitchen
from faststay_app.views.display_views.hostel_pic import HostelPicView
from faststay_app.views.display_views.room_pic import RoomPicView
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
    path('add/hostel_rating', AddHostelRatingView.as_view(), name='add_hostel_rating'),
    path('update/hostel_rating', UpdateHostelRatingView.as_view(), name='update_hostel_rating'),
    path('delete/hostel_rating', DeleteHostelRatingView.as_view(), name='delete_hostel_rating'),
    path('display/hostel_rating', DisplayRatingsView.as_view(), name='display_hostel_rating'),
    path('display/all_hostels', DisplayAllHostelsView.as_view(), name='display_all_hostels'),
    path('display/hostel_mess', DetailsHostelMess.as_view(), name='display_details_mess'),
    path('display/details_kitchen', DetailsKitchen.as_view(), name='display_details_kitchen'),
    path('display/hostel_pic',HostelPicView.as_view(), name='display_hostel_pic'),
    path('display/room_pic',RoomPicView.as_view(), name='display_room_pic'),
}
