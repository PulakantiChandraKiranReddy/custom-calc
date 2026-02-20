import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import React, { useEffect, useState } from "react";
import KitchenRow from "./kitchenRow";
import { RowAccessories } from "../Wardrobe/wardrobeRow";
import dummyData from "@/data/dummy";
import useTotalSumStore, { KitchenWoodItem, AccessoryItem } from "@/store/sumStore";

export default function Kitchen() {
  const { setKitchenAccessory, setKitchenWood, setKitchenWoodItems, setKitchenAccessoryItems } = useTotalSumStore(
    (state) => state
  );

  // State for Wooden Items (Fixed 4 rows)
  const [woodenItems, setWoodenItems] = useState<KitchenWoodItem[]>([]);
  
  // State for Accessory Items
  const [accessoryItems, setAccessoryItems] = useState<AccessoryItem[]>([]);
  
  // Manage IDs for dynamic rows
  const [accessoryRows, setAccessoryRows] = useState<{ id: number }[]>([]);

  /* ... imports ... */

  const updateWoodenItem = React.useCallback((item: KitchenWoodItem) => {
    setWoodenItems((prev) => {
        const existingIndex = prev.findIndex(i => i.id === item.id);
        if (existingIndex >= 0) {
            const newItems = [...prev];
            newItems[existingIndex] = item;
            return newItems;
        } else {
            return [...prev, item];
        }
    });
  }, []);

  const addAccessoryRow = React.useCallback(() => {
    setAccessoryRows((prevRows) => {
        const newRowId = prevRows.length > 0 ? Math.max(...prevRows.map(r => r.id)) + 1 : 1;
        return [...prevRows, { id: newRowId }];
    });
  }, []);

  const deleteAccessoryRow = React.useCallback((id: number) => {
    setAccessoryRows((prevRows) => prevRows.filter((row) => row.id !== id));
    setAccessoryItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateAccessoryItem = React.useCallback((item: AccessoryItem) => {
      setAccessoryItems((prev) => {
          const existingIndex = prev.findIndex(i => i.id === item.id);
          if (existingIndex >= 0) {
              const newItems = [...prev];
              newItems[existingIndex] = item;
              return newItems;
          } else {
              return [...prev, item];
          }
      });
  }, []);

  // Calculate totals
  const totalGrandTotal = woodenItems.reduce((acc, curr) => acc + curr.total, 0);
  const accessTotal = accessoryItems.reduce((acc, cur) => acc + cur.total, 0);

  useEffect(() => {
    setKitchenWood(totalGrandTotal);
    setKitchenWoodItems(woodenItems); // Sync detailed items
  }, [woodenItems, totalGrandTotal, setKitchenWood, setKitchenWoodItems]);

  useEffect(() => {
    setKitchenAccessory(accessTotal);
    setKitchenAccessoryItems(accessoryItems); // Sync detailed items
  }, [accessoryItems, accessTotal, setKitchenAccessory, setKitchenAccessoryItems]);

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
              <Disclosure.Panel unmount={false} className="px-4 pb-2 py-4 text-sm text-gray-500">
                <div></div>

                <KitchenRow
                  id={0}
                  productname="Base Unit"
                  updateRowData={updateWoodenItem}
                  type="base"
                  multiplier={2.75}
                />
                <KitchenRow
                  id={1}
                  productname="Wall Unit 600"
                  updateRowData={updateWoodenItem}
                  type="wallLoft"
                  multiplier={2}
                />
                <KitchenRow
                  id={2}
                  productname="Wall Unit 700"
                  updateRowData={updateWoodenItem}
                  type="wallLoft"
                  multiplier={2.3}
                />
                <KitchenRow
                  id={3}
                  productname="Loft at 700"
                  updateRowData={updateWoodenItem}
                  type="wallLoft"
                  multiplier={2.3}
                />

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
              <Disclosure.Panel unmount={false} className="px-4 pb-2 py-4 text-sm text-gray-500 sm:overflow-x-scroll hideScroll">
                <div className="flex flex-col space-y-4 md:flex-row md:flex-wrap ">
                  {accessoryRows.map((row) => (
                    <RowAccessories
                      key={row.id}
                      data={dummyData.kitchen_accessories}
                      deleteRow={(id) =>
                        deleteAccessoryRow(id)
                      }
                      updateRowData={updateAccessoryItem}
                      id={row.id}
                      accessoryObject={dummyData.accessoryObject}
                      isKitchen={true}
                    />
                  ))}
                  <div className="w-full flex justify-center">
                    <PlusCircleIcon
                      className="h-8 w-8 cursor-pointer my-4"
                      onClick={() => addAccessoryRow()}
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
