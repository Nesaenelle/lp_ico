function isScrolledIntoView(elem, offsetVal) {
    var docViewTop = window.pageYOffset;
    var docViewBottom = docViewTop + window.innerHeight;
    var elemTop = offset(elem).top;
    var elemBottom = elemTop + elem.clientHeight;
    return docViewTop >= elemTop - (offsetVal || 200) /*- window.innerHeight*/ ; // /((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

function offset(el) {
    var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

function isInViewport(el) {
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;

    while (el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
        left += el.offsetLeft;
    }

    return (
        top < (window.pageYOffset + window.innerHeight) &&
        left < (window.pageXOffset + window.innerWidth) &&
        (top + height) > window.pageYOffset &&
        (left + width) > window.pageXOffset
    );
};

(function() {
    var tabs = document.querySelectorAll('[data-navigation]');

    window.addEventListener('scroll', function() {
        tabs.forEach(function(elem) {
            // if (isInViewport(elem)) {
            if (isScrolledIntoView(elem)) {
                var id = elem.getAttribute('data-navigation');

                var links = document.querySelectorAll('[data-navigation-link');
                links.forEach(function(link) {
                    if (link.getAttribute('data-navigation-link') === id) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, false);


    var body = $("html, body");

    $('[data-navigation-link]').on('click', function(e) {
        e.preventDefault();
        var id = this.getAttribute('data-navigation-link');
        var elem = document.querySelector('[data-navigation="' + id + '"]');
        var topOffset = this.getAttribute('data-navigation-offset') || 200;
        if (elem) {
            console.log(offset(elem).top - topOffset);
            body.stop().animate({ scrollTop: offset(elem).top - topOffset }, 500);
        }

    });
}());


// $("html").easeScroll();


(function() {

    var popupBtn = document.querySelectorAll('.js-popup');
    var modalOverlay = document.querySelector('#modal-overlay');
    var closeBtns = document.querySelectorAll('.js-close-modal');
    var activeModal;
    if (popupBtn.length) {
        popupBtn.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                var id = e.currentTarget.getAttribute('data-modal');
                e.stopPropagation();
                openModal(id);
            });
        });
    }

    if (closeBtns.length) {
        closeBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                activeModal.classList.remove('opened');
                modalOverlay.classList.remove('opened');
            });
        });
    }

    window.addEventListener('click', function(e) {
        if (activeModal && !activeModal.querySelector('.modal-body').contains(e.target)) {
            activeModal.classList.remove('opened');
            modalOverlay.classList.remove('opened')
        }
    }, false);


    function closeModal(e) {
        if (activeModal) {
            activeModal.classList.remove('opened');
            modalOverlay.classList.remove('opened');
        }
    }

    function openModal(id) {
        closeModal();
        modalOverlay.classList.add('opened');
        activeModal = document.querySelector('.modal[data-modal="' + id + '"]');
        activeModal.classList.add('opened');
    }

// }());


// (function() {
    document.querySelectorAll('.js-email-form').forEach(function(form) {
        var messageElem = document.createElement('div');
        var input = form.querySelector('input');
        // var pattern = new RegExp(input.getAttribute('pattern'), 'ig');
        var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        form.onsubmit = function(e) {
            e.preventDefault();
            input.focus();
            InvalidMsg();

            if (pattern.test(input.value)) { 
                openModal('thank-you');
            }
        };

        input.oninput = function() {
            InvalidMsg();
        };

        function InvalidMsg() {
            if (pattern.test(input.value)) {
                input.classList.add('valid');
                input.classList.remove('invalid');
                messageElem.className = 'input-msg valid';
                messageElem.innerHTML = 'This is correct email';
                input.parentNode.appendChild(messageElem);
            } else {
                input.classList.add('invalid');
                input.classList.remove('valid');
                messageElem.className = 'input-msg invalid';
                messageElem.innerHTML = 'Enter the correct email';
                input.parentNode.appendChild(messageElem);

            }
            // return true;
        }
    });


    document.querySelector('#sign-in-form').addEventListener('submit', function(e) {
        e.preventDefault();

    }, false);

    document.querySelector('#sign-up-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
    }, false);
}());


(function() {
    var burger = document.querySelector('[data-burger]');
    var menuContainer = document.querySelector('.dropdown-menu');
    var closeBtn = document.querySelector('.dropdown-menu__close');

    burger.addEventListener('click', function(e) {
        e.stopPropagation();
        if (burger.classList.contains('active')) {
            burger.classList.remove('active');
        } else {
            burger.classList.add('active');
        }

    }, false);

    closeBtn.addEventListener('click', function(e) { 
        burger.classList.remove('active');
    });

    window.addEventListener('click', function(e) {
        if (!menuContainer.contains(e.target)) {
            burger.classList.remove('active');
        }
    }, false);

}());