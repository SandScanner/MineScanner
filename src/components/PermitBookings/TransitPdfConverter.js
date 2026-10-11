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
      let result = await fetch(process.env.REACT_APP_API_URL + `/get_transit_signatures/${userData?.transitId}`);
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
        if (sHour > 12) {
            sHour = iHourCheck - 12;
        }else {
            sHour = iHourCheck;
        }
    }
    else if (iHourCheck === 0) {
        sHour = "12";
    }

    sHour = padValue(sHour);

    return sDay + "-" + sMonth + "-" + sYear + " " + sHour + ":" + sMinute + " " + sAMPM;
}

function padValue(value) {
    return (value < 10) ? "0" + value : value;
}

  let date = new Date();
  let dispatch_time = ("00" + date.getDate()).slice(-2) 
      + "-" + ("00" + (date.getMonth() + 1)).slice(-2) 
      + "-" + date.getFullYear() + " " 
      + ("00" + date.getHours()).slice(-2) + ":" 
      + ("00" + date.getMinutes()).slice(-2) 
      + ":" + ("00" + date.getSeconds()).slice(-2); 

    
  let dispatch_date_time = ("00" + date.getDate()).slice(-2) 
      + "-" + ("00" + (date.getMonth() + 1)).slice(-2) 
      + "-" + date.getFullYear() + " " 
      + ("00" + date.getHours()).slice(-2) + ":" 
      + ("00" + date.getMinutes()).slice(-2) 

  const time_formatting_for_transit = (timestamp) => {
    const date = new Date(timestamp);

      const formatted = `${String(date.getDate()).padStart(2, '0')}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}-${date.getFullYear()} ${String(
        date.getHours()
      ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

    return formatted;
  }

  const getDispatchQRCodeValue = () => {

    // For QR code timing
    let travelling_date = pdfData?.travelling_date ? formatDate(pdfData?.travelling_date) : "";
    let mineral_name = pdfData?.name_of_mineral ? pdfData?.name_of_mineral.split('/')[0] : "";
    let mineral_name_template = mineral_name.trim()+`(${pdfData?.quantity}MT)`;
    let time_start = pdfData?.time_start ? time_formatting_for_transit(pdfData?.time_start) : "";
    let dispatchQRCodeValue = `${pdfData?.bulk_transit_pass_no},${mineral_name_template},${time_start},${pdfData?.transit_pass_sno},${pdfData?.vehicle_no},${pdfData?.address_of_purchaser}`;
    return dispatchQRCodeValue;
  }

  const dispatchQRCode = renderToString(<QRCode
    // size={256}
    style={{ height: "60",width: "60" }}
    value={getDispatchQRCodeValue()}
    viewBox={"0 0 256 256"}
  />);

  let travelling_date = pdfData?.travelling_date ? formatDate(pdfData?.travelling_date) : "";
  let temp_required_time = pdfData?.required_time ? new Date(pdfData?.travelling_date) : new Date();
  temp_required_time.setHours(temp_required_time.getHours() + parseInt(pdfData?.required_time));
  let required_time = pdfData?.required_time ? formatDate(temp_required_time) : "";
  console.log("pdfdata", pdfData);


  let time_start = pdfData?.time_start ? time_formatting_for_transit(pdfData?.time_start) : "";
  let time_end = pdfData?.time_end ? time_formatting_for_transit(pdfData?.time_end) : "";

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
            width: 794px;
            /* A4 width in pixels at 96 DPI */
            height: 1123px;
            background: white;
            box-sizing: border-box;
        }

        .serial_no {
            font-weight: 400;
        }

        .container {
            /* // height: 140.5mm; */
            padding-left: 15mm;
            padding-right: 15mm;
            padding-top: 10mm;
            /* // padding-bottom: 5mm; */
            box-sizing: border-box;
            position: relative;
            /* // margin-top: 40px; */
            margin-left: auto;
            margin-right: auto;
            width: 794px;
            /* A4 width in pixels at 96 DPI */
        }

        .container1 {
            height: 140.5mm;
            padding-left: 15mm;
            padding-right: 15mm;
            padding-top: 15mm;
            padding-bottom: 5mm;
            box-sizing: border-box;
            position: relative;
            margin-left: auto;
            margin-right: auto;
            width: 794px;
            /* A4 width in pixels at 96 DPI */
        }

        .header {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
            width: 100%;
        }

        .header1 {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            margin-bottom: 0px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            bottom: 25px;
        }

        table,
        th,
        td {
            border: 1px solid #000;
        }

        th,
        td {
            padding: 3px;
            text-align: left;
            vertical-align: top;
        }

        .qr-code {
            position: absolute;
            top: 35px;
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
    <br />
    <br />
    <br />
    <div class="container">

        <!-- <img src="${Qrsample}" alt="QR Code" class="qr-code"> -->
        <div class="qr-code">
            ${dispatchQRCode}
        </div>

        <div class="header">

            <!-- <span>sample</span> -->

            <span style="margin-left: 300px; margin-right: auto;">Original</span>
            <span style="float: right;">Date & Time Of Dispatch: ${dispatch_time}</span>

        </div>

        <table>
            <tr>
                <td>Registration Number: </td>
                <td>${pdfData?.reg_no}</td>
                <td>Location of the Stockyard: </td>
                <td>${pdfData?.location_of_stockyard}</td>
            </tr>
            <tr>
                <td rowspan="3" colspan="2">Name and Address of the Register Holder : 
                <br/>
                ${pdfData?.register_name}
                <br/>
                ${pdfData?.register_address.replace(/\r?\n/g, '<br>')}
                
                
                </td>
                
                <td>SF.No / Extent:</td>
                <td>${pdfData?.sf_no}</td>
            </tr>
            <tr>
                <td>Village:</td>
                <td>${pdfData?.village}</td>
            </tr>
            <tr style="height: 20px;">
                <td>Taluk :</td>
                <td>${pdfData?.taluk}</td>
            </tr>


            <tr>

            </tr>


            <tr>
                <td>Name of Mineral / Mineral Products : </td>
                <td>${pdfData?.name_of_mineral}</td>
                <td>District :</td>
                <td>${pdfData?.district}</td>
            </tr>

            <tr>
                <td>Quantity(in MT) :</td>
                <td>${pdfData?.quantity}</td>
                <td>Validity of Stockyard : </td>
                <td>${pdfData?.validity_of_stockyard}</td>
            </tr>

            <tr>
                <td>Bulk Transit Pass No :</td>
                <td>${pdfData?.bulk_transit_pass_no}</td>
                <td>Security Paper Serial No : </td>
                <td>${pdfData?.security_paper_sno}</td>
            </tr>
            <tr>
                <td>Vehicle No : </td>
                <td>${pdfData?.vehicle_no}</td>
                <td>Transit Pass Serial No : </td>
                <td>${pdfData?.transit_pass_sno}</td>
            </tr>
            <tr>
                <td>Approximate Distance : </td>
                <td>${pdfData?.approx_distance}Kms</td>
                <td>Name of the Purchaser : </td>
                <td>${pdfData?.name_of_purchaser}</td>
            </tr>
            <tr>
                <td>Time Start : </td>
                <td>${time_start}</td>
                <td colspan="2" rowspan="3">Address of the Purchaser : 
                    <br/>
                    ${pdfData?.address_of_purchaser}
                </td>
            </tr>

            <tr>
                <td>Time End : </td>
                <td>${time_end}</td>
                
            </tr>
            <tr>
                <td>Name of Vehicle Driver : </td>
                <td>${pdfData?.name_of_vehicle_driver}</td>
            </tr>
            <tr style="height: 25px;">
                <td>Destination and State :</td>
                <td>${pdfData?.destination_and_state}</td>
                <td>Signature of AD / DD </td>
                <td><img style="width: 60px; height: 25px" src="${Sign}" alt="Signature"></td>
            </tr>
            <tr style="height: 40px;">
                <td>Driver Signature :</td>
                <td></td>
                <td>Registree Signature : </td>
                <td></td>
            </tr>
            
        </table>


    </div>

    <div class="container">

        <!-- <img src="${Qrsample}" alt="QR Code" class="qr-code"> -->
        <div class="qr-code">
            ${dispatchQRCode}
             <!-- <img src="qr-sample.png" alt="QR Code" class="qr-code"> -->
        </div>

        <div class="header">

            <!-- <span>sample</span> -->

            <span style="margin-left: 300px; margin-right: auto;">Duplicate</span>
            <span style="float: right;">Date & Time Of Dispatch: ${dispatch_time}</span>

        </div>

        <table>
            <tr>
                <td>Registration Number: </td>
                <td>${pdfData?.reg_no}</td>
                <td>Location of the Stockyard: </td>
                <td>${pdfData?.location_of_stockyard}</td>
            </tr>
            <tr>
                <td rowspan="3" colspan="2">Name and Address of the Register Holder : 
                <br/>
                ${pdfData?.register_name}
                <br/>
                ${pdfData?.register_address.replace(/\r?\n/g, '<br>')}
                </td>
                
                <td>SF.No / Extent:</td>
                <td>${pdfData?.sf_no}</td>
            </tr>
            <tr>
                <td>Village:</td>
                <td>${pdfData?.village}</td>
            </tr>
            <tr style="height: 20px;">
                <td>Taluk :</td>
                <td>${pdfData?.taluk}</td>
            </tr>


            <tr>

            </tr>


            <tr>
                <td>Name of Mineral / Mineral Products : </td>
                <td>${pdfData?.name_of_mineral}</td>
                <td>District :</td>
                <td>${pdfData?.district}</td>
            </tr>

            <tr>
                <td>Quantity(in MT) :</td>
                <td>${pdfData?.quantity}</td>
                <td>Validity of Stockyard : </td>
                <td>${pdfData?.validity_of_stockyard}</td>
            </tr>

            <tr>
                <td>Bulk Transit Pass No :</td>
                <td>${pdfData?.bulk_transit_pass_no}</td>
                <td>Security Paper Serial No : </td>
                <td>${pdfData?.security_paper_sno}</td>
            </tr>
            <tr>
                <td>Vehicle No : </td>
                <td>${pdfData?.vehicle_no}</td>
                <td>Transit Pass Serial No : </td>
                <td>${pdfData?.transit_pass_sno}</td>
            </tr>
            <tr>
                <td>Approximate Distance : </td>
                <td>${pdfData?.approx_distance}Kms</td>
                <td>Name of the Purchaser : </td>
                <td>${pdfData?.name_of_purchaser}</td>
            </tr>
            <tr>
                <td>Time Start : </td>
                <td>${time_start}</td>
                <td colspan="2" rowspan="3">Address of the Purchaser : 
                    <br/>
                    ${pdfData?.address_of_purchaser}
                </td>
            </tr>

            <tr>
                <td>Time End : </td>
                <td>${time_end}</td>
                
            </tr>
            <tr>
                <td>Name of Vehicle Driver : </td>
                <td>${pdfData?.name_of_vehicle_driver}</td>
            </tr>
            <tr style="height: 25px;">
                <td>Destination and State :</td>
                <td>${pdfData?.destination_and_state}</td>
                <td>Signature of AD / DD </td>
                <td><img style="width: 60px; height: 25px" src="${Sign}" alt="Signature"></td>
            </tr>
            <tr style="height: 40px;">
                <td>Driver Signature :</td>
                <td></td>
                <td>Registree Signature : </td>
                <td></td>
            </tr>
            
        </table>


    </div>

    
</body>

</html>
  `;

  const generatePdf = async () => {
    const element = document.createElement("div");
    element.innerHTML = htmlContent;

    html2pdf()
      .from(element)
      .set({
        margin: 0,
        filename: "dispatch-slip.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      })
      .outputPdf("blob")
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      });
      
      await dispatch().then(() => {
      console.log("PDF generated successfully. Click on Download PDF to download the file.");
       }).catch((error) => {
      console.error("Error downloading PDF", error);
       });

  };

  const handleDownload = async() => {

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${pdfData?.transit_pass_sno || "document"}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(pdfUrl);

    await dispatch().then(() => {
      navigate(0);  
    }).catch((error) => {
      alert("Error downloading PDF" )
    });
    
  }

  const downloadPdf = async() => {
    const element = document.createElement("div");
    element.innerHTML = htmlContent;

    await dispatch();

    await html2pdf()
      .from(element)
      .set({
        margin: 0,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      })
      .toPdf()
      .save(`${pdfData?.transit_pass_sno}.pdf`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={generatePdf}>Generate PDF</button>
      {pdfUrl && <button onClick={handleDownload} style={{ marginLeft: "10px" }}>Download PDF</button>}
      {/* {pdfUrl && <a href={pdfUrl} download={`${pdfData?.vehicle_no}.pdf`}  onClick={handleDownload} target="_blank" style={{ marginLeft: "10px" }}>
        Download PDF
        </a>} */}
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
