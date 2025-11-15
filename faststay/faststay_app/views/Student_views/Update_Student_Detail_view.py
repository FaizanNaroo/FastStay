from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services.Student_Services.Update_Student_Detail_service import Update_Student_Detail_Service
from faststay_app.serializers.Student_Serializers.Update_StudentDetail_Serializer import Update_StudentDetails_Serializer

class Update_Student_Detail_view(APIView):
    """
    Update existing student demographic details.

    PUT:
    Accepts JSON:
    {
        "p_StudentId": int,       # Required, must exist in StudentDemographics table
        "p_Semester": int,        # Required, 1-8
        "p_Department": str,      # Optional
        "p_Batch": int,           # Optional
        "p_RoomateCount": int,    # Required, 1-6
        "p_UniDistance": float,   # Optional
        "p_isAcRoom": bool,       # Optional
        "p_isMess": bool,         # Optional
        "p_BedType": str,         # Required, 'Bed', 'Mattress', or 'Anyone'
        "p_WashroomType": str     # Required, 'RoomAttached' or 'Community'
    }

    Returns:
    {
        "message": str,           # "Details updated successfully" or error message
        "result": bool            # True if update succeeded, False otherwise
    }

    Notes:
    - Calls stored procedure `UpdateStudentDetails`.
    - Validates that `p_StudentId` exists.
    - Returns 400 if input is invalid or student does not exist.
    - Returns 201 Created if successfully updated.
    """


    @swagger_auto_schema(request_body=Update_StudentDetails_Serializer)
    def post(self, request):
        serializer = Update_StudentDetails_Serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer._errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = Update_Student_Detail_Service('UpdateStudentDetails', serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'message': 'Data Entered Successfully', 'result': success}, status=status.HTTP_200_OK)
