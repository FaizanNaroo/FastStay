from rest_framework import serializers

def validate_p_MessTimeCount(value):
    if 1 <= value <= 3:
        raise serializers.ValidationError("Incorrect Mess Count Range.")
    return value

class Mess_Detail_Serializer(serializers.Serializer):
    p_HostelId = serializers.IntegerField()
    p_MessTimeCount = serializers.IntegerField(validators=[validate_p_MessTimeCount])
    p_Dishes = serializers.ListField(
        child = serializers.CharField(),
        allow_empty = False
    )
