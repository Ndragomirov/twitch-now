Handlebars.registerHelper('h-checked', function (input, parent){
  var v = input && parent ?
    input.id === parent.value :
    this.value;
  return  v ? 'checked' : '';
});

Handlebars.registerHelper('h-prettydate', function (v){
  return humaneDate(v);
});

Handlebars.registerHelper('h-enc', function (v){
  return encodeURIComponent(v);
});

Handlebars.registerHelper('h-selected', function (t, ctx){
  return ctx.value === t.id ? 'selected' : '';
});

Handlebars.registerHelper('h-disabled', function (t, ctx){
  return t.enabled ? 'true' : 'false';
});