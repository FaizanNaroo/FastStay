from django.views import View
from faststay_app.services.delete_kitchen_details_service import DeleteKitchenDetailsService
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class DeleteKitchenDetails(View):

    def post(self, request, *args, **kwargs):
        
        auth_service = DeleteKitchenDetailsService()
        try:
            data = json.loads(request.body)

            kitchen_id_str = data.get("p_KitchenId")
            is_valid = None
            error = None
            
            if kitchen_id_str is None:
                is_valid=False
                error='Missing required field: p_KitchenId'
                if not is_valid:
                    return JsonResponse({'error': error}, status=400)
            

            try:
                int(kitchen_id_str)
            except ValueError:
                is_valid=False
                error='Kitchen Id must be a valid integer'
                if not is_valid:
                    return JsonResponse({'error': error}, status=400)
            
            
            kitchen_id = int(kitchen_id_str)
 
            is_deleted = auth_service.delete_kitchen_details(kitchen_id)

            if is_deleted is True:
                return JsonResponse({'message': f'Kitchen for Pic ID {kitchen_id} deleted'}, status=200)

            elif is_deleted is False:
                return JsonResponse({'error': f'Kitchen Id {kitchen_id} not found'}, status=404)

            else:
                return JsonResponse({'error': 'Database system error during deletion'}, status=500)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON input'}, status=400)

        except Exception as e:
            print(f"Error deleting kitchen: {e}")
            return JsonResponse({'error': 'Internal server error'}, status=500)
