from django.http import JsonResponse
from django.views import View
import json
from faststay_app.services.display_securityinfo_service import SecurityInfo
from faststay_app.utils.add_securityinfo_validator import validate_security_info 
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


@method_decorator(csrf_exempt, name='dispatch')
class AddSecurityInfoView(View):
    hostel_service = SecurityInfo()

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            is_valid, error = validate_security_info(data)
            if not is_valid:
                return JsonResponse({'error': error}, status=400)
            
            hostel_id = data.get("p_HostelId") 
            params = [
                hostel_id,
                data.get("p_GateTimings"),
                data.get("p_isCameras"),
                data.get("p_isGuard"),
                data.get("p_isOutsiderVerification")
            ]
            
            is_added = self.hostel_service.add_security_info(params) 
            
            if is_added is True:
                return JsonResponse({
                    'message': f'Security information added for Hostel ID {hostel_id}'
                }, status=201)
            elif is_added is False:
                return JsonResponse({'error': f'Hostel ID {hostel_id} not found'}, status=404)
            else:
                return JsonResponse({'error': 'Database system error during insertion'}, status=500)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON input'}, status=400)
        except Exception as e:
            print(f"Error adding security info: {e}")
            return JsonResponse({'error': 'Internal server error'}, status=500)