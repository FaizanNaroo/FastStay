from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services.Mess_Details_Service import Mess_Detail_service
from faststay_app.serializers.Mess_Detail_Serializer import Mess_Detail_Serializer

class Add_Mess_Details(APIView):

    @swagger_auto_schema(request_body=Mess_Detail_Serializer)
    def post(self, request):
        serializer = Mess_Detail_Serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer._errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = Mess_Detail_service(serializer.validated_data, 'add')
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'message': result, 'result': success}, status=status.HTTP_200_OK)
