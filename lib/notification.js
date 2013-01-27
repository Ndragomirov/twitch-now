"use strict";
var b = chrome.extension.getBackgroundPage();
var ids = b.following.addedStreams;
var streams =
    b.following
        .filter(function ( stream ) {
            return ~ids.indexOf(stream.get("_id"));
        })
        .map(function ( stream ) {
            return stream.toJSON()
        });

var streamsToShow = streams.splice(0, 5);
var more = streams.length;

$('.output').html(Handlebars.templates["notification.html"]({
    streams: streamsToShow,
    more   : more,
    live   : streamsToShow.length == 1 ? "is live now" : "are live now"
}));

$('.output').on('click', '.stream', function () {
    var href = $(this).attr('data-href');
    chrome.tabs.create({ url: href });
    self.close();
});

//$(function () {
//    setTimeout(function () {
//        self.close();
//    }, 7000);
//});