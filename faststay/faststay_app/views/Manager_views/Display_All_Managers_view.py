from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services import Display_All_Managers_service

class Display_All_Managers_View(APIView):
    """
    Summary: Retrieve details of all hostel managers (Admin view).

    GET:

    Returns:
    {
        "success": bool,   # True if managers retrieved successfully, False otherwise
        "result": [        # List of managers
            {
                "p_ManagerId": int,
                "p_PhotoLink": str,
                "p_PhoneNo": str,
                "p_Education": str,
                "p_ManagerType": str,
                "p_OperatingHours": int
            }
        ]
    }

    Notes:
    - Calls stored procedure `DisplayAllManagers`.
    - Returns full details of all managers in the system.
    - API response:
        * 200 OK with list of managers if successful
        * 400 Bad Request if any error occurs
    """
    
    @swagger_auto_schema(
            operation_description="Display all managers",
            responses={200: "Managers retrieved successfully"}
    )
    def get(self, request):
        
        #call service
        success, result = Display_All_Managers_service()
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'success': success, 'result': result}, status=status.HTTP_200_OK)