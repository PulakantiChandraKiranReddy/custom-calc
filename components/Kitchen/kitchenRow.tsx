import React, { useEffect, useState } from "react";
import ListBox from "../UI/listbox";
import dummyData from "@/data/dummy";
import { TrashIcon } from "@heroicons/react/16/solid";

type Props = {
  productname: string;
  updateGrandTotal: (total: number) => void;
  type: "base" | "wallLoft";
  multiplier: number;
};

const KitchenRow = (props: Props) => {
  const { updateGrandTotal, type, multiplier } = props;
  const hinge = 470;
  const [cost, setCost] = useState(dummyData.kitchen[0][type]);
  const [wall, setWall] = useState({
    "wall 1": 0,
    "wall 2": 0,
    "wall 3": 0,
    "wall 4": 0,
    "wall 5": 0,
  });

  const handleWallChange = (wallName: string, value: number) => {
    setWall((prevState) => ({
      ...prevState,
      [wallName]: isNaN(value) || value < 0 ? 0 : value,
    }));
  };
  const totalWalls = Object.values(wall).reduce((acc, curr) => acc + curr, 0);
  const totalGrandTotal = Math.round(
    totalWalls * multiplier * cost + (totalWalls * multiplier * hinge) / 1.5
  );
  useEffect(() => {
    updateGrandTotal(totalGrandTotal);
  }, [totalGrandTotal]);

  return (
    <div className="flex items-center justify-center gap-x-4 w-full py-2">
      <ListBox
        data={dummyData.kitchen}
        cb={(val) => {
          if (val) setCost(val?.[type]);
        }}
      />
      <p className="w-32 justify-center flex">{props.productname}</p>
      <div className="flex gap-x-2 px-4 border-gray-400 border-x-2 border-y-0">
        {Object.entries(wall).map(([wallName, wallValue], idx) => (
          <div key={idx}>
            <p>{wallName}</p>
            <input
              key={idx}
              type="number"
              value={wallValue}
              onChange={(e) =>
                handleWallChange(wallName, parseInt(e.target.value))
              }
              className="px-3 my-2 border rounded-lg focus:outline-none focus:border-indigo-500 w-20"
            />
          </div>
        ))}
      </div>
      <div>
        <p>Total Sqrft</p>
        <p className="my-2">{Math.round(totalWalls * multiplier)}</p>
      </div>
      <div>
        <p>Grand Total</p>
        <p className="my-2">{totalGrandTotal}</p>
      </div>
      {/* <TrashIcon className="h-5 w-5 cursor-pointer" onClick={props.delete} /> */}
    </div>
  );
};

export default KitchenRow;
