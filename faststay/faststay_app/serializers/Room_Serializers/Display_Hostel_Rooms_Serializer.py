from rest_framework import serializers
from faststay_app.utils.validators import validate_Nums
    
class Display_Hostel_Room_serializer(serializers.Serializer):
    p_HostelId = serializers.IntegerField()

    def validate_p_HostelId(self, value):
        if not validate_Nums(value):
            raise serializers.ValidationError("Invalid Hostel Id")
        return value
        