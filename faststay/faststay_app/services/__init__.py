from .App_Services import add_app_suggestion_service
from .Hostel_Services import save_hostel_details
from .Kitchen_Services import Add_Kitchen_Detail_service, Update_Kitchen_Detail_service
from .Manager_Services import Add_Manager_Detail_Service, Update_Manager_Detail_Service, delete_Hostel_Manager_service
from .Mess_Services import Add_Mess_Detail_service, Add_New_Dish_Service, Update_Mess_Detail_service, Delete_Mess_Detail_service
from .Student_Services import Student_Detail_Service, Update_Student_Detail_Service
from .User_Services import register_user

__all__ = [
    "add_app_suggestion_service",
    "save_hostel_details",
    "Add_Kitchen_Detail_service",
    "Update_Kitchen_Detail_service",
    "Add_Manager_Detail_Service",
    "Update_Manager_Detail_Service",
    "delete_Hostel_Manager_service",
    "Add_Mess_Detail_service",
    "Add_New_Dish_Service",
    "Update_Mess_Detail_service",
    "Delete_Mess_Detail_service",
    "Student_Detail_Service",
    "Update_Student_Detail_Service",
    "register_user",
]
