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

function buildEditor(initialJSON) {

  let startString = '{ "stuff": { "that": [1,2,3], "isin": true, "json": "end"}}'
  if (initialJSON) {
    startString = JSON.stringify(initialJSON)
  }

  var editor1 = monaco.editor.create(document.getElementById('editor1'), {
    value: [
      startString,
    ].join('\n'),
    language: 'json',
    tabSize: 2,
    formatOnPaste: true,
    minimap: { enabled: false }
  });

  document.getElementById("format-edit-1").addEventListener("click", formatJson1)
  function formatJson1() {
    editor1.getAction("editor.action.formatDocument").run()
  }

  document.getElementById("paste-1").addEventListener("click", paste1)
  function paste1() {
    navigator.clipboard.readText().then(
      clipText => {
        editor1.setValue(clipText)
        editor1.getAction("editor.action.formatDocument").run()
      }
    )
  }




  var editor2 = monaco.editor.create(document.getElementById('editor2'), {
    value: [
      '{ "stuff": { "that": [1,2,3], "isin": true, "json": "end"}}',
    ].join('\n'),
    language: 'json',
    tabSize: 2,
    formatOnPaste: true,
    minimap: { enabled: false }
  });

  document.getElementById("format-edit-2").addEventListener("click", formatJson2)
  function formatJson2() {
    editor2.getAction("editor.action.formatDocument").run()
  }

  document.getElementById("paste-2").addEventListener("click", paste2)
  function paste2() {
    navigator.clipboard.readText().then(
      clipText => {
        editor2.setValue(clipText)
        editor2.getAction("editor.action.formatDocument").run()
      }
    )
  }


  var originalModel = monaco.editor.createModel(editor1.getValue(), "text/json");
  var modifiedModel = monaco.editor.createModel(editor2.getValue(), "text/json");

  var diffEditor = monaco.editor.createDiffEditor(document.getElementById("diff-editor"));

  var navi = monaco.editor.createDiffNavigator(diffEditor, {
    followsCaret: true, // resets the navigator state when the user selects something in the editor
    ignoreCharChanges: true // jump from line to line
  });

  document.getElementById("refresh-diff").addEventListener("click", switchToDiff)

  function switchToDiff() {
    originalModel = monaco.editor.createModel(editor1.getValue(), "text/json");
    modifiedModel = monaco.editor.createModel(editor2.getValue(), "text/json");
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

}
