from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services.Manager_Services.Delete_Hostel_Manager_service import delete_Hostel_Manager_service
from faststay_app.serializers.Manager_Serializers.Delete_Hostel_Manager_Serializer import Delete_Hostel_Manager_Serializer

class delete_Hostel_Manager_view(APIView):
    """
    Delete an existing hostel manager (SuperAdmin only).

    DELETE:
    Accepts JSON:
    {
        "p_ManagerId": int  # Required, must exist in HostelManager table
    }

    Returns:
    {
        "message": str,  # "Manager deleted successfully" or error message
        "result": bool   # True if deleted successfully, False otherwise
    }

    Notes:
    - Calls stored procedure `DeleteHostelManager`.
    - Validates that `p_ManagerId` exists.
    - Returns 400 if input is invalid or manager does not exist.
    - Returns 201 Created if successfully deleted.
    """


    @swagger_auto_schema(request_body=Delete_Hostel_Manager_Serializer)
    def delete(self, request):
        serializer = Delete_Hostel_Manager_Serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer._errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = delete_Hostel_Manager_service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'message': result, 'result': success}, status=status.HTTP_200_OK)