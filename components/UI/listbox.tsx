import { useEffect, useState } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

type Props<T> = {
  data: T[] | undefined;
  cb?: (data: T | null) => void;
  label?: string;
  useDefault?: boolean;
  selectedVal?: string;
};

export default function ListBox<
  T extends { name: string | number | undefined }
>({ data, cb, label, selectedVal }: Props<T>) {
  const [selected, setSelected] = useState<T | undefined>(data?.[0]);

  const handleSelection = (val: T) => {
    setSelected(val);
    cb?.(val);
  };

  useEffect(() => {
    if (data && data.length > 0) {
      setSelected(data[0]);
    }
  }, [data]);

  useEffect(() => {
    if (selectedVal && data) {
      const foundObject = data.find((item) => item.name === selectedVal);
      if (foundObject) {
        setSelected(foundObject);
      }
    }
  }, [selectedVal, data]);

  useEffect(() => {
    if (selected) handleSelection(selected);
  }, [selected]);

  return (
    <div className="relative max-w-36">
      {label && <p>{label}</p>}
      <Listbox value={selected} onChange={(val) => handleSelection(val)}>
        <div className="relative">
          <ListboxButton className="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-lg shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 sm:text-sm">
            <span className="block truncate">
              {selected && selected.name && data && data.length
                ? selected.name
                : "No Data available"}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronUpDownIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>
          {data && (
            <Transition
              as={"div"}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <ListboxOptions className="w-80 absolute z-10 mt-1  overflow-auto hideScroll bg-white border border-gray-300 rounded-md shadow-lg max-h-32 ring-1 ring-black ring-opacity-5 focus:outline-none text-xs">
                {data.map((person, personIdx) => (
                  <ListboxOption
                    key={personIdx}
                    className={({ focus }) =>
                      `${
                        focus ? "text-amber-900 bg-amber-100" : "text-gray-900"
                      }
                      cursor-default select-none relative py-2 pl-3 pr-9`
                    }
                    value={person}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`${
                            selected ? "font-medium" : "font-normal"
                          } block truncate`}
                        >
                          {person.name}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                            <CheckIcon className="w-5 h-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Transition>
          )}
        </div>
      </Listbox>
    </div>
  );
}
