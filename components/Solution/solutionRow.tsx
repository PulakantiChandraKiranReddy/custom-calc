import React, { useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/16/solid";
import ListBox from "../UI/listbox";
import dummyData, { SolutionObject } from "@/data/dummy";

interface Props {
  deleteRow: (id: number, total: number) => void;
  updateTotal: (total: number, id: number) => void; // Update the updateTotal signature to accept id
  id: number;
}

const SolutionRow: React.FC<Props> = ({ deleteRow, updateTotal, id }) => {
  const [activeRow, setActiveRow] = useState<SolutionObject | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    const total = Math.round((activeRow?.rate ?? 0) * quantity);
    updateTotal(total, id);
  }, [activeRow, quantity, id]);

  return (
    <div className="border-b-2 border-gray-200 w-full">
      <div className="flex gap-x-4 w-full">
        <ListBox
          data={dummyData.solutionObject}
          cb={setActiveRow}
          selectedVal={activeRow?.name || ""}
        />
        <div className="border-gray-400 border-x-2 border-y-0 px-4">
          <p>Specification</p>
          <p className="text-black">{activeRow?.specification}</p>
        </div>
        <div className="pl-4">
          <p>Description</p>
          <p className="text-black">{activeRow?.description}</p>
        </div>
      </div>
      <div className="flex w-full mt-4 justify-between">
        <div className="flex gap-x-6">
          {/* <div className="px-4">
            <p>Rate</p>
            <p className="text-black">{activeRow?.rate}</p>
          </div>
         */ }
          <div className="px-4">
            <p>Unit</p>
            <p className="text-black">{activeRow?.unit}</p>
          </div>
          <div>
            <p>Quantity</p>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(Number(e.target.value), 0))}
              className="px-3 my-2 border rounded-lg focus:outline-none focus:border-indigo-500 w-20"
            />
          </div>
        </div>
        <div className="font-bold">
          <p>Total</p>
          <p className="my-2">
            {Math.round((activeRow?.rate ?? 0) * quantity)}
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center mb-4">
        <TrashIcon
          className="h-5 w-5 cursor-pointer text-red-600"
          onClick={() =>
            deleteRow(id, Math.round((activeRow?.rate ?? 0) * quantity))
          }
        />
      </div>
    </div>
  );
};

export default SolutionRow;
