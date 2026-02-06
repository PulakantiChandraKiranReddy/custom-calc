import React, { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import dummyData from "@/data/dummy";
import { RowAccessories, WardrobeRow } from "./wardrobeRow";
import useTotalSumStore from "@/store/sumStore";

interface WardrobeRowType {
  id: number;
}

interface WardrobeState {
  wooden: WardrobeRowType[];
  accessories: WardrobeRowType[];
}

const Wardrobe: React.FC = () => {
  const { setWardrobeAccessories, setWardrobeWood } = useTotalSumStore(
    (state) => state
  );
  const [wardrobeRows, setWardrobeRows] = useState<WardrobeState>({
    wooden: [],
    accessories: [],
  });
  const [totals, setTotals] = useState<{ [key: string]: number[] }>({
    wooden: [],
    accessories: [],
  });

  const addWardrobeRow = (type: keyof WardrobeState) => {
    const newRowId = wardrobeRows[type].length + 1;
    setWardrobeRows((prevRows) => ({
      ...prevRows,
      [type]: [...prevRows[type], { id: newRowId }],
    }));
    setTotals((prevTotals) => ({
      ...prevTotals,
      [type]: [...prevTotals[type], 0], // Add a new entry in the totals array
    }));
  };

  const deleteWardrobeRow = (
    id: number,
    type: keyof WardrobeState,
    deleteTotal: number
  ) => {
    setWardrobeRows((prevRows) => ({
      ...prevRows,
      [type]: prevRows[type].filter((row) => row.id !== id),
    }));
    setTotals((prevTotals) => ({
      ...prevTotals,
      [type]: prevTotals[type].filter((_, index) => index !== id - 1), // Remove the total at the corresponding index
    }));
  };

  const updateTotal = (
    type: keyof WardrobeState,
    grandTotal: number,
    id: number
  ) => {
    setTotals((prevTotals) => ({
      ...prevTotals,
      [type]: prevTotals[type].map((total, index) =>
        index === id - 1 ? grandTotal : total
      ),
    }));
  };

  // Calculate the sum of totals for a specific category
  const calculateTotalSum = (type: keyof WardrobeState) => {
    return wardrobeRows[type].reduce((acc, row) => {
      const rowTotal = totals[type][row.id - 1] || 0; // Get the total for this row
      return acc + rowTotal;
    }, 0);
  };

  useEffect(() => {
    // Update the total sum in the Zustand store whenever wardrobeRows or totals change
    const woodenTotal = calculateTotalSum("wooden");
    const accessoriesTotal = calculateTotalSum("accessories");
    setWardrobeWood(woodenTotal);
    setWardrobeAccessories(accessoriesTotal);
  }, [wardrobeRows, totals]);

  return (
    <div className="w-full h-full px-4 py-16">
      <div className="mx-auto w-full max-w-[80%] rounded-2xl bg-white p-2 space-y-6">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                <span>Wardrobe Wooden</span>
                <ChevronUpIcon
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pb-2 py-4 text-sm text-gray-500 ">
                <div className="flex flex-col space-y-4 md:flex-row md:flex-wrap">
                  {wardrobeRows.wooden.map((row, index) => (
                    <WardrobeRow
                      key={row.id}
                      data={dummyData.wardrobe}
                      deleteRow={(id, deleteTotal) =>
                        deleteWardrobeRow(id, "wooden", deleteTotal)
                      }
                      updateTotal={(grandTotal) =>
                        updateTotal("wooden", grandTotal, row.id)
                      }
                      id={row.id}
                    />
                  ))}
                  <div className="w-full flex justify-center">
                    <PlusCircleIcon
                      className="h-8 w-8 cursor-pointer my-4"
                      onClick={() => addWardrobeRow("wooden")}
                    />
                  </div>
                  <div className="border-t-2 border-black w-full">
                    Total: {calculateTotalSum("wooden")}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                <span>Wardrobe Accessories</span>
                <ChevronUpIcon
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pb-2 py-4 text-sm text-gray-500 sm:overflow-x-scroll hideScroll">
                <div className="flex flex-col space-y-4 md:flex-row md:flex-wrap ">
                  {wardrobeRows.accessories.map((row, index) => (
                    <RowAccessories
                      key={row.id}
                      data={dummyData.wardrobe_accessories}
                      deleteRow={(id, deleteTotal) =>
                        deleteWardrobeRow(id, "accessories", deleteTotal)
                      }
                      updateTotal={(grandTotal) =>
                        updateTotal("accessories", grandTotal, row.id)
                      }
                      id={row.id}
                      accessoryObject={dummyData.accessoriesObjectWardrobe}
                    />
                  ))}
                  <div className="w-full flex justify-center">
                    <PlusCircleIcon
                      className="h-8 w-8 cursor-pointer my-4"
                      onClick={() => addWardrobeRow("accessories")}
                    />
                  </div>
                  <div className="border-t-2 border-black w-full">
                    Total: {calculateTotalSum("accessories")}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
};

export default Wardrobe;
