from django.views import View
from faststay_app.services.add_hostel_pics_service import AddHostelPicsService
from faststay_app.utils.hostel_pic_validator import validate_pic_data
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class AddHostelPics(View):

    def post(self, request, *args, **kwargs):
        
        auth_service = AddHostelPicsService()
        try:
            data = json.loads(request.body)

            hostel_id_str = data.get("p_HostelId")
            photolink_str = data.get("p_PhotoLink")

            is_valid, error = validate_pic_data(hostel_id_str,photolink_str)
            if not is_valid:
                return JsonResponse({'error': error}, status=400)
            
            hostel_id = int(hostel_id_str)
 
            is_added = auth_service.add_hostel_photo(hostel_id, photolink_str)

            if is_added is True:
                return JsonResponse({'message': f'Photo for Hostel ID {hostel_id} successfully added'}, status=200)

            elif is_added is False:
                return JsonResponse({'error': f'Hostel ID {hostel_id} not found'}, status=404)

            else:
                return JsonResponse({'error': 'Database system error during insertion'}, status=500)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON input'}, status=400)

        except Exception as e:
            print(f"Error adding hostel photo: {e}")
            return JsonResponse({'error': 'Internal server error'}, status=500)
