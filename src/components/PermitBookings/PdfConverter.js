import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import Qrsample from "./qr-sample.png";
import QRCode from "react-qr-code";
// import Sign from "./sign.png";
import { renderToString } from 'react-dom/server';
import { redirect, useNavigate } from "react-router-dom";

const PdfGenerator = ({dispatch, pdfData}) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const userData = JSON.parse(localStorage.getItem("user"));
  const [Sign, setSign] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSignature = async () => {
      let result = await fetch(process.env.REACT_APP_API_URL + `/get_signatures/${userData?.mine_id}`);
      if (result.status === 200) {
        console.log("Signature result:", result.data);
        const blob = await result.blob(); // Assuming the response is a Blob
        const url = URL.createObjectURL(blob);
        setSign(url);
      } else {
        console.error("Error fetching signature:", result.statusText);
      }
    }
    fetchSignature();
  }, [])

  function formatDate(dateVal) {
    var newDate = new Date(dateVal);

    var sMonth = padValue(newDate.getMonth() + 1);
    var sDay = padValue(newDate.getDate());
    var sYear = newDate.getFullYear();
    var sHour = newDate.getHours();
    var sMinute = padValue(newDate.getMinutes());
    var sAMPM = "am";

    var iHourCheck = parseInt(sHour);

    if (iHourCheck >= 12) {
        sAMPM = "pm";
        sHour = iHourCheck - 12;
    }
    else if (iHourCheck === 0) {
        sHour = "12";
    }

    sHour = padValue(sHour);

    return sMonth + "-" + sDay + "-" + sYear + " " + sHour + ":" + sMinute + " " + sAMPM;
}

function padValue(value) {
    return (value < 10) ? "0" + value : value;
}

  let date = new Date();
  let dispatch_time = ("00" + (date.getMonth() + 1)).slice(-2) 
      + "-" + ("00" + date.getDate()).slice(-2) 
      + "-" + date.getFullYear() + " " 
      + ("00" + date.getHours()).slice(-2) + ":" 
      + ("00" + date.getMinutes()).slice(-2) 
      + ":" + ("00" + date.getSeconds()).slice(-2); 

  const dispatchQRCode = renderToString(<QRCode
    // size={256}
    style={{ height: "60",width: "60" }}
    value={pdfData?.dispatch_slip_no ? pdfData?.dispatch_slip_no : ""}
    viewBox={"0 0 256 256"}
  />);

  let travelling_date = pdfData?.travelling_date ? formatDate(pdfData?.travelling_date) : "";
  let temp_required_time = pdfData?.required_time ? new Date(pdfData?.travelling_date) : new Date();
  temp_required_time.setHours(temp_required_time.getHours() + parseInt(pdfData?.required_time));
  let required_time = pdfData?.required_time ? formatDate(temp_required_time) : "";
  console.log("pdfdata", pdfData);

  const htmlContent = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dispatch Slip</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      font-size: 9px;
      font-weight: 700;
        // margin: 100px;
        padding: 200px;
        // height: 100%;
    }
    .serial_no {
      font-weight: 400;
     }
    .container {
    //   width: 210mm;
    // //   margin: 20px auto;
    // //   border: 1px solid #000;
    //   padding: 10px;
    //   position: relative;
    height: 140.5mm;
        //   border: 1px solid #000;
          padding-left: 15mm;
          padding-right: 15mm;
          padding-top: 10mm;
          padding-bottom: 5mm;
          box-sizing: border-box;
          position: relative;
        //   margin-bottom: 2mm;
        margin-top: 40px;
        margin-left: auto;
        margin-right: auto;
    }
         .container1 {
    //   width: 210mm;
    // //   margin: 20px auto;
    // //   border: 1px solid #000;
    //   padding: 10px;
    //   position: relative;
    height: 140.5mm;
        //   border: 1px solid #000;
        //  padding: 15mm;
        padding-left: 15mm;
          padding-right: 15mm;
          padding-top: 15mm;
          padding-bottom: 5mm;
          box-sizing: border-box;
          position: relative;
          // margin-bottom: 300px;
          margin-left: auto;
          margin-right: auto;
          // padding-bottom: 200px;

    }
    .header {
      display: flex;
      justify-content: space-between;
    //   top: 400px;
       margin-top: 30px;
    }
       .header1 {
      display: flex;
      justify-content: space-between;
    //   top: 400px;
       margin-top: 20px;
       margin-bottom: 0px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    //   margin-bottom: 10px;
      bottom: 25px;
    }
    table, th, td {
      border: 1px solid #000;
    }
    th, td {
      padding:3px;
      text-align: left;
      vertical-align: top;
    }
    .qr-code {
      position: absolute;
      top: 9px;
      right: 57px;
      width: 60px;
      height: 60px;
    }
          .qr-code2 {
      position: absolute;
      top: 17px;
      right: 57px;
      width: 60px;
      height: 60px;
    }
    .signature-container {
      border: 1px solid #000;
      padding: 10px;
      display: flex;
      justify-content: space-between;
    }
    .signature img {
      height: 30px;
      vertical-align: middle;
    }
  </style>
</head>
<body>
  <div class="container">
    
  <!-- <img src="${Qrsample}" alt="QR Code" class="qr-code"> -->
  <div class="qr-code">
    ${dispatchQRCode}
  </div>

    <div class="header">
    
        <span>HSN Code: ${pdfData?.hsn_code}</span>
    
    
        <span>Date & Time Of Dispatch: ${dispatch_time}</span>
    
    </div>

    <table>
      <tr>
        <td>Lessee Id: ${pdfData?.lessee_id}</td>
        <td>Minecode: ${pdfData?.mine_code}</td>
        <td>Lease Area Details</td>
        <td>Serial No: <i class="serial_no">${pdfData?.serial_no}</i></td>
      </tr>
      <tr>
        <td>Lessee Name and Address</td>
        <td>${pdfData?.lessee_name}</td>
        <td>District Name:</td>
        <td>${pdfData?.district}</td>
      </tr>
     <tr>
        <td colspan="2" rowspan="3">
          ${pdfData?.lessee_address}
        </td>
        <td>Taluk Name:</td>
        <td>${pdfData?.taluk}</td>
      </tr>
     
      <tr>
        <td>Village:</td>
        <td>${pdfData?.village}</td>
      </tr>
      <tr>
        <td>SF.No / Extent:</td>
        <td>${pdfData?.sf_no}</td>
      </tr>

  
      <tr>
        <td>Mineral Name:${pdfData?.mineral_name}</td>
        <td>Bulk Permit No:${pdfData?.bulk_permit_no}</td>
        <td>Classification:</td>
        <td>${pdfData?.classification}</td>
      </tr>
      
      <tr>
         <td colspan="2">Order Ref:</td>
        <td>Lease Period:</td>
         <td>${pdfData?.lessee_period}</td>
      </tr>
      <tr>
        <td>Dispatch Slip No:</td>
        <td>${pdfData?.dispatch_slip_no}</td>
        <td>Within Tamil Nadu:</td>
        <td>${pdfData?.within_tn==1 ? 'Yes' : 'No'}</td>
      </tr>
       <tr>
         <td>Delivered To:</td>
        <td colspan="3">${pdfData?.delivered_to}</td>
      </tr>
      <tr>
        <td>Vehicle No</td>
        <td>${pdfData?.vehicle_no}</td>
        <td colspan="2">Destination Address:</td>
      </tr>
      <tr>
  <td>Vehicle Type:</td>
  <td>${pdfData?.vehicle_type}</td>
  <td colspan="2" rowspan="4">
   ${pdfData?.destination_address}
  </td>
</tr>
<tr>
  <td>Total Distance In (Kms):</td>
  <td>${pdfData?.total_distance}</td>
</tr>
<tr>
  <td>Travelling Date:</td>
  <td>${travelling_date}</td>
</tr>
<tr>
  <td>Required Time:</td>
  <td>${pdfData?.required_time}hrs (${required_time})</td>
</tr>

      <tr>
         <td>Quantity(in MT):</td>
        <td>${pdfData?.quantity}</td>
        <td>Driver Name:</td>
        <td>${pdfData?.driver_name}</td>
      </tr>
      <tr>
         <td>Driver License No:</td>
        <td>${pdfData?.driver_license_no}</td>
        <td>Via:</td>
        <td>${pdfData?.via_route}</td>
      </tr>
      <tr>
         <td>Driver Phone No:</td>
        <td>${pdfData?.driver_ph_no}</td>
        <td>Lessee / Authorized Person Name:</td>
        <td>${pdfData?.authorized_person}</td>
      </tr>
      <tr style="height: 40px;">
        <td>Driver Signature:</td>
        <td></td>
        <td>Signature of AD / DD:</td>
        <td><img src="${Sign}" alt="Signature"></td>
      </tr>
    </table>


  </div>

  <div class="container1">
    <!-- <img src="${Qrsample}" alt="QR Code" class="qr-code2"> -->
    <div class="qr-code2">
    ${dispatchQRCode}
    </div>

    <div class="header1">
      <div>
        <span>HSN Code: ${pdfData?.hsn_code}</span>
      </div>
      <div>
        <span>Date & Time Of Dispatch: ${dispatch_time}</span>
      </div>
    </div>

    <table>
      <tr>
        <td>Lessee Id: ${pdfData?.lessee_id}</td>
        <td>Minecode: ${pdfData?.mine_code}</td>
        <td>Lease Area Details</td>
        <td>Serial No: <i class="serial_no">${pdfData?.serial_no}</i></td>
      </tr>
      <tr>
        <td>Lessee Name and Address</td>
        <td>${pdfData?.lessee_name}</td>
        <td>District Name:</td>
        <td>${pdfData?.district}</td>
      </tr>
     <tr>
        <td colspan="2" rowspan="3">
          ${pdfData?.lessee_address}
        </td>
        <td>Taluk Name:</td>
        <td>${pdfData?.taluk}</td>
      </tr>
     
      <tr>
        <td>Village:</td>
        <td>${pdfData?.village}</td>
      </tr>
      <tr>
        <td>SF.No / Extent:</td>
        <td>${pdfData?.sf_no}</td>
      </tr>

  
      <tr>
        <td>Mineral Name:${pdfData?.mineral_name}</td>
        <td>Bulk Permit No:${pdfData?.bulk_permit_no}</td>
        <td>Classification:</td>
        <td>${pdfData?.classification}</td>
      </tr>
      
      <tr>
         <td colspan="2">Order Ref:</td>
        <td>Lease Period:</td>
         <td>${pdfData?.lessee_period}</td>
      </tr>
      <tr>
        <td>Dispatch Slip No:</td>
        <td>${pdfData?.dispatch_slip_no}</td>
        <td>Within Tamil Nadu:</td>
        <td>${pdfData?.within_tn==1 ? 'Yes' : 'No'}</td>
      </tr>
       <tr>
         <td>Delivered To:</td>
        <td colspan="3">${pdfData?.delivered_to}</td>
      </tr>
      <tr>
        <td>Vehicle No</td>
        <td>${pdfData?.vehicle_no}</td>
        <td colspan="2">Destination Address:</td>
      </tr>
      <tr>
  <td>Vehicle Type:</td>
  <td>${pdfData?.vehicle_type}</td>
  <td colspan="2" rowspan="4">
   ${pdfData?.destination_address}
  </td>
</tr>
<tr>
  <td>Total Distance In (Kms):</td>
  <td>${pdfData?.total_distance}</td>
</tr>
<tr>
  <td>Travelling Date:</td>
  <td>${travelling_date}</td>
</tr>
<tr>
  <td>Required Time:</td>
  <td>${pdfData?.required_time}hrs (${required_time})</td>
</tr>

      <tr>
         <td>Quantity(in MT):</td>
        <td>${pdfData?.quantity}</td>
        <td>Driver Name:</td>
        <td>${pdfData?.driver_name}</td>
      </tr>
      <tr>
         <td>Driver License No:</td>
        <td>${pdfData?.driver_license_no}</td>
        <td>Via:</td>
        <td>${pdfData?.via_route}</td>
      </tr>
      <tr>
         <td>Driver Phone No:</td>
        <td>${pdfData?.driver_ph_no}</td>
        <td>Lessee / Authorized Person Name:</td>
        <td>${pdfData?.authorized_person}</td>
      </tr>
      <tr style="height: 40px;">
         <td>Driver Signature:</td>
        <td></td>
        <td>Signature of AD / DD:</td>
        <td><img src=${Sign} alt="Signature"></td>
      </tr>
    </table>


  </div>
</body>
</html>
  `;

  const generatePdf = () => {
    const element = document.createElement("div");
    element.innerHTML = htmlContent;

    html2pdf()
      .from(element)
      .set({
        margin: 0,
        filename: "dispatch-slip.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 1.5 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      })
      .outputPdf("blob")
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      });
  };

  const downloadPdf = async() => {
    const element = document.createElement("div");
    element.innerHTML = htmlContent;

    await dispatch();

    await html2pdf()
      .from(element)
      .set({
        margin: 0,
        filename: `${pdfData?.vehicle_no}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 1.5 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      })
      .save();

    window.location.reload();
  };

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={generatePdf}>Generate PDF</button>
      <button onClick={downloadPdf} style={{ marginLeft: "10px" }}>Download PDF</button>

      {pdfUrl && (
        <iframe
          src={pdfUrl}
          title="PDF Preview"
          width="100%"
          height="800px"
          style={{ marginTop: "20px", border: "1px solid #ccc" }}
        />
      )}
    </div>
  );
};

export default PdfGenerator;
