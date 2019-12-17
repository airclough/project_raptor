var awsIot = require( 'aws-iot-device-sdk' );
var rpio = require( 'rpio' );

class Raptor {
  constructor( argv ) {
    var args = {};
    argv.forEach( ( arg ) => {
      var [ prop, val ] = arg.split( '=' );
      prop = prop.slice( 2 );

      args[ prop ] = val;
    });

    console.log( args );

    var device = this.device = awsIot.device({
      caPath: `./${args[ 'ca-certificate' ]}`,
      certPath: `./${args[ 'client-certificate' ]}`,
      clientId: args[ 'client-id' ],
      host: args[ 'host-name' ],
      keyPath: `./${args[ 'private-key' ]}`,
    });

    this._subscribe( device );
  }

  _subscribe( device ) {
    device.on( 'connect', () => {
      console.log( 'connect' );
      device.subscribe( 'topic_1' );
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
