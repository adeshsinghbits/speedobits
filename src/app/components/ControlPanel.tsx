'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FaJava, FaShare, FaSpinner } from 'react-icons/fa';
import { VscRunAll } from "react-icons/vsc";
import {
  SiJavascript,
  SiPython,
  SiCplusplus,
  SiTypescript,
  SiGo,
  SiRust,
  SiPhp,
  SiRuby
} from 'react-icons/si';

interface LanguageOption {
  id: string;
  name: string;
}

interface ControlPanelProps {
  language: string;
  onLanguageChange: (lang: string) => void;
  onRun: () => void;
  isRunning: boolean;
  onReset: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  languageOptions: LanguageOption[];
  onShare: () => void;
}

// Icons map
const ICONS: Record<string, JSX.Element> = {
  javascript: <SiJavascript />,
  python: <SiPython />,
  java: <FaJava />,
  cpp: <SiCplusplus />,
  typescript: <SiTypescript />,
  go: <SiGo />,
  rust: <SiRust />,
  php: <SiPhp />,
  ruby: <SiRuby />,
};

export default function ControlPanel({
  language,
  onLanguageChange,
  onRun,
  isRunning,
  onReset,
  fontSize,
  onFontSizeChange,
  languageOptions,
  onShare
}: ControlPanelProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Custom Language Dropdown */}
        <div>
          <Menu as="div" className="relative mt-4 inline-block text-left">
            <Menu.Button className="inline-flex items-center gap-2 justify-between w-48 rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none">
              {ICONS[language] && <span className="text-xl">{ICONS[language]}</span>}
              {languageOptions.find((l) => l.id === language)?.name}
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute mt-4 w-48 origin-top-left rounded-md bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                {languageOptions.map(({ id, name }) => (
                  <Menu.Item key={id}>
                    {({ active }) => (
                      <button
                        onClick={() => onLanguageChange(id)}
                        className={`${
                          active ? 'bg-gray-700' : ''
                        } group flex w-full items-center gap-2 px-4 py-2 text-sm text-white`}
                      >
                        {ICONS[id] && <span className="text-lg">{ICONS[id]}</span>}
                        {name}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        {/* Run / Reset Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={onRun}
            disabled={isRunning}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
              isRunning
                ? 'bg-transparent cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-500 hover:scale-[1.03]'
            }`}
          >
            {isRunning ? (
              <>
                <FaSpinner className="animate-spin" />
                Running
              </>
            ):(
              <>
                <VscRunAll />
                Run
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="px-4 py-2 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 hover:scale-[1.03] flex items-center gap-2 transition-all"
          >
            Reset
          </button>
          <button
            className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-[1.03] flex items-center gap-2 transition-all"
            onClick={onShare}
          > 
            <FaShare />
            Share
          </button>
        </div>

        {/* Font Size */}
        <div className="ml-auto flex items-center gap-4">
          <label className="text-sm text-gray-300 whitespace-nowrap">Font Size</label>
          <div className="flex items-center gap-2 w-40">
            <input
              type="range"
              min={12}
              max={24}
              value={fontSize}
              onChange={(e) => onFontSizeChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="text-white text-sm w-6 text-center">{fontSize}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
