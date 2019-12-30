const awsIot = require( 'aws-iot-device-sdk' );
const { Gpio } = require( 'onoff' );

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

    this._gpio()
      ._subscribe( device );
  }

  _gpio() {
    this.gpioZero = new Gpio( '17', 'out' );

    return this;
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

      this.gpioZero.writeSync( 1 );
      setTimeout( () => {
        this.gpioZero.writeSync( 0 );
      }, 5000 );

      device.publish( 'topic', JSON.stringify({
        'success': true
      }));
    });

    return this;
  }
}

new Raptor( process.argv.slice( 2 ) );
