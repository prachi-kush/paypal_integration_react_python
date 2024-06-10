import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios'; // Import Axios
import toast from "react-hot-toast";

const products = [
  { id: 1, name: 'Samsung M31S Mobile', price: 60000.00, image: 'https://www.refurbkart.com/cdn/shop/files/m31s1_1.jpg?v=1707131618' },
  { id: 2, name: 'Apple Laptop', price: 120000.00, image: 'https://m.media-amazon.com/images/I/41ZJJLODSAL._AC_UF1000,1000_QL80_.jpg' },
  { id: 3, name: 'Apple TV', price: 670000.00, image: 'https://help.apple.com/assets/65F33C034E53F804F50D908E/65F33C06169682BA770AB6BA/en_US/b7c60d736e07e1d4e7ee48db0a1ef9f0.png' },
];

function ProductList() {
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
      console.log("details data", details.id);
      console.log("payer_id", details.payer.payer_id);
      console.log("email_address", details.payer.email_address);
      console.log("amount", details.purchase_units[0].amount.value);
      console.log("currency_code", details.purchase_units[0].amount.currency_code);
      console.log("status",  details.status);
      // console.log("details", details);
      // Send the transaction details to the backend
      axios.post('http://127.0.0.1:8000/paypal/transaction/', {
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
    <div>
      <h1>Welcome to our website !! select your products and done your payment with paypal in secure way.</h1>
      <h2>HAPPY SHOPPING :)</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <img src={product.image} alt={product.name} style={{ width: '20%',height:'20%',flexDirection:'row' }} />
            <h2>{product.name}</h2>
            <p>Price: ${product.price.toFixed(2)}</p>
            <PayPalButtons
              style={{ layout: "horizontal" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: product.price.toFixed(2), // Ensure two decimal places
                      },
                      name:{
                        value :'Buy now with PayPal'
                      }
                    },
                  ],
                });
              }}
              onCancel={onCancel}
              onError={onError}
              onApprove={onApprove}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
