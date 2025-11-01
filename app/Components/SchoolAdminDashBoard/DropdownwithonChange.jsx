import { useState, useMemo } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { HiOutlineChevronDown } from "react-icons/hi";

/**
 * Props:
 * - label: placeholder text when empty
 * - items: [{ label, onClick? }]
 * - value: controlled selected label (optional)
 * - onChange: (item) => void (optional)
 */
const Dropdown2 = ({ label = "Options", items = [], value, onChange }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (item) => {
    setSelected(item.label);
    if (typeof onChange === "function") onChange(item);
    if (item.onClick) item.onClick();
  };

  // show parent value if provided; else internal; else placeholder
  const displayedLabel = useMemo(
    () => value ?? selected ?? label,
    [value, selected, label]
  );

  const isFilled = useMemo(() => Boolean(value ?? selected), [value, selected]);

  return (
    <Menu as="div" className="relative inline-block text-left w-full">
      <div>
        <MenuButton
          className={`p-1.5 inline-flex w-full justify-between rounded-sm bg-white sm:text-xs lg:text-sm
            ${
              isFilled
                ? "border-[#0071E3] border-2 font-bold text-black"
                : "border-[#B6B6B6] border-[1.5px] text-[#808080]"
            }`}
        >
          {displayedLabel}
          <HiOutlineChevronDown
            aria-hidden="true"
            className="-mr-1 size-4 text-[#808080]"
          />
        </MenuButton>
      </div>

      <MenuItems className="absolute right-0 z-[100] mt-2 w-full overflow-y-auto max-h-64 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
        <div className="py-1">
          {items.map((item, index) => (
            <MenuItem key={index}>
              {({ active }) => (
                <button
                  onClick={() => handleSelect(item)}
                  className={`block w-full text-left px-4 py-2 lg:text-sm sm:text-xs cursor-pointer ${
                    active ? "bg-blue-100 text-[#0071E3]" : "text-[#333]"
                  }`}
                >
                  {item.label}
                </button>
              )}
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
};

export default Dropdown2;
