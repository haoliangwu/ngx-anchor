#!/usr/bin/env bash

readonly currentDir=$(cd $(dirname $0); pwd)
readonly libraryName='ngx-anchor'
cd ${currentDir}

echo 'Clean the publish directory'
rm -rf ./publish

echo 'Compiling to es2015 via Angular compiler'
# TODO npm bin not found
ngc -p src/tsconfig.build.json -t es2015 --outDir publish

echo 'Compiling angular inline assets of es2015'
gulp compile --module="es2015"

echo 'Bundling to es module of es2015'
export ROLLUP_TARGET=esm
$(npm bin)/rollup -c rollup.config.js -f es -i publish/index.js -o publish/dist/${libraryName}.esm2015.js

echo 'Compiling to es5 via Angular compiler'
ngc -p src/tsconfig.build.json -t es5 --outDir publish/es5

echo 'Compiling angular inline assets of es5'
gulp compile --module="es5"

echo 'Bundling to es module of es5'
export ROLLUP_TARGET=esm
$(npm bin)/rollup -c rollup.config.js -f es -i publish/es5/index.js -o publish/dist/${libraryName}.esm5.js

echo 'Bundling to umd module of es5'
export ROLLUP_TARGET=umd
$(npm bin)/rollup -c rollup.config.js -f umd -i publish/dist/${libraryName}.esm5.js -o publish/dist/${libraryName}.umd.js

echo 'Bundling to minified umd module of es5'
export ROLLUP_TARGET=mumd
$(npm bin)/rollup -c rollup.config.js -f umd -i publish/dist/${libraryName}.esm5.js -o publish/dist/${libraryName}.umd.min.js

echo 'Unifying publish folder'
rm -rf publish/es5

# echo 'Cleaning up temporary files'

echo 'Copying package.json'
cp package.json publish/package.json
