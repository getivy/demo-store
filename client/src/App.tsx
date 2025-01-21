import "./App.css";

import { useEffect, useState } from "react";

import axios from "axios";

const BASE_URL = "http://localhost:3001";

const useScript = (url: string) => {
  useEffect(() => {
    const script = document.createElement("script");

    script.src = url;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url]);
};

const App = () => {
  const [error, setError] = useState<string>("");
  const isSuccess = window.location.search.includes("success=true");
  const isError = window.location.search.includes("error=true");

  useScript("https://cdn.getivy.de/button.js");

  const createCheckout = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/checkout/create`, {
        price: {
          total: 16,
          currency: "EUR",
        },
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      startIvyCheckout(res.data.ivyCheckoutUrl);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message || "Failed to get checkout URL");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div>
      {isSuccess && <p>Your previous payment was successful!</p>}
      {isError && <p>Your previous payment failed!</p>}
      <p>Click below to start the payment process</p>
      <button className="ivy-checkout-button" onClick={createCheckout}></button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default App;
