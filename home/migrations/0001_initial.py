# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django_pgjson.fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('space', models.CharField(max_length=30)),
                ('token', django_pgjson.fields.JsonField()),
                ('project_id', models.IntegerField()),
            ],
        ),
    ]
