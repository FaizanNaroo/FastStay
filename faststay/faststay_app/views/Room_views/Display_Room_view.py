from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services import Display_Room_service
from faststay_app.serializers import Display_Room_serializer

class Display_Room_View(APIView):
    """
    Summary: Retrieve details of a single room in a hostel.

    POST:
    Accepts JSON:
    {
        "p_HostelId": int,    # Required, ID of the hostel
        "p_RoomNo": int       # Required, room number to display
    }

    Returns:
    {
        "success": bool,       # True if room found, False otherwise
        "result": {            # Room details if found
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
    }

    Notes:
    - Calls stored procedure `DisplaySingleRoom`.
    - Validates that the room exists in the specified hostel.
    - API response:
        * 200 OK if room found
        * 400 Bad Request if input is invalid or room does not exist
    """
    
    @swagger_auto_schema(request_body=Display_Room_serializer)
    def post(self, request):
        serializer = Display_Room_serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = Display_Room_service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'success': success, 'result': result}, status=status.HTTP_200_OK)
