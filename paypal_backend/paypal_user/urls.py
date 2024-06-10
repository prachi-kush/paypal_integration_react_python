from django.urls import path
from .views import ProcessWebhookView, PayPalTransactionView

urlpatterns = [
    path('paypal/transaction/', PayPalTransactionView.as_view(), name='paypal_transaction'),
    path('webhooks/paypal/', ProcessWebhookView.as_view(), name='webhook_url')


]
