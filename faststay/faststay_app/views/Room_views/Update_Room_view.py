from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services import Update_Room_service
from faststay_app.serializers import Update_Room_serializer

class Update_Room_View(APIView):
    """
    Summary: Update details of an existing room in a hostel (Hostel Manager only).

    PUT:
    Accepts JSON:
    {
        "p_RoomNo": int,          # Required, room number to update
        "p_HostelId": int,        # Required, ID of the hostel
        "p_FloorNo": int,         # Optional, new floor number
        "p_SeaterNo": int,        # Optional, new number of beds
        "p_RoomRent": float,      # Optional, new rent per room
        "p_BedType": str,         # Optional, "Bed" or "Mattress"
        "p_WashroomType": str,    # Optional, "RoomAttached" or "Community"
        "p_CupboardType": str,    # Optional, "PerPerson" or "Shared"
        "p_isVentilated": bool,   # Optional, whether room is ventilated
        "p_isCarpet": bool,       # Optional, whether room has carpet
        "p_isMiniFridge": bool    # Optional, whether room has mini fridge
    }

    Returns:
    {
        "message": str,    # Description of success or error
        "result": bool     # True if room updated successfully, False otherwise
    }

    Notes:
    - Calls stored procedure `UpdateRoom`.
    - Validates:
        * Hostel exists
        * Room exists in the hostel
    - Only updates fields provided in the input; other fields remain unchanged.
    - Status codes returned by procedure:
        1: Room details updated successfully
        0: Hostel does not exist
       -1: Room with this ID does not exist
    - API response:
        * 200 OK if successful
        * 400 Bad Request if input is invalid or update fails
    """
    @swagger_auto_schema(request_body=Update_Room_serializer)
    def put(self, request):
        serializer = Update_Room_serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = Update_Room_service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'message': result, 'result': success}, status=status.HTTP_200_OK)
