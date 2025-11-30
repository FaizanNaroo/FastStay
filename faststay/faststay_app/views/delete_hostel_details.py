from django.http import JsonResponse
from django.views import View
import json
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from faststay_app.services.delete_hostel_details_service import HostelService

@method_decorator(csrf_exempt, name='dispatch')
class DeleteHostelDetailsView(View):
    hostel_service = HostelService()

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            hostel_id_str = data.get("p_HostelId")
            try:
                if hostel_id_str is None:
                    return JsonResponse({'error': 'Missing required field: p_HostelId'}, status=400)
                hostel_id = int(hostel_id_str)
         
            except ValueError:
                return JsonResponse({'error': 'HostelId must be a valid integer'}, status=400)

            is_deleted = self.hostel_service.delete_hostel(hostel_id) 

            if is_deleted is True:
                return JsonResponse({'message': f'Hostel ID {hostel_id} successfully deleted'}, status=200)
            elif is_deleted is False:
                return JsonResponse({'error': f'Hostel ID {hostel_id} not found'}, status=404)
            else:
                return JsonResponse({'error': 'Database system error during deletion'}, status=500)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON input'}, status=400)
        except Exception as e:
            print(f"Error deleting hostel details: {e}")
            return JsonResponse({'error': 'Internal server error'}, status=500)