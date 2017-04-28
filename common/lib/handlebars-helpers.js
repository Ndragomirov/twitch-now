function formatDuration(s){
  s = parseInt(s, 10);

  if ( isNaN(s) ) return '';

  var fm = [
    Math.floor(s / 60 / 60 / 24),
    Math.floor(s / 60 / 60) % 24,
    Math.floor(s / 60) % 60,
    s % 60
  ];

  return fm.map(function (v, i){
    return ((v < 10) ? '0' : '') + v;
  }).join(':').replace(/^(00:)*/, "").replace(/^0(\d)/, '$1')
}

Handlebars.registerHelper('h-checked', function (input, parent){
  var v = false;

  if ( input && !parent.type ) {
    v = input.value;
  }
  else if ( input && parent.type ) {
    if ( Array.isArray(parent.value) ) {
      v = parent.value.indexOf(input.id) > -1;
    } else {
      v = input.id === parent.value;
    }
  }
  return v ? 'checked' : '';
});

Handlebars.registerHelper('h-checked-2', function (context, block){
  return context == 1 ? 'checked' : '';
});

Handlebars.registerHelper('h-num-format', function (v){
  return isNaN(v) ? '' : v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
})

Handlebars.registerHelper('h-uptime', function (v){
  return formatDuration(Math.round((new Date() - new Date(v).valueOf() ) / 1000));
})

Handlebars.registerHelper('h-date-format', function (s){
  return formatDuration(s);
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