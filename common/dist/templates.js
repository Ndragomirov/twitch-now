this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};

this["Handlebars"]["templates"]["contextgamemenu.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"context-row\">__MSG_m70__</div>\n";
  });

this["Handlebars"]["templates"]["contextstreammenu.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "\n<div class=\"context-row js-follow\">__MSG_m22__</div>\n<div class=\"context-row js-unfollow\">__MSG_m23__</div>\n";
  }

  buffer += "<div class=\"context-row js-open-stream\" data-type=\"newlayout\">__MSG_m71__</div>\n<div class=\"context-row js-open-stream\" data-type=\"popout\">__MSG_m17__</div>\n<div class=\"context-row js-open-chat\">__MSG_m20__</div>\n<div class=\"context-row\" data-route=\"videos/"
    + escapeExpression((helper = helpers['h-enc'] || (depth0 && depth0['h-enc']),options={hash:{},data:data},helper ? helper.call(depth0, ((stack1 = (depth0 && depth0.channel)),stack1 == null || stack1 === false ? stack1 : stack1.name), options) : helperMissing.call(depth0, "h-enc", ((stack1 = (depth0 && depth0.channel)),stack1 == null || stack1 === false ? stack1 : stack1.name), options)))
    + "\">__MSG_m21__</div>\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.authorized), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
  });

this["Handlebars"]["templates"]["contributor.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"contributor js-tab tip\" title=\"";
  if (helper = helpers.login) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.login); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-href=\"";
  if (helper = helpers.html_url) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.html_url); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n    <img class=\"user-avatar lazy\"\n         alt=\"\"\n         src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\"\n         data-original=\"";
  if (helper = helpers.avatar_url) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.avatar_url); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "s=140\"/>\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["control.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<div class=\"control\">\n    <label>\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.range), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.radio), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.button), {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.checkbox), {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.select), {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.text), {hash:{},inverse:self.noop,fn:self.program(14, program14, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </label>\n</div>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n        <div class=\"control-desc\">";
  if (helper = helpers.desc) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.desc); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n        <div class=\"control-wrapper\">\n            <input data-type=";
  if (helper = helpers.type) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.type); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " data-id=";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " type=\"range\" value=\"";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" min=\"";
  if (helper = helpers.min) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.min); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" max=\"";
  if (helper = helpers.max) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.max); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n\n            <div class=\"range-helper\">\n                <span class=\"range-helper-value\"> ";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " </span> <span>";
  if (helper = helpers.tip) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tip); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n            </div>\n        </div>\n        ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n        <div class=\"control-desc\">";
  if (helper = helpers.desc) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.desc); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n        <div class=\"control-wrapper\">\n            ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.opts), {hash:{},inverse:self.noop,fn:self.programWithDepth(5, program5, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </div>\n        ";
  return buffer;
  }
function program5(depth0,data,depth1) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n            <input data-type=\""
    + escapeExpression(((stack1 = (depth1 && depth1.type)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-id="
    + escapeExpression(((stack1 = (depth1 && depth1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " name=\""
    + escapeExpression(((stack1 = (depth1 && depth1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" type=\"radio\"\n                   value=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" "
    + escapeExpression((helper = helpers['h-checked'] || (depth0 && depth0['h-checked']),options={hash:{},data:data},helper ? helper.call(depth0, depth0, depth1, options) : helperMissing.call(depth0, "h-checked", depth0, depth1, options)))
    + ">\n\n            <label for=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n                <span></span>\n                <div class=\"radio-tip\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n            </label>\n            <br/>\n            ";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n        <div class=\"control-wrapper\">\n            <input data-type=";
  if (helper = helpers.type) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.type); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " data-id=";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " class=\"tviggr-dark-btn\" type=\"button\" value=\"";
  if (helper = helpers.desc) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.desc); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n        </div>\n        ";
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n        <div class=\"control-wrapper\">\n            <!--id нужен для связывания label и checkbox при нажатии -->\n            <input type=\"checkbox\" id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-type=";
  if (helper = helpers.type) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.type); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " data-id=";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers['h-checked']) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0['h-checked']); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " />\n            <label for=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n                <span></span>\n\n                <div class=\"control-desc\">";
  if (helper = helpers.desc) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.desc); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n            </label>\n        </div>\n        ";
  return buffer;
  }

function program11(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n        <div class=\"control-desc\">";
  if (helper = helpers.desc) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.desc); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n        <div class=\"control-wrapper\">\n            <select data-type=";
  if (helper = helpers.type) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.type); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " data-id=";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ">\n                ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.opts), {hash:{},inverse:self.noop,fn:self.programWithDepth(12, program12, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            </select>\n\n        </div>\n        ";
  return buffer;
  }
function program12(depth0,data,depth1) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n                <option value=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"\n                "
    + escapeExpression((helper = helpers['h-selected'] || (depth0 && depth0['h-selected']),options={hash:{},data:data},helper ? helper.call(depth0, depth0, depth1, options) : helperMissing.call(depth0, "h-selected", depth0, depth1, options)))
    + " >";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n                ";
  return buffer;
  }

function program14(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n        <div class=\"control-desc\">";
  if (helper = helpers.desc) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.desc); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n        <div class=\"control-wrapper\">\n            <input data-type=";
  if (helper = helpers.type) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.type); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " data-id=";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " type=\"text\" value=\"";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n        </div>\n        ";
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, (depth0 && depth0.show), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });

this["Handlebars"]["templates"]["donation.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"donation\">\n    <img class=\"user-avatar lazy\"\n         src=\"http://www.gravatar.com/avatar/";
  if (helper = helpers.avatar) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.avatar); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"\n         alt=\"\">\n    <span> ";
  if (helper = helpers.L_NAME) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.L_NAME); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers.L_AMT) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.L_AMT); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers.L_CURRENCYCODE) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.L_CURRENCYCODE); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " </span>\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["game.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function";


  buffer += "<div class=\"stream\" data-route=\"browse/"
    + escapeExpression((helper = helpers['h-enc'] || (depth0 && depth0['h-enc']),options={hash:{},data:data},helper ? helper.call(depth0, ((stack1 = (depth0 && depth0.game)),stack1 == null || stack1 === false ? stack1 : stack1.name), options) : helperMissing.call(depth0, "h-enc", ((stack1 = (depth0 && depth0.game)),stack1 == null || stack1 === false ? stack1 : stack1.name), options)))
    + "/streams\">\n    <div class=\"stream-preview game-preview\">\n        <img alt=\"\" class=\"lazy\" data-original=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.game)),stack1 == null || stack1 === false ? stack1 : stack1.box)),stack1 == null || stack1 === false ? stack1 : stack1.medium)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\n    </div>\n    <span class=\"stream-info stream-title\">\n            "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.game)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </span>\n    <span class=\"stream-info\">\n            ";
  if (helper = helpers.viewers) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.viewers); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " __MSG_m45__\n        </span>\n    <span class=\"stream-info\">\n            ";
  if (helper = helpers.channels) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.channels); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " __MSG_m46__\n    </span>\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["gameextended.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<div class=\"game-preview\">\n    <img src=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.game)),stack1 == null || stack1 === false ? stack1 : stack1.box)),stack1 == null || stack1 === false ? stack1 : stack1.medium)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\"/>\n</div>\n<span class=\"stream-info stream-title\">\n            "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.game)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </span>\n<span class=\"stream-info\">\n            ";
  if (helper = helpers.viewers) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.viewers); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " __MSG_m45__\n        </span>\n<span class=\"stream-info\">\n            ";
  if (helper = helpers.channels) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.channels); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " __MSG_m46__\n    </span>\n<span class=\"buttons\">\n<span class=\"button\" data-route=\"browse/"
    + escapeExpression((helper = helpers['h-enc'] || (depth0 && depth0['h-enc']),options={hash:{},data:data},helper ? helper.call(depth0, ((stack1 = (depth0 && depth0.game)),stack1 == null || stack1 === false ? stack1 : stack1.name), options) : helperMissing.call(depth0, "h-enc", ((stack1 = (depth0 && depth0.game)),stack1 == null || stack1 === false ? stack1 : stack1.name), options)))
    + "/streams\">\n    <img src=\"../css/img/cam.png\" alt=\"\"/>\n    <span>streams</span>\n    <div class=\"indicator\"></div>\n</span>\n<span class=\"button\" data-route=\"browse/"
    + escapeExpression((helper = helpers['h-enc'] || (depth0 && depth0['h-enc']),options={hash:{},data:data},helper ? helper.call(depth0, ((stack1 = (depth0 && depth0.game)),stack1 == null || stack1 === false ? stack1 : stack1.name), options) : helperMissing.call(depth0, "h-enc", ((stack1 = (depth0 && depth0.game)),stack1 == null || stack1 === false ? stack1 : stack1.name), options)))
    + "/videos\">\n    <img src=\"../css/img/play.png\" alt=\"\"/>\n    <span>__MSG_m21__</span>\n    <div class=\"indicator\"></div>\n</span>\n</span>";
  return buffer;
  });

this["Handlebars"]["templates"]["notification.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n    And ";
  if (helper = helpers.more) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.more); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " more are live now\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n    ";
  if (helper = helpers.live) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.live); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n    ";
  return buffer;
  }

  buffer += "<div>\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.more), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n";
  return buffer;
  });

this["Handlebars"]["templates"]["notificationstream.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"stream\">\n    "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.channel)),stack1 == null || stack1 === false ? stack1 : stack1.display_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["screenmessage.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"screen-msg\">\n    ";
  if (helper = helpers.text) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.text); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["stream.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"stream\">\n    <div class=\"stream-preview\">\n        <img class=\"lazy\" alt=\"\" data-original=\"";
  if (helper = helpers.preview) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.preview); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"/>\n    </div>\n    <span class=\"stream-info stream-title\">\n            "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.channel)),stack1 == null || stack1 === false ? stack1 : stack1.display_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </span>\n    <span class=\"stream-info stream-info-viewers\">\n            ";
  if (helper = helpers.game) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.game); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " - ";
  if (helper = helpers.viewers) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.viewers); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " __MSG_m45__\n        </span>\n    <span class=\"stream-info stream-info-status\" title=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.channel)),stack1 == null || stack1 === false ? stack1 : stack1.status)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " \">\n            "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.channel)),stack1 == null || stack1 === false ? stack1 : stack1.status)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n        </span>\n</div>\n";
  return buffer;
  });

this["Handlebars"]["templates"]["user.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n<a class=\"btn logout-btn\" title=\"__MSG_m53__\" id=\"logout-btn\"><i class=\"icon-off\"></i></a>\n<div class=\"user-panel\">\n    <img class=\"lazy\" alt=\"\" src=\"";
  if (helper = helpers.logo) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.logo); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"/>\n    <span title=\"__MSG_m72__\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n</div>\n";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\n<a class=\"btn\" title=\"__MSG_m52__\" id=\"login-btn\">__MSG_m52__</a>\n";
  }

  stack1 = helpers['if'].call(depth0, (depth0 && depth0.authenticated), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });

this["Handlebars"]["templates"]["video.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<div class=\"stream js-tab\" data-href=\"";
  if (helper = helpers.url) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.url); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n    <div class=\"stream-preview\">\n        <img alt=\"\" class=\"lazy\" data-original=\"";
  if (helper = helpers.preview) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.preview); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"/>\n    </div>\n    <span class=\"stream-info stream-title\">\n            ";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n    </span>\n\n    <span class=\"stream-info\">\n            "
    + escapeExpression((helper = helpers['h-prettydate'] || (depth0 && depth0['h-prettydate']),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.recorded_at), options) : helperMissing.call(depth0, "h-prettydate", (depth0 && depth0.recorded_at), options)))
    + "\n    </span>\n\n    <span class=\"stream-info\">\n            ";
  if (helper = helpers.length) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.length); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " __MSG_m47__\n    </span>\n</div>";
  return buffer;
  });