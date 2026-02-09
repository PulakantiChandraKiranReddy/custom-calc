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

type TotalsState = {
  wooden: Record<number, number>;
  accessories: Record<number, number>;
};

const Wardrobe: React.FC = () => {
  const { setWardrobeAccessories, setWardrobeWood } = useTotalSumStore();

  const [wardrobeRows, setWardrobeRows] = useState<WardrobeState>({
    wooden: [],
    accessories: [],
  });

  const [totals, setTotals] = useState<TotalsState>({
    wooden: {},
    accessories: {},
  });

  const addWardrobeRow = (type: keyof WardrobeState) => {
    const newId =
      wardrobeRows[type].length > 0
        ? Math.max(...wardrobeRows[type].map((r) => r.id)) + 1
        : 1;

    setWardrobeRows((prev) => ({
      ...prev,
      [type]: [...prev[type], { id: newId }],
    }));

    setTotals((prev) => ({
      ...prev,
      [type]: { ...prev[type], [newId]: 0 },
    }));
  };

  const deleteWardrobeRow = (id: number, type: keyof WardrobeState) => {
    setWardrobeRows((prev) => ({
      ...prev,
      [type]: prev[type].filter((row) => row.id !== id),
    }));

    setTotals((prev) => {
      const copy = { ...prev[type] };
      delete copy[id];
      return { ...prev, [type]: copy };
    });
  };

  const updateTotal = (
    type: keyof WardrobeState,
    id: number,
    total: number,
  ) => {
    setTotals((prev) => {
      if (prev[type][id] === total) return prev; // 🔒 NO loop
      return {
        ...prev,
        [type]: {
          ...prev[type],
          [id]: total,
        },
      };
    });
  };

  const sumTotals = (type: keyof WardrobeState) =>
    Object.values(totals[type]).reduce((a, b) => a + b, 0);

  useEffect(() => {
    setWardrobeWood(sumTotals("wooden"));
    setWardrobeAccessories(sumTotals("accessories"));
  }, [totals, setWardrobeWood, setWardrobeAccessories]);

  return (
    <div className="w-full h-full px-4 py-16">
      <div className="mx-auto w-full max-w-[80%] rounded-2xl bg-white p-2 space-y-6">
        {/* WOODEN */}
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2">
                <span>Wardrobe Wooden</span>
                <ChevronUpIcon
                  className={`${open ? "rotate-180" : ""} h-5 w-5`}
                />
              </Disclosure.Button>

              <Disclosure.Panel className="px-4 py-4">
                {wardrobeRows.wooden.map((row) => (
                  <WardrobeRow
                    key={row.id}
                    id={row.id}
                    data={dummyData.wardrobe}
                    updateTotal={(total) =>
                      updateTotal("wooden", row.id, total)
                    }
                    deleteRow={() => deleteWardrobeRow(row.id, "wooden")}
                  />
                ))}

                <PlusCircleIcon
                  className="h-8 w-8 cursor-pointer my-4 mx-auto"
                  onClick={() => addWardrobeRow("wooden")}
                />

                <div className="border-t-2 border-black">
                  Total: {sumTotals("wooden")}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {/* ACCESSORIES */}
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2">
                <span>Wardrobe Accessories</span>
                <ChevronUpIcon
                  className={`${open ? "rotate-180" : ""} h-5 w-5`}
                />
              </Disclosure.Button>

              <Disclosure.Panel className="px-4 py-4">
                {wardrobeRows.accessories.map((row) => (
                  <RowAccessories
                    key={row.id}
                    id={row.id}
                    data={dummyData.wardrobe_accessories}
                    accessoryObject={dummyData.accessoriesObjectWardrobe}
                    updateTotal={(total) =>
                      updateTotal("accessories", row.id, total)
                    }
                    deleteRow={() => deleteWardrobeRow(row.id, "accessories")}
                  />
                ))}

                <PlusCircleIcon
                  className="h-8 w-8 cursor-pointer my-4 mx-auto"
                  onClick={() => addWardrobeRow("accessories")}
                />

                <div className="border-t-2 border-black">
                  Total: {sumTotals("accessories")}
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
