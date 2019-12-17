var awsIot = require( 'aws-iot-device-sdk' );
var rpio = require( 'rpio' );

class Raptor {
  constructor( argv ) {
    var args = {};
    argv.forEach( ( arg ) => {
      var [ prop, val ] = arg.split( '=' );

      args[ prop ] = val;
    });

    console.log( args );

    var device = this.device = awsIot.device({
      baseReconnectTimeMs: args.baseReconnectTimeMs,
      caPath: args.caCert,
      certPath: args.clientCert,
      clientId: args.clientId,
      debug: args.Debug,
      host: args.Host,
      keepalive: args.keepAlive,
      keyPath: args.privateKey,
      port: args.Port,
      protocol: args.Protocol,
      region: args.region
    });

    this._subscribe( device );
  }

  _subscribe( device ) {
    device.on( 'connect', () => {
      console.log( 'connect' );
      device.subscribe( 'led' );
    });

    device.on( 'close', () => {
      console.log( 'close' );
    });

    device.on( 'reconnect', () => {
      console.log( 'reconnect' );
    });

    device.on( 'offline', () => {
      console.log( 'offline' );
    });

    device.on( 'error', ( error ) => {
     console.log( 'error', error );
    });

    device.on( 'message', ( topic, payload ) => {
      console.log( 'message', topic, payload.toString() );

      device.publish( 'topic', JSON.stringify({
        'success': true
      }));
    });
  }
}

new Raptor( process.argv.slice( 2 ) );
