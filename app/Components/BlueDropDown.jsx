import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { HiOutlineChevronDown } from "react-icons/hi";
const BlueDropdown = ({ label = "Options", items = [] }) => {
  return (
    <Menu as="div" className="text-[#01427A] relative inline-block text-left ">
      <div>
        <MenuButton className="border-[2px] p-2 font-bold border-[#01427A] inline-flex w-full justify-between rounded-sm bg-white px-3 py-2 sm:text-sm  text-[#01427A]   ">
          {label}
          <HiOutlineChevronDown
            aria-hidden="true"
            className="-mr-1 size-4 text-[#01427A]"
          />
        </MenuButton>
      </div>

      <MenuItems className="absolute right-0 z-100 mt-2 w-full overflow-y-auto max-h-18 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
        <div className="py-1">
          {items.map((item, index) => (
            <MenuItem key={index}>
              {({ active }) =>
                item.href ? (
                  <a
                    href={item.href}
                    className={`block px-4 py-2 text-sm cursor-pointer ${
                      active
                        ? "bg-gray-100 font-bold text-[#808080]"
                        : "text-[#808080] font-bold"
                    }`}
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    onClick={item.onClick}
                    className={`block w-full text-left px-4 py-2 text-sm cursor-pointer ${
                      active ? "bg-blue-50 text-[#808080]" : "text-[#808080]"
                    }`}
                  >
                    {item.label}
                  </button>
                )
              }
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
};
export default BlueDropdown;
