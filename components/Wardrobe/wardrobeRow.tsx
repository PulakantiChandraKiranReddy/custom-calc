import React, { useState, useEffect, use } from "react";
import { TrashIcon } from "@heroicons/react/16/solid";
import ListBox from "../UI/listbox";
import { AccessoryObject } from "@/data/dummy";

type Props = {
  data: {
    value: number;
    name: string;
  }[];
  deleteRow: (id: number, total: number) => void;
  updateTotal: (grandTotal: number) => void;
  id: number;
};

export const WardrobeRow = (props: Props) => {
  const { data, updateTotal, id, deleteRow } = props;

  const [cost, setCost] = useState(data[0].value);
  const [length, setLength] = useState(0);
  const [height, setHeight] = useState(0);
  const grandTotal = Math.round(height * length * cost);

  useEffect(() => {
    updateTotal(grandTotal);
  }, [grandTotal]);

  return (
    <div className="relative flex flex-col items-center justify-center gap-x-4 w-full min-w-full  border-b-2 border-gray-300">
      <div className=" flex justify-between  w-full ">
        <ListBox
          data={data}
          cb={(val) => {
            if (val) setCost(val?.value);
          }}
          label="Finish"
        />
        <div>
          <p>Length</p>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="p-2  border rounded-lg focus:outline-none focus:border-indigo-500 max-w-32"
          />
        </div>

        <div>
          <p>Height</p>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="p-2  border rounded-lg focus:outline-none focus:border-indigo-500 max-w-32"
          />
        </div>
      </div>
      <div className="flex w-full gap-x-4 mt-4 font-bold mb-4">
        <div className="min-w-20">
          <p>Total Sqrft</p>
          <p className="my-2">{Math.round(height * length)}</p>
        </div>
        <div className="min-w-20">
          <p>Grand Total</p>
          <p className="my-2">{grandTotal}</p>
        </div>
      </div>
      <TrashIcon
        className="absolute bottom-[3px] h-5 w-5 cursor-pointer text-red-600"
        onClick={() => deleteRow(id, grandTotal)}
      />
    </div>
  );
};

type accessories = {
  data: {
    name: string;
  }[];

  deleteRow: (id: number, total: number) => void;
  updateTotal: (grandTotal: number) => void;
  id: number;
  isKitchen?: boolean;
  accessoryObject: AccessoryObject;
};

export const RowAccessories = (props: accessories) => {
  const {
    data,
    updateTotal,
    id,
    deleteRow,
    accessoryObject,
    isKitchen = false,
  } = props;
  const initializeState = (selectedItem: string, state: "Brand" | "Size") => {
    const brandsOrSizes: Set<string> = new Set();

    // Check if the selected item exists in accessoryObject
    if (accessoryObject[selectedItem]) {
      accessoryObject[selectedItem].forEach((item) => {
        if (item[state]) {
          brandsOrSizes.add(item[state]!); // Add brand or size to the set
        }
      });
    }
    return Array.from(brandsOrSizes).map((value) => ({ name: value }));
  };

  const [item, setItem] = useState(data[0].name);
  const [Brand, setBrand] = useState<{ name: string | undefined }[]>(
    initializeState(item, "Brand")
  );

  const [Size, setSize] = useState<{ name: string | undefined }[]>(
    initializeState(item, "Size")
  );
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(
    Brand?.[0]?.name
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    Size?.[0]?.name
  );

  const [uom, setUom] = useState(0);

  const calculatePrice = (): string | undefined => {
    if (!Brand.length && !Size.length) {
      const accessories = accessoryObject[item];
      if (accessories?.length === 1) {
        return accessories[0].Price;
      }
    } else if (Brand.length && Size.length) {
      const accessory = accessoryObject[item]?.find(
        (item) => item.Brand === selectedBrand && item.Size === selectedSize
      );
      return accessory?.Price;
    } else if (Brand.length) {
      const accessory = accessoryObject[item]?.find(
        (item) => item.Brand === selectedBrand
      );
      return accessory?.Price;
    } else if (Size.length) {
      const accessory = accessoryObject[item]?.find(
        (item) => item.Size === selectedSize
      );
      return accessory?.Price;
    }
    return undefined;
  };

  // Price based on selected item, brand, and size
  const price = calculatePrice();
  const grandTotal: number = price ? Number(price) * uom : 0;

  useEffect(() => {
    updateTotal(grandTotal);
  }, [grandTotal]);

  useEffect(() => {
    setBrand(initializeState(item, "Brand"));
    setSize(initializeState(item, "Size"));
  }, [item]);

  return (
    <div className="relative flex flex-col items-center justify-center gap-x-4 w-full min-w-full  border-b-2 border-gray-300">
      <div className=" flex justify-between  w-full ">
        <ListBox
          data={data}
          cb={(val) => setItem(String(val?.name))}
          label="Accessories"
        />
        <div>
          <p>UOM</p>
          <input
            type="number"
            value={uom}
            onChange={(e) =>
              setUom(Number(e.target.value) < 0 ? 0 : Number(e.target.value))
            }
            className="p-2  border rounded-lg focus:outline-none focus:border-indigo-500 max-w-32"
          />
        </div>
        <ListBox
          data={Brand}
          label="Brand"
          useDefault={true}
          cb={(val) => setSelectedBrand(String(val?.name))}
          selectedVal={selectedBrand}
        />
        <ListBox
          data={Size}
          label="Size"
          useDefault={true}
          cb={(val) => setSelectedSize(String(val?.name))}
          selectedVal={selectedSize}
        />
      </div>
      <div className="flex w-full gap-x-4 mt-4 font-bold mb-4">
        <div>
          <p>Amount</p>
          <p className="my-2">{grandTotal}</p>
        </div>
      </div>

      <TrashIcon
        className="absolute bottom-[3px] h-5 w-5 cursor-pointer text-red-600"
        onClick={() => deleteRow(id, grandTotal)}
      />
    </div>
  );
};
