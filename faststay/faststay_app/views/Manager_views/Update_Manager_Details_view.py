from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services.Manager_Services.Update_Manager_Details_service import Update_Manager_Detail_Service
from faststay_app.serializers.Manager_Serializers.Update_Manager_Details_serializer import Update_Manager_Details_Serializer

class Update_Manager_Details_view(APIView):
    """
    Update hostel manager Detail.

    POST:
    Accepts JSON:
    {
        "p_UserId": int,           # Required, must exist in Users table
        "p_PhotoLink": str,        # Optional, URL/path to photo
        "p_PhoneNo": str,          # Required, 11-digit phone number
        "p_Education": str,        # Optional
        "p_ManagerType": str,      # Required, 'Owner' or 'Employee'
        "p_OperatingHours": int    # Required, 1–24
    }

    Returns:
    {
        "message": str,  # "Manager added successfully" or error message
        "result": bool   # True if added successfully, False otherwise
    }

    Notes:
    - Calls stored procedure `AddManagerDetails`.
    - Validates that `p_UserId` exists and is not already a student.
    - Returns 400 if input is invalid or constraints fail.
    - Returns 201 Created if successfully added.
    """

    @swagger_auto_schema(request_body=Update_Manager_Details_Serializer)
    def put(self, request):
        serializer = Update_Manager_Details_Serializer(data=request.data)

        # Validate Input
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Call service
        success, result = Update_Manager_Detail_Service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)

        # Success
        return Response({'message': result, 'result': success}, status=status.HTTP_200_OK)