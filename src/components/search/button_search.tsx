import { BsSearch } from "react-icons/bs";
import "./button_search.css";

export default function Button_Search() {
  return (
    <div className="input-container">
      <BsSearch className="search-icon" />
      <input
        type="text"
        name="text"
        className="input"
        placeholder="Pesquise seu produto aqui!!"
      />
      <div className="highlight"></div>
    </div>
  );
}
