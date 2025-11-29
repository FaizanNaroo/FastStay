from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services import add_app_suggestion_service
from faststay_app.serializers import Add_App_Suggestions_serializer

class Add_App_Suggestion_view(APIView):
    """
    Register a new app suggestion from a user (student or manager).

    POST:
    Accepts JSON:
    {
        "p_UserId": int,         # Required, must exist in Users table
        "p_Improvements": str,   # Optional, description of suggested improvements
        "p_Defects": str         # Optional, description of defects/issues faced
    }

    Returns:
    {
        "message": str,          # "Suggestion registered" or error message
        "result": bool           # True if suggestion successfully stored, False otherwise
    }

    Notes:
    - Calls stored procedure `AddAppSuggestion`.
    - Validates that `p_UserId` exists.
    - Returns 400 if input is invalid or user does not exist.
    - Returns 201 Created if successfully registered.
    """

    @swagger_auto_schema(request_body=Add_App_Suggestions_serializer)
    def post(self, request):
        serializer = Add_App_Suggestions_serializer(data=request.data)

        #Validate Input
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        #call service
        success, result = add_app_suggestion_service(serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'message': 'Data Entered Successfully', 'result': success}, status=status.HTTP_201_CREATED)