import React, { useEffect, useRef, useState } from "react";
import { GlobalWorkerOptions, getDocument, version } from "pdfjs-dist";
import file from "./sample-local-pdf.pdf";

const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.mjs`;
const PDFReader = () => {
  //TODO: handle rotation, scale, and other configurations
  const rotate = 0;
  const scale = 1.5;
  const [pdfDoc, setPdfDoc] = useState(null);

  const canvasRef = useRef();
  const highlightLayerRef = useRef();
  // Using useRef to store the render task to avoid re-rendering

  const renderTask = useRef(null);
  const lastPageRequestedRenderRef = useRef(null);

  const [pageNumber, setPageNumber] = useState(1);
  const nextPage = () => {
    if (pdfDoc && pageNumber < pdfDoc.numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const prevPage = () => {
    if (pdfDoc && pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const onSuccessLoaded = (pdfDoc) => {
    setPdfDoc(pdfDoc);
  };
  const onFailLoaded = () => {
    console.error("Failed to load document");
  };

  useEffect(() => {
    GlobalWorkerOptions.workerSrc = workerSrc;
  }, [workerSrc]);

  useEffect(() => {
    const config = {
      url: file,
      withCredentials: false,
    };

    getDocument(config).promise.then(onSuccessLoaded, onFailLoaded);
  }, []);

  useEffect(() => {
    if (!pdfDoc) return;
    const handleDrawPDFPage = (pdfPage) => {
      if (!pdfPage) {
        return;
      }

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      const viewport = pdfPage.getViewport({ scale: scale });

      const outputScale = window.devicePixelRatio || 1;

      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);

      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      const transform =
        outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        transform: transform,
      };

      if (renderTask.current) {
        lastPageRequestedRenderRef.current = pdfPage;
        renderTask.current.cancel();
        return;
      }

      renderTask.current = pdfPage.render(renderContext);

      return renderTask.current.promise
        .then(() => {
          renderTask.current = null;
        })
        .catch((err) => {
          console.error("Error rendering PDF page:", err);
          renderTask.current = null;
          if (err && err.name === "RenderingCancelledException") {
            const lastPageRequestedRender =
              lastPageRequestedRenderRef.current ?? page;
            lastPageRequestedRenderRef.current = null;
            handleDrawPDFPage(lastPageRequestedRender);
          }
        });
    };

    pdfDoc
      .getPage(pageNumber)
      .then(handleDrawPDFPage)
      .catch((err) => {
        console.error("Error getting PDF page:", err);
      });
  }, [pdfDoc, pageNumber]);

  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "inline-block", // giữ cho highlight theo canvas
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: "block", // tránh inline padding
          }}
        />
        <div
          ref={highlightLayerRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 2,
            width: "100%",
            height: "100%",
            border: "1px solid blue", // chỉ để debug
          }}
        ></div>
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={prevPage}>Previous</button>
        <span style={{ margin: "0 8px" }}>
          Page {pageNumber} / {pdfDoc?.numPages}
        </span>
        <button onClick={nextPage}>Next</button>
      </div>
    </div>
  );
};

export default PDFReader;
