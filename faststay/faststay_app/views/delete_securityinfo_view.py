from django.http import JsonResponse
from django.views import View
import json
from faststay_app.services.delete_securityinfo_service import DeleteSecurityInfo 
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


@method_decorator(csrf_exempt, name='dispatch')
class DeleteSecurityInfoView(View):

    hostel_service =  DeleteSecurityInfo()

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            security_id_str = data.get("p_SecurityId")
            if security_id_str is None:
                return JsonResponse({'error': 'Missing required field: p_SecurityId'}, status=400)
            
            try:
                security_id = int(security_id_str)
            except ValueError:
                return JsonResponse({'error': 'p_SecurityId must be a valid integer'}, status=400)

            is_deleted = self.hostel_service.delete_security_info(security_id) 

            if is_deleted is True:
                return JsonResponse({
                    'message': f'Security information for ID {security_id} successfully deleted'
                }, status=200)
            elif is_deleted is False:
                return JsonResponse({'error': f'Security ID {security_id} not found'}, status=404)
            else:
                return JsonResponse({'error': 'Database system error during deletion'}, status=500)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON input'}, status=400)
        except Exception as e:
            print(f"Error deleting security info: {e}")
            return JsonResponse({'error': 'Internal server error'}, status=500)