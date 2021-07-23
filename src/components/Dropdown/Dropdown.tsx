
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/outline';

interface IDropdown {
  options: { title: string }[];
  defaultTitle: string;
  handleSelectedOption: (value: string) => void;
}

export const DropDown = ({
  options,
  defaultTitle,
  handleSelectedOption,
}: IDropdown) => {
  const [selectedOption, setSelectedOption] = useState<string>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggle = () => setIsOpen(!isOpen);
  const onSelectOption = (option: { title: string }) => () => {
    setSelectedOption(option.title);
    handleSelectedOption(option.title);
    toggle();
  };

  return (
    <div>
      <div>
        <div className="flex justify-between p-2 border-solid border-2 cursor-pointer">
          <h1 className="">{selectedOption ?? defaultTitle}</h1>
          <ChevronDownIcon className="w-5 mr-2" onClick={toggle} />
        </div>
        <div className="relative">

        {isOpen && (
          <ul className="border-solid border-2 mt-2 absolute z-20 w-full bg-gray-300 max-h-96 overflow-y-scroll">
            {options.map((option: { title: string }) => (
              <li
                className="p-2 mt-2  border-b-2 hover:bg-bc-teal-light-700"
                key={option.title}
              >
                <button
                  type="button"
                  className="w-full"
                  onClick={onSelectOption(option)}
                >
                  {option.title}
                </button>
              </li>
            ))}
          </ul>
        )}
        </div>
      </div>
    </div>
  );
};