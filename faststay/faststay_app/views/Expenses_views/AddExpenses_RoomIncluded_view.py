from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services import AddExpenses_RoomIncluded_service
from faststay_app.serializers import AddExpenses_RoomIncluded_serializer

class AddExpenses_RoomIncluded_View(APIView):
    """
    Summary: Add expenses when manager selects "Expenses included in RoomRent".

    POST:
    Accepts JSON:
    {
        "p_HostelId": int,          # Required, ID of the hostel
        "p_SecurityCharges": float  # Required, security charges amount
    }

    Returns:
    {
        "message": str,   # Description of success or error
        "result": bool    # True if expenses added successfully, False otherwise
    }

    Notes:
    - Calls stored procedure `AddExpenses_RoomIncluded`.
    - Validates that the hostel exists.
    - Inserts room charges averaged per seater into the Expenses table with `isincludedinroomcharges = true`.
    - API response:
        * 201 Created if expenses added successfully
        * 400 Bad Request if input is invalid or hostel does not exist
    """

    @swagger_auto_schema(request_body=AddExpenses_RoomIncluded_serializer)
    def post(self, request):
        serializer = AddExpenses_RoomIncluded_serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = AddExpenses_RoomIncluded_service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'message': 'Data Entered Successfully', 'result': success}, status=status.HTTP_201_CREATED)
    