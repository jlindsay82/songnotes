//components
import SongSpace from "../components/SongSpace";
import Explorer from "../components/Explorer";

const Home = () => {
  //if there are songs, map them out as individual song paragraphs
  return (
    <div className="home">
      <SongSpace />
      <Explorer />
    </div>
  );
};

export default Home;
