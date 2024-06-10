import React from 'react';
import { useParams } from 'react-router-dom';
import { PayPalButtons } from "@paypal/react-paypal-js";
import toast from "react-hot-toast";
import axios from 'axios';

export function Payment() {
  const { price } = useParams();

  const onCancel = () => {
    toast(
      "You cancelled the payment. Try again by clicking the PayPal button", 
      {
        duration: 6000
      }
    );
  };

  const onError = (err) => {
    toast.error("There was an error processing your payment. If this error persists, please contact support.",
    { duration: 6000 });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(function (details) {
      toast.success('Payment completed. Thank you, ' + details.payer.name.given_name);
      console.log("details", details);

      // Send the transaction details to the backend
      axios.post('/paypal/transaction/', {
        transaction_id: details.id,
        payer_id: details.payer.payer_id,
        payer_email: details.payer.email_address,
        amount: details.purchase_units[0].amount.value,
        currency: details.purchase_units[0].amount.currency_code,
        status: details.status,
        create_time: details.create_time,
        update_time: details.update_time,
      }).then(response => {
        console.log('Transaction saved:', response.data);
      }).catch(error => {
        console.error('Error saving transaction:', error);
      });
    });
  };

  return (
    <div className="card">
      {/* <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpJDoLEj5bcbkQhxlFOl0vJQ6JH0TQUnd6auGYNM0XnL09iuHx82As_Gd7Ak4Xa6OCTIA&usqp=CAU" alt="Product" style={{ width: '100%' }} /> */}
      <div className="card-details">
        {/* <h1>Product Payment</h1> */}
        {/* <p className="price">${price}</p> */}
        <PayPalButtons
          style={{ layout: "horizontal" }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: price,
                  },
                },
              ],
            });
          }}
          onCancel={onCancel}
          onError={onError}
          onApprove={onApprove}
        />
      </div>
    </div>
  );
}

export default Payment;
