# paypal_user/views.py
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .utils import make_paypal_payment, verify_paypal_payment
from paypal_user.models import handel_subscribtion_paypal
from .serializers import PayPalTransactionSerializer
from django.conf import settings
from django.http import HttpResponse, HttpResponseBadRequest
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from .serializers import *
from paypalrestsdk import notifications
import logging

logger = logging.getLogger(__name__)


class PayPalTransactionView(APIView):
    def post(self, request):
        serializer = PayPalTransactionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)
        return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

 
@method_decorator(csrf_exempt, name="dispatch")
class ProcessWebhookView(View):
    def post(self, request):
        # breakpoint()
        if "HTTP_PAYPAL_TRANSMISSION_ID" not in request.META:
            return HttpResponseBadRequest()
 
        auth_algo = request.META['HTTP_PAYPAL_AUTH_ALGO']
        cert_url = request.META['HTTP_PAYPAL_CERT_URL']
        transmission_id = request.META['HTTP_PAYPAL_TRANSMISSION_ID']
        transmission_sig = request.META['HTTP_PAYPAL_TRANSMISSION_SIG']
        transmission_time = request.META['HTTP_PAYPAL_TRANSMISSION_TIME']
        webhook_id = settings.PAYPAL_WEBHOOK_ID
        event_body = request.body.decode(request.encoding or "utf-8")
 
        valid = notifications.WebhookEvent.verify(
            transmission_id=transmission_id,
            timestamp=transmission_time,
            webhook_id=webhook_id,
            event_body=event_body,
            cert_url=cert_url,
            actual_sig=transmission_sig,
            auth_algo=auth_algo,
        )
 
        if not valid:
            return HttpResponseBadRequest()
 
        webhook_event = json.loads(event_body)
 
        event_type = webhook_event["event_type"]
        response_content = f"-------------Received event of type: {event_type}"
        print(response_content)
        # # Extracting details from the webhook event
        # transaction_id = webhook_event["resource"]["id"]
        # payer_id = webhook_event["resource"]["payer"]["payer_id"]
        # payer_email = webhook_event["resource"]["payer"]["email_address"]
        # amount = webhook_event["resource"]["amount"]["value"]
        # currency = webhook_event["resource"]["amount"]["currency_code"]
        # status = webhook_event["resource"]["status"]
        # create_time = webhook_event["resource"]["create_time"]
        # update_time = webhook_event["resource"]["update_time"]

        # # Saving the details in the PayPalTransaction model
        # PayPalTransaction.objects.create(
        #     transaction_id=transaction_id,
        #     payer_id=payer_id,
        #     payer_email=payer_email,
        #     amount=amount,
        #     currency=currency,
        #     status=status,
        #     create_time=create_time,
        #     update_time=update_time,
        # )

        # return HttpResponse("Webhook event processed and data saved.")

        if event_type == "PAYMENT.SALE.COMPLETED":
            transaction_id = resource.get("id")
            payer_info = resource.get("payer", {})
            payer_id = payer_info.get("payer_id")
            payer_email = payer_info.get("email_address")
            amount_info = resource.get("amount", {})
            amount = amount_info.get("value")
            currency = amount_info.get("currency_code")
            status = resource.get("status")
            create_time = resource.get("create_time")
            update_time = resource.get("update_time")

            if transaction_id and payer_id and payer_email and amount and currency:
                # Saving the details in the PayPalTransaction model
                PayPalTransaction.objects.create(
                    transaction_id=transaction_id,
                    payer_id=payer_id,
                    payer_email=payer_email,
                    amount=amount,
                    currency=currency,
                    status=status,
                    create_time=create_time,
                    update_time=update_time,
                )
                logger.info(f"Transaction {transaction_id} saved successfully.")
                print("Transaction saved successfully",transaction_id)
            else:
                print("Incomplete data for transaction",resource)
                logger.warning(f"Incomplete data for transaction: {resource}")

        return HttpResponse()