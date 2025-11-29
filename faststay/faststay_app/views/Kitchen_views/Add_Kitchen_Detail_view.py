from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services import Add_Kitchen_Detail_service
from faststay_app.serializers import Add_Kitchen_Details_serializer

class Add_Kitchen_Details_view(APIView):
    """
    Add kitchen details for a hostel.

    POST:
    Accepts JSON:
    {
        "p_HostelId": int,     # Required, must exist in Hostel table
        "p_isFridge": bool,    # Required
        "p_isMicrowave": bool, # Required
        "p_isGas": bool        # Required
    }

    Returns:
    {
        "message": str,   # "Kitchen Details Added Successfully" or error message
        "result": bool    # True if added, False if hostel does not exist
    }

    Notes:
    - Calls stored function `AddKitchenDetails`.
    - Returns 400 Bad Request if hostel does not exist or input is invalid.
    - Returns 201 Created if kitchen details were added successfully.
    """

    @swagger_auto_schema(request_body=Add_Kitchen_Details_serializer)
    def post(self, request):
        serializer = Add_Kitchen_Details_serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = Add_Kitchen_Detail_service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'message': result, 'result': success}, status=status.HTTP_200_OK)
