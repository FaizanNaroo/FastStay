from django.views import View
from faststay_app.services.delete_hostel_pics_service import DeleteHostelPicsService
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class DeleteHostelPics(View):

    def post(self, request, *args, **kwargs):
        
        auth_service = DeleteHostelPicsService()
        try:
            data = json.loads(request.body)

            pic_id_str = data.get("p_PicId")
            is_valid = None
            error = None
            
            if pic_id_str is None:
                is_valid=False
                error='Missing required field: p_PicId'
                if not is_valid:
                    return JsonResponse({'error': error}, status=400)
            

            try:
                int(pic_id_str)
            except ValueError:
                is_valid=False
                error='PicId must be a valid integer'
                if not is_valid:
                    return JsonResponse({'error': error}, status=400)
            
            
            pic_id = int(pic_id_str)
 
            is_deleted = auth_service.delete_hostel_photo(pic_id)

            if is_deleted is True:
                return JsonResponse({'message': f'Photo for Pic ID {pic_id} deleted'}, status=200)

            elif is_deleted is False:
                return JsonResponse({'error': f'Pic Id {pic_id} not found'}, status=404)

            else:
                return JsonResponse({'error': 'Database system error during deletion'}, status=500)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON input'}, status=400)

        except Exception as e:
            print(f"Error deleting photo: {e}")
            return JsonResponse({'error': 'Internal server error'}, status=500)
