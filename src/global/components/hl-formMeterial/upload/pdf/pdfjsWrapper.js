import { PDFLinkService } from "pdfjs-dist/lib/web/pdf_link_service";

export default function (PDFJS) {
  function isPDFDocumentLoadingTask(obj) {
    return (
      typeof obj === "object" &&
      obj !== null &&
      obj.__PDFDocumentLoadingTask === true
    );
  }

  function createLoadingTask(src, options) {
    let source;
    if (typeof src === "string") {
      source = { url: src };
    } else if (src instanceof Uint8Array) {
      source = { data: src };
    } else if (typeof src === "object" && src !== null) {
      source = Object.assign({}, src);
    } else {
      throw new TypeError("invalid src type");
    }
    Object.assign(source, { cMapUrl: "/cmaps/", cMapPacked: true });
    const loadingTask = PDFJS.getDocument(source);
    loadingTask.__PDFDocumentLoadingTask = true; // since PDFDocumentLoadingTask is not public

    if (options && options.onPassword) {
      loadingTask.onPassword = options.onPassword;
    }

    if (options && options.onProgress) {
      loadingTask.onProgress = options.onProgress;
    }

    return loadingTask;
  }

  function PDFJSWrapper(canvasElt, annotationLayerElt, emitEvent) {
    let pdfDoc = null;
    let pdfPage = null;
    let pdfRender = null;
    let canceling = false;

    canvasElt.getContext("2d").save();

    function clearCanvas() {
      canvasElt
        .getContext("2d")
        .clearRect(0, 0, canvasElt.width, canvasElt.height);
    }

    function clearAnnotations() {
      while (annotationLayerElt.firstChild) {
        annotationLayerElt.removeChild(annotationLayerElt.firstChild);
      }
    }

    this.destroy = function () {
      if (pdfDoc === null) {
        return;
      }
      pdfDoc.destroy();
      pdfDoc = null;
    };

    this.getResolutionScale = function () {
      return canvasElt.offsetWidth / canvasElt.width;
    };

    this.printPage = function (dpi, pageNumberOnly) {
      if (pdfPage === null) {
        return;
      }

      // 1in == 72pt
      // 1in == 96px
      const PRINT_RESOLUTION = dpi === undefined ? 150 : dpi;
      const PRINT_UNITS = PRINT_RESOLUTION / 72.0;
      const CSS_UNITS = 96.0 / 72.0;

      const iframeElt = document.createElement("iframe");

      function removeIframe() {
        iframeElt.parentNode.removeChild(iframeElt);
      }

      new Promise((resolve, reject) => {
        iframeElt.frameBorder = "0";
        iframeElt.scrolling = "no";
        iframeElt.width = "0px;";
        iframeElt.height = "0px;";
        iframeElt.style.cssText = "position: absolute; top: 0; left: 0";

        iframeElt.onload = function () {
          resolve(this.contentWindow);
        };

        window.document.body.appendChild(iframeElt);
      })
        .then((win) => {
          win.document.title = "";

          return pdfDoc.getPage(1).then((page) => {
            const viewport = page.getViewport(1);
            win.document.head.appendChild(
              win.document.createElement("style")
            ).textContent =
              `${
                "@supports ((size:A4) and (size:1pt 1pt)) {" +
                "@page { margin: 1pt; size: "
              }${(viewport.width * PRINT_UNITS) / CSS_UNITS}pt ${
                (viewport.height * PRINT_UNITS) / CSS_UNITS
              }pt; }` +
              "}" +
              "@media print {" +
              "body { margin: 0 }" +
              "canvas { page-break-before: avoid; page-break-after: always; page-break-inside: avoid }" +
              "}" +
              "@media screen {" +
              "body { margin: 0 }" +
              "}" +
              "";
            return win;
          });
        })
        .then((win) => {
          const allPages = [];

          for (
            let pageNumber = 1;
            pageNumber <= pdfDoc.numPages;
            ++pageNumber
          ) {
            if (
              pageNumberOnly !== undefined &&
              pageNumberOnly.indexOf(pageNumber) === -1
            ) {
              continue;
            }

            allPages.push(
              pdfDoc.getPage(pageNumber).then((page) => {
                const viewport = page.getViewport(1);

                const printCanvasElt = win.document.body.appendChild(
                  win.document.createElement("canvas")
                );
                printCanvasElt.width = viewport.width * PRINT_UNITS;
                printCanvasElt.height = viewport.height * PRINT_UNITS;

                return page.render({
                  canvasContext: printCanvasElt.getContext("2d"),
                  transform: [
                    // Additional transform, applied just before viewport transform.
                    PRINT_UNITS,
                    0,
                    0,
                    PRINT_UNITS,
                    0,
                    0,
                  ],
                  viewport,
                  intent: "print",
                }).promise;
              })
            );
          }

          Promise.all(allPages)
            .then(() => {
              win.focus(); // Required for IE
              if (win.document.queryCommandSupported("print")) {
                win.document.execCommand("print", false, null);
              } else {
                win.print();
              }
              removeIframe();
            })
            .catch((err) => {
              removeIframe();
              emitEvent("error", err);
            });
        });
    };

    this.renderPage = function (rotate) {
      if (pdfRender !== null) {
        if (canceling) {
          return;
        }
        canceling = true;
        pdfRender.cancel();
        return;
      }

      if (pdfPage === null) {
        return;
      }

      rotate =
        (pdfPage.rotate === undefined ? 0 : pdfPage.rotate) +
        (rotate === undefined ? 0 : rotate);

      const scale =
        (canvasElt.offsetWidth / pdfPage.getViewport(1).width) *
        (window.devicePixelRatio || 1);
      const viewport = pdfPage.getViewport(scale, rotate);

      emitEvent("page-size", viewport.width, viewport.height);

      canvasElt.width = viewport.width;
      canvasElt.height = viewport.height;

      pdfRender = pdfPage.render({
        canvasContext: canvasElt.getContext("2d"),
        viewport,
      });

      annotationLayerElt.style.visibility = "hidden";
      clearAnnotations();

      const viewer = {
        scrollPageIntoView(params) {
          emitEvent("link-clicked", params.pageNumber);
        },
      };

      const linkService = new PDFLinkService();
      linkService.setDocument(pdfDoc);
      linkService.setViewer(viewer);

      pdfPage.getAnnotations({ intent: "display" }).then((annotations) => {
        PDFJS.AnnotationLayer.render({
          viewport: viewport.clone({ dontFlip: true }),
          div: annotationLayerElt,
          annotations,
          page: pdfPage,
          linkService,
          renderInteractiveForms: false,
        });
      });

      pdfRender
        .then(() => {
          annotationLayerElt.style.visibility = "";
          canceling = false;
          pdfRender = null;
        })
        .catch((err) => {
          pdfRender = null;
          if (err instanceof PDFJS.RenderingCancelledException) {
            canceling = false;
            this.renderPage(rotate);
            return;
          }
          emitEvent("error", err);
        });
    };

    this.forEachPage = function (pageCallback) {
      const { numPages } = pdfDoc;

      (function next(pageNum) {
        pdfDoc
          .getPage(pageNum)
          .then(pageCallback)
          .then(() => {
            if (++pageNum <= numPages) {
              next(pageNum);
            }
          });
      })(1);
    };

    this.loadPage = function (pageNumber, rotate) {
      pdfPage = null;

      if (pdfDoc === null) {
        return;
      }

      pdfDoc
        .getPage(pageNumber)
        .then((page) => {
          pdfPage = page;
          this.renderPage(rotate);
          emitEvent("page-loaded", page.pageNumber);
        })
        .catch((err) => {
          clearCanvas();
          clearAnnotations();
          emitEvent("error", err);
        });
    };

    this.loadDocument = function (src) {
      pdfDoc = null;
      pdfPage = null;

      emitEvent("num-pages", undefined);

      if (!src) {
        canvasElt.removeAttribute("width");
        canvasElt.removeAttribute("height");
        clearAnnotations();
        return;
      }

      if (isPDFDocumentLoadingTask(src)) {
        if (src.destroyed) {
          emitEvent("error", new Error("loadingTask has been destroyed"));
          return;
        }

        var loadingTask = src;
      } else {
        var loadingTask = createLoadingTask(src, {
          onPassword(updatePassword, reason) {
            let reasonStr;
            switch (reason) {
              case PDFJS.PasswordResponses.NEED_PASSWORD:
                reasonStr = "NEED_PASSWORD";
                break;
              case PDFJS.PasswordResponses.INCORRECT_PASSWORD:
                reasonStr = "INCORRECT_PASSWORD";
                break;
            }
            emitEvent("password", updatePassword, reasonStr);
          },
          onProgress(status) {
            const ratio = status.loaded / status.total;
            emitEvent("progress", Math.min(ratio, 1));
          },
        });
      }

      loadingTask
        .then((pdf) => {
          pdfDoc = pdf;
          emitEvent("num-pages", pdf.numPages);
          emitEvent("loaded");
        })
        .catch((err) => {
          clearCanvas();
          clearAnnotations();
          emitEvent("error", err);
        });
    };

    annotationLayerElt.style.transformOrigin = "0 0";
  }

  return {
    createLoadingTask,
    PDFJSWrapper,
  };
}
