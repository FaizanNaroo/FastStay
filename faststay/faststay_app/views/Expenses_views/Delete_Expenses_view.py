from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services import Delete_Expenses_service
from faststay_app.serializers import Delete_Expenses_serializer

class Delete_Expenses_View(APIView):
    """
    Summary: Delete an existing hostel expense record.

    DELETE:
    Accepts JSON:
    {
        "p_ExpenseId": int  # Required, ID of the expense record to delete
    }

    Returns:
    {
        "message": str,   # Description of success or error
        "result": bool    # True if expense deleted successfully, False otherwise
    }

    Notes:
    - Calls stored procedure `DeleteExpenses`.
    - Validates that the expense record exists.
    - API response:
        * 201 Created if expense deleted successfully
        * 400 Bad Request if input is invalid or expense does not exist
    """

    @swagger_auto_schema(request_body=Delete_Expenses_serializer)
    def delete(self, request):
        serializer = Delete_Expenses_serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = Delete_Expenses_service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'message': 'Data Entered Successfully', 'result': success}, status=status.HTTP_201_CREATED)
    