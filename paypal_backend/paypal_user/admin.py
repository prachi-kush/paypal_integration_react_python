from django.contrib import admin
from .models import CustomUser, PayPalSubscription, PayPalTransaction

admin.site.register(CustomUser)
admin.site.register(PayPalSubscription)
admin.site.register(PayPalTransaction)