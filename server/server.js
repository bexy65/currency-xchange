const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Rate = require("./models/Rate");
const connectDB = require("./db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5543;

let currencies;
let allCurrencies;

async function fetchExchangeRates() {
  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    const currency = process.env.CURRENCY;
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${currency}`
    );
    return response.data.conversion_rates;
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
    return null;
  }
}

async function updateRatesInDatabase(currencies, conversionRates) {
  try {
    for (const currencyObj of currencies) {
      const { currency } = currencyObj;
      if (conversionRates && currency in conversionRates) {
        await Rate.updateOne(
          { currency },
          { rate: conversionRates[currency], updatedAt: new Date() }
        );
      }
    }
    console.log("Rates updated successfully");
  } catch (error) {
    console.error("Error updating rates in database:", error);
    throw error;
  }
}

async function initializeData() {
  try {
    allCurrencies = await fetchExchangeRates();
    currencies = await Rate.find();
    console.log("Initial data fetched successfully");
  } catch (error) {
    console.error("Failed to initialize data:", error);
  }
}

initializeData();

app.get("/update-rates", async (req, res) => {
  try {
    const conversionRates = await fetchExchangeRates();
    if (conversionRates) {
      await updateRatesInDatabase(currencies, conversionRates);
      currencies = await Rate.find();
      res.status(200).json({ message: "Exchange rates updated" });
    } else {
      res.status(500).json({ error: "Failed to fetch exchange rates" });
    }
  } catch (error) {
    console.error("Error updating exchange rates:", error);
    res.status(500).json({ error: "Failed to update rates" });
  }
});

app.get("/", async (req, res) => {
  try {
    if (currencies !== null && allCurrencies !== null) {
      const responseData = {
        currencies,
        allCurrencies,
      };
      res.json(responseData);
    } else {
      res.status(500).json({ error: "Failed to fetch currencies plase try again later!" });
    }
  } catch (error) {
    console.error("Error in / endpoint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/add-currency", async (req, res) => {
  const { currency } = req.body;

  try {
    const conversionRates = await fetchExchangeRates();
    if (!conversionRates || !(currency in conversionRates)) {
      return res.status(400).json({ error: "Exchange rate not found" });
    }

    const rate = conversionRates[currency];
    await Rate.findOneAndUpdate(
      { currency },
      { rate, updatedAt: new Date() },
      { upsert: true }
    );

    currencies = await Rate.find();

    res.json({ message: `${currency} added` });
  } catch (error) {
    console.error("Error adding/updating currency:", error);
    res.status(500).json({ error: "Failed to add currency" });
  }
});

app.delete("/delete-currency", async (req, res) => {
  const { currency } = req.body;

  try {
    const result = await Rate.deleteOne({ currency });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Currency not found" });
    }

    currencies = await Rate.find();
    res.status(200).json({ message: `${currency} deleted successfully` });
  } catch (error) {
    console.error("Error deleting currency:", error);
    res.status(500).json({ error: "Failed to delete currency" });
  }
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
