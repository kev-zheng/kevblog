var grid = new Muuri('.HomeGrid', {dragEnabled: false, layout: {fillGaps: true}});

var filterField = document.querySelector('.filter-field');
filterField.addEventListener('change', filter);

function filter() {
  grid.filter(function (item) {
    var element = item.getElement();
    var isFilterMatch = filterField.value == "" ? true : (element.getAttribute('data-category').includes(filterField.value))
  
    return isFilterMatch;
  
  });
}

function DropDown(el) {
    this.dd = el;
    this.initEvents();
}

DropDown.prototype = {
  initEvents : function() {
      var obj = this;

      obj.dd.on('click', function(event){
          $(this).toggleClass('active');
          event.stopPropagation();
      }); 
  }
}
