from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services.Add_New_Dish_service import Add_New_Dish_service
from faststay_app.serializers.Add_New_Dish_Serializer import Add_New_Dish_Serializer

class Add_New_Dish_View(APIView):

    @swagger_auto_schema(request_body=Add_New_Dish_Serializer)
    def put(self, request):
        serializer = Add_New_Dish_Serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer._errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = Add_New_Dish_service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'message': result, 'result': success}, status=status.HTTP_200_OK)
