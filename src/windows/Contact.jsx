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
    <div className="p-5 space-y-5">

      <img
        src="/images/sanaan.JPG"
        alt="sanaan"
        className="w-20 rounded-full"
      />

      <h3>Let's connect</h3>
      <p>Free to chat anytime.</p>
      <p>contact@sanaan.dev</p>

      <ul>
        {socials.map(({ id, bg, link, icon, text }) => (
          <li key={id} style={{ backgroundColor: bg}}>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                title={text}
              >

                <img src={icon} alt={text} className="size-5"/>
                <p>{text}</p>
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
