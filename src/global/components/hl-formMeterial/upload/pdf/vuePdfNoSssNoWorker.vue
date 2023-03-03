<script>
import componentFactory from "./componentFactory";

const PDFJS = require("pdfjs-dist/build/pdf.js");

const pdfjsWorker = require("pdfjs-dist/build/pdf.worker.entry");
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const pdfjsWrapper = require("./pdfjsWrapper.js").default;

const component = componentFactory(pdfjsWrapper(PDFJS));

export default component;
</script>
