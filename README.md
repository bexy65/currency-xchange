# **Project Deployment Information**

This project has been successfully deployed using:

- **Backend (Node.js):** Hosted on **Render**
- **Frontend (React):** Hosted on **Netlify**

## **Backend Overview**
The backend is built with **Node.js** and **Express.js** and serves as an API to manage currency exchange rates. It connects to a **MongoDB database** via **Mongoose** and fetches live exchange rates using the **ExchangeRate-API**. Key functionalities include:

- Fetching and updating exchange rates automatically.
- Adding and removing currencies from the database.
- Serving data to the frontend via API endpoints.

### **Key Endpoints:**
- `GET /` - Retrieves all stored currencies and their exchange rates.
- `GET /update-rates` - Fetches the latest exchange rates and updates the database.
- `POST /add-currency` - Adds a new currency to the database.
- `DELETE /delete-currency` - Removes a currency from the database.

This backend ensures up-to-date exchange rates and provides a robust API for the frontend.

## **Frontend Overview**
The frontend is built using **React.js** and provides a user-friendly interface for interacting with currency exchange rates. It features:

- A dynamic currency list fetched from the backend.
- The ability to add and remove currencies.
- A real-time exchange rate calculator.
- Toast notifications for user feedback.
- A refresh function to update exchange rates from the backend.

### **Key Features:**
- **Live Exchange Rates:** Users can view the latest exchange rates dynamically.
- **Currency Management:** Add or remove currencies to customize the exchange list.
- **Conversion Tool:** Adjust the base value to see real-time conversions.
- **API Integration:** Fetches and updates data from the backend via API calls.

For further details on managing deployments, refer to the documentation of **Render** and **Netlify**.

