from django.http import JsonResponse
from django.views import View
import json
from faststay_app.services.rating_service.update import UpdateRating 
from faststay_app.utils.rating_validator import validate_hostel_rating # Use the new validator
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


@method_decorator(csrf_exempt, name='dispatch')
class UpdateHostelRatingView(View):
    hostel_service = UpdateRating()

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)

            p_RatingId = data.get("p_RatingId")
            if p_RatingId is None:
                return JsonResponse({"error": "p_RatingId is required"}, status=400)

            try:
                p_RatingId = int(p_RatingId)
            except ValueError:
                return JsonResponse({"error": "p_RatingId must be a valid integer"}, status=400)

            data_for_validation = {k: v for k, v in data.items() if k != "p_RatingId"}

            is_valid, error, other_validated_fields = validate_hostel_rating(data_for_validation)
            if not is_valid:
                return JsonResponse({'error': error}, status=400)
            
            validated_data = {
                "p_RatingId": p_RatingId,
                **other_validated_fields,
            }

            sql_return_code = self.hostel_service.update_hostel_rating(validated_data) 
            
            if sql_return_code == 1:
                return JsonResponse({'message': 'Hostel rating updated successfully'}, status=200)
            
            elif sql_return_code == 0:
                return JsonResponse({'error': 'Rating record not found for the provided IDs.'}, status=404)
            
            elif sql_return_code == -1:
                return JsonResponse({'error': 'Invalid rating data: one or more rating values out of range 1-5.'}, status=400)
            
            else:
                return JsonResponse({'error': 'Unknown system error occurred during rating update.'}, status=500)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON input'}, status=400)
        except Exception as e:
            print(f"Error updating hostel rating: {e}")
            return JsonResponse({'error': 'Internal server error'}, status=500)
        
