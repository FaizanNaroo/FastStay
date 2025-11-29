from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services import Display_Expenses_service
from faststay_app.serializers import Display_Expenses_serializer

class Display_Expenses_View(APIView):
    """
    Summary: Display the expenses of a given hostel.

    POST:
    Accepts JSON:
    {
        "p_HostelId": int  # Required, ID of the hostel
    }

    Returns:
    {
        "success": bool,   # True if expenses found, False otherwise
        "result": {        # Expense details
            "p_isIncludedInRoomCharges": bool,
            "p_RoomCharges": [float],
            "p_SecurityCharges": float,
            "p_MessCharges": float,
            "p_KitchenCharges": float,
            "p_InternetCharges": float,
            "p_AcServiceCharges": float,
            "p_ElectricitybillType": str,
            "p_ElectricityCharges": float
        }
    }

    Notes:
    - Calls stored procedure `DisplayExpenses`.
    - Returns all expense fields for the given hostel ID.
    - API response:
        * 200 OK with expense details if found
        * 400 Bad Request if input is invalid or hostel does not exist
    """

    @swagger_auto_schema(request_body=Display_Expenses_serializer)
    def post(self, request):
        serializer = Display_Expenses_serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = Display_Expenses_service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'success': success, 'result': result}, status=status.HTTP_200_OK)
    