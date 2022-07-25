/* eslint-disable */
class Form {
  constructor(id, modules) {
    this.forms = {};
    this.modules = modules;
    this.formName = '';
    this.form = {};
    this.elements = {
      formComponent: document.getElementById(id),
    };
    this.elements.formComponent.addEventListener('submit', (e) => {
      e.preventDefault();
    });
  }

  test() {
    const step = {
      step: {
        command: 'Form `Order`',
        success: [],
        fail: [],
        finalization: [],
      },
      form: {
        product: [
          {
            productId: '2',
            name: 'Huawei D16 Laptop',
            description: 'AMD Ryzon 5, 16gb RAM, SSD 500gb',
            amount: 10,
            price: 30000,
            weight: 2,
          },
          {
            productId: '3',
            name: 'Vitelotte potatoes',
            description: 'Violet-blue, nutty flavour, chestnuts smell',
            amount: 100,
            price: 75,
            weight: 1,
          },
          {
            productId: '4',
            name: 'Gesture chair',
            description: 'Inspired by the movement of the human body',
            amount: 25,
            price: 17000,
            weight: 20,
          },
          {
            productId: '1',
            name: 'Motorola Edge 20 Pro',
            description: 'Dual-Sim 256gb, 12gb RAM, 5G',
            amount: 42,
            price: 20000,
            weight: 0,
          },
        ],
        carrier: [
          {
            carrierId: '1',
            name: 'Postal service',
          },
          {
            carrierId: '2',
            name: 'Courier service',
          },
          {
            carrierId: '3',
            name: 'Pickup from store',
          },
        ],
        amount: {
          type: 'number',
          required: true,
        },
      },
    };
    this.showForm(step);
  }

  show(step) {
    // console.log(step);
    this.elements.formComponent.innerHTML = '';
    this.formName = step.step.command;
    this.form = {};
    // const inputs = [];
    for (let id in step.form) {
      let desc = step.form[id],
        element,
        input;
      const label = document.createElement('label');
      label.textContent = id;
      label.setAttribute('for', id);
      this.elements.formComponent.appendChild(label);

      this.form[id] = '';

      if (Array.isArray(desc)) {
        const keys = Object.keys(desc[0]),
          value = keys[0],
          name = keys[1];
        input = document.createElement('select');
        for (let opt of desc) {
          const option = document.createElement('option');
          option.value = opt[value];
          option.innerText = opt[name];
          input.appendChild(option);
        }
        this.form[id] = desc[0][value];
      } else if (desc.type == 'number') {
        input = document.createElement('input');
        input.type = 'number';
        input.required = desc.required;
      } else {
        element = document.createElement('input');
      }
      input.id = id;
      this.elements.formComponent.appendChild(input);
    }

    this.modules.dialogs.open(this.elements.formComponent, {
      title: step.step.command,
      close: false,
      buttons: [{ text: 'Submit', callback: this.submitForm.bind(this) }],
    });
  }

  submitForm() {
    this.elements.formComponent.requestSubmit();
    const valid = this.elements.formComponent.checkValidity();
    if (!valid) return;
    for (let id in this.form) {
      this.form[id] = this.elements.formComponent.querySelector('#' + id).value;
    }
    console.log(this.form);
    this.modules.transport.send('formSubmit', {
      name: this.formName,
      data: this.form,
    });
    this.modules.dialogs.close();
  }
}

export default Form;
