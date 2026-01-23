import WindowWrapper from "#hoc/WindowWrapper.jsx";
import {Check, Flag} from "lucide-react"
import {techStack} from "#constants/index.js";
import {WindowControls} from "#components/index.js";

const Terminal = () => {
  return (
    <>
      <div id="window-header">
        <WindowControls target = "terminal"/>
        <h2> Skill Stack</h2>
      </div>

      <div className="techstack h-[calc(100%-40px)] overflow-y-auto max-sm:p-4">
        <p className="max-sm:text-xs">
          <span className="font-bold">@sanaan % </span>
          show skills.
        </p>

        <div className="label max-sm:ms-0 max-sm:mt-4">
          <p className="w-32 max-sm:w-24 max-sm:text-xs">Category</p>
          <p className="max-sm:text-xs">Technologies</p>

        </div>

        <ul className="content max-sm:my-4 max-sm:py-4">
          {techStack.map(({ category, items }) => (
            <li key ={category} className="flex items-start max-sm:gap-2">
              <Check className="check flex-none" size={16} />
              <h3 className="max-sm:ms-0 max-sm:w-24 max-sm:text-xs">{category}</h3>
              <ul className="max-sm:flex-wrap">
                {items.map((item, i ) => (
                  <li key={i} className="max-sm:text-xs">
                    {item}
                    {i < items.length - 1 ? "," : ""}</li>

                ))}
              </ul>
            </li>

          ))}
        </ul>
        <div className="footnote max-sm:space-y-2">
          <p className="max-sm:text-xs">
            <Check size={16} /> 5 of 5 skills loaded successfully (100%)
          </p>

          <p className="text-black dark:text-white max-sm:text-xs">
            <Flag size={12} fill="currentColor" />
            Render time: 6ms
          </p>

        </div>
      </div>
    </>
  )
}
const TerminalWindow = WindowWrapper(Terminal, 'terminal')

export default TerminalWindow
