let params = (new URL(document.location)).searchParams;
let json1Url = params.get('json1');

if (json1Url) {
  fetch(json1Url)
  .then(response => response.json())
  .then(json => buildEditor(json))
  .catch(error => {
    window.console.log('error: ', error)
    buildEditor() // show editor with default values
  })
} else {
  buildEditor()
}


function buildEditor(startJSON1) {

  if (!navigator.clipboard || !navigator.clipboard.readText) {
    document.getElementById("paste-1").hidden = true
    document.getElementById("paste-2").hidden = true
  }


    let startString = '{ "stuff": { "that": [1,2,3], "isin": true, "json": "end"}}'
  if (startJSON1) {
    startString = JSON.stringify(startJSON1)
  }

  var editor1 = monaco.editor.create(document.getElementById('editor1'), {
    value: [
      startString,
    ].join('\n'),
    language: 'json',
    tabSize: 2,
    fontSize:12,
    formatOnPaste: true,
      links:true,
      showFoldingControls:"always",
    minimap: { enabled: false }
  });

  document.getElementById("format-edit-1").addEventListener("click", formatJson1)
  function formatJson1() {
    var jsonString = validateJson(editor1.getValue())
    editor1.setValue(jsonString)
    editor1.getAction("editor.action.formatDocument").run()
  }

  function validateJson(json){
    var tempres = json.replace("msg=\"", "message").trim();
    var res = tempres.replace("requestUri=http://", "requestUri=www.").trim();
    var finalRes = res.replace("requestUri=https://", "requestUri=www.").trim();
    return finalRes
  }

  document.getElementById("font-zoom-in").addEventListener("click", fontZoomIn)
  function fontZoomIn() {
    editor1.getAction("editor.action.fontZoomIn").run()
  }

  document.getElementById("font-zoom-out").addEventListener("click", fontZoomOut)
  function fontZoomOut() {
    editor1.getAction("editor.action.fontZoomOut").run()
  }

  document.getElementById("font-zoom-reset").addEventListener("click", fontZoomReset)
  function fontZoomReset() {
    editor1.getAction("editor.action.fontZoomReset").run()
  }

  document.getElementById("paste-1").addEventListener("click", paste1)
  function paste1() {
    navigator.clipboard.readText().then(
      clipText => {
        var jsonString = validateJson(clipText)
        editor1.setValue(jsonString)
        editor1.getAction("editor.action.formatDocument").run()
      }
    )
  }

  document.getElementById("minify-1").addEventListener("click", minify1)
  function minify1() {
    const newText = JSON.stringify(JSON.parse(editor1.getValue()), null, 0)
    editor1.setValue(newText)
  }

  document.getElementById("clear-1").addEventListener("click", clear1)
  function clear1() {
    editor1.setValue('')
  }

  document.getElementById("minify-2").addEventListener("click", minify2)
  function minify2() {
    const newText = JSON.stringify(JSON.parse(editor2.getValue()), null, 0)
    editor2.setValue(newText)
  }

  var editor2 = monaco.editor.create(document.getElementById('editor2'), {
    value: [
      '{ "stuff": { "that": [1,2,3], "isin": true, "json": "end"}}',
    ].join('\n'),
    language: 'json',
    tabSize: 2,
    fontSize:12,
    formatOnPaste: true,
    showFoldingControls:"always",
    minimap: { enabled: false }
  });

  document.getElementById("format-edit-2").addEventListener("click", formatJson2)
  function formatJson2() {
    var jsonString = validateJson(editor2.getValue())
    editor2.setValue(jsonString)
    editor2.getAction("editor.action.formatDocument").run()
  }

  document.getElementById("paste-2").addEventListener("click", paste2)
  function paste2() {
    navigator.clipboard.readText().then(
      clipText => {
        var jsonString = validateJson(clipText)
        editor2.setValue(jsonString)
        editor2.getAction("editor.action.formatDocument").run()
      }
    )
  }

  document.getElementById("clear-2").addEventListener("click", clear2)
  function clear2() {
    editor2.setValue('')
  }



  var originalModel = monaco.editor.createModel(editor1.getValue(), "text/json")
  var modifiedModel = monaco.editor.createModel(editor2.getValue(), "text/json")

  var diffEditor = monaco.editor.createDiffEditor(document.getElementById("diff-editor"))

  var navi = monaco.editor.createDiffNavigator(diffEditor, {
    followsCaret: true, // resets the navigator state when the user selects something in the editor
    ignoreCharChanges: true // jump from line to line
  });

  document.getElementById("refresh-diff").addEventListener("click", switchToDiff)
  document.getElementById("compare-json").addEventListener("click", switchToDiff)


  function switchToDiff() {
    originalModel = monaco.editor.createModel(editor1.getValue(), "text/json")
    modifiedModel = monaco.editor.createModel(editor2.getValue(), "text/json")
    diffEditor.setModel({
      original: originalModel,
      modified: modifiedModel
    });
  }

  document.getElementById("next-change").addEventListener("click", nextDiff)
  function nextDiff() {
    navi.next()
  }

  document.getElementById("previous-change").addEventListener("click", previousDiff)
  function previousDiff() {
    navi.previous()
  }

  function layout() {
    var GLOBAL_PADDING = 20

    var WIDTH = window.innerWidth - 2 * GLOBAL_PADDING
    var HEIGHT = window.innerHeight

    var TITLE_HEIGHT = 36 + 5 + 15
    var FOOTER_HEIGHT = 10
    var TABS_HEIGHT = 20 + 2 + 2
    var INNER_PADDING = 0

    var HALF_WIDTH = Math.floor((WIDTH - INNER_PADDING) / 2)
    var REMAINING_HEIGHT = HEIGHT - TITLE_HEIGHT - FOOTER_HEIGHT - TABS_HEIGHT - FOOTER_HEIGHT

    document.getElementById('editor1').style.width = HALF_WIDTH + 'px'
    document.getElementById('editor2').style.width = HALF_WIDTH + 'px'
    document.getElementById('diff-editor').style.width = WIDTH + 'px'

    document.getElementById('editor1').style.height = REMAINING_HEIGHT + 'px'
    document.getElementById('editor2').style.height = REMAINING_HEIGHT + 'px'
    document.getElementById('diff-editor').style.height = REMAINING_HEIGHT + 'px'
    document.getElementsByClassName('other-format-div')[0].style.width = WIDTH + 'px'

    if (diffEditor) {
      diffEditor.layout({
        width: WIDTH,
        height: REMAINING_HEIGHT
      })
    }
    if (editor1) {
      editor1.layout({
        width: HALF_WIDTH,
        height: REMAINING_HEIGHT
      })
    }
    if (editor2) {
      editor2.layout({
        width: HALF_WIDTH,
        height: REMAINING_HEIGHT
      })
    }
  }

  layout()
  window.onresize = layout

}
















// function buildEditor(initialJSON) {

//   let startString = '{ "stuff": { "that": [1,2,3], "isin": true, "json": "end"}}'
//   if (initialJSON) {
//     startString = JSON.stringify(initialJSON)
//   }

//   var editor1 = monaco.editor.create(document.getElementById('editor1'), {
//     value: [
//       startString,
//     ].join('\n'),
//     language: 'json',
//     tabSize: 2,
//     formatOnPaste: true,
//     minimap: { enabled: false }
//   });

//   document.getElementById("format-edit-1").addEventListener("click", formatJson1)
//   function formatJson1() {
//     editor1.getAction("editor.action.formatDocument").run()
//   }

//   document.getElementById("paste-1").addEventListener("click", paste1)
//   function paste1() {
//     navigator.clipboard.readText().then(
//       clipText => {
//         editor1.setValue(clipText)
//         editor1.getAction("editor.action.formatDocument").run()
//       }
//     )
//   }




//   var editor2 = monaco.editor.create(document.getElementById('editor2'), {
//     value: [
//       '{ "stuff": { "that": [1,2,3], "isin": true, "json": "end"}}',
//     ].join('\n'),
//     language: 'json',
//     tabSize: 2,
//     formatOnPaste: true,
//     minimap: { enabled: false }
//   });

//   document.getElementById("format-edit-2").addEventListener("click", formatJson2)
//   function formatJson2() {
//     editor2.getAction("editor.action.formatDocument").run()
//   }

//   document.getElementById("paste-2").addEventListener("click", paste2)
//   function paste2() {
//     navigator.clipboard.readText().then(
//       clipText => {
//         editor2.setValue(clipText)
//         editor2.getAction("editor.action.formatDocument").run()
//       }
//     )
//   }


//   var originalModel = monaco.editor.createModel(editor1.getValue(), "text/json");
//   var modifiedModel = monaco.editor.createModel(editor2.getValue(), "text/json");

//   var diffEditor = monaco.editor.createDiffEditor(document.getElementById("diff-editor"));

//   var navi = monaco.editor.createDiffNavigator(diffEditor, {
//     followsCaret: true, // resets the navigator state when the user selects something in the editor
//     ignoreCharChanges: true // jump from line to line
//   });

//   document.getElementById("refresh-diff").addEventListener("click", switchToDiff)

//   function switchToDiff() {
//     originalModel = monaco.editor.createModel(editor1.getValue(), "text/json");
//     modifiedModel = monaco.editor.createModel(editor2.getValue(), "text/json");
//     diffEditor.setModel({
//       original: originalModel,
//       modified: modifiedModel
//     });
//   }

//   document.getElementById("next-change").addEventListener("click", nextDiff)
//   function nextDiff() {
//     navi.next()
//   }

//   document.getElementById("previous-change").addEventListener("click", previousDiff)
//   function previousDiff() {
//     navi.previous()
//   }

// }
