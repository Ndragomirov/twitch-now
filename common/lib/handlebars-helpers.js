Handlebars.registerHelper('h-checked', function (input, parent){
  var v = input && parent ?
    input.id === parent.value :
    this.value;
  return  v ? 'checked' : '';
});

Handlebars.registerHelper('h-num-format', function (v){
  return v ? v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : '';
})

Handlebars.registerHelper('h-prettydate', function (v){
  return humaneDate(v);
});

Handlebars.registerHelper('h-enc', function (v){
  return encodeURIComponent(v);
});

Handlebars.registerHelper('h-selected', function (t, ctx){
  return ctx.value === t.id ? 'selected' : '';
});

Handlebars.registerHelper('h-disabled', function (t, parent){
  var v = t.type ? t.enabled : parent && parent.enabled;
  return v ? '' : 'disabled';
});