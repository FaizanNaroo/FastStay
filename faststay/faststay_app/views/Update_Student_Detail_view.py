from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services.Update_Student_Detail_service import Update_Student_Detail_Service
from faststay_app.serializers.Update_StudentDetail_Serializer import Update_StudentDetails_Serializer

class Update_Student_Detail_view(APIView):
    """
    Handles student details entry
    
    POST:
    Accepts JSON:
    {
        "userid": "int",
        ...
    }
    Returns:
    {
        "message": "Details entered successfully",
        "result": Boolean
    }
    """

    @swagger_auto_schema(request_body=Update_StudentDetails_Serializer)
    def post(self, request):
        serializer = Update_StudentDetails_Serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer._errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = Update_Student_Detail_Service('UpdateStudentDetails', serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'message': 'Data Entered Successfully', 'result': success}, status=status.HTTP_201_CREATED)
