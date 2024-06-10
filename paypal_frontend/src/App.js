import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Payment } from './components/Payment'
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import axios from 'axios'; // Import axios for making HTTP requests
import { useState } from "react";
import ProductList from './components/ProductList'

// export default function App() {

//   const onApprove = (data, actions) => {
//     const user_id = 1
//     // After the payment is approved, call your API to handle the payment
//     axios.post('http://127.0.0.1:8000/paypal/create/', {
//       orderID: data.orderID
//     })
//     .then((response) => {
//       console.log("response data is", response.data);
//       toast.success('Payment completed. Thank you, ' + response.data.payerName);
//       console.log("response.data.approved_url", response.data.approved_url);
//     })
//     .catch((error) => {
//       console.error('Error processing payment:', error);
//       toast.error('There was an error processing your payment. If this error persists, please contact support.');
//     });
//   };

//   return (
//     <div>
//       <button onClick={onApprove}>create payment link</button>

//       <ProductList/>
//       {/* <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID }}>
//         <Toaster position="top-center" />
//         <Payment />
//       </PayPalScriptProvider> */}
//     </div>
//   );
// }

// import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import ProductList from './components/ProductList'
// import Payment from './components/Payment';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<ProductList />} />
//         <Route path="/payment/:price" element={<Payment />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

function App() {
  return (
   <div>
      <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID }}>
         <Toaster position="top-center" />
          <ProductList />
      </PayPalScriptProvider>
   </div>
  );
}

export default App;