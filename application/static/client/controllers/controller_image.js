/* eslint-disable */


class controllerImage {
  constructor(id, modules) {
    this.id = id;
    this.modules = modules;
    this.view = 'Image';
    this.elements = {
      image: document.getElementById(id).querySelector('img'),
    };

    const value = ``;
    this.modules.events.listen('image-selected', (data) => {
      this.elements.image.src = data.url;
    })

  }
}

export default controllerImage;
