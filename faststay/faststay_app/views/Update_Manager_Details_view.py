from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services.Update_Manager_Details_service import Update_Manager_Detail_Service
from faststay_app.serializers.Update_Manager_Details_serializer import Update_Manager_Details_Serializer

class Update_Manager_Details_view(APIView):
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

    @swagger_auto_schema(request_body=Update_Manager_Details_Serializer)
    def post(self, request):
        serializer = Update_Manager_Details_Serializer(data=request.data)

        # Validate Input
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Call service
        success, result = Update_Manager_Detail_Service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)

        # Success
        return Response({'message': result, 'result': success}, status=status.HTTP_201_CREATED)