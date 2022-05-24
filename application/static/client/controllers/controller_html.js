/* eslint-disable */
import BaseCodeEditor from '../editors/baseCodeEditor.js';

class controllerHtml {
  constructor(id, modules) {
    this.id = id;
    this.modules = modules;
    this.elements = {};

    const value = `<html style="color: green">
<!-- this is a comment -->
<head>
  <title>Mixed HTML Example</title>
  <style>
    h1 {font-family: comic sans; color: #f0f;}
    div {background: yellow !important;}
    body {
      max-width: 50em;
      margin: 1em 2em 1em 5em;
    }
  </style>
</head>
<body>
  <h1>Mixed HTML Example</h1>
  <script>
    function jsFunc(arg1, arg2) {
      if (arg1 && arg2) document.body.innerHTML = "achoo";
    }
  </script>
</body>
</html>`;

    this.codeEditor = new BaseCodeEditor(id, modules, {
      mode: 'text/html',
      value: '',
    });
  }
}

export default controllerHtml;
