import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import React, { useEffect, useState } from "react";
import KitchenRow from "./kitchenRow";
import { RowAccessories } from "../Wardrobe/wardrobeRow";
import dummyData from "@/data/dummy";
import useTotalSumStore from "@/store/sumStore";

export default function Kitchen() {
  const { setKitchenAccessory, setKitchenWood } = useTotalSumStore(
    (state) => state
  );
  const [grandTotals, setGrandTotals] = useState<number[]>([0, 0, 0, 0]);
  const [kitchenAccessories, setKitchenAccessories] = useState<
    { id: number }[]
  >([]);
  const [accessoriesTotal, setAccessoriesTotal] = useState<number[]>([]);

  const updateGrandTotal = (index: number, total: number) => {
    const updatedTotals = [...grandTotals];
    updatedTotals[index] = total;
    setGrandTotals(updatedTotals);
  };
  const addWardrobeRow = () => {
    const newRowId = kitchenAccessories.length + 1;
    setKitchenAccessories((prevRows) => [...prevRows, { id: newRowId }]);
    setAccessoriesTotal((prevTotals) => [...prevTotals, 0]);
  };
  const deleteWardrobeRow = (id: number, deleteTotal: number) => {
    setKitchenAccessories((prevRows) =>
      prevRows.filter((row) => row.id !== id)
    );
    setAccessoriesTotal((prevTotals) =>
      prevTotals.filter((_, index) => index !== id - 1)
    );
  };

  const updateTotal = (grandTotal: number, id: number) => {
    setAccessoriesTotal((prevTotals) =>
      prevTotals.map((total, index) => (index === id - 1 ? grandTotal : total))
    );
  };

  const totalGrandTotal = grandTotals.reduce((acc, curr) => acc + curr, 0);
  const accessTotal = accessoriesTotal.reduce((acc, cur) => acc + cur, 0);
  useEffect(() => {
    setKitchenWood(grandTotals.reduce((acc, curr) => acc + curr, 0));
  }, [grandTotals]);
  useEffect(() => {
    setKitchenAccessory(accessoriesTotal.reduce((acc, cur) => acc + cur, 0));
  }, [accessoriesTotal]);
  return (
    <div className="w-full px-4 py-16">
      <div className="mx-auto w-full max-w-[80%] rounded-2xl bg-white p-2 space-y-6">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                <span>Kitchen Wooden</span>
                <ChevronUpIcon
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pb-2 py-4 text-sm text-gray-500">
                <div></div>

                <KitchenRow
                  productname="Base Unit"
                  updateGrandTotal={(total) => updateGrandTotal(0, total)}
                  type="base"
                  multiplier={2.75}
                />
                <KitchenRow
                  productname="Wall Unit 600"
                  updateGrandTotal={(total) => updateGrandTotal(1, total)}
                  type="wallLoft"
                  multiplier={2}
                />
                <KitchenRow
                  productname="Wall Unit 700"
                  updateGrandTotal={(total) => updateGrandTotal(2, total)}
                  type="wallLoft"
                  multiplier={2.3}
                />
                <KitchenRow
                  productname="Loft at 700"
                  updateGrandTotal={(total) => updateGrandTotal(3, total)}
                  type="wallLoft"
                  multiplier={2.3}
                />

                {/* <PlusCircleIcon
                  className="h-5 w-5 cursor-pointer"
                  onClick={addKitchenRow}
                /> */}
                <div className="border-t-2 border-black">
                  Total: {totalGrandTotal}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                <span>Kitchen Accessories</span>
                <ChevronUpIcon
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pb-2 py-4 text-sm text-gray-500 sm:overflow-x-scroll hideScroll">
                <div className="flex flex-col space-y-4 md:flex-row md:flex-wrap ">
                  {kitchenAccessories.map((row, index) => (
                    <RowAccessories
                      key={row.id}
                      data={dummyData.kitchen_accessories}
                      deleteRow={(id, deleteTotal) =>
                        deleteWardrobeRow(id, deleteTotal)
                      }
                      updateTotal={(grandTotal) =>
                        updateTotal(grandTotal, row.id)
                      }
                      id={row.id}
                      accessoryObject={dummyData.accessoryObject}
                      isKitchen={true}
                    />
                  ))}
                  <div className="w-full flex justify-center">
                    <PlusCircleIcon
                      className="h-8 w-8 cursor-pointer my-4"
                      onClick={() => addWardrobeRow()}
                    />
                  </div>
                  <div className="border-t-2 border-black w-full">
                    Total: {accessTotal}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
