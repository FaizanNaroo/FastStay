from .App_Serializers import Add_App_Suggestions_serializer
from .Hostel_Serializers import Hostel_Details_serializer
from .Kitchen_Serializers import Add_Kitchen_Details_serializer, Update_Kitchen_Details_serializer
from .Manager_Serializers import Add_Manager_Details_serializer, Update_Manager_Details_Serializer, Delete_Hostel_Manager_serializer
from .Mess_Serializers import Add_Mess_Detail_serializer, Update_Mess_Detail_serializer, Add_New_Dish_serializer, Delete_Mess_Details_serializer
from .Student_Serializers import Student_Details_serializer, Update_StudentDetails_serializer
from .User_Serializers import SignUp_serializer

__all__ = [
    "SignUp_serializer",
    "Add_App_Suggestions_serializer",
    "Hostel_Details_serializer",
    "Add_Kitchen_Details_serializer",
    "Update_Kitchen_Details_serializer",
    "Add_Manager_Details_serializer",
    "Update_Manager_Details_Serializer",
    "Delete_Hostel_Manager_serializer",
    "Add_Mess_Detail_serializer",
    "Update_Mess_Detail_serializer",
    "Add_New_Dish_serializer",
    "Delete_Mess_Details_serializer",
    "Student_Details_serializer",
    "Update_StudentDetails_serializer",
]
