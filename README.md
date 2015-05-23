# PAG [![Build Status](https://travis-ci.org/rivayama/pag.svg?branch=master)](https://travis-ci.org/rivayama/pag)

This is the project grading tool for Backlog.

## Installation

If you use Vagrant, add this sentence to your `Vagrantfile`.

	config.vm.network :forwarded_port, guest:5000, host:5000

Then simply clone this repository to your VM by following:

	$ git clone https://github.com/rivayama/pag.git

Then run following commands:

	$ cd pag
	$ pip install -r requirements.txt

Create your local environment file:

	$ vi .env
	DJANGO_SECRET_KEY="your django secret key"
	DEBUG=1
	DATABASE_URL="sqlite:///db.sqlite3"
	BACKLOG_CLIENT_ID="your backlog client id"
	BACKLOG_CLIENT_SECRET="your backlog client secret"

Then initialize database.

	$ python manage.py migrate

Now you can run the server.

	$ foreman start

Access `localhost:5000` by an web browser.

Enjoy PAG!
