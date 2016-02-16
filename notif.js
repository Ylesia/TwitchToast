$(document).ready(function() {
    function topBar(message) {
        $("<div />", { class: 'success', text: message }).hide().prependTo("#noti")
        .slideDown('fast').delay(10000).slideUp(function() { $(this).remove(); });
    }
    var i = 0;
    $("button").click(function() {
        topBar("Test Message " + i++);
    });
});
