from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
from faststay_app.services.login_user_service import login_user_service
from faststay_app.utils.login_validator import validate_login_data

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(View):
    auth_service = login_user_service()

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            is_valid, error = validate_login_data(data)
            if not is_valid:
                return JsonResponse({'error': error}, status=400)

            email = data.get('email')
            password = data.get('password')

            user_data = self.auth_service.authenticate_user(email, password) 
            if user_data is None:
                return JsonResponse({'error': 'Invalid email or password'}, status=401)

            user_id, usertype = user_data
            return JsonResponse({
                'message': 'Login successful', 
                'user_id': user_id,
                'usertype': usertype
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON input'}, status=400)
        except Exception as e:
            print(f"Login view server error: {e}")
            return JsonResponse({'error': f'Internal Server Error'}, status=500)