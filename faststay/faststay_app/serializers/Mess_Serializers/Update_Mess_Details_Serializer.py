from rest_framework import serializers

def validate_p_MessTimeCount(value):
    if value < 1 or value > 3:
        raise serializers.ValidationError("Incorrect Mess Count Range.")
    return value

class Update_Mess_Detail_Serializer(serializers.Serializer):
    p_MessId = serializers.IntegerField()
    p_MessTimeCount = serializers.IntegerField(validators=[validate_p_MessTimeCount])
    p_Dishes = serializers.ListField(
        child = serializers.CharField(),
        allow_empty = False
    )
