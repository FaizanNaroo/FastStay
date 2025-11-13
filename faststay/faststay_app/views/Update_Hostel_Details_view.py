from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services.save_Hostel_Details_Service import save_hostel_details
from faststay_app.serializers.Hostel_Details_Serializer import Hostel_Details_serializer
   
class Update_Hostel_Details_view(APIView):
    """
    Update Hostel Details
    
    PUT:
    Accepts JSON:
    {
        "p_ManagerId": "int",
        ...
    }
    Returns:
    {
        "message": "Successfully Altered",
        "result": bool
    }
    """

    @swagger_auto_schema(request_body=Hostel_Details_serializer)
    def put(self, request):
        serializer = Hostel_Details_serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer._errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = save_hostel_details(serializer.validated_data, 'update')
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'message': 'Data Entered Successfully', 'result': success}, status=status.HTTP_201_CREATED)
    
    