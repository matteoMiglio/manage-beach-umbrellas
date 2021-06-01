#!/usr/bin/env python
import os
import sys
import requests
from datetime import timedelta, date, datetime

def main():

    url = 'http://localhost:8000/api/reservations/'    

    start_date = date(2021, 5, 1)
    end_date = date(2021, 9, 30)
    delta = timedelta(days=1)
    while start_date <= end_date:

        for i in range(1, 121):

            myobj = {'date': start_date.strftime('%Y-%m-%d'),
                    'umbrella': i, 
                    'paid': "null", 
                    'subscription': None, 
                    'beachLoungers': '1'
            }

            x = requests.post(url, data = myobj)
            print(x.text)

        start_date += delta


if __name__ == '__main__':
    main()
