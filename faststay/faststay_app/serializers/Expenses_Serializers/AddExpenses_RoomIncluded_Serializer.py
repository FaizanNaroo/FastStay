from rest_framework import serializers
from faststay_app.utils.validators import validate_NNums, validate_Nums

class AddExpenses_RoomIncluded_serializer(serializers.Serializer):
    p_HostelId = serializers.IntegerField()
    p_SecurityCharges = serializers.DecimalField(max_digits=10, decimal_places=2)

    def validate_p_HostelId(self, value):
        if not validate_Nums(value):
            raise serializers.ValidationError("Invalid Id.")
        return value

    def validate_p_SecurityCharges(self, value):
        if not validate_NNums(value):
            raise serializers.ValidationError("Charges cannot be negative.")
        return value