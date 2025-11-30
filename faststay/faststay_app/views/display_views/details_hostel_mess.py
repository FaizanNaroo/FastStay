from django.http import JsonResponse
from django.views import View
import json
from faststay_app.services.display_service.details_hostel_mess import DetailsHostelMess
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


@method_decorator(csrf_exempt, name='dispatch')
class DetailsHostelMess(View):
    hostel_service = DetailsHostelMess()

    def get(self, request, *args, **kwargs):
        
        data = json.loads(request.body)
        hostel_id_str = data.get("p_HostelId")
        if not hostel_id_str:
            return JsonResponse({'error': 'Missing required query parameter:  p_HostelId'}, status=400)
            
        try:
            hostel_id = int(hostel_id_str)
        except ValueError:
            return JsonResponse({'error': 'hostel_id must be a valid integer'}, status=400)

        try:
            info_list = self.hostel_service.details_hostel_mess(hostel_id)
            if info_list:

                return JsonResponse(info_list[0], status=200)
            else:
                return JsonResponse({'error': f'Mess information not found for Hostel ID {hostel_id}'}, status=404)

        except Exception as e:
            print(f"Error fetching mess info: {e}")
            return JsonResponse({'error': 'Internal server error while fetching details'}, status=500)