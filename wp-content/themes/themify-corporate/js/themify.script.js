;// Themify Theme Scripts - http://themify.me/

// Initialize object literals
var FixedHeader = {},
	EntryFilter = {};

/////////////////////////////////////////////
// jQuery functions					
/////////////////////////////////////////////
(function($){

// Initialize carousels //////////////////////////////
function createCarousel(obj) {
	obj.each(function() {
		var $this = $(this);
		$this.carouFredSel({
			responsive : true,
			prev : '#' + $this.data('id') + ' .carousel-prev',
			next : '#' + $this.data('id') + ' .carousel-next',
			pagination : {
				container : '#' + $this.data('id') + ' .carousel-pager'
			},
			circular : true,
			infinite : true,
			swipe: true,
			scroll : {
				items : 1,
				fx : $this.data('effect'),
				duration : parseInt($this.data('speed'))
			},
			auto : {
				play : !!('off' != $this.data('autoplay')),
				timeoutDuration : 'off' != $this.data('autoplay') ? parseInt($this.data('autoplay')) : 0
			},
			items : {
				visible : {
					min : 1,
					max : 1
				},
				width : 222
			},
			onCreate : function() {
				$this.closest('.slideshow-wrap').css({
					'visibility' : 'visible',
					'height' : 'auto'
				});
				var $testimonialSlider = $this.closest('.testimonial.slider');
				if( $testimonialSlider.length > 0 ) {
					$testimonialSlider.css({
						'visibility' : 'visible',
						'height' : 'auto'
					});
				}
				$(window).resize();
			}
		});
	});
}

// Test if touch event exists //////////////////////////////
function is_touch_device() {
	return 'true' == themifyScript.isTouch;
}

// Scroll to Element //////////////////////////////
function themeScrollTo(offset) {
	$('body,html').animate({ scrollTop: offset }, 800);
}

// Fixed Header /////////////////////////
FixedHeader = {
	init: function() {
		if( '' != themifyScript.fixedHeader ) {
			var cons = is_touch_device() ? 10 : 74;
			FixedHeader.headerHeight = $('#headerwrap').height() - cons;
			this.activate();
			$(window).on('scroll touchstart.touchScroll touchmove.touchScroll', this.activate);
		}
	},
	activate: function() {
		var $window = $(window),
			scrollTop = $window.scrollTop();
		if( scrollTop > FixedHeader.headerHeight ) {
			FixedHeader.scrollEnabled();
		} else {
			FixedHeader.scrollDisabled();
		}
	},
	scrollDisabled: function() {
		$('#headerwrap').removeClass('fixed-header');
		$('#header').removeClass('header-on-scroll');
		$('body').removeClass('fixed-header-on');
	},
	scrollEnabled: function() {
		$('#headerwrap').addClass('fixed-header');
		$('#header').addClass('header-on-scroll');
		$('body').addClass('fixed-header-on');
	}
};

// Entry Filter /////////////////////////
EntryFilter = {
	filter: function(){
		var $filter = $('.post-filter');
		if ( $filter.find('a').length > 0 && 'undefined' !== typeof $.fn.isotope ){
			$filter.find('li').each(function(){
				var $li = $(this),
					$entries = $li.parent().next(),
					cat = $li.attr('class').replace( /(current-cat)|(cat-item)|(-)|(active)/g, '' ).replace( ' ', '' );
				if ( $entries.find('.portfolio-post.cat-' + cat).length <= 0 ) {
					$li.remove();
				}
			});

			$filter.show().on('click', 'a', function(e) {
				e.preventDefault();
				var $li = $(this).parent(),
					$entries = $li.parent().next();
				if ( $li.hasClass('active') ) {
					$li.removeClass('active');
					$entries.isotope( {
						filter: '.portfolio-post'
					} );
				} else {
					$li.siblings('.active').removeClass('active');
					$li.addClass('active');
					$entries.isotope( {
						filter: '.cat-' + $li.attr('class').replace( /(current-cat)|(cat-item)|(-)|(active)/g, '' ).replace( ' ', '' )  } );
				}
			} );
		}
	},
	layout: function(){
		$('.loops-wrapper.portfolio').isotope({
			layoutMode: 'fitRows',
			transformsEnabled: false,
			itemSelector : '.portfolio-post'
		});
	}
};

// DOCUMENT READY
$(document).ready(function() {

	var $body = $('body'), $window = $(window), $skills = $('.progress-bar');

	// Initialize color animation
	if ( 'undefined' !== typeof $.fn.animatedBG ) {
		themifyScript.colorAnimationSet = themifyScript.colorAnimationSet.split(',');
		themifyScript.colorAnimationSpeed = parseInt( themifyScript.colorAnimationSpeed, 10 );
		$('.animated-bg').animatedBG({
			colorSet: themifyScript.colorAnimationSet,
			speed: themifyScript.colorAnimationSpeed
		});
	}

	/////////////////////////////////////////////
	// Fixed header
	/////////////////////////////////////////////
	if( ('' != themifyScript.fixedHeader && ! themifyScript.scrollingEffectOn) || (! is_touch_device() && '' != themifyScript.fixedHeader) ){
		FixedHeader.init();
	}

	/////////////////////////////////////////////
	// Scroll to row when a menu item is clicked.
	/////////////////////////////////////////////
	if ( 'undefined' !== typeof $.fn.themifyScrollHighlight ) {
		$body.themifyScrollHighlight();
	}

	/////////////////////////////////////////////
	// Entry Filter
	/////////////////////////////////////////////
	EntryFilter.filter();

	/////////////////////////////////////////////
	// Skillset Animation
	/////////////////////////////////////////////
	if( themifyScript.scrollingEffectOn ) {
		$skills.each(function(){
			var $self = $(this).find('span'),
				percent = $self.data('percent');

			if( typeof $.waypoints !== 'undefined' ) {
				$self.width(0);
				$self.waypoint(function(direction){
					$self.animate({width: percent}, 800,function(){
						$(this).addClass('animated');
					});
				}, {offset: '80%'});
			}
		});
	}

	/////////////////////////////////////////////
	// Scroll to top
	/////////////////////////////////////////////
	$('.back-top a').on('click', function(e){
		e.preventDefault();
		themeScrollTo(0);
	});

	/////////////////////////////////////////////
	// Toggle main nav on mobile
	/////////////////////////////////////////////
	$('#menu-icon').sidr({
	    name: 'sidr',
	    side: 'right'
	});
	$('#menu-icon-close').sidr({
	    name: 'sidr',
	    side: 'right'
	});

	// Release spacing taken by mobile menu
	$window.on('debouncedresize', function(){
		if ( $('#sidr').is(':visible') && $window.width() > 1000 ) {
			$('#menu-icon-close').trigger('click');
	    }
	});
	
	/////////////////////////////////////////////
	// Add class "first" to first elements
	/////////////////////////////////////////////
	$('.highlight-post:odd').addClass('odd');

	/////////////////////////////////////////////
	// Lightbox / Fullscreen initialization
	/////////////////////////////////////////////
	if(typeof ThemifyGallery !== 'undefined') {
		ThemifyGallery.init({'context': $(themifyScript.lightboxContext)});
	}

});

// WINDOW LOAD
$(window).load(function() {
	// scrolling nav
	if ( typeof($.fn.themifySectionHighlight) !== 'undefined' && themifyScript.scrollingEffectOn ) {
		$('body').themifySectionHighlight();
	}

	/////////////////////////////////////////////
	// Carousel initialization
	/////////////////////////////////////////////
	if( typeof $.fn.carouFredSel !== 'undefined' ) {
		createCarousel($('.slideshow'));
	}

	/////////////////////////////////////////////
	// Entry Filter Layout
	/////////////////////////////////////////////
	EntryFilter.layout();

});
	
})(jQuery);