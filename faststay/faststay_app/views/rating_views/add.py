from django.http import JsonResponse
from django.views import View
import json
from faststay_app.services.rating_service.add import AddRating
from faststay_app.utils.rating_validator import validate_hostel_rating 
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


@method_decorator(csrf_exempt, name='dispatch')
class AddHostelRatingView(View):
    hostel_service = AddRating()

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            
            is_valid, error, validated_data = validate_hostel_rating(data)
            if not is_valid:
                return JsonResponse({'error': error}, status=400)
            
            sql_return_code = self.hostel_service.add_hostel_rating(validated_data) 
            
            if sql_return_code == 1:
                return JsonResponse({'message': 'Hostel rating added successfully'}, status=201)
            
            elif sql_return_code == 0:
                return JsonResponse({'error': 'Hostel ID not found in the database.'}, status=404)
            
            elif sql_return_code == -1:
                return JsonResponse({'error': 'Student ID not found in the database.'}, status=404)
            
            elif sql_return_code == -2:
                return JsonResponse({'error': 'Invalid rating data (e.g., rating out of range 1-5).'}, status=400)
            
            else:
                 return JsonResponse({'error': 'Unknown system error occurred.'}, status=500)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON input'}, status=400)
        except Exception as e:
            print(f"Error submitting hostel rating: {e}")
            return JsonResponse({'error': 'Internal server error'}, status=500)