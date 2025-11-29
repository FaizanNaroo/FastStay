from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services import Display_Hostel_Rooms_service
from faststay_app.serializers import Display_Hostel_Room_serializer

class Display_Hostel_Rooms_View(APIView):
    """
    Summary: Retrieve details of all rooms in a specific hostel.

    POST:
    Accepts JSON:
    {
        "p_HostelId": int    # Required, ID of the hostel
    }

    Returns:
    {
        "success": bool,       # True if rooms found, False otherwise
        "result": [            # List of room details
            {
                "p_FloorNo": int,
                "p_SeaterNo": int,
                "p_BedType": str,
                "p_WashroomType": str,
                "p_CupboardType": str,
                "p_RoomRent": float,
                "p_isVentilated": bool,
                "p_isCarpet": bool,
                "p_isMiniFridge": bool
            }
        ]
    }

    Notes:
    - Calls stored procedure `DisplayHostelRooms`.
    - Validates that the hostel exists and has rooms.
    - API response:
        * 200 OK if rooms found
        * 400 Bad Request if input is invalid or no rooms exist
    """
    
    @swagger_auto_schema(request_body=Display_Hostel_Room_serializer)
    def post(self, request):
        serializer = Display_Hostel_Room_serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = Display_Hostel_Rooms_service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'success': success, 'result': result}, status=status.HTTP_200_OK)
