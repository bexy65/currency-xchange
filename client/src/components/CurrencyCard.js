import React, { useState, useEffect } from "react";

function CurrencyCard({ currency, rate, baseValue, onValueChange }) {
  const [value, setValue] = useState(baseValue * rate);

  useEffect(() => {
    setValue(baseValue * rate); 
  }, [baseValue, rate]);

  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value) || 0; 
    setValue(newValue);
    onValueChange(newValue / rate); 
  };

  return (
    <div className="card m-2 p-2 shadow-sm">
      <div className="card-body text-center">
        <h5 className="card-title">{currency}</h5>
        <p className="card-text h3">{rate}</p>
        <input
          type="number"
          className="form-control text-center"
          value={value}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default CurrencyCard;
