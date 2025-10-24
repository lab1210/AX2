import { Popover } from "@headlessui/react";
import { HiOutlineChevronDown } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";

const MultiDropdownbyid = ({
  label = "Options",
  items = [], // Array<{ label: string, value?: string | number }>
  selectedValues, // Preferred: string[] of values (ids)
  selectedItems, // Back-compat: string[] of labels (deprecated)
  onChange, // Preferred: (values: string[]) => void
  onSelect, // Back-compat: (labels: string[]) => void
}) => {
  // Normalize items: ensure a stable value (falls back to label)
  const normalized = items.map((it) => ({
    label: it.label,
    value: (it.value ?? it.label).toString(),
  }));

  // Determine controlled selection source (values first, fallback to items/labels)
  const usingValues = Array.isArray(selectedValues);
  const current = usingValues
    ? selectedValues.map(String)
    : Array.isArray(selectedItems)
    ? // map labels -> values (by label) for internal consistency
      selectedItems
        .map((lbl) => normalized.find((x) => x.label === lbl)?.value)
        .filter(Boolean)
    : [];

  const setSelection = (valuesArray) => {
    if (usingValues && typeof onChange === "function") {
      onChange(valuesArray);
    } else if (typeof onSelect === "function") {
      // Convert values back to labels for back-compat
      const labels = valuesArray
        .map((v) => normalized.find((x) => x.value === v)?.label)
        .filter(Boolean);
      onSelect(labels);
    }
  };

  const toggleValue = (value) => {
    const exists = current.includes(value);
    const next = exists
      ? current.filter((v) => v !== value)
      : [...current, value];
    setSelection(next);
  };

  const allSelected =
    normalized.length > 0 &&
    normalized.every((it) => current.includes(it.value));

  const toggleAll = () => {
    setSelection(allSelected ? [] : normalized.map((it) => it.value));
  };

  return (
    <Popover className="relative w-full">
      {() => (
        <>
          <Popover.Button className="focus:border-[#0071E3] z-[100] border-[1.5px] p-1.5 border-[#B6B6B6] inline-flex w-full justify-between rounded-sm bg-white sm:text-xs lg:text-sm text-[#808080] flex-wrap gap-2">
            <div className="flex flex-wrap gap-1">
              {current.length > 0 ? (
                current
                  .map((v) => normalized.find((x) => x.value === v))
                  .filter(Boolean)
                  .map((it) => (
                    <span
                      key={it.value}
                      className="bg-[#0055AB] text-white px-2 py-0.5 text-xs rounded-sm flex items-center gap-1"
                    >
                      {it.label}
                      <IoMdClose
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleValue(it.value);
                        }}
                      />
                    </span>
                  ))
              ) : (
                <span className="text-[#808080]">{label}</span>
              )}
            </div>
            <HiOutlineChevronDown className="size-4 text-[#808080]" />
          </Popover.Button>

          <Popover.Panel className="absolute z-[300] mt-2 w-full max-h-60 overflow-y-auto rounded-md bg-white shadow-lg ring-1 ring-black/5 p-2">
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={toggleAll}
                className="text-left px-3 py-2 text-sm rounded hover:bg-blue-50 font-bold text-blue-600"
              >
                {allSelected ? "Deselect All" : "Select All"}
              </button>

              {normalized.map((it) => {
                const isActive = current.includes(it.value);
                return (
                  <button
                    key={it.value}
                    type="button"
                    onClick={() => toggleValue(it.value)}
                    className={`text-left px-3 py-2 text-sm rounded hover:bg-blue-50 flex justify-between items-center ${
                      isActive
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-[#808080]"
                    }`}
                  >
                    <span>{it.label}</span>
                    {isActive && (
                      <span className="text-blue-600 font-bold">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};

export default MultiDropdownbyid;
