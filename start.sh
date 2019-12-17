# stop script on error
set -e

# Check to see if root CA file exists, download if not
if [ ! -f ./root-CA.crt ]; then
  printf "\nDownloading AWS IoT Root CA certificate from AWS\n"
  curl https://www.amazontrust.com/repository/AmazonRootCA1.pem > root-CA.crt
fi

# install NPM packages
if [ ! -d ./node_modules ]; then
  printf "\nInstalling NPM packages\n"
  npm install
fi

# run pub/sub sample app using certificates downloaded in package
printf "\nRunning Project Raptor\n"
node index.js --host-name=a2x4jnyxq2i9zz-ats.iot.us-east-1.amazonaws.com --private-key=PI4.private.key --client-certificate=PI4.cert.pem --ca-certificate=root-CA.crt --client-id=sdk-nodejs-fbd45dbe-7fd7-4d3f-b89a-37b5ad8b04bb
