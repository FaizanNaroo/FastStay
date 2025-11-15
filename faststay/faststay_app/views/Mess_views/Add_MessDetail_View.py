from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services.Mess_Services.Add_Mess_Details_Service import Add_Mess_Detail_service
from faststay_app.serializers.Mess_Serializers.Add_Mess_Detail_Serializer import Add_Mess_Detail_Serializer

class Add_Mess_Details(APIView):
    """
    Add mess details for a hostel.

    POST:
    Accepts JSON:
    {
        "p_HostelId": int,           # Required, must exist in Hostel table
        "p_MessTimeCount": int,      # Required, must be 1–3
        "p_Dishes": [str, ...]       # Required, list of dish names
    }

    Returns:
    {
        "message": str,   # Success or error message
        "result": int     # 1, 0, -1, or -2 depending on AddMessDetails return code
    }

    Notes:
    - Calls the stored function `AddMessDetails`.
    - Returns 400 Bad Request if the hostel does not exist or mess is not provided.
    - Returns 201 Created if mess details were added successfully.
    - Return Codes:
        1  -> Mess details added successfully
        0  -> Hostel does not provide mess
        -1 -> Hostel does not exist
        -2 -> Mess Meal Count must be between 1 and 3
    """

    @swagger_auto_schema(request_body=Add_Mess_Detail_Serializer)
    def post(self, request):
        serializer = Add_Mess_Detail_Serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer._errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = Add_Mess_Detail_service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'message': result, 'result': success}, status=status.HTTP_200_OK)
