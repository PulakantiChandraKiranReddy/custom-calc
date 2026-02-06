import useTotalSumStore from "@/store/sumStore";
import React from "react";
import * as XLSX from "xlsx";

const Summary = () => {
  const {
    kitchenWood,
    kitchenAccessories,
    wardrobeAccessories,
    wardrobeWood,
    solution,
  } = useTotalSumStore((state) => state);

  const grandTotal =
    kitchenAccessories +
    kitchenWood +
    wardrobeAccessories +
    wardrobeWood +
    solution.withGst +
    solution.handlingFee -
    solution.discountTotal;

  const handleDownloadExcel = () => {
    const data = [
      ["Category", "Description", "Amount"],

      ["Kitchen", "Total with GST", kitchenAccessories + kitchenWood],
      ["Wardrobe", "Total with GST", wardrobeAccessories + wardrobeWood],

      ["Services", "Total without GST", solution.withoutGst],
      ["Services", "Total with GST", solution.withGst],
      ["Services", "Discount", solution.discountTotal],
      ["Services", "Handling Fee", solution.handlingFee],

      ["", "Grand Total", grandTotal],
    ];

    const getSummaryFileName = () => {
      const now = new Date();

      const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
      const time = now
        .toTimeString()
        .slice(0, 8) // HH:MM:SS
        .replace(/:/g, ""); // HHMMSS

      return `summary-${date}-${time}.xlsx`;
    };

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Summary");

    const fileName = getSummaryFileName();

    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="w-full h-full px-4 py-16">
      <div className="mx-auto w-full max-w-[80%] rounded-2xl bg-white p-8 space-y-6">
        <div className="flex justify-end">
          <button
            onClick={handleDownloadExcel}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Download Excel
          </button>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Kitchen Summary</h2>
          <table className="w-full">
            <tbody>
              {/*  <tr>
               <td className="py-2">Wooden part with installation:</td>
                <td className="py-2 flex justify-end">{kitchenWood}</td>
             </tr>
              <tr>
                <td className="py-2">Accessories:</td>
               <td className="py-2 flex justify-end">{kitchenAccessories}</td>
             </tr> */}
              <tr>
                <td className="py-2">Total with GST:</td>
                <td className="py-2 flex justify-end">
                  {kitchenAccessories + kitchenWood}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Wardrobe Summary</h2>
          <table className="w-full">
            <tbody>
              {/*     <tr>
                <td className="py-2">Wooden part with installation:</td>
                <td className="py-2 flex justify-end">{wardrobeWood}</td>
              </tr>
              <tr>
                <td className="py-2">Accessories:</td>
                <td className="py-2 flex justify-end">{wardrobeAccessories}</td>
              </tr> */}
              <tr>
                <td className="py-2">Total with GST:</td>
                <td className="py-2 flex justify-end">
                  {wardrobeAccessories + wardrobeWood}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Services Summary</h2>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="py-2">Total without GST:</td>
                <td className="py-2 flex justify-end">{solution.withoutGst}</td>
              </tr>
              <tr>
                <td className="py-2">Total with GST:</td>
                <td className="py-2 flex justify-end">{solution.withGst}</td>
              </tr>
              <tr>
                <td className="py-2">Discount:</td>
                <td className="py-2 flex justify-end">
                  {solution.discountTotal}
                </td>
              </tr>
              <tr>
                <td className="py-2">Handling fee:</td>
                <td className="py-2 flex justify-end">
                  {solution.handlingFee}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="border-t-2 border-black flex justify-between py-4 font-bold">
          <p>Grand Total:</p>
          <p>
            {kitchenAccessories +
              kitchenWood +
              wardrobeAccessories +
              wardrobeWood +
              solution.withGst +
              solution.handlingFee -
              solution.discountTotal}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Summary;
