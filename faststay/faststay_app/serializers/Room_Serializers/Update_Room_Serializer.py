from rest_framework import serializers
from faststay_app.utils.validators import validate_Nums

def natural_number_validator(value):
    if not validate_Nums(value):
        raise serializers.ValidationError("Value must be at least 1.")
    
class Update_Room_serializer(serializers.Serializer):
    p_RoomNo = serializers.IntegerField()
    p_HostelId = serializers.IntegerField()
    p_FloorNo = serializers.IntegerField()
    p_SeaterNo = serializers.IntegerField()
    p_RoomRent = serializers.DecimalField(max_digits=9, decimal_places=2)
    p_BedType = serializers.ChoiceField(choices=['Bed','Mattress'])
    p_WashroomType = serializers.ChoiceField(choices=['RoomAttached','Community'])
    p_CupboardType = serializers.ChoiceField(choices=['PerPerson','Shared'])
    p_isVentilated = serializers.BooleanField()
    p_isCarpet = serializers.BooleanField()
    p_isMiniFridge = serializers.BooleanField()
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        for field_name, field in self.fields.items():
            if isinstance(field, serializers.IntegerField):
                field.validators.append(natural_number_validator)
