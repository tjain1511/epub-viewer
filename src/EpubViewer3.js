import React, { useState } from "react";
import { ReactReader } from "react-reader";

const EpubViewer3 = () => {
  const [location, setLocation] = useState(null);
  return (
    <div style={{ height: "100vh" }}>
      <ReactReader
        url="https://cloud.toddleapp.com/eu-west-1/s/5wDWrg/content/bjDa-d8flr/figure-gallery-bindings.epub"
        // location={location}
        // locationChanged={(epubcfi) => setLocation(epubcfi)}
      />
    </div>
  );
};

export default EpubViewer3;
