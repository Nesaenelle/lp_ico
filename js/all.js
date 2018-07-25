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


    function Form(form) {
        var self = this;
        this.controls = [];
        this.form = form;

        form.querySelectorAll('input').forEach(function(input) {
            self.controls.push(new Input(input, self));
        });

        form.onsubmit = function(e) {
            e.preventDefault();
            var focusState = false;

            self.controls.forEach(function(ctrl) {
                if (!focusState) {
                    ctrl.input.focus();
                    if (!ctrl.validate()) {
                        focusState = true;
                    }
                }
            });

            var errors = self.controls.reduce(function(a, b) {
                b = b.valid ? 0 : 1;
                return a + b;
            }, 0);

            if (errors === 0) {
                openModal('thank-you');
                self.controls.forEach(function(ctrl) {
                    ctrl.input.value = '';
                })
            }
        };
    };

    Form.prototype.validate = function() {
        this.controls.forEach(function(ctrl) {
            ctrl.validate()
        });
    };

    ////
    function Input(input, parent) {
        var self = this;
        this.parent = parent;
        this.msg = document.createElement('div');
        this.pattern = getPattern(input.getAttribute('data-pattern'));
        this.input = input;
        this.valid = false;
        this.value = input.value;
        input.oninput = function() {
            self.value = this.type === 'checkbox' ? this.checked : this.value;
            self.parent.validate();
        };
    }

    Input.prototype.validate = function() {
        if (this.input.getAttribute('data-pass-confirm')) {
            if (this.input.value === this.parent.form.querySelector('[data-pattern="password"]').value) {
                this.removeError();
            } else {
                this.addError();
            }
        } else {
            if ((this.input.type === 'text' || this.input.type === 'password') && this.pattern.test(this.input.value) || this.input.checked) {
                this.removeError();
            } else {
                this.addError();
            }
        }

        return this.valid;
    };

    Input.prototype.addError = function() {
        this.input.classList.add('invalid');
        this.input.classList.remove('valid');
        this.msg.className = 'input-msg invalid';
        this.msg.innerHTML = 'Enter the correct email';
        this.input.parentNode.appendChild(this.msg);
        this.valid = false;
    }

    Input.prototype.removeError = function() {
        this.input.classList.add('valid');
        this.input.classList.remove('invalid');
        this.msg.className = 'input-msg valid';
        this.msg.innerHTML = 'This is correct email';
        this.input.parentNode.appendChild(this.msg);
        this.valid = true;
    };

    function getPattern(o) {
        var pattern;
        switch (o) {
            case 'email':
                pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                break;

            case 'login':
                pattern = /^(?=.*[A-Za-z0-9]$)[A-Za-z][A-Za-z\d.-]{0,19}$/;
                break;

            case 'password':
                pattern = /^(?=.*[a-zA-Z0-9])(?=.*).{7,40}$/;
                break;

            case 'checkbox':
                pattern = /^on$/;
                break;
        }

        return pattern;
    }


    document.querySelectorAll('form').forEach(function(form) {
        var formInst = new Form(form);
    });

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



(function() {
    var roadmap = document.querySelector('.roadmap');

    var innerLine = document.querySelector('.roadmap-canvas__line_inner');
    var points = document.querySelectorAll('.roadmap-canvas__point');
    var totalHeight = 5000;
    var offsetTop = offset(roadmap).top;
    var step = 0;
    var pointCount = 6;

    function redraw(step) {
        points.forEach(function(item) {
            item.classList.remove('active');
            item.classList.remove('activated');
        });

        for (var i = 0; i < step; i++) {
            points[i].classList.add('active');
            if (points[i - 1]) {
                points[i - 1].classList.add('activated')
            }
        }
    }

    resize();
    window.addEventListener('scroll', function() {
        if (window.innerWidth >= 1280) {
            updateDesktopCanvas();
        } else {
            updateMobileCanvas();
        }
    }, false);

    window.addEventListener('resize', function() {
        resize();
    }, false);

    function resize() {
        if (window.innerWidth >= 1280) {
            innerLine.style.height = "";
            updateDesktopCanvas();
        } else {
            roadmap.classList.remove('fixed');
            innerLine.style.width = "";
            offsetTop = offset(roadmap).top;
            roadmap.style.paddingBottom = '';
            roadmap.style.paddingTop = '';
            updateMobileCanvas();
        }
    }

    function round(num) {
        return Math.round(num * 100) / 100;
    }

    function updateDesktopCanvas() {
        var value = Math.abs(offsetTop - window.pageYOffset);
        value = Math.floor((value / totalHeight) * 100);
        step = Math.ceil((pointCount / 100) * value);

        if (offsetTop <= window.pageYOffset && (offsetTop + totalHeight) > window.pageYOffset) {
            redraw(step);
            if (value <= 2) {
                redraw(0);
            }
            if (value >= 96) {
                value = 100;
                redraw(7);
            }
            roadmap.classList.add('fixed');
            roadmap.style.paddingTop = '';
            roadmap.style.paddingBottom = totalHeight + 'px';
            innerLine.style.width = value + '%';
        }
        if ((offsetTop + totalHeight) < window.pageYOffset) {
            roadmap.classList.remove('fixed');
            roadmap.style.paddingTop = totalHeight + 'px';
            roadmap.style.paddingBottom = '';
        }

        if (offsetTop >= window.pageYOffset) {
            roadmap.classList.remove('fixed');
            roadmap.style.paddingTop = '';
            roadmap.style.paddingBottom = totalHeight + 'px';
        }
    }

    function updateMobileCanvas() {
        var winOffset = window.pageYOffset + 300;
        var value = Math.abs(offsetTop - winOffset);
        value = Math.floor((value / (roadmap.clientHeight)) * 100);
        step = Math.ceil((7 / 100) * value);
        if (offsetTop <= winOffset && (offsetTop + roadmap.clientHeight) > winOffset) {
            redraw(step);
            if (value >= 90) {
                value = 101;
                redraw(step > 7 ? 7 : step);
            }
            innerLine.style.height = value + '%';
        }
    }


}());