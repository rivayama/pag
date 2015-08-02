#!/usr/bin/env python
import os
import sys
import dotenv

if os.path.exists('.env'):
    dotenv.read_dotenv()

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pag.settings")

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
