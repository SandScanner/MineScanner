import axios from "axios";
import React, { useState } from "react";
import PdfConverter from "./PdfConverter";


const VehicleCheckForm = () => {
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
      const result = await axios.post(process.env.REACT_APP_API_URL + "/vehicle_check", {
        vehicleNumber: vehicleNumber,
        userId: userData.userId,
        mine_id: userData.mine_id,
      });

      if (result.status === 200 && result.data) {
        // Simulate vehicle found
        setVehicleVerified(true);
        setFormData({
          ...formData,
          ...result.data,
          within_tn: result?.data?.within_tn?.data[0],
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
    if (!formData.dispatch_slip_no || !formData.serial_no || !formData.travelling_date || !formData.required_time || !formData.quantity) {

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
      const result = await axios.post(process.env.REACT_APP_API_URL + "/dispatch", {
        ...formData,
        userId: userData.userId,
        mine_id: userData.mine_id,
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
      <div style={{  height: "100vh" }}>
        <div style={{ border: "1px solid #ccc", padding: "30px", width: "300px", borderRadius: "8px" }}>
          <h2>Check Vehicle</h2>
          <input
            type="text"
            placeholder="Vehicle Number"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />
          <button onClick={handleVehicleCheck} style={{ width: "100%", padding: "8px" }}>Check</button>
        </div>
        <PdfConverter dispatch={handleSave} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
      <div style={{ border: "1px solid #ccc", padding: "30px", width: "400px", borderRadius: "8px" }}>
        <h2>Dispatch Details</h2>
        <form style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label style={{ fontSize: "14px", marginBottom: "5px" }}>Vehicle Number</label>
          <input
            type="text"
            placeholder="Dispatch Number"
            name="dispatch_slip_no"
            value={formData.dispatch_slip_no}
            onChange={handleFormChange}
          />
          <label style={{ fontSize: "14px", marginBottom: "5px" }}>Serial Number</label>
          <input
            type="text"
            placeholder="Serial Number"
            name="serial_no"
            value={formData.serial_no}
            onChange={handleFormChange}
          />
          <label style={{ fontSize: "14px", marginBottom: "5px" }}>Travelling Date</label>
          <input
            type="datetime-local"
            placeholder="Travelling Date"
            name="travelling_date"
            value={formData.travelling_date}
            onChange={handleFormChange}
          />
          <label style={{ fontSize: "14px", marginBottom: "5px" }}>Required Time</label>
          <input
            type="text"
            placeholder="Required Time"
            name="required_time"
            value={formData.required_time}
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
          <label style={{ fontSize: "14px", marginBottom: "5px" }}>Driver Name</label>
          <input
            type="text"
            placeholder="Driver Name"
            name="driver_name"
            value={formData.driver_name}
            onChange={handleFormChange}
          />
          <label style={{ fontSize: "14px", marginBottom: "5px" }}>Driver Ph</label>
          <input
            type="text"
            placeholder="Driver Contact"
            name="driver_ph_no"
            value={formData.driver_ph_no}
            onChange={handleFormChange}
          />
          <label style={{ fontSize: "14px", marginBottom: "5px" }}>Driver License No</label>
          <input
            type="text"
            placeholder="Driver License No"
            name="driver_license_no"
            value={formData.driver_license_no}
            onChange={handleFormChange}
          />

          <button type="submit" style={{ padding: "8px" }} onClick={handleShowPdf}>Submit</button>
        </form>
      </div>
      {showPdf && 
          <PdfConverter dispatch={handleSave} pdfData={formData} />
        }
        
    </div>
  );
};

export default VehicleCheckForm;
