from rest_framework import serializers
from faststay_app.utils.validators import (validate_email,
     validate_password, validate_username, validate_name,
     validate_age)


class SignUp_Serializer(serializers.Serializer):
    usertype = serializers.ChoiceField(choices=['Student','Hostel Manager','Admin'])
    fname = serializers.CharField(max_length=50)
    lname = serializers.CharField(max_length=50)
    age = serializers.IntegerField()
    gender = serializers.ChoiceField(choices=['Male', 'Female', 'Other'])
    city = serializers.CharField(max_length=50)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate_email(self, value):
        if not validate_email(value):
            raise serializers.ValidationError("Invalid email format.")
        return value

    def validate_password(self, value):
        if not validate_password(value):
            raise serializers.ValidationError(
                "Password must be at least 8 characters, include 1 number and 1 uppercase letter, 1 lowercase and 1 special character."
            )
        return value
    
    def validate_username(self, value):
        if not validate_username(value):
            raise serializers.ValidationError(
                "Username must be an alphanumeric with Ranging from 3-15 characters."
            )
        return value

    def validate_fname(self, value):
        if not validate_name(value):
            raise serializers.ValidationError(
                "Invalid Naming Convention(First name)."
            )
        return value
    
    def validate_lname(self, value):
        if not validate_name(value):
            raise serializers.ValidationError(
                "Invalid Naming Convention(Last name)."
            )
        return value
    
    def validate_age(self, value):
        if not validate_age(value):
            raise serializers.ValidationError(
                "Invalid Age Criteria."
            )
        return value