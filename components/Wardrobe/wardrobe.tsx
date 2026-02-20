import React, { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import dummyData from "@/data/dummy";
import { RowAccessories, WardrobeRow } from "./wardrobeRow";
import useTotalSumStore, { WardrobeWoodItem, AccessoryItem } from "@/store/sumStore";

export default function Wardrobe() {
  const { setWardrobeAccessories, setWardrobeWood, setWardrobeWoodItems, setWardrobeAccessoryItems } = useTotalSumStore(
    (state) => state
  );

  // State for Wooden Items
  const [woodenItems, setWoodenItems] = useState<WardrobeWoodItem[]>([]);
  const [woodenRows, setWoodenRows] = useState<{ id: number }[]>([]);

  // State for Accessory Items
  const [accessoryItems, setAccessoryItems] = useState<AccessoryItem[]>([]);
  const [accessoryRows, setAccessoryRows] = useState<{ id: number }[]>([]);


  /* ... */

  const addWoodenRow = React.useCallback(() => {
    setWoodenRows((prevRows) => {
        const newRowId = prevRows.length > 0 ? Math.max(...prevRows.map(r => r.id)) + 1 : 1;
        return [...prevRows, { id: newRowId }];
    });
  }, []);

  const deleteWoodenRow = React.useCallback((id: number) => {
    setWoodenRows((prevRows) => prevRows.filter((row) => row.id !== id));
    setWoodenItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateWoodenItem = React.useCallback((item: WardrobeWoodItem) => {
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

  const woodenTotal = woodenItems.reduce((acc, curr) => acc + curr.total, 0);
  const accessoriesTotal = accessoryItems.reduce((acc, curr) => acc + curr.total, 0);


  useEffect(() => {
    setWardrobeWood(woodenTotal);
    setWardrobeWoodItems(woodenItems);
  }, [woodenItems, woodenTotal, setWardrobeWood, setWardrobeWoodItems]);

  useEffect(() => {
    setWardrobeAccessories(accessoriesTotal);
    setWardrobeAccessoryItems(accessoryItems);
  }, [accessoryItems, accessoriesTotal, setWardrobeAccessories, setWardrobeAccessoryItems]);

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
              <Disclosure.Panel unmount={false} className="px-4 pb-2 py-4 text-sm text-gray-500 ">
                <div className="flex flex-col space-y-4 md:flex-row md:flex-wrap">
                  {woodenRows.map((row, index) => (
                    <WardrobeRow
                      key={row.id}
                      data={dummyData.wardrobe}
                      deleteRow={(id) =>
                        deleteWoodenRow(id)
                      }
                      updateRowData={updateWoodenItem}
                      id={row.id}
                    />
                  ))}
                  <div className="w-full flex justify-center">
                    <PlusCircleIcon
                      className="h-8 w-8 cursor-pointer my-4"
                      onClick={() => addWoodenRow()}
                    />
                  </div>
                  <div className="border-t-2 border-black w-full">
                    Total: {woodenTotal}
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
              <Disclosure.Panel unmount={false} className="px-4 pb-2 py-4 text-sm text-gray-500 sm:overflow-x-scroll hideScroll">
                <div className="flex flex-col space-y-4 md:flex-row md:flex-wrap ">
                  {accessoryRows.map((row, index) => (
                    <RowAccessories
                      key={row.id}
                      data={dummyData.wardrobe_accessories}
                      deleteRow={(id) =>
                        deleteAccessoryRow(id)
                      }
                      updateRowData={updateAccessoryItem}
                      id={row.id}
                      accessoryObject={dummyData.accessoriesObjectWardrobe}
                    />
                  ))}
                  <div className="w-full flex justify-center">
                    <PlusCircleIcon
                      className="h-8 w-8 cursor-pointer my-4"
                      onClick={() => addAccessoryRow()}
                    />
                  </div>
                  <div className="border-t-2 border-black w-full">
                    Total: {accessoriesTotal}
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
