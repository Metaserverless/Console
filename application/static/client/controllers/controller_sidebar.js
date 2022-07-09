/* eslint-disable */

import treesManager from '../elements/treesManager.js'
// import Tree from '../elements/Tree.js';
class controllerSidepanel {
  constructor(id, modules) {
    this.id = id;
    this.modules = modules;
    const sidebar = document.getElementById(id);
    this.elements = {
      sidebar,
      sections: sidebar.querySelector('.side-bar-sections'),
    };
    this.selectedSection = null;
    modules.events.listen('transport:initiated', this.loadData.bind(this));




    this.sections = [{
        text: 'Server',
        icon: 'fas fa-server',
        type: 'server',
      },
      {
        text: 'Client',
        icon: 'fas fa-desktop',
        type: 'client',
      },
      {
        text: 'Database',
        icon: 'fas fa-database',
        type: 'database',
      },
      {
        text: 'External APIs',
        icon: 'fas fa-external-link-alt',
        type: 'external',
      },
      {
        text: 'Files',
        icon: 'far fa-file',
        type: 'files',
      },
      {
        text: 'Mail',
        icon: 'far fa-envelope',
        type: 'mail',
      },
      {
        text: 'Versioning',
        icon: 'fas fa-code-branch',
        type: 'versioning',
      },
      {
        text: 'Debugging',
        icon: 'fas fa-bug',
        type: 'debugging',
      },
      {
        text: 'Extensions',
        icon: 'fas fa-th-large',
        type: 'extensions',
      },
      {
        text: 'Templates',
        icon: 'far fa-clone',
        type: 'templates',
      },
    ];
    this.trees = {};
    // console.log($)
    // $(function () {
    for (let section of this.sections) {
      let div = document.createElement('div');
      div.id = 'side-bar-' + section.type;
      div.setAttribute('data-section', section.type);
      div.className = 'side-bar-section';
      section.el = div;
      this.elements.sections.appendChild(div);
      // this.trees[section.type] = [];
    }

    let to = false;
    $('#jstree_search').keyup(() => {
      if (to) {
        clearTimeout(to);
      }
      to = setTimeout(
        function () {
          const v = $('#jstree_search').val();
          this.searchSections(v);
          // $(this.selectedSection).jstree(true).search(v);
        }.bind(this),
        250
      );
    });

    this.modules.events.listen(
      'activity-bar-item-selected',
      this.selectSection.bind(this)
    );

    this.selectSection('server');

    // this.modules.events.listen(
    //   'tree-item-selected',
    //   this.treeItemSelected.bind(this)
    // );
  }

  async loadData() {
    const selectedSectionType = this.selectedSection.getAttribute('data-section');
    treesManager.makeTrees(this.sections, selectedSectionType);
  }







  searchSections(str) {
    this.elements.sections
      .querySelectorAll('.side-bar-section')
      .forEach((section) => {
        if ($(section).jstree(true).search) $(section).jstree(true).search(str);
      });
  }

  selectSection(type) {
    // console.log(type);
    this.elements.sections
      .querySelectorAll('.side-bar-section')
      .forEach((section) => {
        if (section.getAttribute('data-section') == type) {
          this.selectedSection = section;
          this.modules.events.emit('sidebar:section:selected', type);
          // this.modules.events.emit('sidebar:current:tree', this.trees[type]);
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      });

    // for (let id in this.trees) {
    //   this.trees[id].active = id == type;
    // }
  }

  showContextMenu(event, data) {
    // console.log(event);
    // console.log(data);
  }
}

export default controllerSidepanel;
