from rest_framework import serializers
from faststay_app.utils.validators import validate_Nums

def natural_number_validator(value):
    if not validate_Nums(value):
        raise serializers.ValidationError("Charges cannot be negative.")
    
class Add_Expenses_serializer(serializers.Serializer):
    p_HostelId = serializers.IntegerField()
    p_SecurityCharges = serializers.DecimalField(max_digits=10, decimal_places=2)
    p_MessCharges = serializers.DecimalField(max_digits=10, decimal_places=2)
    p_KitchenCharges = serializers.DecimalField(max_digits=10, decimal_places=2)
    p_InternetCharges = serializers.DecimalField(max_digits=10, decimal_places=2)
    p_AcServiceCharges = serializers.DecimalField(max_digits=10, decimal_places=2)
    p_ElectricitybillType = serializers.ChoiceField(choices=['RoomMeterFull','RoomMeterACOnly','ACSubmeter','UnitBased'])
    p_ElectricityCharges = serializers.DecimalField(max_digits=10, decimal_places=2)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        for field_name, field in self.fields.items():
            if isinstance(field, serializers.DecimalField):
                field.validators.append(natural_number_validator)