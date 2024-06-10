# serializers.py
from rest_framework import serializers
from .models import PayPalTransaction

class PayPalTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayPalTransaction
        fields = '__all__'
