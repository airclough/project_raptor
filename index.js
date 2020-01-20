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

    this.name = 'PI4';
    var device = this.device = awsIot.device({
      caPath: `./${args[ 'ca-certificate' ]}`,
      certPath: `./${args[ 'client-certificate' ]}`,
      clientId: args[ 'client-id' ],
      host: args[ 'host-name' ],
      keyPath: `./${args[ 'private-key' ]}`,
    });

    this._gpio()
      ._subscribe( device )
      ._report();
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
    });

    return this;
  }

  _report() {
    setInterval( () => {
      device.publish(
        '$aws/things/' + this.name + '/shadow/update',
        JSON.stringify({
          'state': {
            'reported': {
              'timestamp': Date.now()
            }
          }
        })
      );
    }, 5000 );
  }
}

new Raptor( process.argv.slice( 2 ) );
