const navLinks = [
    {
        id: 1,
        name: "Projects",
        type: "finder",
    },
    {
        id: 3,
        name: "Contact",
        type: "contact",
    },
    {
        id: 4,
        name: "Resume",
        type: "resume",
    },
];

const navIcons = [
    {
        id: 1,
        img: "/icons/wifi.svg",
    },
    {
        id: 2,
        img: "/icons/search.svg",
    },
    {
        id: 3,
        img: "/icons/user.svg",
    },
    {
        id: 4,
        img: "/icons/mode.svg",
    },
];

const dockApps = [
    {
        id: "finder",
        name: "Portfolio", // was "Finder"
        icon: "finder.png",
        canOpen: true,
    },
    {
        id: "safari",
        name: "Articles", // was "Safari"
        icon: "safari.png",
        canOpen: true,
    },
    {
        id: "gallery",
        name: "Gallery", // was "Photos"
        icon: "photos.png",
        canOpen: true,
    },
    {
        id: "contact",
        name: "Contact", // or "Get in touch"
        icon: "contact.png",
        canOpen: true,
    },
    {
        id: "terminal",
        name: "Skills", // was "Terminal"
        icon: "terminal.png",
        canOpen: true,
    },
    {
        id: "trash",
        name: "Archive", // was "Trash"
        icon: "trash.png",
        canOpen: false,
    },
];

const blogPosts = [
    {
        id: 1,
        date: "Sep 11, 2025",
        title:
            "Coming soon.",
        image: "/images/comingsoon.png",
        link: "https://sanaan.dev",
    },
    {
        id: 2,
        date: "Aug 28, 2025",
        title: "Coming soon.",
        image: "/images/comingsoon.png",
        link: "https://sanaan.dev",
    },
    {
        id: 3,
        date: "Aug 15, 2025",
        title: "Coming soon.",
        image: "/images/comingsoon.png",
        link: "https://sanaan.dev",
    },
];

const techStack = [
    {
        category: "Video Editing",
        items: ["Premiere Pro", "Sony Vegas"],
    },
    {
        category: "Mobile",
        items: ["Unity"],
    },
    {
        category: "3D Animation",
        items: ["After Effects", "Blender"],
    },

    {
        category: "Web " + "Development",
        items: ["Tailwind CSS", "Node.js", "React.js"],
    },
    {
        category: "Programming Languages",
        items: ["Python", "JavaScript", "C#"],
    },
];

const socials = [
    {
        id: 1,
        text: "Github",
        icon: "/icons/github.svg",
        bg: "#f4656b",
        link: "https://github.com/Sanaan01",
    },
    {
        id: 2,
        text: "Platform",
        icon: "/icons/atom.svg",
        bg: "#4bcb63",
        link: "https://jsmastery.com/",
    },
    {
        id: 3,
        text: "Instagram",
        icon: "/icons/instagram.svg",
        bg: "#ff866b",
        link: "https://www.instagram.com/__sanaan__/",
    },
    {
        id: 4,
        text: "Youtube",
        icon: "/icons/youtube.svg",
        bg: "#05b6f6",
        link: "https://www.youtube.com/@sanaan0168",
    },
];

const galleryLinks = [
    {
        id: 1,
        icon: "/icons/gicon1.svg",
        title: "Library",
    },
    {
        id: 2,
        icon: "/icons/gicon2.svg",
        title: "Cappadocia",
    },
    {
        id: 3,
        icon: "/icons/file.svg",
        title: "Qatar",
    },
    {
        id: 4,
        icon: "/icons/gicon4.svg",
        title: "People",
    },
    {
        id: 5,
        icon: "/icons/gicon5.svg",
        title: "Favorites",
    },
];

const gallery = [
    {
        id: 1,
        name: "goreme.JPG",
        img: "/images/goreme.JPG",
        categories: ["Library", "Favorites","Cappadocia"],
    },
    {
        id: 2,
        name: "sapanca.JPG",
        img: "/images/sapanca.JPG",
        categories: ["Library", "Favorites","Cappadocia"],
    },
    {
        id: 3,
        name: "volcano.JPG",
        img: "/images/volcano.JPG",
        categories: ["Library", "Favorites","Cappadocia"],
    },
    {
        id: 4,
        name: "cave.JPG",
        img: "https://assets.sanaan.dev/cave.JPG",
        thumbnail: "/images/thumbnails/cave.webp",
        categories: ["Library","Cappadocia"],
    },
    {
        id: 5,
        name: "sanaanfull.JPG",
        img: "/images/sanaanfull.JPG",
        categories: ["Library","People"],
    },
    {
        id: 6,
        name: "balloon1.JPG",
        img: "/images/balloon1.JPG",
        categories: ["Library","Cappadocia"],
    },
    {
        id: 7,
        name: "balloon2.JPG",
        img: "/images/balloon2.JPG",
        categories: ["Library","Cappadocia"],
    },
    {
        id: 8,
        name: "balloon3.JPG",
        img: "/images/balloon3.JPG",
        categories: ["Library","Cappadocia"],
    },
];

export {
    navLinks,
    navIcons,
    dockApps,
    blogPosts,
    techStack,
    socials,
    galleryLinks,
    gallery,
};

const WORK_LOCATION = {
    id: 1,
    type: "work",
    name: "Work",
    icon: "/icons/work.svg",
    kind: "folder",
    children: [
        // ▶ Project 1
        {
            id: 5,
            name: "BrainRot ScreenTime Tracker",
            icon: "/images/folder.png",
            kind: "folder",
            position: "top-10 left-5", // icon position inside Finder
            windowPosition: "top-[5vh] left-5", // optional: Finder window position
            children: [
                {
                    id: 1,
                    name: "BrainRot Windows.txt",
                    icon: "/images/txt.png",
                    kind: "file",
                    fileType: "txt",
                    position: "top-5 left-10",
                    description: [
                        "The Brainrot UI Screentime app is a native Win UI 3 app.",
                        "Instead of a simple screentime app it uses animations to show different 'rotting' states of the brain",
                        "With a cartoony approach it shows the state of the user's brain. Encouraging them to do something healthier with their time",
                        "Work in Progress",
                    ],
                },
                {
                    id: 2,
                    name: "sanaan.dev/brainrotui",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://youtu.be/fZdTYswuZjU?si=Awjl-pIst9e09_UU",
                    position: "top-10 right-20",
                },
                {
                    id: 4,
                    name: "brainrot.png",
                    icon: "/images/image.png",
                    kind: "file",
                    fileType: "img",
                    position: "top-52 right-80",
                    imageUrl: "/images/project-1.png",
                },
                {
                    id: 5,
                    name: "Design.fig",
                    icon: "/images/plain.png",
                    kind: "file",
                    fileType: "fig",
                    href: "https://google.com",
                    position: "top-60 right-20",
                },
            ],
        },

        // ▶ Project 2
        {
            id: 6,
            name: "Video Editing",
            icon: "/images/folder.png",
            kind: "folder",
            position: "top-52 right-80",
            windowPosition: "top-[20vh] left-7",
            children: [
                {
                    id: 1,
                    name: "What I can Do.txt",
                    icon: "/images/txt.png",
                    kind: "file",
                    fileType: "txt",
                    position: "top-5 right-10",
                    description: [
                        "From advanced 3D to basic 2D editing I can do it all.",
                        "I've edited made animations for institutions and individuals.",
                        "Using different applications such as After Effects, Premiere Pro, Blender, and more.",
                    ],
                },
                {
                    id: 2,
                    name: "instagram.com/sanaan_visuals",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://www.instagram.com/sanaan_visuals",
                    position: "top-20 left-20",
                },
                {
                    id: 4,
                    name: "insta.png",
                    icon: "/images/image.png",
                    kind: "file",
                    fileType: "img",
                    position: "top-52 left-80",
                    imageUrl: "/images/project-2.png",
                },
                {
                    id: 5,
                    name: "Design.fig",
                    icon: "/images/plain.png",
                    kind: "file",
                    fileType: "fig",
                    href: "https://google.com",
                    position: "top-60 left-5",
                },
            ],
        },

        // ▶ Project 3
        {
            id: 7,
            name: "Coming soon",
            icon: "/images/folder.png",
            kind: "folder",
            position: "top-10 left-80",
            windowPosition: "top-[33vh] left-7",
            children: [],
        },
    ],
};

const ABOUT_LOCATION = {
    id: 2,
    type: "about",
    name: "About me",
    icon: "/icons/info.svg",
    kind: "folder",
    children: [
        {
            id: 1,
            name: "me.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            position: "top-10 left-5",
            imageUrl: "/images/sanaanfull.JPG",
        },
        {
            id: 2,
            name: "casual-me.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            position: "top-28 right-72",
            imageUrl: "/images/casualme.jpeg",
        },
        {
            id: 3,
            name: "about-me.txt",
            icon: "/images/txt.png",
            kind: "file",
            fileType: "txt",
            position: "top-60 left-5",
            subtitle: "Coming soon asw",
            image: "/images/sanaanfull.JPG",
            description: [
                "[Insert Type shi]",
            ],
        },
    ],
};

const RESUME_LOCATION = {
    id: 3,
    type: "resume",
    name: "Resume",
    icon: "/icons/file.svg",
    kind: "folder",
    children: [
        {
            id: 1,
            name: "Resume.pdf",
            icon: "/images/pdf.png",
            kind: "file",
            fileType: "pdf",
            // you can add `href` if you want to open a hosted resume
            // href: "/your/resume/path.pdf",
        },
    ],
};

const TRASH_LOCATION = {
    id: 4,
    type: "trash",
    name: "Trash",
    icon: "/icons/trash.svg",
    kind: "folder",
    children: [
        {
            id: 1,
            name: "trash1.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            position: "top-10 left-10",
            imageUrl: "/images/trash-1.png",
        },
        {
            id: 2,
            name: "trash2.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            position: "top-40 left-80",
            imageUrl: "/images/trash-2.png",
        },
    ],
};

export const locations = {
    work: WORK_LOCATION,
    about: ABOUT_LOCATION,
    resume: RESUME_LOCATION,
    trash: TRASH_LOCATION,
};

const INITIAL_Z_INDEX = 1000;

const WINDOW_CONFIG = {
    finder: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    contact: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    resume: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    safari: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    gallery: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    terminal: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    txtfile: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    imgfile: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    controlcenter: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
};

export { INITIAL_Z_INDEX, WINDOW_CONFIG };
