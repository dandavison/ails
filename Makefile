.PHONY: all install clean

all: install

install:
	cd extension && $(MAKE) install

clean:
	cd extension && $(MAKE) clean
	cd server && rm -rf out/
