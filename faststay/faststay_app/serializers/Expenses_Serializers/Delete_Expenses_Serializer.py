from rest_framework import serializers
    
class Delete_Expenses_serializer(serializers.Serializer):
    p_ExpenseId = serializers.IntegerField()