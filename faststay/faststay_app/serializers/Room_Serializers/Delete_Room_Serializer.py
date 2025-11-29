from rest_framework import serializers
from faststay_app.utils.validators import validate_Nums

def natural_number_validator(value):
    if not validate_Nums(value):
        raise serializers.ValidationError("Value must be at least 1.")
    
class Delete_Room_serializer(serializers.Serializer):
    p_HostelId = serializers.IntegerField()
    p_RoomNo = serializers.IntegerField()
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        for field_name, field in self.fields.items():
            if isinstance(field, serializers.IntegerField):
                field.validators.append(natural_number_validator)