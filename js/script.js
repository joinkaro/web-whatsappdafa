(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    // ====== SLIDER ======
    var inner = document.getElementById('sliderInner');
    var dotsWrap = document.getElementById('sliderDots');
    if (!inner || !dotsWrap) return;

    var slides = inner.querySelectorAll('.s-slide');
    var count = slides.length;
    if (count === 0) return;

    // Dynamically generate dots to match slide count
    dotsWrap.innerHTML = '';
    for (var i = 0; i < count; i++) {
      var dot = document.createElement('span');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dotsWrap.appendChild(dot);
    }

    var dots = dotsWrap.querySelectorAll('.dot');

    // Clone first and last slides for seamless infinite loop
    var firstClone = slides[0].cloneNode(true);
    var lastClone = slides[count - 1].cloneNode(true);
    
    inner.appendChild(firstClone);
    inner.insertBefore(lastClone, slides[0]);

    var idx = 0; // Virtual index (0 to count - 1)
    var timer;
    var isTransitioning = false;

    // Set initial position to show the first actual slide (offset by the lastClone)
    inner.style.transition = 'none';
    inner.style.transform = 'translateX(-100%)';
    inner.offsetHeight; // Force reflow
    inner.style.transition = 'transform 0.6s ease';

    function updateDots(activeIdx) {
      var dotIdx = (activeIdx + count) % count;
      for (var j = 0; j < dots.length; j++) {
        dots[j].classList.toggle('active', j === dotIdx);
      }
    }

    function go(i, immediate) {
      if (isTransitioning && !immediate) return;
      isTransitioning = true;
      idx = i;
      
      if (immediate) {
        inner.style.transition = 'none';
        inner.style.transform = 'translateX(-' + ((idx + 1) * 100) + '%)';
        updateDots(idx);
        isTransitioning = false;
      } else {
        inner.style.transition = 'transform 0.6s ease';
        inner.style.transform = 'translateX(-' + ((idx + 1) * 100) + '%)';
        updateDots(idx);
      }
    }

    inner.addEventListener('transitionend', function () {
      isTransitioning = false;
      if (idx === count) {
        inner.style.transition = 'none';
        idx = 0;
        inner.style.transform = 'translateX(-100%)';
      } else if (idx === -1) {
        inner.style.transition = 'none';
        idx = count - 1;
        inner.style.transform = 'translateX(-' + ((idx + 1) * 100) + '%)';
      }
    });

    function next() {
      if (isTransitioning) return;
      go(idx + 1);
    }

    function prev() {
      if (isTransitioning) return;
      go(idx - 1);
    }

    function start() { timer = setInterval(next, 4000); }
    function stop() { clearInterval(timer); }

    for (var d = 0; d < dots.length; d++) {
      dots[d].addEventListener('click', (function (i) {
        return function () {
          if (isTransitioning) return;
          stop();
          go(i);
          start();
        };
      })(d));
    }

    var sx = 0;
    inner.addEventListener('touchstart', function (e) {
      if (isTransitioning) return;
      sx = e.touches[0].clientX;
      stop();
    }, { passive: true });

    inner.addEventListener('touchend', function (e) {
      if (isTransitioning) return;
      var diff = sx - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          next();
        } else {
          prev();
        }
      }
      start();
    }, { passive: true });

    start();

    // ====== ROTATING TEXT ======
    var texts = document.querySelectorAll('.r-text');
    if (texts.length === 0) return;
    var ti = 0;

    setInterval(function () {
      texts[ti].classList.remove('active');
      texts[ti].classList.add('exit');
      ti = (ti + 1) % texts.length;
      setTimeout(function () {
        for (var k = 0; k < texts.length; k++) texts[k].classList.remove('exit');
        texts[ti].classList.add('active');
      }, 400);
    }, 2200);

  });
})();
