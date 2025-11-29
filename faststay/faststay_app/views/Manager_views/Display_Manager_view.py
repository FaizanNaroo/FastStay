from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services import Display_Manager_service
from faststay_app.serializers import Display_Manager_serializer

class Display_Manager_View(APIView):
    """
    Summary: Retrieve details of a single hostel manager by Manager ID.

    POST:
    Accepts JSON:
    {
        "p_ManagerId": int   # Required, ID of the manager
    }

    Returns:
    {
        "success": bool,    # True if manager details retrieved successfully, False otherwise
        "result": {         # Manager details
            "p_PhotoLink": str,
            "p_PhoneNo": str,
            "p_Education": str,
            "p_ManagerType": str,
            "p_OperatingHours": int
        }
    }

    Notes:
    - Calls stored procedure `DisplayManager`.
    - Returns details such as photo link, phone number, education, manager type, and operating hours.
    - API response:
        * 201 Created with manager details if successful
        * 400 Bad Request if input is invalid or manager does not exist
    """
    
    @swagger_auto_schema(request_body=Display_Manager_serializer)
    def post(self, request):
        serializer = Display_Manager_serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = Display_Manager_service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'success': success, "result": result}, status=status.HTTP_201_CREATED)
