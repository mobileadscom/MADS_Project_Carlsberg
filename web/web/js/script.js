var filesLists = [
        ['first-screen.png'],
        ['glass-empty.png', 'nozzle-empty.png', 'swipe-totap.png'],
        ['nozzle-pour.png', 'glass-full.png', 'hand-icon.png', 'end-image.png', 'end-screen.png']
    ],
    listsCount = filesLists.length;

var phone = window.innerWidth <= 760;
var dir = phone ? myApp.sdk.path + 'phone/' : myApp.sdk.path + 'tablet/';



function imgToCamelCase(source) {
    return source.substr(0, source.indexOf('.'));
}

function loadImages(list) {
    var loadedCount = 0,
        sources = filesLists[list];

    for (var i = 0, sourcesCount = sources.length; i < sourcesCount; i++) {
        var image = new Image();
        image.onload = function () {
            loadedCount++;
            if (loadedCount === sourcesCount && list < listsCount) {
                for (var j = 0; j < sourcesCount; j++) {
                    var el = id(imgToCamelCase(sources[j]));
                    if (el) {
                        el.backgroundImage = "url("+dir+sources[j]+")";
                    }
                }

                if (list === 1) {
                    startAnimation();
                }

                list++;
                if (list < listsCount) {
                    loadImages(list);
                }
            }
        };
        image.src = dir + sources[i];
    }
}


loadImages(0);

//////////////////////////////////////////////
var sound = new Audio(myApp.sdk.path + 'js/sound-beer-pour.m4a');

function id(str) {
    return document.getElementById(str).style;
}

function startAnimation() {
    sound.currentTime = 2;
    var start = false,
        ge = id("glass-empty"),
        ne = id("nozzle-empty"),
        st = id("swipe-totap"),
        hi = id("hand-icon");

    ge.display = 'block';
    ne.display = 'block';
    st.display = 'block';

    setTimeout(function () {
        ge.opacity = 1;
        ne.opacity = 1;
        st.opacity = 1;
    }, 30);
    setTimeout(function () {
        if (!start) {
            hi.display = 'block';
        }
    }, 3200);

    window.addEventListener('touchend', pour);
    window.addEventListener('mouseup', pour);

    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if(iOS) {
        window.addEventListener('click', function () {
            setTimeout(function () {
                pour();
            }, 500)
        })
    }

    function pour() {
        if (!start) {
            start = true;
            sound.play();
            id("glass-full").height = phone ? '213px' : '426px';
            var np = id("nozzle-pour");
            np.height = phone ? '139px' : '309px';
            hi.display = '';
            st.transition = 'opacity 2s';
            st.opacity = 0;

            setTimeout(function () {
                np.position = 'absolute';
                np.bottom = phone ? '-35%' : '-48%';
                np.backgroundPosition = 'bottom';
                np.transitionDuration = '1.6s';

                np.height = 0;
            }, 2700);

            var es = id("end-screen");
            var ei = id("end-image");
            ei.display = 'block';
            es.display = 'block';

            setTimeout(function () {
                ei.opacity = 1;
                es.top = '0';
                document.getElementById("end-image").onclick = function () {
                    myApp.sdk.linkOpener('http://www.carlsberg.com');
                }
                document.getElementById("end-screen").onclick = function () {
                    myApp.sdk.linkOpener('http://www.carlsberg.com');
                }
            }, 6200);
        }}

}