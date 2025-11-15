from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services.Mess_Services.Update_Mess_Details_service import Update_Mess_Detail_service
from faststay_app.serializers.Mess_Serializers.Update_Mess_Details_Serializer import Update_Mess_Detail_Serializer

class Update_Mess_Details(APIView):
    """
    Update mess details for a hostel.

    PUT:
    Accepts JSON:
    {
        "p_MessId": int,            # Required, must exist in MessDetails table
        "p_MessTimeCount": int,     # Required, must be 1–3
        "p_Dishes": [str, ...]      # Required, list of dish names
    }

    Returns:
    {
        "message": str,   # Success or error message
        "result": int     # 1, 0, or -1 depending on UpdateMessDetails return code
    }

    Notes:
    - Calls the stored function `UpdateMessDetails`.
    - Returns 400 Bad Request if mess does not exist or input is invalid.
    - Returns 201 Created if mess details were updated successfully.
    - Return Codes:
        1  -> Mess details updated successfully
        0  -> Meal count must be between 1 and 3
        -1 -> Mess details do not exist
    """

    @swagger_auto_schema(request_body=Update_Mess_Detail_Serializer)
    def put(self, request):
        serializer = Update_Mess_Detail_Serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer._errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = Update_Mess_Detail_service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'message': result, 'result': success}, status=status.HTTP_200_OK)
