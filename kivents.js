/* kivents.js | MIT License | https://github.com/kadirilkimen/kivents */
'use strict';
const KIVENTS = function(params)
  {
    const _this       = this;
    const _events     = new Map();
    let noNameCounter = 0;

    function _errorReport( ...args )
      {
        if( typeof console !== "undefined" && typeof console.error === 'function' ) console.error( ...args );
      }

    function _logReport( ...args )
      {
        if( typeof console !== "undefined" && typeof console.log === 'function' ) console.log( ...args );
      }

    const _args = {
      debug     : false,
      highSpeed : false,
      errorFunc : _errorReport,
      logFunc   : _logReport
    }

    if( typeof params === 'object' )
      {
        if( typeof params.debug === 'boolean' )       _args.debug     = params.debug;
        if( typeof params.highSpeed === 'boolean' )   _args.highSpeed = params.highSpeed;
        if( typeof params.errorFunc === 'function' )  _args.errorFunc = params.errorFunc;
        if( typeof params.logFunc === 'function' )    _args.logFunc   = params.logFunc;
      }


    function _log( ...args )
      {
        try { _args.logFunc( ...args ); }
        catch( e ) { _errorReport( 'logFunc error,', e, ...args ); }
      }

    function _error( ...args )
      {
        try { _args.errorFunc( ...args ); }
        catch( e ) { _errorReport( 'errorFunc error,', e, ...args ); }
      }

    function _on( target, name, callback, callOnce )
      {
        if( typeof name==='function' )
          {
            callback = name;
            name = Math.random().toString( 36 ).slice( 2 ) + '_' + ( noNameCounter++ );
          }

        if( typeof callback !== 'function' )
          {
            if( _args.debug ) _error( 'Event callback must be a function for target: ' + target + ' name: ' + name );
            return null;
          }

        if( typeof target !== 'string' || target === '' )
          {
            if( _args.debug ) _error( 'Event target must be a valid string! target: ?' );
            return null;
          }

        if( typeof name !== 'string' || name === '' )
          {
            if( _args.debug ) _error( 'Event name must be a valid string! target: ' + target + ' name: ?' );
            return null;
          }

        let targetMap = _events.get( target );
        if ( !targetMap )
          {
            targetMap = new Map();
            _events.set( target, targetMap );
          }

        targetMap.set( name, { once: !!callOnce, callbackFunc: callback } );
        return name;
      }

    _this.getEvents = function()
      {
        if( !_args.debug ) return null;
        return _events;
      }

    _this.on = function( target, name, callback ){ return _on( target, name, callback, false ); }
    _this.once = function( target, name, callback ){ return _on( target, name, callback, true ); }

    _this.off = function( target, name )
      {
        const targetMap = _events.get( target );
        if( !targetMap ) return false;

        if( name !== "" && name !== null && name !== undefined && targetMap.has( name ) )
          {
            targetMap.delete( name );
            if( targetMap.size === 0 ) _events.delete( target );
          }
        else _events.delete( target );

        return true;
      }

    _this.emit = function( target, payload, printable ) { _this.run( target, payload, printable ); };
    _this.run = function( target, payload, printable )
      {
        if( printable === undefined ) printable = _args.debug;
        if( !_events.has(target) ) return;
        const targetMap = _events.get( target );
        const toDelete = [];
        const eventsRan = targetMap.size;

        targetMap.forEach( function( ev, key )
          {
            if( !ev || typeof ev.callbackFunc !== 'function' ) return;
            if( _args.highSpeed ) ev.callbackFunc( payload );
            else
              {
                try { ev.callbackFunc( payload ); }
                catch(e) { if( _args.debug ) _error( 'Event error', target, key, e ); }
              }

            if( ev.once ) toDelete.push( key );
          });

        for( const key of toDelete ) targetMap.delete( key );

        if( !_args.highSpeed && _args.debug && printable )
          {
            const after = targetMap.size;
            const eventSize = ( after === eventsRan ) ? 'Ran: ' + eventsRan : ( 'Ran: '+eventsRan + ', Remained: ' + after );

            if( payload !== undefined && payload !== null && payload !='' ) _log( 'Events:', target + '[' + eventSize + ']', payload );
            else _log( 'Events:', target + '[' +  eventSize + ']' );
          }

        if( targetMap.size === 0 ) _events.delete( target );
      }
  };
