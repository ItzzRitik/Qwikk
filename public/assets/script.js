function splash(){
    $('.splash p').text('');
    $('.splash .loading-wrapper').delay(300).queue(function (next) {
            //$('meta[name="theme-color"]').prop('content',  cssVar.getPropertyValue('--theme_back'));
            $(this).css("animation","splashwrapper 0.8s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275)");
        });
    $('.splash #loading-content').css("animation","splashcontent 0.8s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275)");
    $('.splash .splashlogo').css("animation","splashlogo 0.8s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275)");
    setTimeout(function(){
        $('.splash').remove();
    }, 1100);
}

window.onload = function(){
    setTimeout(function(){
        splash();
    },000);
}
function copyToClipboard(text) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
}

$('.url').on('keypress', function (e) {
    if((e.type == "keypress" && (event.keyCode ? event.keyCode : event.which) == '13')) $('.qwikk').click();
});
$('.qwikk').on('click', function (e) {
    const http = new XMLHttpRequest();
        http.open('POST', '/qwikk');
        http.setRequestHeader('Content-type', 'application/json');
        http.onreadystatechange=function(e) {
            if (http.readyState == XMLHttpRequest.DONE){   
                let res = http.responseText;
                copyToClipboard(res);
                console.log(res)
            } 
        }
        http.send(JSON.stringify({
            url: $('.url').val()
        }));
});

        