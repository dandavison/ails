install: clean build uninstall
	code --install-extension ails-*.vsix --force
	code --list-extensions --show-versions | grep ails

clean:
	@rm -rf *.vsix server/ 2>/dev/null || true

build:
	npm run compile
	cd ../server && npm run compile
	mkdir -p server
	cp ../server/out/server.js server/
	npx vsce package --no-dependencies

uninstall:
	code --uninstall-extension dandavison.ails || true
	! code --list-extensions --show-versions | grep ails
