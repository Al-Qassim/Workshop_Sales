

export function DownloadCSV({TableData, TableColumns}) {

    const KeysAndHeaders = Object.entries(TableColumns)
                .filter(([k,v])=>{return !v.hide && !v.DontExport})
                .map(([k,v])=>[k, v.header])

    let rows = TableData.map((RowObject)=>{
        return KeysAndHeaders.map(([k, h]) => RowObject[k])
    })
    rows = [
        KeysAndHeaders.map(([k, h]) => h),
        ...rows
    ]
    const saveFile = async () => {
        // Example data
        //   const rows = [
        //     ["Name", "Age", "Country"],
        //     ["Alice", 25, "USA"],
        //     ["Bob", 30, "UK"],
        //     ["Charlie", 35, "Canada"],
        //   ];
    
        // Convert the rows into a CSV string
        const csvContent = rows.map(row => row.join(",")).join("\n");
    
        // Create a Blob object with the CSV data
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    
        // Create a link element
        const link = document.createElement("a");
    
        // Create a URL for the Blob and set it as the link's href
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
    
        // Set the download attribute to the desired file name
        link.setAttribute("download", "example.csv");
    
        // Append the link to the document body
        document.body.appendChild(link);
    
        // Programmatically click the link to trigger the download
        link.click();
    
        // Clean up and remove the link
        document.body.removeChild(link);
        /////////////////////////////////////////////
        // const csvContent = rows.map(row => row.join(",")).join("\n");

        // // Check if the `showSaveFilePicker` API is supported
        // if (window.showSaveFilePicker) {
        //   try {
        //     // Use the Save File Picker API
        //     const fileHandle = await window.showSaveFilePicker({
        //       suggestedName: "example.csv",
        //       types: [
        //         {
        //           description: "CSV File",
        //           accept: { "text/csv": [".csv"] },
        //         },
        //       ],
        //     });

        //     // Write to the file
        //     const writable = await fileHandle.createWritable();
        //     await writable.write(new Blob([csvContent], { type: "text/csv" }));
        //     await writable.close();
        //     alert("File saved successfully!");
        //   } catch (error) {
        //     console.error("Error saving file:", error);
        //   }
        // } else {
        //   alert("Your browser does not support the Save File Picker API.");
        // }
    };
    
    return (
        <div className="DownloadCSV">
            <button 
                className="button green-button"
                style={{margin: "25px"}}
                onClick={saveFile}
            >Export Table</button>
        </div>
    );
};