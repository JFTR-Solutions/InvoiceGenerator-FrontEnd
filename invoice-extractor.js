const headURL = 'http://localhost:8080/';
//const headURL = "https://swiftmarine.azurewebsites.net/";

const container = document.querySelector("#example1");
let hot = null;

const uploadButtonInvoiceEx = document.getElementById(
  "uploadButton-invoice-ex"
);

const data = [];

uploadButtonInvoiceEx.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/pdf"; // Add other accepted file types if needed, e.g. 'image/*' for images
  input.multiple = true; // Allow multiple files to be selected

  input.addEventListener("change", async () => {
    document.getElementById("loader").style.display = "block";
    document.getElementById("uploadButton-invoice-ex").style.display = "none";
    uploadButtonInvoiceEx.style.display = "none";
    const files = Array.from(input.files);
    if (files.length === 0) return;

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    console.log("Number of files: " + files.length);
    const apiURL = headURL + "invoices/test";
    const token = localStorage.getItem("token");

    fetch(apiURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((listData) => {
        listData.forEach((item) => {
          const totalPrice = item.quantity * item.price;
          const itemInfo = [
            item.description,
            item.quantity,
            item.price,
            totalPrice,
            'EUR',
            item.referenceNumber,
          ];
          data.push(itemInfo);
          console.log(itemInfo);
          createTable();
          document.getElementById("loader").style.display = "none";
          document.getElementById("uploadButton-invoice-ex").style.display = "block";
          document.getElementById("exportButton").style.display = "block";
          document.getElementById("copyButton").style.display = "block";
          document.getElementById("resetButton").style.display = "block";
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  });
  input.click();
});

const columnHeaders = [
  "Description",
  "Qty.",
  "Unit Price",
  "Total",
  "Currency",
  "PO",
];

function createTable() {
  hot = new Handsontable(container, {
    data,
    startRows: 1,
    startCols: 5,
    height: 500,
    width: 1000,
    colHeaders: true,
    colWidths: [150,50,80,80,100,400],
    rowHeaders: true,
    contextMenu: true,
    colHeaders: columnHeaders,
    customBorders: true,
    licenseKey: "non-commercial-and-evaluation",
  });
}

function clearTable(){
  let text = "Are you sure you want to clear the table?"
  if(!confirm(text)) return;
  hot.destroy(); //removes Handsontable from the page
  data.length = 0;  //clears data in table
  document.getElementById("exportButton").style.display = "none";
  document.getElementById("copyButton").style.display = "none";
  document.getElementById("resetButton").style.display = "none";
}

function exportToExcel() {
  const combinedData = [columnHeaders, ...hot.getData()];
  const ws = XLSX.utils.aoa_to_sheet(combinedData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  const now = new Date();
  const date = now.toLocaleDateString().replace(/\//g, '-'); // Format the date as a string with hyphens instead of slashes
  const time = now.toLocaleTimeString().replace(/:/g, '-'); // Format the time as a string with hyphens instead of colons
  const filename = `${date}_${time}_invoice_extract_data.xlsx`;

  // Generate a Blob using XLSX.write()
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

  // Convert the binary string to an ArrayBuffer
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }

  // Save the file using FileSaver.js
  saveAs(
    new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
    filename
  );
}

function copyToClipboard() {
  const tableData = hot.getData(); // Get the data from the Handsontable instance
  const clipboardData = tableData.map(row => row.join('\t')).join('\n'); // Convert the data to a tab-separated format for Excel
  navigator.clipboard.writeText(clipboardData); // Write the data to the clipboard
}

