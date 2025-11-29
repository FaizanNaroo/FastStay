from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services import Display_Student_service
from faststay_app.serializers import Display_Student_serializer

class Display_Student_View(APIView):
    """
    Summary: Display detailed information of a single student.

    POST:
    Accepts JSON:
    {
        "p_StudentId": int  # Required, ID of the student
    }

    Returns:
    {
        "success": bool,   # True if student found, False otherwise
        "result": {        # Student demographic details
            "p_Semester": int,
            "p_Department": str,
            "p_Batch": int,
            "p_RoomateCount": int,
            "p_UniDistance": float,
            "p_isAcRoom": bool,
            "p_isMess": bool,
            "p_BedType": str,
            "p_WashroomType": str
        }
    }

    Notes:
    - Calls stored procedure `DisplayStudent`.
    - Returns all student demographic details for the given student ID.
    - API response:
        * 200 OK with student details if found
        * 400 Bad Request if input is invalid or student does not exist
    """
    
    @swagger_auto_schema(request_body=Display_Student_serializer)
    def post(self, request):
        serializer = Display_Student_serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = Display_Student_service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'success': success, "result": result}, status=status.HTTP_200_OK)
