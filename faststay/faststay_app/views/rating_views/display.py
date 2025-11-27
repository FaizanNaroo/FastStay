from django.http import JsonResponse
from django.views import View
# Import the unified service class
from faststay_app.services.rating_service.display import DisplayRating 
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


@method_decorator(csrf_exempt, name='dispatch')
class DisplayRatingsView(View):

    hostel_service =  DisplayRating()

    def get(self, request, *args, **kwargs):
        try:
            ratings_list = self.hostel_service.display_ratings()
            if ratings_list:
                return JsonResponse({
                    'ratings': ratings_list, 
                    'count': len(ratings_list)
                }, status=200)
            else:
                return JsonResponse({'ratings': [], 'count': 0, 'message': 'No ratings found'}, status=200)

        except Exception as e:
            print(f"Error fetching all ratings: {e}")
            return JsonResponse({'error': 'Internal server error while fetching ratings'}, status=500)