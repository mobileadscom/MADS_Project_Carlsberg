var filesLists = [
        ['first-screen.png'],
        ['glass-empty.png', 'nozzle-empty.png', 'swipe-totap.png'],
        ['nozzle-pour.gif', 'glass-full.png', 'hand-icon.png', 'end-image.png', 'end-screen.png']
    ],
    listsCount = filesLists.length;

var phone = window.innerWidth <= 760;
var dir = phone ? myApp.sdk.path + 'phone_cn/' : myApp.sdk.path + 'tablet_cn/';

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
sound.oldplay = sound.play;
var drop = document.createElement('div');
sound.play = function() {
  sound.oldplay();
  var fs = document.getElementById('first-screen');
  drop.id = 'drop';
  drop.style.width = fs.clientWidth + 'px';
  drop.style.height = fs.clientHeight + 'px';
  drop.style.position = 'absolute';
  drop.style.display = 'block';
  drop.style.left = 0;
  drop.style.top = 0;
  drop.style.zIndex = 10000;
  if (!document.getElementById('drop'))
    fs.parentNode.appendChild(drop);
  setTimeout(function() {
    sound.play = function() {};
  }, 5600);
}
var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
sound.currentTime = iOS ? 4 : 2;

function id(str) {
    return document.getElementById(str).style;
}

function startAnimation() {
    sound.currentTime = iOS ? 4 : 2;
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



    var hammertime = new Hammer(document.getElementById('first-screen'));
    var swipe = new Hammer.Swipe()
    hammertime.add(swipe)
    hammertime.on('swipedown', pour);

    document.getElementById('first-screen').addEventListener('touchstart', handleTouchStart, false);
    document.getElementById('first-screen').addEventListener('touchmove', handleTouchMove, false);
    document.getElementById('first-screen').addEventListener('mousedown', handleTouchStart, false);
    document.getElementById('first-screen').addEventListener('mousemove', handleTouchMove, false);
    var xDown = null;
    var yDown = null;
    function handleTouchStart(evt) {
        xDown = evt.clientX || evt.touches[0].clientX;
        yDown = evt.clientY || evt.touches[0].clientY;

            // sound.play();
            pour();
            sound.currentTime = iOS ? 4 : 2;
            // setTimeout(function () {
            // if (!start) {
            //     sound.pause();
            // }
        // }, 1000)

    };
    function handleTouchMove(evt) {
        if ( ! xDown || ! yDown ) {
            return;
        }

        var xUp = evt.clientX || evt.touches[0].clientX;
        var yUp = evt.clientY || evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;
        if(Math.abs( xDiff )+Math.abs( yDiff )>50){ //to deal with to short swipes

        if ( Math.abs( xDiff ) <= Math.abs( yDiff ) ) {/*most significant*/
            if ( yDiff <= 0 ) {
                // sound.play();
                pour();
            }
        }
        /* reset values */
        xDown = null;
        yDown = null;
        }
    };


    document.getElementById('first-screen').addEventListener('touchend', function (){
        // sound.play();
        // setTimeout(function () {
        //     if (!start) {
        //         sound.pause();
        //     }
        // }, 1000)
        pour();
    });






    //document.getElementById('first-screen').addEventListener('touchend', pour);
    //document.getElementById('first-screen').addEventListener('mouseup', pour);

    if(iOS) {
        document.getElementById('first-screen').addEventListener('click', pour);
    }


    function pour() {


        if (!start) {
            myApp.sdk.tracker('E', 'pour', 'pour');

            start = true;
            sound.play();
            id("glass-full").clip = phone ? 'rect(0, 90px, 213px, 0)' : 'rect(0, 180px, 426px, 0)';
            var np = id("nozzle-pour");
            np.height = phone ? '230px' : '428px';
            hi.display = '';
            st.transition = 'opacity 2s';
            st.opacity = 0;
            setTimeout(function() {
              st.display = 'none';
            }, 2000);

            setTimeout(function () {
                // np.clip = phone ? 'rect(0, 75px, 117px, 0)' : 'rect(0, 152px, 309px, 0)';
                // np.transitionProperty = 'clip';
                // np.transitionDuration = '1.8s';

                np.backgroundImage = 'url(' + dir + 'nozzle-pour.png)';

                requestAnimationFrame(function () {
                   // np.clip = phone ? 'rect(117px, 75px, 117px, 0)' : 'rect(309px, 152px, 309px, 0)';
                });

                sound.play = function() {}
                drop.parentNode.removeChild(drop);

            }, 5600);

            var es = id("end-screen");
            var ei = id("end-image");
            ei.display = 'block';
            es.display = 'block';

            setTimeout(function () {
                var url = 'https://www.probablythebest.com.my/#!smooth-draught';
                ei.opacity = 1;
                es.left = '0';
                es.opacity = 1;
                document.getElementById("end-image").onclick = function () {
                    myApp.sdk.linkOpener(url);
                    myApp.sdk.tracker('CTR', 'landing', 'landing');
                };
                document.getElementById("end-screen").onclick = function () {
                    myApp.sdk.linkOpener(url);
                    myApp.sdk.tracker('CTR', 'landing', 'landing');
                }
            }, 6200);
        }}
}
