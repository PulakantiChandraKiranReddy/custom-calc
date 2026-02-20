import useTotalSumStore from "@/store/sumStore";
import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Summary = () => {
  const {
    kitchenWood,
    kitchenAccessories,
    wardrobeAccessories,
    wardrobeWood,

    kitchenWoodItems,
    kitchenAccessoryItems,
    wardrobeWoodItems,
    wardrobeAccessoryItems,
    serviceItems,

    solution,
    estimateId,
    setEstimateId,
  } = useTotalSumStore((state) => state);

  React.useEffect(() => {
    if (!estimateId) {
      const now = new Date();
      const code = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
      setEstimateId(code);
    }
  }, [estimateId, setEstimateId]);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // 1. Kitchen Sheet
    const kitchenData = [
      ["Kitchen Wooden Items"],
      ["Item", "Type", "Rate", "Total Sqft", "Amount"],
      ...kitchenWoodItems.map((item) => [
        item.type,
        item.name,
        item.rate,
        item.totalSqft,
        item.total,
      ]),
      [],
      ["Kitchen Accessories"],
      ["Accessory", "Brand", "Size", "Price", "Qty/UOM", "Amount"],
      ...kitchenAccessoryItems.map((item) => [
        item.name,
        item.brand || "-",
        item.size || "-",
        item.price,
        item.uom,
        item.total,
      ]),
      [],
      ["Kitchen Subtotal", "", "", "", kitchenWood + kitchenAccessories],
    ];
    const wsKitchen = XLSX.utils.aoa_to_sheet(kitchenData);
    XLSX.utils.book_append_sheet(wb, wsKitchen, "Kitchen");

    // 2. Wardrobe Sheet
    const wardrobeData = [
      ["Wardrobe Wooden Items"],
      ["Finish", "Length", "Height", "Total Sqft", "Amount"],
      ...wardrobeWoodItems.map((item) => [
        item.finish,
        item.length,
        item.height,
        item.totalSqft,
        item.total,
      ]),
      [],
      ["Wardrobe Accessories"],
      ["Accessory", "Brand", "Size", "Price", "Qty/UOM", "Amount"],
      ...wardrobeAccessoryItems.map((item) => [
        item.name,
        item.brand || "-",
        item.size || "-",
        item.price,
        item.uom,
        item.total,
      ]),
      [],
      ["Wardrobe Subtotal", "", "", "", wardrobeWood + wardrobeAccessories],
    ];
    const wsWardrobe = XLSX.utils.aoa_to_sheet(wardrobeData);
    XLSX.utils.book_append_sheet(wb, wsWardrobe, "Wardrobe");

    // 3. Services Sheet
    const servicesData = [
      ["Services"],
      [
        "Service Name",
        "Specification",
        "Description",
        "Rate",
        "Unit",
        "Qty",
        "Amount",
      ],
      ...serviceItems.map((item) => [
        item.name,
        item.specification,
        item.description,
        item.rate,
        item.unit,
        item.quantity,
        item.total,
      ]),
      [],
      ["Total (Before GST/Discount)", "", "", "", "", "", solution.withoutGst],
      ["GST (18%)", "", "", "", "", "", solution.withGst - solution.withoutGst],
      ["Handling Fee (8%)", "", "", "", "", "", solution.handlingFee],
      [
        `Discount (${solution.discountPercentage}%)`,
        "",
        "",
        "",
        "",
        "",
        solution.discountTotal,
      ],
      [
        "Services Net Total",
        "",
        "",
        "",
        "",
        "",
        solution.withGst + solution.handlingFee - solution.discountTotal,
      ],
    ];
    const wsServices = XLSX.utils.aoa_to_sheet(servicesData);
    XLSX.utils.book_append_sheet(wb, wsServices, "Services");

    // 4. Summary Sheet
    const grandTotal =
      kitchenAccessories +
      kitchenWood +
      wardrobeAccessories +
      wardrobeWood +
      solution.withGst +
      solution.handlingFee -
      solution.discountTotal;
    const summaryData = [
      ["Estimate ID", estimateId],
      ["Project Estimate Summary"],
      [],
      ["Section", "Amount"],
      ["Kitchen Wooden", kitchenWood],
      ["Kitchen Accessories", kitchenAccessories],
      ["Kitchen Total", kitchenWood + kitchenAccessories],
      [],
      ["Wardrobe Wooden", wardrobeWood],
      ["Wardrobe Accessories", wardrobeAccessories],
      ["Wardrobe Total", wardrobeWood + wardrobeAccessories],
      [],
      [
        "Services Total (Net)",
        solution.withGst + solution.handlingFee - solution.discountTotal,
      ],
      [],
      ["GRAND TOTAL", grandTotal],
      [],
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

    // Generate Excel File
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      `Summary_${estimateId}.xlsx`,
    );
  };

  return (
    <div className="w-full h-full px-4 py-16">
      <div className="mx-auto w-full max-w-[80%] rounded-2xl bg-white p-8 space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Estimate ID: {estimateId}</h2>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Kitchen Summary</h2>
          <table className="w-full">
            <tbody>
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

        <div className="flex justify-center mt-8">
          <button
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow-lg transition duration-200"
          >
            Export to Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Summary;
