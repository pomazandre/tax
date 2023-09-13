java -jar closure.jar --charset UTF-8 --js dist/inline.bundle.js --js_output_file prod/inline.bundle.js
java -jar closure.jar --charset UTF-8 --js dist/main.bundle.js --js_output_file prod/main.bundle.js
java -jar closure.jar --charset UTF-8 --js dist/polyfills.bundle.js --js_output_file prod/polyfills.bundle.js
java -jar closure.jar --charset UTF-8 --js dist/styles.bundle.js --js_output_file prod/styles.bundle.js






