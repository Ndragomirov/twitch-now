this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};

this["Handlebars"]["templates"]["contextgamemenu.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<div class=\"context-row\">__MSG_m70__</div>\n";
  });

this["Handlebars"]["templates"]["contextstreammenu.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "\n<div class=\"context-row js-follow\">__MSG_m22__</div>\n<div class=\"context-row js-unfollow\">__MSG_m23__</div>\n";
  }

  buffer += "<div class=\"context-row js-open-stream\" data-type=\"newlayout\">__MSG_m16__</div>\n<div class=\"context-row js-open-stream\" data-type=\"oldlayout\">__MSG_m15__</div>\n<div class=\"context-row js-open-stream\" data-type=\"popout\">__MSG_m17__</div>\n<!--<div class=\"context-row js-notify\">notify</div>-->\n<div class=\"context-row js-open-chat\">__MSG_m20__</div>\n<div class=\"context-row\" data-route=\"videos/";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['h-enc']),stack1 ? stack1.call(depth0, ((stack1 = depth0.channel),stack1 == null || stack1 === false ? stack1 : stack1.name), options) : helperMissing.call(depth0, "h-enc", ((stack1 = depth0.channel),stack1 == null || stack1 === false ? stack1 : stack1.name), options)))
    + "\">__MSG_m21__</div>\n";
  stack2 = helpers['if'].call(depth0, depth0.authorized, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  return buffer;
  });

this["Handlebars"]["templates"]["contributor.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"contributor js-tab\" data-href=\"";
  if (stack1 = helpers.html_url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.html_url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    <img class=\"contributor-avatar lazy tip\"\n         title=\"";
  if (stack1 = helpers.login) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.login; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"\n         data-original=\"";
  if (stack1 = helpers.avatar_url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.avatar_url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"\n         alt=\"";
  if (stack1 = helpers.login) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.login; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["control.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<div class=\"control\">\n    <label>\n        ";
  stack1 = helpers['if'].call(depth0, depth0.range, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n        ";
  stack1 = helpers['if'].call(depth0, depth0.radio, {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n        ";
  stack1 = helpers['if'].call(depth0, depth0.button, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n        ";
  stack1 = helpers['if'].call(depth0, depth0.checkbox, {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n        ";
  stack1 = helpers['if'].call(depth0, depth0.select, {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n        ";
  stack1 = helpers['if'].call(depth0, depth0.text, {hash:{},inverse:self.noop,fn:self.program(14, program14, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </label>\n</div>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <div class=\"control-desc\">";
  if (stack1 = helpers.desc) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.desc; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n        <div class=\"control-wrapper\">\n            <input data-type=";
  if (stack1 = helpers.type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.type; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " data-id=";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " type=\"range\" value=\"";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" min=\"";
  if (stack1 = helpers.min) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.min; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" max=\"";
  if (stack1 = helpers.max) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.max; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n\n            <div class=\"range-helper\">\n                <span class=\"range-helper-value\"> ";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " </span> <span>";
  if (stack1 = helpers.tip) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.tip; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n            </div>\n        </div>\n        ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <div class=\"control-desc\">";
  if (stack1 = helpers.desc) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.desc; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n        <div class=\"control-wrapper\">\n            ";
  stack1 = helpers.each.call(depth0, depth0.opts, {hash:{},inverse:self.noop,fn:self.programWithDepth(program5, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </div>\n        ";
  return buffer;
  }
function program5(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\n            <input data-type=\""
    + escapeExpression(((stack1 = depth1.type),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" id=\"";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" data-id="
    + escapeExpression(((stack1 = depth1.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " name=\""
    + escapeExpression(((stack1 = depth1.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" type=\"radio\"\n                   value=\"";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['h-checked']),stack1 ? stack1.call(depth0, depth0, depth1, options) : helperMissing.call(depth0, "h-checked", depth0, depth1, options)))
    + ">\n\n            <label for=\"";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\n                <span></span>\n                <div class=\"radio-tip\">";
  if (stack2 = helpers.name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.name; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</div>\n            </label>\n            <br/>\n            ";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <div class=\"control-wrapper\">\n            <input data-type=";
  if (stack1 = helpers.type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.type; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " data-id=";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " class=\"tviggr-dark-btn\" type=\"button\" value=\"";
  if (stack1 = helpers.desc) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.desc; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n        </div>\n        ";
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <div class=\"control-wrapper\">\n            <!--id нужен для связывания label и checkbox при нажатии -->\n            <input type=\"checkbox\" id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-type=";
  if (stack1 = helpers.type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.type; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " data-id=";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  if (stack1 = helpers['h-checked']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0['h-checked']; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " />\n            <label for=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n                <span></span>\n\n                <div class=\"control-desc\">";
  if (stack1 = helpers.desc) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.desc; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n            </label>\n        </div>\n        ";
  return buffer;
  }

function program11(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <div class=\"control-desc\">";
  if (stack1 = helpers.desc) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.desc; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n        <div class=\"control-wrapper\">\n            <select data-type=";
  if (stack1 = helpers.type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.type; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " data-id=";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ">\n                ";
  stack1 = helpers.each.call(depth0, depth0.opts, {hash:{},inverse:self.noop,fn:self.programWithDepth(program12, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            </select>\n\n        </div>\n        ";
  return buffer;
  }
function program12(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\n                <option value=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"\n                ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['h-selected']),stack1 ? stack1.call(depth0, depth0, depth1, options) : helperMissing.call(depth0, "h-selected", depth0, depth1, options)))
    + " >";
  if (stack2 = helpers.name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.name; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</option>\n                ";
  return buffer;
  }

function program14(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <div class=\"control-desc\">";
  if (stack1 = helpers.desc) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.desc; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n        <div class=\"control-wrapper\">\n            <input data-type=";
  if (stack1 = helpers.type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.type; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " data-id=";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " type=\"text\" value=\"";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n        </div>\n        ";
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, depth0.show, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });

this["Handlebars"]["templates"]["game.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function";


  buffer += "<div class=\"stream\" data-route=\"browse/";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['h-enc']),stack1 ? stack1.call(depth0, ((stack1 = depth0.game),stack1 == null || stack1 === false ? stack1 : stack1.name), options) : helperMissing.call(depth0, "h-enc", ((stack1 = depth0.game),stack1 == null || stack1 === false ? stack1 : stack1.name), options)))
    + "\">\n    <div class=\"stream-preview game-preview\">\n        <img class=\"lazy\" data-original=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.game),stack1 == null || stack1 === false ? stack1 : stack1.logo)),stack1 == null || stack1 === false ? stack1 : stack1.medium)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\n    </div>\n    <span class=\"stream-info stream-title\">\n            "
    + escapeExpression(((stack1 = ((stack1 = depth0.game),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </span>\n    <span class=\"stream-info\">\n            ";
  if (stack2 = helpers.viewers) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.viewers; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + " __MSG_m45__\n        </span>\n    <span class=\"stream-info\">\n            ";
  if (stack2 = helpers.channels) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.channels; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + " __MSG_m46__\n    </span>\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["notification.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    And ";
  if (stack1 = helpers.more) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.more; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " more are live now\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
  if (stack1 = helpers.live) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.live; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n    ";
  return buffer;
  }

  buffer += "<div>\n    ";
  stack1 = helpers['if'].call(depth0, depth0.more, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n";
  return buffer;
  });

this["Handlebars"]["templates"]["notificationstream.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"stream\">\n    "
    + escapeExpression(((stack1 = ((stack1 = depth0.channel),stack1 == null || stack1 === false ? stack1 : stack1.display_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["screenmessage.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"error-msg\">\n    ";
  if (stack1 = helpers.text) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.text; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["stream.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"stream\">\n    <div class=\"stream-preview\">\n        <img class=\"lazy\" data-original=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.preview),stack1 == null || stack1 === false ? stack1 : stack1.small)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\n    </div>\n    <span class=\"stream-info stream-title\">\n            "
    + escapeExpression(((stack1 = ((stack1 = depth0.channel),stack1 == null || stack1 === false ? stack1 : stack1.display_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </span>\n    <span class=\"stream-info stream-info-viewers\">\n            ";
  if (stack2 = helpers.game) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.game; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + " - ";
  if (stack2 = helpers.viewers) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.viewers; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + " __MSG_m45__\n        </span>\n    <span class=\"stream-info stream-info-status\" title=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.channel),stack1 == null || stack1 === false ? stack1 : stack1.status)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " \">\n            "
    + escapeExpression(((stack1 = ((stack1 = depth0.channel),stack1 == null || stack1 === false ? stack1 : stack1.status)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n        </span>\n</div>\n";
  return buffer;
  });

this["Handlebars"]["templates"]["user.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var stack1, self=this;

function program1(depth0,data) {
  
  
  return "\n<a class=\"btn\" id=\"logout-btn\">__MSG_m53__</a>\n";
  }

function program3(depth0,data) {
  
  
  return "\n<a class=\"btn\" id=\"login-btn\">__MSG_m52__</a>\n";
  }

  stack1 = helpers['if'].call(depth0, depth0.authenticated, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });

this["Handlebars"]["templates"]["video.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<div class=\"stream js-tab\" data-href=\"";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    <div class=\"stream-preview game-preview\">\n        <img class=\"lazy\" data-original=\"";
  if (stack1 = helpers.preview) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.preview; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"/>\n    </div>\n    <span class=\"stream-info stream-title\">\n            ";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n    </span>\n\n    <span class=\"stream-info\">\n            ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['h-prettydate']),stack1 ? stack1.call(depth0, depth0.recorded_at, options) : helperMissing.call(depth0, "h-prettydate", depth0.recorded_at, options)))
    + "\n    </span>\n\n    <span class=\"stream-info\">\n            ";
  if (stack2 = helpers.length) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.length; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + " __MSG_m47__\n    </span>\n</div>";
  return buffer;
  });