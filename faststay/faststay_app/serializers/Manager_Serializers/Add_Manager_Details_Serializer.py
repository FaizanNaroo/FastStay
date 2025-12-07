from rest_framework import serializers
from faststay_app.utils.validators import validate_PhoneNum, validate_OperatingHours

class Add_Manager_Details_serializer(serializers.Serializer):
    p_UserId = serializers.IntegerField()
    p_PhoneNo = serializers.CharField(max_length=11)
    p_Education = serializers.CharField(max_length=50)
    p_ManagerType = serializers.CharField(max_length=50)
    p_OperatingHours = serializers.IntegerField()

    def validate_p_PhoneNo(self, value):
        if not validate_PhoneNum(value):
             raise serializers.ValidationError("Invalid Phone Number.")
        return value
    
    def validate_p_OperatingHours(self, value):
        if not validate_OperatingHours(value):
             raise serializers.ValidationError("Invalid Operating Hours. Choose between 1 and 24, inclusively.")
        return value
