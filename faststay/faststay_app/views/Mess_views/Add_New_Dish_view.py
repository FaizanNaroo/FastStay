from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services import Add_New_Dish_Service
from faststay_app.serializers import Add_New_Dish_serializer

class Add_New_Dish_View(APIView):
    """
    Add a new dish to an existing hostel mess.

    POST:
    Accepts JSON:
    {
        "p_MessId": int,    # Required, must exist in MessDetails table
        "p_Dish": str       # Required, name of the new dish
    }

    Returns:
    {
        "message": str,   # "Dish Added Successfully" or error message
        "result": bool    # True if added, False if mess does not exist
    }

    Notes:
    - Calls stored function `AddNewDish`.
    - Returns 400 Bad Request if mess does not exist or input is invalid.
    - Returns 201 Created if the dish was added successfully.
    """

    @swagger_auto_schema(request_body=Add_New_Dish_serializer)
    def put(self, request):
        serializer = Add_New_Dish_serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer._errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = Add_New_Dish_Service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'message': result, 'result': success}, status=status.HTTP_200_OK)
