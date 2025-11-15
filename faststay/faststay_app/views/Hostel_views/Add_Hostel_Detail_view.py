from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services import save_hostel_details
from faststay_app.serializers import Hostel_Details_serializer

class Add_Hostel_Details_view(APIView):
    """
    Add new hostel details for a manager.

    POST:
    Accepts JSON:
    {
        "p_ManagerId": int,           # Required, must exist in HostelManager table
        "p_BlockNo": str,             # Required
        "p_HouseNo": str,             # Required
        "p_HostelType": str,          # Required, 'Portion' or 'Building'
        "p_isParking": bool,          # Required
        "p_NumRooms": int,            # Required, >= 1
        "p_NumFloors": int,           # Required, >= 1
        "p_WaterTimings": str,        # Required, HH:MM:SS format
        "p_CleanlinessTenure": int,   # Required, >= 1
        "p_IssueResolvingTenure": int,# Required, >= 1
        "p_MessProvide": bool,        # Required
        "p_GeezerFlag": bool          # Required
    }

    Returns:
    {
        "message": str,   # "Data Entered Successfully" or error message
        "result": bool    # True if added successfully, False otherwise
    }

    Notes:
    - Calls stored procedure `AddHostelDetails`.
    - Validates that `p_ManagerId` exists.
    - Returns 400 if input is invalid or manager does not exist.
    - Returns 201 Created if successfully added.
    """


    @swagger_auto_schema(request_body=Hostel_Details_serializer)
    def post(self, request):
        serializer = Hostel_Details_serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer._errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = save_hostel_details(serializer.validated_data, 'add')
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'message': 'Data Entered Successfully', 'result': success}, status=status.HTTP_201_CREATED)
    