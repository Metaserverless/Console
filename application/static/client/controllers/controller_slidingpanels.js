class slidingPanels {
  constructor(modules) {
    this.modules = modules;
    const opts = {
      hide: false,
      show: true,
      fixed: false,
      test: false,
      systemScreen: document.getElementById('app'),
      offcanvas: {
        top: {
          show: true,
          fixed: false,
          height: 32,
          proximity: 20,
          el: document.getElementById('top-header'),
        },
        start: {
          show: true,
          fixed: false,
          width: 290,
          proximity: 20,
          el: document.getElementById('leftColumns'),
        },
      },
      resizing: {},
    };
    for (let id in opts) this[id] = opts[id];

    // document.addEventListener('mousemove', this.checkMouseoPosition);
    // this.openOffcanvas(false, true);
    this.manageOffcanvas(true);
    this.modules.events.listen('setTop', (show) => {
      this.openOffcanvas('top', !show);
    });
    this.modules.events.listen('setLeft', (show) => {
      this.openOffcanvas('start', show);
    });
    this.modules.events.listen('setTopAndLeft', (show) => {
      this.openOffcanvas('top', show);
      this.openOffcanvas('start', show);
    });
  }

  openOffcanvas(position, show) {
    // console.log('open', position, show);

    if (this.offcanvas[position]) {
      this.offcanvas[position].show =
        show == undefined ? !this.offcanvas[position].show : show;
    } else {
      this.show = show != undefined ? show : !this.show;
    }
    this.manageOffcanvas(position == undefined);
  }

  fixedOffcanvas(position, fixed) {
    // console.log('fixed', position);
    if (this.offcanvas[position])
      this.offcanvas[position].fixed =
        fixed == undefined ? !this.offcanvas[position].fixed : fixed;
    else this.fixed = fixed != undefined ? fixed : !this.fixed;
    this.manageOffcanvas(position == undefined);
  }

  manageOffcanvas(all) {
    // const offcanvas = document.querySelectorAll('.system-offcanvas');

    // if (!this.offcanvas['top'].height) this.offcanvas['top'].height = this.offcanvas['top'].el.getBoundingClientRect().height;
    // if (!this.offcanvas['bottom'].height) this.offcanvas['bottom'].height = this.offcanvas['bottom'].el.getBoundingClientRect().height;
    const sizes = {};

    for (let id in this.offcanvas) {
      if (!this.offcanvas[id].el) console.log(id);
      let o = this.offcanvas[id].el,
        ci = o.parentNode,
        c = ci.parentNode,
        rect = o.getBoundingClientRect(),
        show = all && !this.show ? false : this.offcanvas[id].show,
        // show = all ? this.show : this.offcanvas[id].show,
        fixed = this.fixed || this.offcanvas[id].fixed;

      c.style.position = fixed ? 'fixed' : 'relative';

      if (id == 'top' || id == 'start') {
        o.style.transform = show ? 'translate(0)' : '';
      }

      if (id == 'top' || id == 'bottom') {
        //  console.log(rect.height)
        o.style.height = this.offcanvas[id].height + 'px';
        // ci.style.height = (show ? this.offcanvas[id].height : 0) + 'px';
        c.style.height =
          (this.show && this.offcanvas[id].show
            ? this.offcanvas[id].height
            : 0) + 'px';
        // if (c.classList.contains('system-top-offcanvas-container')) topHeight = rect.height;
        // else bottomHeight = rect.height;
        sizes[id] = rect.height;
      } else {
        //  console.log(rect.width)
        //  yOffcanvas.push(o);
        o.style.width = this.offcanvas[id].width + 'px';
        // o.style.width = '100%';
        c.style.height = fixed ? '100%' : 'auto';
        c.style.width = (show ? this.offcanvas[id].width : 0) + 'px';
        // o.style.width = this.offcanvas[id].width + 'px';
        // const cs = window.getComputedStyle(c);
        // console.log(cs.transition);
        // const transition = cs.transition;
        // c.style.transition = '';
        ci.style.marginTop =
          ((this.fixed ||
            this.offcanvas.top.fixed ||
            this.offcanvas[id].fixed) &&
          this.show &&
          this.offcanvas.top.show
            ? this.offcanvas.top.height
            : 0) + 'px';
        ci.style.marginBottom =
          ((this.fixed ||
            // this.offcanvas.bottom.fixed ||
            this.offcanvas[id].fixed) &&
          this.show &&
          this.offcanvas.bottom.show
            ? this.offcanvas.bottom.height
            : 0) + 'px';

        sizes[id] = rect.width;
      }
    }

    // this.systemScreen.classList.toggle('show', this.show);

    //  console.log(sizes)
    // for (let o of yOffcanvas){
    // o.style.marginTop = (this.fixed && this.show ? this.offcanvas.top.height : 0) + 'px';
    // o.style.marginBottom = (this.fixed && this.show ? this.offcanvas.bottom.height : 0)  + 'px';

    // }
  }

  checkMouseoPosition(event) {
    // const proximity = 20;
    let changed = false;

    for (let id in this.offcanvas) {
      if (!this.fixed && !this.offcanvas[id].fixed) continue;
      if (id == 'top') {
        if (
          !this.offcanvas[id].show &&
          event.y < this.offcanvas[id].proximity
        ) {
          this.offcanvas[id].show = true;
          changed = true;
        } else if (
          this.offcanvas[id].show &&
          event.y > this.offcanvas[id].rect.height
        ) {
          this.offcanvas[id].show = false;
          changed = true;
        }
      }
    }
    if (changed) this.manageOffcanvas();

    // if (!this.fixed)
    // if (event.x < proximity) {
    //     this.openOffcanvas('start', true);
    // }
    // else if (event.x > window.innerWidth - proximity) {
    //     this.openOffcanvas('end', true);
    // }
    // else if (event.y < proximity) {
    //     this.openOffcanvas('top', true);
    // }
    // else if (event.y > window.innerHeight - proximity) {
    //     this.openOffcanvas('bottom', true);
    // }
    // else {
    //     this.openOffcanvas('start', false);
    //     this.openOffcanvas('end', false);
    //     this.openOffcanvas('top', false);
    //     this.openOffcanvas('bottom', false);
    // }
  }

  resizeStripMousedown(event) {
    const target = event.target,
      inner = target.parentNode,
      container = inner.parentNode,
      positions = ['top', 'start', 'end', 'bottom'];

    let position;
    for (let id of positions) {
      if (container.classList.contains(id)) {
        position = id;
        break;
      }
    }
    if (!this.offcanvas[position].show) return;
    // console.log(position);
    this.resizing = {
      id: position,
      el: this.offcanvas[position].el,
      inner,
      container,
      coordinates: {
        x: event.x,
        y: event.y,
      },
    };

    this.resizing.el.style.transition =
      this.resizing.inner.style.transition =
      this.resizing.container.style.container =
        'unset';

    document.addEventListener('mousemove', this.resizeStripMousemove);
    document.addEventListener('mouseup', this.resizeStripMousemup);
  }

  resizeStripMousemove(event) {
    // console.log('mousemove', event);
    let diff;
    if (this.resizing.id == 'top' || this.resizing.id == 'bottom') {
      if (this.resizing.id == 'top') {
        this.offcanvas[this.resizing.id].height = event.y;
        this.resizing.el.style.height = this.resizing.container.style.height =
          this.offcanvas[this.resizing.id].height + 'px';
      }
    } else {
      diff = event.x - this.resizing.coordinates.x;
    }
  }

  resizeStripMousemup(event) {
    console.log('mouseup', event);
    this.resizing.el.style.transition =
      this.resizing.inner.style.transition =
      this.resizing.container.style.container =
        '';
    document.removeEventListener('mousemove', this.resizeStripMousemove);
    document.removeEventListener('mouseup', this.resizeStripMousemup);
    this.resizing = {};
  }
}

export default slidingPanels;
