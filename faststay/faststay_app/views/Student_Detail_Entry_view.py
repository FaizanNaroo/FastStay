from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services.Student_Detail_service import Student_Detail_Service
from faststay_app.serializers.Student_Details_Serializer import Student_Details_Serializer

class Student_Detail_Entry_view(APIView):
    """
    Summary: Register student demographic details.

    POST:
    Accepts JSON:
    {
        "UserId": int,          # Required, must exist in Users table
        "Semester": int,        # Required, 1-8
        "Department": str,      # Optional, department name
        "Batch": int,           # Optional, batch number
        "RoomateCount": int,    # Required, 1-6
        "UniDistance": float,   # Optional, distance to university in km
        "isAcRoom": bool,       # Optional, AC room flag
        "isMess": bool,         # Optional, mess flag
        "BedType": str,         # Required, 'Bed', 'Mattress', 'Anyone'
        "WashroomType": str     # Required, 'RoomAttached' or 'Community'
    }

    Returns:
    {
        "message": str,         # "Details registered" or error message
        "result": bool          # True if successfully stored, False otherwise
    }

    Notes:
    - Calls stored procedure `EnterStudentDetails`.
    - Validates `UserId` exists and input values are within allowed ranges.
    - Returns 400 if input is invalid or `UserId` does not exist.
    - Returns 201 Created if successfully registered.
    """


    @swagger_auto_schema(request_body=Student_Details_Serializer)
    def post(self, request):
        serializer = Student_Details_Serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer._errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = Student_Detail_Service('EnterStudentDetails', serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'message': 'Data Entered Successfully', "result": success}, status=status.HTTP_201_CREATED)
