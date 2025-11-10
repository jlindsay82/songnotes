//components
import SongSpace from "../components/SongSpace";
import Explorer from "../components/Explorer";
import AudioSpace from "../components/AudioSpace/AudioSpace";
import { useState } from "react";
const Home = () => {
  const [showExplorer, setShowExplorer] = useState(false);
  const toggleExplorer = () => setShowExplorer(!showExplorer);

  //if there are songs, map them out as individual song paragraphs
  return (
    <div className="home">
      <SongSpace />
      <Explorer showExplorer={showExplorer} toggleExplorer={toggleExplorer} />
      <AudioSpace />
    </div>
  );
};

export default Home;
