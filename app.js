import searchGoogleMaps from "./scrapper.js";
import ExcelJS from "exceljs";
import { program } from 'commander';


program
  .command('search')
  .description('Fetch businesses from Google Maps')
  .option('-q, --query <query>', 'Search query')
  .action((options) => {
    const { query } = options;
    if (!query) {
      console.error('Please provide a search query using -q or --query.');
      process.exit(1);
    }
    searchGoogleMaps(query)
      .then((businesses) => {
        console.log("Businesses:", businesses);
        saveToExcel(businesses);
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  });

program.parse(process.argv);

// Function to save data to Excel
function saveToExcel(businesses) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Businesses");

    // Define columns
    worksheet.columns = [
        { header: "Place ID", key: "placeId" },
        { header: "Store Name", key: "storeName" },
        { header: "Address", key: "address" },
        { header: "Category", key: "category" },
        // { header: "Phone", key: "phone" },
        { header: "Google URL", key: "googleUrl" },
        // { header: "Business Website", key: "bizWebsite" },
        { header: "Rating Text", key: "ratingText" },
        { header: "Stars", key: "stars" },
        { header: "Number of Reviews", key: "numberOfReviews" },
    ];

    // Add data to the worksheet
    businesses.forEach((business) => {
        worksheet.addRow(business);
    });

    // Save the workbook to a file
    const fileName = "businesses.xlsx";
    workbook.xlsx.writeFile(fileName)
        .then(() => {
            console.log(`Businesses saved to ${fileName}`);
        })
        .catch((error) => {
            console.error("Error saving to Excel:", error.message);
        });
}