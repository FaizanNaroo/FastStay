from rest_framework import serializers

class Add_New_Dish_Serializer(serializers.Serializer):
    p_MessId = serializers.IntegerField()
    p_Dish = serializers.CharField()

