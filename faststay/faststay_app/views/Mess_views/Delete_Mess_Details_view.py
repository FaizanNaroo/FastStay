from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services import Delete_Mess_Detail_service
from faststay_app.serializers import Delete_Mess_Details_serializer

class Delete_Mess_Details_view(APIView):
    """
    Delete mess details for a hostel.

    DELETE:
    Accepts JSON:
    {
        "p_MessId": int   # Required, must exist in MessDetails table
    }

    Returns:
    {
        "message": str,   # "Mess Details Deleted Successfully" or error message
        "result": bool    # True if deleted, False if mess does not exist
    }

    Notes:
    - Calls stored function `DeleteMessDetails`.
    - Returns 400 Bad Request if mess does not exist or input is invalid.
    - Returns 200 OK if the mess details were deleted successfully.
    """

    @swagger_auto_schema(request_body=Delete_Mess_Details_serializer)
    def delete(self, request):
        serializer = Delete_Mess_Details_serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer._errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = Delete_Mess_Detail_service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'message': result, 'result': success}, status=status.HTTP_200_OK)
