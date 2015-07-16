import cronjobs

@cronjobs.register
def periodic_task():
    print('here')
    pass
