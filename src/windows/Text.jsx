import {WindowControls} from "#components/index.js";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import useWindowStore from "#store/window.js";

const TextFile = () => {
  const { windows } = useWindowStore();
  const data = windows.txtfile.data;

  if (!data) return null;

  const { name, subtitle, image, description } = data;

  return (
    <>
      <div id="window-header">
        <WindowControls target="txtfile" />
          <h2>{name}</h2>
      </div>

      <div className="p-5 space-y-6 bg-white h-[calc(100%-40px)] overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {image ? (
            <div className="w-full">
            <img 
              src={image} 
              alt={name} 
              className="w-full h-auto rounded-lg mb-6"
            />
            </div>
          ) : null}

          
          {subtitle ?
            <h3 className="text-lg font-semibold">{subtitle}</h3> : null}

          <div className="space-y-4">
            {description && Array.isArray(description) && description.map((paragraph, index) => (
              <p key={index} className="text-gray-800 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const TextFileWindow = WindowWrapper(TextFile, "txtfile");

export default TextFileWindow;
