from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services import Display_User_Suggestion_service

class Display_User_Suggestions_View(APIView):
    """
    Summary: Retrieve all app suggestions submitted by users (Admin view).

    GET:

    Returns:
    {
        "success": bool,   # True if suggestions retrieved successfully, False otherwise
        "result": [        # List of user suggestions
            {
                "p_userid": int,
                "p_improvements": str,
                "p_defects": str
            }
        ]
    }

    Notes:
    - Calls stored procedure `DisplayUserSuggestions`.
    - Returns all user-submitted app suggestions with improvements and defects.
    - API response:
        * 200 OK with list of suggestions if successful
        * 400 Bad Request if any error occurs
    """
    
    @swagger_auto_schema()
    def get(self, request):
        
        #call service
        success, result = Display_User_Suggestion_service()
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'success': success, 'result': result}, status=status.HTTP_200_OK)