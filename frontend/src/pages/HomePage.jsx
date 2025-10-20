import NavBar from "../components/NavBar";
import Categories from "../components/Categories";
import Search from "../components/Search";
import Stores from "../components/Stores";


export default function Home() {
  return (
    <>
      <NavBar />
      <Categories />
      <Search /> 
      <Stores />
    </>
  );
}
