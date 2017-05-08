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
var sound = new Audio(myApp.sdk.path + 'sound-beer-pour.mp3');
var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
sound.currentTime = iOS ? 4 : 2;

function id(str) {
    return document.getElementById(str).style;
}

function startAnimation() {
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

    if(iOS) {
        document.getElementById('first-screen').addEventListener('click', pour);
    }


    function pour() {
        if (!start) {
            myApp.sdk.tracker('E', 'pour', 'pour');

            start = true;
            sound.currentTime = iOS ? 4 : 2;
            sound.play();
            id("glass-full").clip = phone ? 'rect(0, 90px, 213px, 0)' : 'rect(0, 180px, 426px, 0)';
            var np = id("nozzle-pour");
            np.height = phone ? '139px' : '309px';
            hi.display = '';
            st.transition = 'opacity 2s';
            st.opacity = 0;

            setTimeout(function () {
                np.clip = phone ? 'rect(0, 75px, 139px, 0)' : 'rect(0, 152px, 309px, 0)';
                np.transitionProperty = 'clip';
                np.transitionDuration = '1.8s';

                requestAnimationFrame(function () {
                    np.clip = phone ? 'rect(139px, 75px, 139px, 0)' : 'rect(309px, 152px, 309px, 0)';
                });
            }, 2700);

            var es = id("end-screen");
            var ei = id("end-image");
            ei.display = 'block';
            es.display = 'block';

            setTimeout(function () {
                ei.opacity = 1;
                es.left = '0';
                es.opacity = 1;
                document.getElementById("end-image").onclick = function () {
                    myApp.sdk.linkOpener('http://www.carlsberg.com');
                    myApp.sdk.tracker('CTR', 'landing', 'landing');
                }
                document.getElementById("end-screen").onclick = function () {
                    myApp.sdk.linkOpener('http://www.carlsberg.com');
                    myApp.sdk.tracker('CTR', 'landing', 'landing');
                }
            }, 6200);
        }}

}