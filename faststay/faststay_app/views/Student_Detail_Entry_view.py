from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services.Student_Detail_service import Student_Detail_Service
from faststay_app.serializers.Student_Details_Serializer import Student_Details_Serializer

class Student_Detail_Entry_view(APIView):
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

    @swagger_auto_schema(request_body=Student_Details_Serializer)
    def post(self, request):
        serializer = Student_Details_Serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer._errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = Student_Detail_Service('EnterStudentDetails', serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'message': 'Data Entered Successfully', "result": success}, status=status.HTTP_201_CREATED)
