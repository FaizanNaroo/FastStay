from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services.Add_App_Suggestion_service import add_app_suggestion_service
from faststay_app.serializers.Add_App_Suggestion_Serializer import Add_App_Suggestions_serializer

class Add_App_Suggestion_view(APIView):
    """
    Input User Complaints and suggestion
    
    POST:
    Accepts JSON:
    {
        "userId": "int",
        ...
    }
    Returns:
    {
        "message": "Complaint registered",
        "result": bool
    }
    """

    @swagger_auto_schema(request_body=Add_App_Suggestions_serializer)
    def post(self, request):
        serializer = Add_App_Suggestions_serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer._errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = add_app_suggestion_service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'message': 'Data Entered Successfully', 'result': success}, status=status.HTTP_201_CREATED)