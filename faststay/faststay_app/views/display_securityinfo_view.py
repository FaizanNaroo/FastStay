from django.http import JsonResponse
from django.views import View
import json
from faststay_app.services.display_securityinfo_service import DisplaySecurityInfo
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


@method_decorator(csrf_exempt, name='dispatch')
class DisplayHostelSecurityInfoView(View):
    hostel_service = DisplaySecurityInfo()

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
            security_info_list = self.hostel_service.display_hostel_security_info(hostel_id)
            if security_info_list:

                return JsonResponse(security_info_list[0], status=200)
            else:
                return JsonResponse({'error': f'Security information not found for Hostel ID {hostel_id}'}, status=404)

        except Exception as e:
            print(f"Error fetching security info: {e}")
            return JsonResponse({'error': 'Internal server error while fetching security details'}, status=500)