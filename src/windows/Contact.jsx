import WindowWrapper from "#hoc/WindowWrapper.jsx";
import {socials} from "#constants";
import {WindowControls} from "#components";
const Contact = () => {
  return (
  <>
    <div id="window-header">
      <WindowControls target="contact"/>
      <h2>Contact me</h2>
    </div>
    <div className="p-5 space-y-5 bg-white dark:bg-[#1e1e1e] h-[calc(100%-40px)] overflow-y-auto dark:text-white">

      <img
        src="/images/sanaan.JPG"
        alt="sanaan"
        className="w-20 rounded-full"
      />

      <h3>Let's connect</h3>
      <p>Free to chat anytime.</p>
      <p>contact@sanaan.dev</p>

      <ul className="max-sm:grid max-sm:grid-cols-2 max-sm:gap-3 max-sm:w-full">
        {socials.map(({ id, bg, link, icon, text }) => (
          <li key={id} style={{ backgroundColor: bg}} className="max-sm:w-full">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                title={text}
                className="max-sm:flex max-sm:flex-col max-sm:items-center max-sm:gap-2"
              >

                <img src={icon} alt={text} className="size-5"/>
                <p className="max-sm:text-xs">{text}</p>
              </a>
          </li>
        ))}
      </ul>
    </div>

    </>
  )
};
const ContactWindow = WindowWrapper(Contact, "contact")

export default ContactWindow
