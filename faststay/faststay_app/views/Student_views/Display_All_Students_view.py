from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services import Display_All_Students_service

class Display_All_Students_View(APIView):
    """
    Summary: Retrieve all students' demographic details (Admin only).

    GET:

    Returns:
    {
        "success": bool,   # True if student list retrieved successfully, False otherwise
        "result": [        # List of student demographic details
            {
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
        ]
    }

    Notes:
    - Calls stored procedure `DisplayAllStudents`.
    - Returns all student demographic details in the system.
    - API response:
        * 200 OK with list of students if successful
        * 400 Bad Request if any error occurs
    """
    
    @swagger_auto_schema()
    def get(self, request):
        
        #call service
        success, result = Display_All_Students_service()
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'success': success, 'result': result}, status=status.HTTP_200_OK)