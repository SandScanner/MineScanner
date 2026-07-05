import axios from "axios";
import React, { useState } from "react";
import TransitPdfConverter from "./TransitPdfConverter";


const TransitVehicleCheckForm = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleVerified, setVehicleVerified] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [formData, setFormData] = useState({
    dispatch_slip_no: "",
    serial_no: "",
    travelling_date: "",
    required_time: "",
    quantity: "",
  });

  const handleVehicleCheck = async () => {
    // Dummy API simulation
    try {
      // Simulate API success
      const success = vehicleNumber.trim() !== ""; // Accept anything non-empty
      const result = await axios.post(process.env.REACT_APP_API_URL + "/transit_vehicle_check", {
        vehicleNumber: vehicleNumber,
        userId: userData.userId,
        transitId: userData.transitId,
      });

      if (result.status === 200 && result.data) {
        // Simulate vehicle found
        setVehicleVerified(true);
        setFormData({
          ...formData,
          ...result.data,
          vehicleNumber: vehicleNumber,
        });
        alert("Vehicle verified successfully!");
      } else {
        alert("Vehicle not found!");
      }
    } catch (error) {
      alert("Error verifying vehicle.");
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShowPdf = (e) => {
    e.preventDefault();

    // Validate form data before showing PDF
    if (!formData.name_of_vehicle_driver || !formData.name_of_purchaser || !formData.address_of_purchaser || !formData.bulk_transit_pass_no || !formData.quantity || !formData.security_paper_sno || !formData.transit_pass_sno || !formData.approx_distance || !formData.destination_and_state || !formData.time_start || !formData.time_end) {

      alert("Please fill in all fields before proceeding.");

      return;
    }

    // Logic to show PDF
    console.log("Show PDF button clicked");
    setShowPdf(true);
  }

  const handleSave = async () => {
    // e.preventDefault();
    console.log("Form data:", formData);
    try {
      const result = await axios.post(process.env.REACT_APP_API_URL + "/transit_dispatch", {
        ...formData,
        userId: userData.userId,
        transitId: userData.transitId,
      });

      if (result.status === 200) {
        alert("Dispatch details saved successfully!");
      } else {
        alert("Error saving dispatch details.");
      }
    } catch (error) {
      alert("Error saving dispatch details.");
    }
  };

  if (!vehicleVerified) {
    return (
      <div>
        <div style={{ border: "1px solid #ccc", padding: "30px", width: "300px", borderRadius: "8px" }}>
          <h2>Check Vehicle Transit</h2>
          <input
            type="text"
            placeholder="Vehicle Number"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />
          <button onClick={handleVehicleCheck} style={{ width: "100%", padding: "8px" }}>Check</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ border: "1px solid #ccc", padding: "30px", width: "400px", borderRadius: "8px" }}>
        <h2>Dispatch Details</h2>
        <form style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label style={{ fontSize: "14px", marginBottom: "5px" }}>Driver Name</label>
          <input
            type="text"
            placeholder="Driver Name"
            name="name_of_vehicle_driver"
            value={formData.name_of_vehicle_driver}
            onChange={handleFormChange}
          />
          <label style={{ fontSize: "14px", marginBottom: "5px" }}>Name of Purchaser</label>
          <input
            type="text"
            placeholder="Purchaser Name"
            name="name_of_purchaser"
            value={formData.name_of_purchaser}
            onChange={handleFormChange}
          />
          <label style={{ fontSize: "14px", marginBottom: "5px" }}>Address of Purchaser</label>
          <input
            type="text"
            placeholder="Purchaser Address"
            name="address_of_purchaser"
            value={formData.address_of_purchaser}
            onChange={handleFormChange}
          />
          <label style={{ fontSize: "14px", marginBottom: "5px" }}>Time Start</label>
          <input
            type="datetime-local"
            placeholder="Time Start"
            name="time_start"
            value={formData.time_start}
            onChange={handleFormChange}
          />
          <label style={{ fontSize: "14px", marginBottom: "5px" }}>Time End</label>
          <input
            type="datetime-local"
            placeholder="Time End"
            name="time_end"
            value={formData.time_end}
            onChange={handleFormChange}
          />

          <label style={{ fontSize: "14px", marginBottom: "5px" }}>Approx. Distance (in Kms)</label>
          <input
            type="text"
            placeholder="Approx. distance"
            name="approx_distance"
            value={formData.approx_distance}
            onChange={handleFormChange}
          />

          <label style={{ fontSize: "14px", marginBottom: "5px" }}>Quantity (MT)</label>
          <input
            type="number"
            placeholder="Quantity (MT)"
            name="quantity"
            value={formData.quantity}
            onChange={handleFormChange}
          />
  
          <label style={{ fontSize: "14px", marginBottom: "5px" }}>Bulk Transit Pass No</label>
          <input
            type="text"
            placeholder="Bulk Transit Pass No"
            name="bulk_transit_pass_no"
            value={formData.bulk_transit_pass_no}
            onChange={handleFormChange}
          />

          <label style={{ fontSize: "14px", marginBottom: "5px" }}>Security Paper S.No</label>
          <input
            type="text"
            placeholder="Security Paper S.No"
            name="security_paper_sno"
            value={formData.security_paper_sno}
            onChange={handleFormChange}
          />

          <label style={{ fontSize: "14px", marginBottom: "5px" }}>Transit Pass S.No</label>
          <input
            type="text"
            placeholder="Transit Pass S.No"
            name="transit_pass_sno"
            value={formData.transit_pass_sno}
            onChange={handleFormChange}
          />

          <label style={{ fontSize: "14px", marginBottom: "5px" }}>Destination and State</label>
          <input
            type="text"
            placeholder="Destination & State"
            name="destination_and_state"
            value={formData.destination_and_state}
            onChange={handleFormChange}
          />
          
          <button type="submit" style={{ padding: "8px" }} onClick={handleShowPdf}>Submit</button>
        </form>
      </div>
      {showPdf && 
          <TransitPdfConverter dispatch={handleSave} pdfData={formData} />
        }
        
    </div>
  );
};

export default TransitVehicleCheckForm;
