import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CurrencyCard from "../components/CurrencyCard";

function Home() {
  const [data, setData] = useState([]);
  const [allCurrencies, setAllCurrencies] = useState([]);
  const [baseValue, setBaseValue] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState("");

  const getData = async () => {
    try {
      const response = await fetch("http://localhost:4700");
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      if (result) {
        setData(result.currencies);
        setAllCurrencies(result.allCurrencies);
      } else {
        throw new Error("Unexpected data format");
      }
    } catch (err) {
      toast.error(err.message);
      setData([]);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleValueChange = (newBaseValue) => {
    setBaseValue(newBaseValue);
  };

  const addCurrency = async () => {
    try {
      const response = await fetch("http://localhost:4700/add-currency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency: selectedCurrency }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to add currency");
      }
      toast.success(`${selectedCurrency} added successfully`);
      await getData();
      setSelectedCurrency("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const updateRates = async () => {
    try {
      const response = await fetch("http://localhost:4700/update-rates");
      if (!response.ok) {
        throw new Error("Failed to update rates");
      }
      toast.success(`Rates refreshed successfully`);
      await getData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteCurrency = async (currency) => {
    try {
      const response = await fetch("http://localhost:4700/delete-currency", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to delete currency");
      }
      toast.error(`${currency} deleted successfully`);
      await getData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container text-center mt-4">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <h1 className="mb-4">Currency Exchange</h1>

      <div className="mb-4 mx-auto">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="d-flex flex-column flex-sm-row justify-content-center">
              <select
                className="form-select mb-3 mb-md-4 mx-0 mx-md-2"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
              >
                <option value="">Select Currency</option>
                {allCurrencies &&
                  Object.keys(allCurrencies).map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
              </select>
              <button
                className="btn btn-warning mx-0 mx-lg-2 mb-3 mb-md-4"
                disabled={selectedCurrency === ""}
                onClick={addCurrency}
              >
                Add Currency
              </button>
              <button className="btn btn-primary mx-0 mx-lg-2 mb-3 mb-md-4" onClick={updateRates}>
                Refresh Rates
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row mx-auto w-sm-100 justify-content-center w-75 p-0 m-0">
        {data.length === 0 ? (
          <p>Loading...</p>
        ) : (
          data.map((item, index) => (
            <div
              key={index}
              className="col-sm-5 col-lg-3 m-0 p-0 currency-card-container"
            >
              <CurrencyCard
                currency={item.currency}
                rate={item.rate}
                baseValue={baseValue}
                onValueChange={handleValueChange}
              />
              <button
                className="btn btn-danger m-2 delete-button"
                onClick={() => deleteCurrency(item.currency)}
              >
                X
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
