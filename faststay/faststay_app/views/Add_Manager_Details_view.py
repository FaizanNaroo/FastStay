from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services.Add_Manager_Details_Service import Add_Manager_Detail_Service
from faststay_app.serializers.Add_Manager_Details_Serializer import Add_Manager_Details_Serializer

class Add_Manager_Details_view(APIView):
    """
    Adds Manager Details
    
    POST:
    Accepts JSON:
    {
        "p_UserId": "int",
        ...
    }
    Returns:
    {
        "message": "Data successfully Entered",
        "result": boolean
    }
    """

    @swagger_auto_schema(request_body=Add_Manager_Details_Serializer)
    def post(self, request):
        serializer = Add_Manager_Details_Serializer(data=request.data)

        # Validate Input
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Call service
        success, result = Add_Manager_Detail_Service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)

        # Success
        return Response({'message': result, 'result': success}, status=status.HTTP_201_CREATED)