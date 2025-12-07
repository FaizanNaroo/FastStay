from django.http import JsonResponse
from django.views import View
import json
from faststay_app.services.update_securityinfo_service import UpdateSecurityInfo
from faststay_app.utils.add_securityinfo_validator import  validate_update_security_info
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


@method_decorator(csrf_exempt, name='dispatch')
class UpdateSecurityInfoView(View):
    hostel_service = UpdateSecurityInfo()

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
      
            is_valid, error = validate_update_security_info(data)
            if not is_valid:
                return JsonResponse({'error': error}, status=400)
            validated_data=data
            is_updated = self.hostel_service.update_securityinfo(validated_data) 
            if is_updated is True:
                return JsonResponse({
                    'message': f'Security information updated successfully'
                }, status=200)
            elif is_updated is False:
                return JsonResponse({'error': f'Security Info not found'}, status=404)
            else:
                return JsonResponse({'error': 'Database system error during update'}, status=500)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON input'}, status=400)
        except Exception as e:
            print(f"Error updating security info: {e}")
            return JsonResponse({'error': 'Internal server error'}, status=500)