from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services import Add_Expenses_service
from faststay_app.serializers import Add_Expenses_serializer

class Add_Expenses_View(APIView):
    """
    Summary: Add expenses when manager does NOT select "Expenses included in RoomRent".

    POST:
    Accepts JSON:
    {
        "p_HostelId": int,           # Required, ID of the hostel
        "p_SecurityCharges": float,  # Required
        "p_MessCharges": float,      # Required
        "p_KitchenCharges": float,   # Required
        "p_InternetCharges": float,  # Required
        "p_AcServiceCharges": float, # Required
        "p_ElectricitybillType": str,# Required, must be one of 'RoomMeterFull','RoomMeterACOnly','ACSubmeter','UnitBased'
        "p_ElectricityCharges": float# Required
    }

    Returns:
    {
        "message": str,   # Description of success or error
        "result": bool    # True if expenses added successfully, False otherwise
    }

    Notes:
    - Calls stored procedure `AddExpenses`.
    - Validates that the hostel exists.
    - Validates that electricity bill type is correct.
    - Inserts expenses and room charges into Expenses table with `isincludedinroomcharges = false`.
    - Status returned by procedure:
        1: Successfully inserted
        0: Hostel does not exist
        -1: Wrong electricity bill type selected
    - API response:
        * 201 Created if expenses added successfully
        * 400 Bad Request if input is invalid or any validation fails
    """

    @swagger_auto_schema(request_body=Add_Expenses_serializer)
    def post(self, request):
        serializer = Add_Expenses_serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = Add_Expenses_service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'message': 'Data Entered Successfully', 'result': success}, status=status.HTTP_201_CREATED)
    