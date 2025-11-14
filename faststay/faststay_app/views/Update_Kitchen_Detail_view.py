from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services.Update_Kitchen_Detail_service import Update_Kitchen_Detail_service
from faststay_app.serializers.Update_Kitchen_Details_Serializer import Update_Kitchen_Details_Serializer

class Update_Kitchen_Details_view(APIView):

    @swagger_auto_schema(request_body=Update_Kitchen_Details_Serializer)
    def post(self, request):
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
