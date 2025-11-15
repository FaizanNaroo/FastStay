from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services.Kitchen_Services.Update_Kitchen_Detail_service import Update_Kitchen_Detail_service
from faststay_app.serializers.Kitchen_Serializers.Update_Kitchen_Details_Serializer import Update_Kitchen_Details_Serializer

class Update_Kitchen_Details_view(APIView):
    """
    Update kitchen details for a hostel.

    PUT:
    Accepts JSON:
    {
        "p_KitchenId": int,    # Required, must exist in KitchenDetails table
        "p_isFridge": bool,    # Required
        "p_isMicrowave": bool, # Required
        "p_isGas": bool        # Required
    }

    Returns:
    {
        "message": str,   # "Kitchen Details Updated Successfully" or error message
        "result": bool    # True if updated, False if kitchen does not exist
    }

    Notes:
    - Calls stored function `UpdateKitchenDetails`.
    - Returns 400 Bad Request if kitchen does not exist or input is invalid.
    - Returns 201 Created if kitchen details were updated successfully.
    """

    @swagger_auto_schema(request_body=Update_Kitchen_Details_Serializer)
    def put(self, request):
        serializer = Update_Kitchen_Details_Serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer._errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = Update_Kitchen_Detail_service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'message': result, 'result': success}, status=status.HTTP_200_OK)
