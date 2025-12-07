from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services import Update_Expenses_service
from faststay_app.serializers import Update_Expenses_serializer

class Update_Expenses_View(APIView):
    """
    Summary: Update hostel expenses details.

    PUT:
    Accepts JSON:
    {
        "p_ExpenseId": int,                # Required, ID of the expense record
        "p_isIncludedInRoomCharges": bool, # Optional, whether expenses are included in room charges
        "p_RoomCharges": [float],          # Optional, list of room charges per seater
        "p_SecurityCharges": float,        # Optional
        "p_MessCharges": float,            # Optional
        "p_KitchenCharges": float,         # Optional
        "p_InternetCharges": float,        # Optional
        "p_AcServiceCharges": float,       # Optional
        "p_ElectricitybillType": str,      # Optional, must be one of 'RoomMeterFull','RoomMeterACOnly','ACSubmeter','UnitBased'
        "p_ElectricityCharges": float      # Optional
    }

    Returns:
    {
        "message": str,   # Description of success or error
        "result": bool    # True if expenses updated successfully, False otherwise
    }

    Notes:
    - Calls stored procedure `UpdateHostelExpenses`.
    - Validates that the expense record exists.
    - Validates electricity bill type.
    - Updates only provided fields; others remain unchanged.
    - Status returned by procedure:
        1: Successfully updated
        0: Expense record does not exist
        -1: Wrong electricity bill type selected
    - API response:
        * 201 Created if expenses updated successfully
        * 400 Bad Request if input is invalid or any validation fails
    """

    @swagger_auto_schema(request_body=Update_Expenses_serializer)
    def put(self, request):
        serializer = Update_Expenses_serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = Update_Expenses_service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'message': 'Data Entered Successfully', 'result': success}, status=status.HTTP_201_CREATED)
    