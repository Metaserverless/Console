/* eslint-disable */


class Submenu {

    //$root - корневой элемент потом из него удаляется под меню!
    // fields - получаем поля которые выводим!
    //$submenu - создается под меню!
    //метод send - отправляет собронный $submenu!
    //onMouseLeave - с робатавыет  удаляет class и список полей!
    // $list_fileds - список полей!
  
    constructor($root, fields = []) {
  
      this.$root = $root;
      this.fields = fields;
      this.$submenu = document.createElement('div');
      this.$submenu.classList.add('sub_menu-fields')
      this.$list_fields = document.createElement('ul');
      this.$list_fields.innerHTML = this.fields.map((field) => `<li>${field}</li>`).join('');
      this.$submenu.append(this.$list_fields);
      this.$submenu.addEventListener('mouseenter', this.onMouseEnter.bind(this));
      this.$root.addEventListener('mouseleave', this.onMouseLeave.bind(this));
  
  }
  
    send() {
      return this.$submenu;
    }
  
    onMouseEnter(e) {
     console.log(e)
    }
  
    onMouseLeave(e) {
      this.$submenu.classList.remove('active');
      this.$submenu.remove('ul');
    }
  }
  
  export default Submenu;
  