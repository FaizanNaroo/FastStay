from .App_views import Add_App_Suggestion_view
from .Hostel_views import Add_Hostel_Details_view, Update_Hostel_Details_view
from .Kitchen_views import Add_Kitchen_Details_view, Update_Kitchen_Details_view
from .Manager_views import Add_Manager_Details_view, Update_Manager_Details_view, delete_Hostel_Manager_view
from .Mess_views import Add_Mess_Details, Add_New_Dish_View, Update_Mess_Details, Delete_Mess_Details_view
from .Student_views import Student_Detail_Entry_view, Update_Student_Detail_view
from .User_views import SignupView

__all__ = [
    "Add_App_Suggestion_view",
    "Add_Hostel_Details_view",
    "Update_Hostel_Details_view",
    "Add_Kitchen_Details_view",
    "Update_Kitchen_Details_view",
    "Add_Manager_Details_view",
    "Update_Manager_Details_view",
    "delete_Hostel_Manager_view",
    "Add_Mess_Details",
    "Add_New_Dish_View",
    "Update_Mess_Details",
    "Delete_Mess_Details_view",
    "Student_Detail_Entry_view",
    "Update_Student_Detail_view",
    "SignupView",
]
