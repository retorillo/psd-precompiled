build: node_modules psd.js/node_modules
	node node_modules/browserify/bin/cmd.js \
		--o index.js \
		--standalone PSD \
		--node \
		--exclude jspack \
		--exclude parse-engine-data \
		--exclude pngjs \
		--exclude rsvp \
		--exclude lodash \
		--exclude iconv-lite \
		-t coffeeify \
		psd.js/lib/psd.coffee
node_modules:
	npm install
psd.js/node_modules:
	cd psd.js && npm install
