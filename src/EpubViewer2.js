import React, { useState, useRef, useEffect } from "react";
import ePub from "epubjs";
import NavList from "./NavList";
const styles = {
  container: {
    maxHeight: "80vh",
    overflowY: "auto",
    border: "1px solid #ccc",
    padding: "10px",
    width: "250px",
  },
  item: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
  },
};
const EpubViewer = () => {
  const [book, setBook] = useState(null);
  const [rendition, setRendition] = useState(null);
  const [loading, setLoading] = useState(true);
  //   const [totalPage, setTotalPage] = useState(0);
  //   const [currentPage, setCurrentPage] = useState(0);
  const [tocList, setTocList] = useState([]);
  const [activeToc, setActiveToc] = useState();
  const [sections, setSections] = useState([]);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (book) {
      // When the book is loaded, render it
      const rendition = book.renderTo(viewerRef.current, {
        width: "80vw",
        height: "80vh",
        flow: "paginated",
      });
      //used to load chapters labels and href
      book.loaded.navigation.then((toc) => {
        setTocList(toc.toc);
      });
      book.loaded.spine.then((spine) => {
        const promises = spine.spineItems.map((s) =>
          s.load(book?.load.bind(book))
        );
        Promise.all(promises).then(() => {
          spine.spineItems.forEach((s) => {
            s.length = s.document.body.textContent?.length ?? 0;
            s.images = [...s.document.querySelectorAll("img")].map(
              (el) => el.src
            );
          });
          setSections(spine.spineItems);
        });
      });
      rendition.on("relocated", (dis) => {
        console.log("check", dis);
        //set first matched toc from toclist
        if (dis.start.href) setActiveToc(dis.start.href);
        else setActiveToc();
      });
      rendition.display();
      setRendition(rendition);

      // Add key listener for navigation
      const keyListener = (e) => {
        if (e.keyCode === 37) {
          rendition.prev(); // Left key
        } else if (e.keyCode === 39) {
          rendition.next(); // Right key
        }
      };

      document.addEventListener("keyup", keyListener);

      return () => {
        document.removeEventListener("keyup", keyListener);
        book.destroy();
      };
    }
  }, [book]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = () => {
        const bookData = reader.result;
        const newBook = ePub();
        newBook.open(bookData, "binary").then(() => {
          console.log("check range", newBook.locations.length());
        });
        setBook(newBook);
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Navigation functions
  const goToNextPage = () => {
    if (rendition) {
      setLoading(true);

      rendition.next().then(() => {
        setLoading(false);
      });
    }
  };

  const goToPrevPage = () => {
    if (rendition) {
      setLoading(true);

      rendition.prev().then(() => {
        setLoading(false);
      });
    }
  };
  const getHrefForToc = (item) => {
    //generate display targer
    const [target, id] = item.href.split("#");
    const section = sections.find(
      (section) =>
        target.endsWith(section.href) || section.href.endsWith(target)
    );
    if (id) {
      const el = section.document.querySelector(`#${id}`);
      return section.cfiFromElement(el);
    }
    return section?.href || "";
  };
  const onNavItemClick = (item) => {
    console.log("cehcek clicked", item);
    if (item.id && item.href) {
      rendition.display(getHrefForToc(item));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "80vh" }}>
      <div style={{ display: "flex" }}>
        <input type="file" id="input" onChange={handleFileChange} />
        {loading && book && <div>Loading....</div>}
      </div>
      {book && (
        <div style={{ border: "solid black 1px", margin: "4px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              height: "80vh",
              gap: "10px",
            }}
          >
            <div>
              <div>Table of Contents</div>
              <div style={styles.container}>
                {tocList.map((item) => (
                  <NavList
                    onNavItemClick={onNavItemClick}
                    activeToc={activeToc}
                    item={item}
                  />
                ))}
              </div>
            </div>
            <div
              ref={viewerRef}
              style={{
                flex: 1,
                width: "80vw",
                height: "80vh",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "10px",
            }}
          >
            <button onClick={goToPrevPage} style={{ marginRight: "20px" }}>
              Previous Page
            </button>
            <button onClick={goToNextPage}>Next Page</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EpubViewer;
