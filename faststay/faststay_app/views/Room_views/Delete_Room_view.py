from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services import Delete_Room_service
from faststay_app.serializers import Delete_Room_serializer

class Delete_Room_View(APIView):
    """
    Summary: Delete a room from a hostel (Hostel Manager only).

    DELETE:
    Accepts JSON:
    {
        "p_HostelId": int,    # Required, ID of the hostel
        "p_RoomNo": int       # Required, room number to delete
    }

    Returns:
    {
        "message": str,    # Description of success or error
        "result": bool     # True if room deleted successfully, False otherwise
    }

    Notes:
    - Calls stored procedure `DeleteRoom`.
    - Validates that the room exists in the specified hostel.
    - Status returned by procedure:
        true: Room deleted successfully
        false: Room does not exist
    - API response:
        * 200 OK if successful
        * 400 Bad Request if input is invalid or room deletion fails
    """
    
    @swagger_auto_schema(request_body=Delete_Room_serializer)
    def delete(self, request):
        serializer = Delete_Room_serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = Delete_Room_service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'message': result, 'result': success}, status=status.HTTP_200_OK)
