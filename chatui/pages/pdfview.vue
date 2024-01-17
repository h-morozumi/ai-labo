<template>
  <div class="Container">
    <div ref="renderPdfSpace"></div>
  </div>
</template>
<script setup lang="ts">
import * as PDFJS from 'pdfjs-dist'
import * as pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs'
import { ref, onMounted } from 'vue'

PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker
const renderPdfSpace = ref(null);

onMounted(() => {
    const loadingTask = PDFJS.getDocument('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf');
    loadingTask.promise.then((pdf) => {
        console.log('PDF loaded');
        const numPages = pdf.numPages;
        console.log("numPages", numPages);
        // Fetch the first page
        pdf.getPage(1).then((page) => {
            console.log('Page loaded');
            const scale = 1.5;
            const viewport = page.getViewport({ scale: scale, });
            // Prepare canvas using PDF page dimensions
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            // CanvasをDOMに追加
            renderPdfSpace?.value.appendChild(canvas);
            // Render PDF page into canvas context
            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };
            const renderTask = page.render(renderContext);
        });
    }, (error) => {
        console.log(error);
    });
});

</script>