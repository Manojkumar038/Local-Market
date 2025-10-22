import NavBar from "../../components/NavBar";
import Categories from "../../components/Categories";
import Search from "../../components/Search";
import Stores from "../../components/Stores";


export default function Home() {
  return (
    <>
      <NavBar
              menuItems={[
                { label: "Profile", href: "/profile" },
                { label: "Add Products", href: "/add-product" },
                { label: "My Orders", href: "/orders" },
                { label: "Settings", href: "/settings" },
                {
                  label: "Logout",
                  onClick: () => alert("Logging out..."),
                  className: "danger",
                },
              ]}
            />
      <Categories />
      <Search /> 
      <Stores />
    </>
  );
}
