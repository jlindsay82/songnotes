import { SongsContextProvider } from "../context/SongsContext";
import { DocumentsContextProvider } from "../context/DocumentsContext";
import { EditorContextProvider } from "../context/EditorContext";

//components
import SongSpace from "../components/SongSpace";
import Explorer from "../components/Explorer";

const Home = () => {
  //if there are songs, map them out as individual song paragraphs
  return (
    <>
      <SongsContextProvider>
        <DocumentsContextProvider>
          <EditorContextProvider>
            <div className="home">
              <SongSpace />
              <Explorer />
            </div>
          </EditorContextProvider>
        </DocumentsContextProvider>
      </SongsContextProvider>
    </>
  );
};

export default Home;
