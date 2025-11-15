from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services.Hostel_Services.save_Hostel_Details_Service import save_hostel_details
from faststay_app.serializers.Hostel_Serializers.Hostel_Details_Serializer import Hostel_Details_serializer
   
class Update_Hostel_Details_view(APIView):
    """
    Update existing hostel details for a manager.

    PUT:
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
        "message": str,   # "Data Updated Successfully" or error message
        "result": bool    # True if updated successfully, False otherwise
    }

    Notes:
    - Calls stored procedure `UpdateHostelDetails`.
    - Validates that `p_ManagerId` exists.
    - Returns 400 if input is invalid or manager does not exist.
    - Returns 201 Created if successfully updated.
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
    
    