from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services import Display_Ratings_service

class Display_Ratings_View(APIView):
    """
    Summary: Retrieve all hostel rating entries.

    GET:

    Returns:
    {
        "success": bool,   # True if ratings retrieved successfully, False otherwise
        "result": [        # List of rating entries
            {
                "p_RatingId": int,
                "p_HostelId": int,
                "p_StudentId": int,
                "p_RatingStar": int,
                "p_MaintenanceRating": int,
                "p_IssueResolvingRate": int,
                "p_ManagerBehaviour": int,
                "p_Challenges": str
            }
        ]
    }

    Notes:
    - Calls stored procedure `DisplayRatings`.
    - Returns all ratings for all hostels.
    - API response:
        * 200 OK with rating list if successful
        * 400 Bad Request if any error occurs
    """
    
    @swagger_auto_schema()
    def get(self, request):
        
        #call service
        success, result = Display_Ratings_service()
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
        
        #success
        return Response({'success': success, 'result': result}, status=status.HTTP_200_OK)