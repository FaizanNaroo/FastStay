from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services import Add_Room_service
from faststay_app.serializers import Add_Room_serializer

class Add_Room_View(APIView):
    """
    Summary: Add a new room to a hostel (Hostel Manager only).

    POST:
    Accepts JSON:
    {
        "p_RoomNo": int,          # Required, unique room number
        "p_HostelId": int,        # Required, ID of the hostel
        "p_FloorNo": int,         # Required, floor number of the room
        "p_SeaterNo": int,        # Required, number of beds in the room
        "p_RoomRent": float,      # Required, rent per room
        "p_BedType": str,         # Required, "Bed" or "Mattress"
        "p_WashroomType": str,    # Required, "RoomAttached" or "Community"
        "p_CupboardType": str,    # Required, "PerPerson" or "Shared"
        "p_isVentilated": bool,   # Required, whether room is ventilated
        "p_isCarpet": bool,       # Required, whether room has carpet
        "p_isMiniFridge": bool    # Required, whether room has mini fridge
    }

    Returns:
    {
        "message": str,    # Description of success or error
        "result": bool     # True if room added successfully, False otherwise
    }

    Notes:
    - Calls stored procedure `AddRoom`.
    - Validates:
        * Hostel exists
        * Room number is unique
        * Hostel room limit is not exceeded
        * Bed, washroom, and cupboard types are valid
    - Status codes returned by procedure:
        1: Room added successfully
        0: Hostel does not exist
       -1: Room with this ID already exists
       -2: Invalid data types
       -3: Hostel room limit reached
    - API response:
        * 200 OK if successful
        * 400 Bad Request if input is invalid or room addition fails
    """

    @swagger_auto_schema(request_body=Add_Room_serializer)
    def post(self, request):
        serializer = Add_Room_serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = Add_Room_service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'message': result, 'result': success}, status=status.HTTP_200_OK)
