from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.services import register_user
from faststay_app.serializers import SignUp_serializer

class SignupView(APIView):
    """
    Summary: Register a new user account (Student or Hostel Manager).

    POST:
    Accepts JSON:
    {
        "UserType": str,   # Required, must be "Student" or "HostelManager"
        "Fname": str,      # Required, first name
        "Lname": str,      # Optional, last name
        "Age": int,        # Required, must be >= 1
        "Gender": str,     # Optional, gender
        "City": str,       # Optional, city of residence
        "email": str,      # Required, must be unique
        "password": str    # Required, raw password
    }

    Returns:
    {
        "message": str,    # "User registered" or error message
        "result": bool     # True if successfully registered, False otherwise
    }

    Notes:
    - Calls stored procedure `Signup`.
    - Validates that email is unique and age is >= 1.
    - Returns 400 if input is invalid or email already exists.
    - Returns 201 Created if successfully registered.
    """


    @swagger_auto_schema(request_body=SignUp_serializer)
    def post(self, request):
        serializer = SignUp_serializer(data=request.data)  # DRF automatically parses JSON

        # Validate Input
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Call service
        success, result = register_user('signup', serializer.validated_data)
        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)

        # Success
        return Response({'message': 'User created successfully', 'user_id': result}, status=status.HTTP_201_CREATED)