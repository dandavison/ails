install: clean build uninstall
	code --install-extension ails-*.vsix --force
	code --list-extensions --show-versions | grep ails

clean:
	@rm *.vsix 2>/dev/null || true

build:
	yes | vsce package

uninstall:
	code --uninstall-extension dandavison.ails || true
	! code --list-extensions --show-versions | grep ails
