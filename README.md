# PAG [![Build Status](https://travis-ci.org/rivayama/pag.svg?branch=master)](https://travis-ci.org/rivayama/pag)

This is the project grading tool for Backlog.

## Installation

If you use Vagrant, add this sentence to your `Vagrantfile`.

	config.vm.network :forwarded_port, guest:8000, host:8000

Then simply clone this repository to your VM by following:

	$ git clone https://github.com/rivayama/pag.git

Then run following commands:

	$ cd pag
	$ pip install -r requirements.txt
	$ python manage.py migrate

Now you can run the server.

	$ python manage.py runserver

Access `localhost:8000` by an web browser.

Enjoy PAG!
