from rest_framework import serializers

class Update_Kitchen_Details_serializer(serializers.Serializer):
    p_KitchenId = serializers.IntegerField()
    p_isFridge = serializers.BooleanField()
    p_isMicrowave = serializers.BooleanField()
    p_isGas = serializers.BooleanField()
    