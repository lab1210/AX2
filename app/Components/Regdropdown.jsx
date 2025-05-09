import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { HiOutlineChevronDown } from "react-icons/hi";
const RegDropdown = ({ label = "Options", items = [], onSelect }) => {
  return (
    <Menu as="div" className="relative inline-block text-left w-full">
      <div>
        <MenuButton className="focus:outline-accent-foreground border-2 px-3 py-2 border-gray-300 inline-flex w-full justify-between rounded bg-white sm:text-sm text-[#808080] shadow-xs">
          {label}
          <HiOutlineChevronDown
            aria-hidden="true"
            className="-mr-1 size-4 text-[#808080]"
          />
        </MenuButton>
      </div>

      <MenuItems className="absolute right-0 z-[100] mt-2 w-full overflow-y-auto max-h-30 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
        <div className="py-1">
          {items.map((item, index) => (
            <MenuItem key={index}>
              {({ active }) => (
                <button
                  onClick={() => {
                    if (onSelect) onSelect(item.value);
                    if (item.onClick) item.onClick(); // optional individual item action
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm cursor-pointer ${
                    active ? "bg-blue-50 text-[#808080]" : "text-[#808080]"
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

export default RegDropdown;
