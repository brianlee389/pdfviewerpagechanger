function toggleFullScreen() {
  var inFullScreenMode = document.fullscreenElement ||
            document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;

  if (inFullScreenMode) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  } else {
    var docElm = document.documentElement;
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen();
    } else if (docElm.msRequestFullscreen) {
      docElm.msRequestFullscreen();
    } else if (docElm.mozRequestFullScreen) {
      docElm.mozRequestFullScreen();
    }
  }
}

function runPoorManLongPolling(getPageNumber, runFunction) {
  return setInterval(function() {
    axios.get('http://localhost:3000/getPageNumber')
    .then(function (response) {
      if (response.data.pageNumber > getPageNumber())
      {
        console.log("move to next page: " + response.data.pageNumber);
        runFunction();
      } else {
        console.log("do nothing");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }, 1000);
}

WebViewer({
  path: 'WebViewer/lib', // path to the PDFTron 'lib' folder on your server
  licenseKey: 'Insert commercial license key here after purchase',
  initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/webviewer-demo.pdf',
  // initialDoc: '/path/to/my/file.pdf',  // You can also use documents on your server
}, document.getElementById('viewer'))
.then(function(instance) {

  var docViewer = instance.docViewer;
  var annotManager = instance.annotManager;
  // call methods from instance, docViewer and annotManager as needed

  // you can also access major namespaces from the instance as follows:
  // var Tools = instance.Tools;
  // var Annotations = instance.Annotations;


  docViewer.on('documentLoaded', function() {
    // call methods relating to the loaded document
    instance.setLayoutMode("Facing");
    // instance.disableTools();
    toggleFullScreen();
    document.getElementsByTagName("iframe")[0].focus();

    document.getElementById("nextpage").addEventListener('click', function() {
      instance.goToNextPage();
      console.log(instance);
      console.log("Page Count: " + instance.getPageCount());
      console.log("Current Page Number: " + instance.getCurrentPageNumber());

    });

    document.getElementById("loadDefaultForm").addEventListener('click', function() {
      instance.loadDocument("http://localhost:3000/getForm");
    });

    var startScanText = 'Start Scan Process';
    var startScanButton = document.getElementById("startScan");
    startScanButton.addEventListener('click', function() {
      var longPollCycle;
      if (startScanButton.textContent == startScanText) {
          instance.loadDocument("http://localhost:3000/getForm");
          document.getElementsByTagName("iframe")[0].focus();

          startScanButton.textContent = 'Stop Scan';
          longPollCycle = runPoorManLongPolling(function() {
            return instance.getCurrentPageNumber();
          },
          function() {
            instance.goToNextPage();
          });
      } else {
        startScanButton.textContent = 'Stop Scan';
        clearInterval(longPollCycle);
      }
    });
  });
});
