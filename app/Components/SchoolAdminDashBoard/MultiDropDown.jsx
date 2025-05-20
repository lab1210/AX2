import { Popover } from "@headlessui/react";
import { HiOutlineChevronDown } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";

const MultiDropdown = ({
  label = "Options",
  items = [],
  selectedItems = [],
  onSelect,
}) => {
  const toggleItem = (item) => {
    if (selectedItems.includes(item)) {
      onSelect(selectedItems.filter((i) => i !== item));
    } else {
      onSelect([...selectedItems, item]);
    }
  };

  return (
    <Popover className="relative w-full z-[200]">
      {() => (
        <>
          <Popover.Button className="focus:border-[#0071E3] border-2 p-1.5 border-[#B6B6B6] inline-flex w-full justify-between rounded-sm bg-white sm:text-xs lg:text-sm text-[#808080] flex-wrap gap-2">
            <div className="flex flex-wrap gap-1">
              {selectedItems.length > 0 ? (
                selectedItems.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-[#0055AB] text-white px-2 py-0.5 text-xs rounded-sm flex items-center gap-1"
                  >
                    {item}
                    <IoMdClose
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleItem(item);
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

          <Popover.Panel className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto rounded-md bg-white shadow-lg ring-1 ring-black/5 p-2">
            <div className="flex flex-col gap-1">
              {items.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleItem(item.label)}
                  className={`text-left px-3 py-2 text-sm rounded hover:bg-blue-50 flex justify-between items-center ${
                    selectedItems.includes(item.label)
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-[#808080]"
                  }`}
                >
                  <span>{item.label}</span>
                  {selectedItems.includes(item.label) && (
                    <span className="text-blue-600 font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};

export default MultiDropdown;
