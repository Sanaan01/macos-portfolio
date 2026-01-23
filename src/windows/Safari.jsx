import {WindowControls} from "#components";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import {PanelLeft, ChevronLeft, ChevronRight, ShieldHalf, Search, Share, Plus, Copy, MoveRight, BookOpen} from "lucide-react";
import {blogPosts} from "#constants/index.js";
const Safari = () => {
  return (
      <>
    <div id="window-header">
      <WindowControls target="safari" />

      <PanelLeft className="ml-10 icon max-sm:hidden" />

      <div className="flex items-center gap-1 ml-5 max-sm:hidden">
        <ChevronLeft className="icon"/>
        <ChevronRight className="icon"/>
      </div>

      <div className="flex-1 flex items-center gap-3 max-sm:hidden">
        <ShieldHalf className="icon max-sm:hidden"/>
        <div className="search max-sm:w-full">
          <Search className="icon"/>

          <input
            type="text"
            placeholder="Search or Enter Website name"
            className="flex-1 text-sm"
          />
        </div>
      </div>

        <div className="flex items-center gap-5 max-sm:hidden">
          <Share className="icon"/>
          <Plus className="icon"/>
          <Copy className="icon"/>
        </div>
      </div>
      <div className="blog h-[calc(100%-40px)] max-sm:h-[calc(100%-160px)] overflow-y-auto max-sm:p-4">
        <h2 className="max-sm:text-lg">To be announced</h2>

        <div className="space-y-8">
          {blogPosts.map(({ id, image, title, date, link}) => (
            <div key={id} className="blog-post max-sm:flex max-sm:flex-col max-sm:gap-2">
              <div className="col-span-2 max-sm:w-full">
                <img src={image} alt={title} className="max-sm:h-32 max-sm:w-48 max-sm:mx-auto object-cover" />
              </div>
              <div className="content">
                <p>{date}</p>
                <h3 className="max-sm:text-base">{title}</h3>
                <a href={link} target="_blank" rel="noopenernoreferrer">
                  Check out the full post <MoveRight className="icon-hover"/>
                </a>


              </div>

            </div>
          ))}
        </div>
      </div>

      <div className="hidden max-sm:flex flex-col fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-lg border-t border-gray-200 dark:border-zinc-800 p-4 pb-[calc(0.5rem+env(safe-area-inset-bottom))] z-[2100]">
        <div className="flex items-center gap-3 w-full bg-gray-200/50 dark:bg-white/10 border border-transparent dark:border-zinc-700 rounded-xl px-4 py-2 mb-4">
          <Search className="size-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search or Enter Website name"
            className="flex-1 text-sm bg-transparent outline-none dark:text-white"
          />
        </div>

        {/* iOS Safari Style Toolbar Icons */}
        <div className="flex items-center justify-between px-2 text-blue-500">
          <ChevronLeft size={24} className="cursor-pointer" />
          <ChevronRight size={24} className="cursor-pointer text-gray-400" />
          <Share size={24} className="cursor-pointer" />
          <BookOpen size={24} className="cursor-pointer" />
          <Copy size={24} className="cursor-pointer" />
        </div>
      </div>
    </>
  )
}
const SafariWindow = WindowWrapper(Safari, "safari");

export default SafariWindow
