/* eslint-disable */

class codeEditor {
  constructor(id, modules, config = {}) {
    this.id = id;
    this.modules = modules;
    (this.original = ''), (this.lines = []);
    this.lastLines = [];

    const codeEditor = document.getElementById(id);

    if (!codeEditor) return console.error('codeEditor not found');

    codeEditor.innerHTML = `<div class="code-editor-container">
            <div class="code-editor-line-numbers"></div>
            <textarea class="code-editor-input" wrap='off'></textarea>
            <!-- <div class="code-editor-input-editable-div" contenteditable="true"></div> -->
            <div class="code-editor-autocomplete"></div>
            <button class="code-editor-close-button code-editor-floating-button">close</button>
        </div>
        <button class="code-editor-open-button code-editor-floating-button">open</button>`;

    this.elements = {
      codeEditor,
      codeEditorContainer: codeEditor.querySelector('.code-editor-container'),
      lineNumners: codeEditor.querySelector('.code-editor-line-numbers'),
      codeEditorInput: codeEditor.querySelector('.code-editor-input'),
      autocomplete: codeEditor.querySelector('.code-editor-autocomplete'),
      closeBtn: codeEditor.querySelector('.code-editor-close-button'),
      openBtn: codeEditor.querySelector('.code-editor-open-button'),
    };

    document.addEventListener('selectionchange', (event) => {
      if (document.activeElement === this.elements.codeEditorInput)
        this.onSelectionChange(
          document.activeElement.selectionStart,
          document.activeElement.selectionEnd
        );
    });
    this.elements.codeEditorInput.addEventListener('input', (event) =>
      this.updateValue(event.target.value)
    );
    // this.elements.codeEditorInput.addEventListener('scroll', (event)=>this.updateScroll(event.target.scrollTop));
    this.elements.codeEditorInput.addEventListener('scroll', (event) =>
      this.updateScroll(event.target.scrollTop)
    );
    // this.elements.codeEditorInput.addEventListener('mousedown', ()=>setTimeout(this.updateAutocomplete.bind(this), 0));
    this.elements.codeEditorInput.addEventListener(
      'keydown',
      this.onEditorKeydown.bind(this)
    );
    this.elements.autocomplete.addEventListener(
      'keydown',
      this.onAutocompleteKeydown.bind(this)
    );
    this.elements.autocomplete.addEventListener(
      'click',
      this.onAutocompleteClick.bind(this)
    );
    this.elements.openBtn.addEventListener('click', () =>
      this.showCodeEditor()
    );
    this.elements.closeBtn.addEventListener('click', () =>
      this.showCodeEditor(false)
    );
  }

  setValue(text) {
    // console.log(text)
    this.original = text;
    this.lastLines = text.split('\n');
    this.elements.codeEditorInput.value = text;
    this.updateLineNumbers(this.lastLines.length);
  }

  updateValue(text) {
    // const text = event.target.innerText;
    // console.log(this, text);
    // console.log('input');
    console.log(text.length, this.original.length);
    //  if(text == this.original.data)  this.elements.processSaveButton.setAttribute('disabled', true);
    //  else this.elements.processSaveButton.removeAttribute('disabled');

    const lines = text.split('\n');
    this.updateLineNumbers(lines.length);

    const isOriginal = text == this.original;
    const changedLines = [];
    const max = Math.max(lines.length, this.lastLines.length);

    for (let i = 0; i < max; i++) {
      if (!lines[i] || !this.lastLines[i] || lines[i] !== this.lastLines[i]) {
        changedLines.push(i);
      }
    }
    this.lastLines = lines;

    this.modules.events.emit(this.id + ':input:change', {
      text,
      lines,
      isOriginal,
      changedLines,
    });

    // this.elements.autocomplete.style.left = box.width + 'px';
    // console.log(process)
    // this.objects = process;
    // // }
    // this.lines = lines;
    // this.cleanLines = cleanLines;

    // console.log(this.elements.codeEditor.selectionStart)
    // this.updateAutocomplete();
    // diagram.updateGraph(this.objects);
    // console.log(this.objects)

    // diagram.updateGraph(this.objects);

    // const parsed = parser.parseScript(this.text);
    // diagram.updateGraph(parsed);
  }

  updateLineNumbers(count) {
    this.elements.lineNumners.innerHTML = new Array(count)
      .fill()
      .map((_, index) => `${index + 1}.`)
      .join('<br>'); //..[...Array(1000).keys()]
    const box = this.elements.lineNumners.getBoundingClientRect();
    this.elements.codeEditorInput.style.paddingLeft = box.width + 'px';
  }

  onSelectionChange(start, end) {
    // console.log('onSelectionChange', start, end);
    // this.updateAutocomplete();
  }

  onEditorBlur() {
    this.elements.autocomplete.style.display = 'none';
  }

  onEditorKeydown(e) {
    let { keyCode } = e;
    let { value, selectionStart, selectionEnd } = this.elements.codeEditorInput;
    if (keyCode === 9) {
      // TAB = 9
      e.preventDefault();
      this.elements.codeEditorInput.value =
        value.slice(0, selectionStart) + '\t' + value.slice(selectionEnd);
      this.elements.codeEditorInput.setSelectionRange(
        selectionStart + 1,
        selectionStart + 1
      );
    } else if (keyCode === 40) {
      if (this.autocomleteShown) {
        e.preventDefault();
        this.elements.autocomplete.firstChild.focus();
        // this.elements.autocomplete.setSelectionRange(0, 0);
      }
    } else if (keyCode === 27) {
      // ESC
      e.preventDefault();
      this.showAutocomplete(false);
    }
  }
  // onAutocompleteBlur(e){
  //     this.showAutocomplete(false);
  // },
  onAutocompleteKeydown(e) {
    if (!this.autocomleteShown) return;
    let { keyCode } = e;

    if (keyCode === 38 || keyCode === 40) {
      e.preventDefault();
      const children = this.elements.autocomplete.children;
      let index = 0;
      for (let i = 0; i < children.length; i++) {
        if (children[i] == document.activeElement) {
          index = i;
          break;
        }
      }
      if (keyCode === 38) {
        // up
        index--;
        if (index < 0) index = children.length - 1;
      } else if (keyCode === 40) {
        // down
        index++;
        if (index >= children.length) index = 0;
      }
      children[index].focus();
      // console.log(keyCode, index);
    } else if (keyCode === 27) {
      // ESC
      e.preventDefault();
      this.showAutocomplete(false);
    }
  }

  updateScroll(scroll) {
    // console.log(this)
    // console.log(this.elements.lineNumners)
    this.elements.lineNumners.scroll(0, scroll);
  }

  showCodeEditor(show = true) {
    if (!show) this.showAutocomplete(false);
    this.codeEditorShown = show;
    this.elements.openBtn.style.display = show ? 'none' : 'block';
    // this.elements.closeBtn.style.display = show ? 'block' : 'none';
    this.elements.codeEditorContainer.style.display = show ? 'flex' : 'none';
    this.elements.codeEditor.style.height = show ? '' : '0';
  }

  showAutocomplete(show = true) {
    this.autocomleteShown = show;
    if (show) {
      this.elements.autocomplete.style.display = 'block';
      let top =
        10 +
        (this.editingLine + 1) * 19 +
        2 -
        this.elements.codeEditorInput.scrollTop;
      const codeEdotorRect =
        this.elements.codeEditorInput.getBoundingClientRect();
      const autocomplete_rect =
        this.elements.autocomplete.getBoundingClientRect();
      if (
        top + autocomplete_rect.height >
        codeEdotorRect.x + codeEdotorRect.height
      ) {
        top -= 10 + autocomplete_rect.height + 19 + 2;
      }
      this.elements.autocomplete.style.top = top + 'px';
      // this.elements.autocomplete.firstChild.focus();
    } else {
      this.elements.autocomplete.style.display = 'none';
      this.elements.autocomplete.innerHTML = '';
      this.elements.codeEditorInput.focus();
    }
  }

  onAutocompleteClick(event) {
    const text = event.target.innerText;
    // console.log(text);
    // console.log(this.lines[this.editingLine], '|', this.cleanLines[this.editingLine], '|',
    //             this.cleanLines[this.editingLine].length, '|', this.lines[this.editingLine].replace(this.cleanLines[this.editingLine], text));

    this.lines[this.editingLine] = this.cleanLines[this.editingLine].length
      ? this.lines[this.editingLine].replace(
          this.cleanLines[this.editingLine],
          text
        )
      : this.lines[this.editingLine] + text;
    const all = this.lines.join('\n');
    this.elements.codeEditorInput.value = all;
    this.updateValue2(all);
  }

  updateAutocomplete(event) {
    // console.log(this.elements.codeEditorInput.selectionStart)
    const lines = this.elements.codeEditorInput.value
      .substr(0, this.elements.codeEditorInput.selectionStart)
      .split('\n');
    this.editingLine = lines.length == 0 ? 0 : lines.length - 1;
    const text = this.cleanLines[this.editingLine].toLowerCase().trim();
    const matches = this.types.filter(
      (item) =>
        item.text.toLowerCase().indexOf(text) != -1 &&
        item.text.toLowerCase() != text
    );
    if (matches.length) {
      this.elements.autocomplete.innerHTML = matches
        .map((item) => `<button>${item.text}</button>`)
        .join('');
      this.showAutocomplete();
    } else {
      this.showAutocomplete(false);
    }

    // console.log(this.cleanLines[this.editingLine]);
  }
}

export default codeEditor;
