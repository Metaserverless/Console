const { createPopper } = window.Popper;

class Tooltip {
  constructor() {
    this.appendTooltip();

    this.popperVirtualElement = {
      getBoundingClientRect: this.generateGetBoundingClientRect(),
    };

    this.shown = false;
    const optionsVertical = {
      placement: 'top',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 15],
          },
        },
        {
          name: 'flip',
          options: {
            // fallbackPlacements: ['bottom'],
            // boundary: this.$refs.paper
          },
        },
      ],
    };
    const optionsHorizontal = {
      placement: 'right',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 15],
          },
        },
        {
          name: 'flip',
          options: {
            // fallbackPlacements: ['bottom'],
            // boundary: this.$refs.paper
          },
        },
      ],
    };

    this.popperVertical = createPopper(
      this.popperVirtualElement,
      this.el,
      optionsVertical
    );
    this.popperHorizontal = createPopper(
      this.popperVirtualElement,
      this.el,
      optionsHorizontal
    );
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  appendTooltip() {
    this.el = document.createElement('div');
    this.el.className = 'tooltip';
    // this.el.style.display =
    const arrow = document.createElement('div');
    arrow.classList.add('tooltip-arrow');
    this.inner = document.createElement('div');
    this.inner.classList.add('tooltip-inner');
    this.el.appendChild(arrow);
    this.el.appendChild(this.inner);
    document.body.appendChild(this.el);
  }

  onMouseMove(evt) {
    if (!evt.target.getAttribute('data-title')) return this.showTooltip(false);

    this.popperVirtualElement.getBoundingClientRect =
      this.generateGetBoundingClientRect(evt.clientX, evt.clientY);

    if (!this.shown) {
      const data = evt.target.getAttribute('data-title');
      this.inner.innerHTML = data;
    }
    const popper = evt.target.classList.contains('tooltip-horizontal')
      ? this.popperHorizontal
      : this.popperVertical;
    popper.update();
    this.showTooltip();
  }

  showTooltip(show = true) {
    if (this.shown == show) return;
    this.el.style.display = show ? 'block' : 'none';
    this.el.style.opacity = show ? 1 : 0;
    this.shown = show;
  }

  generateGetBoundingClientRect(x = 0, y = 0) {
    return () => ({
      width: 0,
      height: 0,
      top: y,
      right: x,
      bottom: y,
      left: x,
    });
  }
}

export default Tooltip;
