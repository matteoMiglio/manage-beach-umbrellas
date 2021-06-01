#!/usr/bin/env python
import os
import sys
import requests
from datetime import timedelta, date, datetime

def main():

    url = 'http://localhost:8000/api/umbrellas/'    

    for i in range(1, 121):

        myobj = {'code': i, 
                'description': "", 
                'row': 0, 
        }
        
        x = requests.post(url, data = myobj)
        print(x.text)


if __name__ == '__main__':
    main()
