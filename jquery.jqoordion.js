/*!
 * jQoordion
 * Author: Len Bradley @ http://www.ninesphere.com
 * Version: 1.0.0
 * Licensed under the MIT license
 *
 */

;( function($) {
    "use strict";

    $.fn.jQoordion = function( settings, args ) {

        if ( typeof settings === 'string' ) {
            var settings = { action : settings };
        }

        if ( typeof settings !== 'object' ) {
            var settings = {};
        }

        if ( typeof args === 'undefined' ) {
            args = null;
        }

        var defaults = {
            action              : 'setup',
            accordionSelector   : '> *',
            titleSelector       : '.title',
            contentSelector     : '.content',
            expandedClass       : 'expanded',
            collapsedClass      : 'collapsed',
            initialState        : 'hidden',
            initialShowIndex    : 0,
            allowMultiple       : true,
            animationEasing     : 'linear',
            animationSpeed      : 400,
            useCSSTransitions   : false
        };

        settings = $.extend( {}, defaults, settings );

        return this.each( function() {

            var parent = $(this);

            this.getAccordions = function() {

                var elements = [];

                parent.find( settings.accordionSelector ).each( function( index, accrdn ) {
                    elements.push( accrdn );
                });

                return elements;
            }

            this.getAccordion = function( elem ) {

                if ( typeof elem === 'number' ) {

                    var parent = $(this);

                    $.each( this.getAccordions(), function( i, a ) {
                        if ( i == elem ) {
                            elem = a;
                        }
                    });
                }

                if ( typeof elem !== 'object' || elem instanceof jQuery === false ) {
                    elem = $(elem);
                }

                if ( elem.data( 'isAccordion' ) !== true ) {
                    elem = elem.closest('[data-is-accordion]');
                }

                return elem;
            }

            this.expandAccordion = function( elem, animate ) {

                if ( typeof elem === 'undefined' ) {
                    return false;
                }

                if ( typeof animate === 'undefined' ) {
                    animate = true;
                }

                var parent      = this;
                var accordion   = parent.getAccordion( elem );

                if ( accordion.data('accordion-state') == 'expanded' ) {
                    return false;
                }

                if ( ! settings.allowMultiple ) {

                    $.each( parent.getAccordions(), function( k, v ) {

                        if ( k != accordion.index() ) {
                            parent.collapseAccordion(v);
                        }
                    });
                }

                accordion
                    .data( 'accordion-state', 'expanded' )
                    .attr( 'data-is-accordion', 'true' )
                    .addClass( settings.expandedClass )
                    .removeClass( settings.collapsedClass );

                if ( ! settings.useCSSTransitions ) {

                    if ( animate ) {
                        accordion.find( settings.contentSelector ).slideDown({
                            duration    : settings.animationSpeed,
                            easing      : settings.animationEasing
                        });
                    } else {
                        accordion.find( settings.contentSelector ).show();
                    }
                }
            }

            this.collapseAccordion = function( elem, animate ) {

                if ( typeof elem === 'undefined' ) {
                    return false;
                }

                if ( typeof animate === 'undefined' ) {
                    animate = true;
                }

                var accordion = this.getAccordion( elem );

                if ( accordion.data('accordion-state') == 'collapsed' ) {
                    return false;
                }

                accordion
                    .data( 'accordion-state', 'collapsed' )
                    .attr( 'data-is-accordion', 'true' )
                    .addClass( settings.collapsedClass )
                    .removeClass( settings.expandedClass );

                if ( ! settings.useCSSTransitions ) {

                    if ( animate ) {
                        accordion.find( settings.contentSelector ).slideUp({
                            duration    : settings.animationSpeed,
                            easing      : settings.animationEasing
                        });
                    } else {
                        accordion.find( settings.contentSelector ).hide();
                    }
                }
            }

            this.toggleAccordion = function( elem ) {

                var accordion = this.getAccordion( elem );

                switch ( accordion.data( 'accordion-state' ) ) {
                    case 'expanded' :
                        this.collapseAccordion( accordion );
                        break;
                    case 'collapsed' :
                        this.expandAccordion( accordion );
                        break;
                }
            }

            this.expandAll = function() {

                var parent = this;

                $.each( parent.getAccordions(), function( k, v ) {
                    parent.expandAccordion(v);
                });
            }

            this.collapseAll = function() {

                var parent = this;

                $.each( parent.getAccordions(), function( k, v ) {
                    parent.collapseAccordion(v);
                });
            }

            this.setupAccordion = function() {

                if ( $(this).data( 'jQoordianInit' ) == true ) {
                    return false;
                }

                var parent = this;

                $.each( this.getAccordions(), function( index, accrdn ) {

                    var accordion = $(accrdn);

                    accordion.data( 'isAccordion', true );

                    if ( settings.initialState == 'hidden' ) {

                        if ( settings.initialShowIndex === index ) {
                            parent.expandAccordion( accordion, false );
                        } else {
                            parent.collapseAccordion( accordion, false );
                        }
                    } else {
                        parent.expandAccordion( accordion, false );
                    }

                    accordion.find( settings.titleSelector ).on( 'click', function(e) {
                        e.preventDefault();
                        parent.toggleAccordion( this );
                    });
                });

                $(this).data( 'jQoordianInit', true );
            }

            switch ( settings.action ) {
                case 'setup' :
                    this.setupAccordion();
                    break;
                case 'expand' :
                    this.expandAccordion( args );
                    break;
                case 'collapse' :
                    this.collapseAccordion( args );
                    break;
                case 'expandAll' :
                    this.expandAll();
                    break;
                case 'collapseAll' :
                    this.collapseAll();
                    break;
                default :
                    console.log( 'jQoordion: No action specified' );
            }
        });
    }

}(jQuery));