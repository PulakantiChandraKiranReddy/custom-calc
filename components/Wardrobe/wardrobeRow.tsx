import React, { useEffect, useRef, useState } from "react";
import { TrashIcon } from "@heroicons/react/16/solid";
import ListBox from "../UI/listbox";

type Props = {
  id: number;
  data: {
    value: number;
    name: string;
  }[];
  updateTotal: (total: number) => void;
  deleteRow: () => void;
};

export const WardrobeRow: React.FC<Props> = ({
  data,
  updateTotal,
  deleteRow,
}) => {
  const [cost, setCost] = useState<number>(data[0].value);
  const [length, setLength] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  const totalSqft = Math.round(length * height);
  const grandTotal = Math.round(totalSqft * cost);

  // 🔒 Prevent infinite update loop
  const lastSentTotal = useRef<number | null>(null);

  useEffect(() => {
    if (lastSentTotal.current !== grandTotal) {
      lastSentTotal.current = grandTotal;
      updateTotal(grandTotal);
    }
  }, [grandTotal, updateTotal]);

  return (
    <div className="relative flex flex-col w-full border-b-2 border-gray-300">
      <div className="flex justify-between w-full gap-x-4">
        <ListBox
          data={data}
          label="Finish"
          cb={(val) => val && setCost(val.value)}
        />

        <div>
          <p>Length</p>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(Number(e.target.value) || 0)}
            className="p-2 border rounded-lg w-32"
          />
        </div>

        <div>
          <p>Height</p>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value) || 0)}
            className="p-2 border rounded-lg w-32"
          />
        </div>
      </div>

      <div className="flex gap-x-6 mt-4 font-bold mb-4">
        <div>
          <p>Total Sqrft</p>
          <p>{totalSqft}</p>
        </div>
        <div>
          <p>Grand Total</p>
          <p>{grandTotal}</p>
        </div>
      </div>

      <TrashIcon
        className="absolute bottom-2 right-2 h-5 w-5 text-red-600 cursor-pointer"
        onClick={deleteRow}
      />
    </div>
  );
};

export default WardrobeRow;
