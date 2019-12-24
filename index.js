var awsIot = require( 'aws-iot-device-sdk' );
var rpio = require( 'rpio' );

class Raptor {
  constructor( argv ) {
    this.blink();
    // console.log( rpio );
    // rpio.open( 7, rpio.OUTPUT, rpio.LOW );
    // rpio.write( 7, rpio.HIGH );
    //
    // console.log( rpio.read( 2 ) );
    //
    // setTimeout( function() {
    //   rpio.write( 7, rpio.LOW );
    // }, 5000 );

    // var args = {};
    // argv.forEach( ( arg ) => {
    //   var [ prop, val ] = arg.split( '=' );
    //   prop = prop.slice( 2 );
    //
    //   args[ prop ] = val;
    // });
    //
    // console.log( args );
    //
    // var device = this.device = awsIot.device({
    //   caPath: `./${args[ 'ca-certificate' ]}`,
    //   certPath: `./${args[ 'client-certificate' ]}`,
    //   clientId: args[ 'client-id' ],
    //   host: args[ 'host-name' ],
    //   keyPath: `./${args[ 'private-key' ]}`,
    // });
    //
    // this._subscribe( device );
  }

  blink() {
    /*
     * Set the initial state to low.  The state is set prior to the pin
     * being actived, so is safe for devices which require a stable setup.
     */
    rpio.open(16, rpio.OUTPUT, rpio.LOW);
    rpio.write(16, rpio.LOW);

    /*
     * The sleep functions block, but rarely in these simple programs does
     * one care about that.  Use a setInterval()/setTimeout() loop instead
     * if it matters.
     */
    // for (var i = 0; i < 5; i++) {
    //         /* On for 1 second */
    //         rpio.write(16, rpio.HIGH);
    //         rpio.sleep(1);
    //
    //         /* Off for half a second (500ms) */
    //         rpio.write(16, rpio.LOW);
    //         rpio.msleep(500);
    // }
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
