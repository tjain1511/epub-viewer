import React, { useEffect, useRef, useState } from "react";
import ePub from "epubjs";
const styles = {
  container: {
    maxHeight: "300px",
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
  const viewerRef = useRef(null);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [totalPage, setTotalPage] = useState(0);
  // const [currentPage, setCurrentPage] = useState(0);
  const [tocList, setTocList] = useState([]);
  const [activeToc, setActiveToc] = useState();
  useEffect(() => {
    // URL of the EPUB file
    const epubUrl =
      // "https://cloud.toddleapp.com/eu-west-1/s/5wDWrg/content/l2gJxktIb/mahabharata.epub";
      // "https://cloud.toddleapp.com/eu-west-1/s/5wDWrg/content/bjDa-d8flr/figure-gallery-bindings.epub";
      "https://cloud.toddleapp.com/eu-west-1/s/5wDWrg/content/oBj8FKeQeW/accessible_epub_3.epub";
    // "https://cloud.toddleapp.com/eu-west-1/s/5wDWrg/content/iwjzpm7zG/package.opf";
    //   "https://s3.amazonaws.com/epubjs/books/alice/OPS/package.opf";

    // Initialize the ePub instance
    const bookInstance = ePub(epubUrl);
    bookInstance.coverUrl().then((val) => {
      console.log("cover url", val);
    });

    // When the book is loaded, render it
    bookInstance.ready.then(() => {
      const rendition = bookInstance.renderTo(viewerRef.current, {
        flow: "paginated",
        width: "100%",
        height: "100%",
      });
      bookInstance.loaded.pageList.then((val) => {
        console.log("check page list", val);
      });
      //used to load chapters labels and href
      bookInstance.loaded.navigation.then((toc) => {
        console.log("check this toc", toc.toc);
        setTocList(toc.toc);
      });
      bookInstance.loaded.spine.then((spine) => {
        console.log('damn check these', spine.spineItems)
      });
      rendition.on("displayed", (dis) => {
        console.log("check displayed", dis);
      });
      rendition.on("rendered", (dis) => {
        console.log("check rendered", dis);
      });
      rendition.on("relocated", (dis) => {
        console.log("check relocated", dis, rendition.currentLocation());
      });

      // rendition.on("relocated", (location) => {
      //   console.log(location);
      //   const start = location.start;
      //   const end = location.end;
      //   if (start.displayed.page === end.displayed.page) {
      //     console.log("single page book");
      //     //have more number of total page numbers
      //     setTotalPage(start.displayed.total);
      //     setCurrentPage(start.displayed.page);
      //   } else {
      //     //dual page book
      //     const total = Math.ceil(start.displayed.total / 2);
      //     const current = Math.floor(end.displayed.page / 2);
      //     setTotalPage(total);
      //     setCurrentPage(current);
      //   }
      //   //use this to sent pages
      // });
      setBook(rendition);
      console.log("its ready");
      setLoading(false);
      rendition.display();
    });

    // Cleanup function
    return () => {
      bookInstance.destroy();
    };
  }, []);

  // Function to turn to the next page
  const nextPage = () => {
    if (book) {
      setLoading(true);

      book.next().then(() => {
        setLoading(false);
      });
    }
  };

  // Function to turn to the previous page
  const prevPage = () => {
    if (book) {
      setLoading(true);

      book.prev().then(() => {
        setLoading(false);
      });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "80vh" }}>
      {loading ? <div>Loading....</div> : <div>Loaded</div>}
      <div style={styles.container}>
        {tocList.map((item) => (
          <div
            key={item.id}
            style={styles.item}
            onClick={() => {
              const getRelativePath = (input) =>
                input.replace(/^(\.\.\/)+/, "");
              setActiveToc(item.id);
              book.display(getRelativePath(item.href));
            }}
          >
            {activeToc === item.id ? `${item.label}(selected)` : item.label}
          </div>
        ))}
      </div>
      <div
        ref={viewerRef}
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          backgroundColor: "#f0f0f0",
        }}
      />
      <div
        style={{ display: "flex", justifyContent: "center", padding: "10px" }}
      >
        <button onClick={prevPage} style={{ marginRight: "20px" }}>
          Previous Page
        </button>
        {/* <div style={{ marginRight: "20px" }}>
          {" "}
          {`${currentPage} of ${totalPage}`}
        </div> */}
        <button onClick={nextPage}>Next Page</button>
      </div>
    </div>
  );
};

export default EpubViewer;
