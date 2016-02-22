$(document).ready(function() {
    function topBar(message) {
        $("<div />", { class: 'geekinc', text: message }).hide().prependTo(".notification")
        .slideDown('fast').delay(10000).slideUp(function() { $(this).remove(); });
    }
    var i = 0;
    $("button").click(function() {
        topBar("Test Message " + i++);
    });
});
