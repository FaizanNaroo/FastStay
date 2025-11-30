from django.http import JsonResponse
from django.views import View
import json
from faststay_app.services.rating_service.delete import DeleteHostelRating
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


@method_decorator(csrf_exempt, name='dispatch')
class DeleteHostelRatingView(View):
    hostel_service = DeleteHostelRating()

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)

            rating_id_str = data.get("p_RatingId")
            hostel_id_str = data.get("p_HostelId")
            student_id_str = data.get("p_StudentId")

            mandatory_ids = {
                "p_RatingId": rating_id_str,
                "p_HostelId": hostel_id_str,
                "p_StudentId": student_id_str,
            }
            
            for field, value_str in mandatory_ids.items():
                if not value_str:
                    return JsonResponse({'error': f'Missing required ID field: {field}'}, status=400)
                try:
                    mandatory_ids[field] = int(value_str)
                except ValueError:
                    return JsonResponse({'error': f'{field} must be a valid integer'}, status=400)
            
            rating_id = mandatory_ids["p_RatingId"]
            hostel_id = mandatory_ids["p_HostelId"]
            student_id = mandatory_ids["p_StudentId"]

            is_deleted = self.hostel_service.delete_hostel_rating(
                rating_id, hostel_id, student_id
            ) 

            if is_deleted is True:
                return JsonResponse({'message': f'Rating ID {rating_id} successfully deleted'}, status=200)
            
            elif is_deleted is False:
                return JsonResponse({'error': 'Rating record not found for the provided IDs.'}, status=404)
            
            else:
                return JsonResponse({'error': 'Database system error during deletion'}, status=500)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON input'}, status=400)
        except Exception as e:
            print(f"Error deleting hostel rating: {e}")
            return JsonResponse({'error': 'Internal server error'}, status=500)