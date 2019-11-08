function splash(){
    $('.splash p').text('');
    $('.splash .loading-wrapper').delay(300).queue(function (next) {
            $('meta[name="theme-color"]').prop('content',  cssVar.getPropertyValue('--theme_back'));
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
    },2000);
}

        