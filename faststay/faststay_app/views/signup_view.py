from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services.Register_service import register_user
from faststay_app.serializers.SignUp_Serializer import SignUp_Serializer

class SignupView(APIView):
    """
    Handles user signup.
    
    POST:
    Accepts JSON:
    {
        "email": "string",
        ...
    }
    Returns:
    {
        "message": "User created successfully",
        "user_id": int
    }
    """

    @swagger_auto_schema(request_body=SignUp_Serializer)
    def post(self, request):
        serializer = SignUp_Serializer(data=request.data)  # DRF automatically parses JSON

        # Validate Input
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Call service
        success, result = register_user('signup', serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)

        # Success
        return Response({'message': 'User created successfully', 'user_id': result}, status=status.HTTP_201_CREATED)