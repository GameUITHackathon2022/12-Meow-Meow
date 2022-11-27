import { BsFillBookmarkCheckFill } from "react-icons/bs";

export const NavMenu = [
    {
        id: "explore",
        label: "main.menu.nav.explore.label",
        type: "link",
        src: "/air/analyse"
    },
    {
        id: "dicussion",
        label: "main.menu.nav.dicussion.label",
        type: "link",
        src: "/discussion"
    }
]

export const SubMenu = [
    {
        id: "function3",
        label: "main.menu.nav.function2.label",
        type: "link",
        src: "#function3",
        icon: <BsFillBookmarkCheckFill/>
    },
]

export const SideBarMenu = [
    {
        id: "function1",
        label: "main.menu.nav.function1.label",
        type: "link",
        src: "#function1",
        icon: <BsFillBookmarkCheckFill/>
    },
    {
        id: "function2",
        label: "main.menu.nav.function2.label",
        type: "collapse",
        icon: <BsFillBookmarkCheckFill/>,
        src: SubMenu
    },
]

export default NavMenu