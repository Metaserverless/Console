/* eslint-disable */
const { createPopper } = window.Popper;

const dialogs = {
  elements: {
    modalDialogBackground: document.getElementById('modal-dialog-background'),
    modalDialog: document.getElementById('modal-dialog'),
    modalDialogHeader: document.getElementById('modal-dialog-header'),
    modalDialogHeaderTitle: document.getElementById(
      'modal-dialog-header-title'
    ),
    modalDialogHeaderButtonClose: document.getElementById(
      'modal-dialog-header-button-close'
    ),
    modalDialogBody: document.getElementById('modal-dialog-body'),
    modalDialogFooter: document.getElementById('modal-dialog-footer'),
    modalDialogCustomButtons: document.getElementById(
      'modal-dialog-custom-buttons'
    ),
    modalDialogDefaultButtons: document.getElementById(
      'modal-dialog-default-buttons'
    ),
    modalDialogButtonCancel: document.getElementById(
      'modal-dialog-button-cancel'
    ),
    modalDialogButtonOk: document.getElementById('modal-dialog-button-ok'),
  },
  element: null,
  parent: null,
  init() {
    this.elements.modalDialogHeaderButtonClose.addEventListener(
      'click',
      this.close.bind(this)
    );
    this.elements.modalDialogButtonOk.addEventListener(
      'click',
      this.close.bind(this)
    );
  },
  open(element, config = {}) {
    this.parent = element.parentNode;
    this.element = this.parent.removeChild(element);
    // return console.log(this.element);
    this.elements.modalDialogBody.appendChild(this.element);
    this.elements.modalDialogHeaderTitle.innerHTML = config.title || '';
    this.elements.modalDialogHeaderButtonClose.classList.remove('display-none');

    if (config.buttons) {
      this.elements.modalDialogDefaultButtons.classList.add('display-none');
      config.buttons.map((button) => {
        const buttonElement = document.createElement('button');
        buttonElement.innerHTML = button.text;
        buttonElement.addEventListener('click', button.callback);
        this.elements.modalDialogCustomButtons.appendChild(buttonElement);
        // return buttonElement;
      });
    }

    if (config.cancel !== undefined && !config.cancel) {
      this.elements.modalDialogButtonCancel.classList.add('display-none');
    }
    if (config.ok !== undefined && !config.ok) {
      this.elements.modalDialogButtonOk.classList.add('display-none');
    }

    this.elements.modalDialogBackground.classList.add('active');
  },
  close() {
    if (this.parent && this.element) {
      this.elements.modalDialogBackground.classList.remove(
        'active',
        'alert',
        'error'
      );
      this.parent.appendChild(
        this.elements.modalDialogBody.removeChild(this.element)
      );
      this.element = null;
      this.parent = null;
    }
    this.elements.modalDialogBody.innerHTML = '';
    this.elements.modalDialogHeaderTitle.innerHTML = '';
    this.elements.modalDialogCustomButtons.innerHTML = '';
    this.elements.modalDialogDefaultButtons.classList.remove('display-none');
    this.elements.modalDialogButtonCancel.classList.remove('display-none');
    this.elements.modalDialogButtonOk.classList.remove('display-none');
    this.elements.modalDialogBackground.classList.remove('active');
  },
  alert(text, config = {}) {
    this.elements.modalDialogBody.innerHTML = text || '';
    this.elements.modalDialogHeaderTitle.innerHTML = config.title || 'Alert';
    if (config.buttons) {
      if (!config.buttons.cancel)
        this.elements.modalDialogButtonCancel.classList.add('display-none');
      if (!config.buttons.ok)
        this.elements.modalDialogButtonOk.classList.add('display-none');
    }
    this.elements.modalDialogBackground.classList.add('active', 'alert');
  },
  error(text, config = {}) {
    this.elements.modalDialogHeaderTitle.innerHTML = config.title || 'Error';
    this.elements.modalDialogBody.innerHTML = text || '';
    if (config.buttons) {
      if (!config.buttons.cancel)
        this.elements.modalDialogButtonCancel.classList.add('display-none');
      if (!config.buttons.ok)
        this.elements.modalDialogButtonOk.classList.add('display-none');
    }
    this.elements.modalDialogBackground.classList.add('active', 'error');
  },
};

export default dialogs;
