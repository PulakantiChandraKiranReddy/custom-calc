import React, { useEffect, useState, useCallback } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronUpIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import SolutionRow from "./solutionRow";
import ListBox from "../UI/listbox";
import useTotalSumStore from "@/store/sumStore";

interface SolutionRowData {
  id: number;
}

const Solution: React.FC = () => {
  const { setSolution } = useTotalSumStore((state) => state);
  const [solutionRows, setSolutionRows] = useState<SolutionRowData[]>([]);
  const [totalArray, setTotalArray] = useState<number[]>([]);
  const [discount, setDiscount] = useState<number>(1);

  const addSolutionRow = useCallback(() => {
    const newRowId = solutionRows.length + 1;
    setSolutionRows((prevRows) => [...prevRows, { id: newRowId }]);
    setTotalArray((prev) => [...prev, 0]);
  }, [solutionRows]);

  const deleteSolutionRow = useCallback((id: number) => {
    setSolutionRows((prevRows) => prevRows.filter((row) => row.id !== id));
    setTotalArray((prev) => prev.filter((_, index) => index !== id - 1));
  }, []);

  const updateTotal = useCallback((total: number, id: number) => {
    setTotalArray((prev) =>
      prev.map((item, index) => (index === id - 1 ? total : item))
    );
  }, []);

  const calculateTotalSum = useCallback(() => {
    const totalWithoutDiscount = totalArray.reduce(
      (acc, total) => acc + total,
      0
    );
    return totalWithoutDiscount > 0
      ? Math.round(totalWithoutDiscount * ((100 - discount) / 100))
      : 0;
  }, [totalArray, discount]);

  const calculateServicesObject = useCallback(() => {
    const withoutGst = totalArray.reduce((acc, total) => acc + total, 0);
    const discountTotal = Number((withoutGst * (discount / 100)).toFixed(2));
    const withGst = Number((withoutGst + withoutGst * (18 / 100)).toFixed(2));
    const handlingFee = Number((withoutGst * (8 / 100)).toFixed(2));
    return {
      withoutGst,
      discountTotal,
      withGst,
      handlingFee,
    };
  }, [discount, totalArray]);

  useEffect(() => {
    setSolution(calculateServicesObject());
  }, [totalArray, discount, calculateServicesObject, setSolution]);

  return (
    <div className="w-full h-full px-4 py-16">
      <div className="mx-auto w-full max-w-[80%] rounded-2xl bg-white p-2 space-y-4">
        <Disclosure>
          {({ open }) => (
            <>
              <DisclosureButton className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                <span>Services</span>
                <ChevronUpIcon
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-purple-500`}
                />
              </DisclosureButton>
              <DisclosurePanel className="px-4 pb-2 py-4 text-sm text-gray-500">
                <div className="flex flex-col space-y-4 md:flex-row md:flex-wrap">
                  {solutionRows.map((row) => (
                    <SolutionRow
                      key={row.id}
                      deleteRow={deleteSolutionRow}
                      updateTotal={updateTotal}
                      id={row.id}
                    />
                  ))}
                  <div className="w-full flex justify-center">
                    <PlusCircleIcon
                      className="h-8 w-8 cursor-pointer my-4"
                      onClick={addSolutionRow}
                    />
                  </div>
                  <div>
                    <p>Discount</p>
                    <ListBox
                      data={[
                        { name: "1%", value: 1 },
                        { name: "2%", value: 2 },
                        { name: "3%", value: 3 },
                        { name: "4%", value: 4 },
                        { name: "5%", value: 5 },
                      ]}
                      cb={(val) => {
                        if (val) setDiscount(val.value);
                      }}
                      selectedVal={`${discount}%`}
                    />
                  </div>
                  <div className="border-t-2 border-black w-full">
                    Grand Total: {calculateTotalSum()}
                  </div>
                </div>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
};

export default Solution;
