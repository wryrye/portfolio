export function distance(x) {
  return window.innerHeight * (x / 100)
}

export function showResume(app) {
    showPDF(app, 'ryan_coughlin_resume.pdf');
}

export function showChinese(app) {
    showPDF(app, 'ryan_coughlin_sample_chinese.pdf');
}

function showPDF(app, name) {
    var pdfjsLib = require('pdfjs-dist');
    var pdfPath = `assets/docs/${name}`;
    // $("a").attr("href", pdfPath); //set download path
  
    var loadingTask = pdfjsLib.getDocument(pdfPath);
  
    var loadingTask = pdfjsLib.getDocument(pdfPath);
    loadingTask.promise.then(function (pdfDocument) {
      // Request a first page
      return pdfDocument.getPage(1).then(function (page) {
        // Display page on the existing canvas with 100% scale.

        document.body.style.overflowY = 'scroll';
  
        var canvas = document.getElementById('pdfjs');
        canvas.style.display = "inherit"
  
        app.view.style.display = "none";
  
        canvas.width = window.innerWidth;
        var viewport = page.getViewport(canvas.width / page.getViewport(1.0).width);
        canvas.height = viewport.height;
        
        var ctx = canvas.getContext('2d');
        var renderTask = page.render({
          canvasContext: ctx,
          viewport: viewport
        });
        return renderTask.promise;
      });
    }).catch(function (reason) {
      console.error('Error: ' + reason);
    });
  }